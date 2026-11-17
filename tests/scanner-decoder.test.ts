import { afterEach, expect, it, vi } from 'vitest'
import { encodeLink } from '../src/core/qr'
import { BarcodeDetector as JavaScriptDetector } from 'qr/decode.js'
import { createExtensionDetector } from '../src/core/scanner-decoder'

afterEach(() => vi.unstubAllGlobals())

it('decodes a real QR using the bundled JavaScript decoder without network requests', async () => {
  const fetch = vi.fn(() => { throw new Error('Unexpected network request') })
  vi.stubGlobal('fetch', fetch)
  // jsdom has no ImageData constructor; supply the browser data container.
  class ImageData {
    readonly colorSpace = 'srgb' as const
    get [Symbol.toStringTag]() { return 'ImageData' }
    constructor(public data: Uint8ClampedArray, public width: number, public height: number) {}
  }
  vi.stubGlobal('ImageData', ImageData)
  const value = 'https://example.com/local-scanner'
  const qr = encodeLink(value)
  const width = qr.size * 6
  const pixels = new Uint8ClampedArray(width * width * 4)
  for (let y = 0; y < width; y++) {
    for (let x = 0; x < width; x++) {
      const offset = (y * width + x) * 4
      const shade = qr.data[Math.floor(y / 6)]![Math.floor(x / 6)] ? 0 : 255
      pixels.set([shade, shade, shade, 255], offset)
    }
  }
  vi.stubGlobal('BarcodeDetector', undefined)
  const detector = await createExtensionDetector()
  expect(detector).toBeInstanceOf(JavaScriptDetector)
  const results = await (detector as JavaScriptDetector).detect(new ImageData(pixels, width, width) as globalThis.ImageData)
  expect(results[0]?.rawValue).toBe(value)
  expect(fetch).not.toHaveBeenCalled()
})

it('prefers native QR detection without invoking the JavaScript fallback', async () => {
  const fallback = vi.spyOn(JavaScriptDetector.prototype, 'detect')
  class NativeDetector {
    static async getSupportedFormats() { return ['qr_code'] }
    async detect() { return [] }
  }
  vi.stubGlobal('BarcodeDetector', NativeDetector)
  try {
    expect(await createExtensionDetector()).toBeInstanceOf(NativeDetector)
    expect(fallback).not.toHaveBeenCalled()
  } finally {
    fallback.mockRestore()
  }
})

it.each(['missing', 'unsupported', 'throws', 'constructor fails'])(
  'uses JavaScript when native QR support is %s',
  async (support) => {
    vi.stubGlobal('BarcodeDetector', support === 'missing' ? undefined : class {
      static async getSupportedFormats() {
        if (support === 'throws') throw new Error('Unavailable')
        return support === 'unsupported' ? ['ean_13'] : ['qr_code']
      }
      constructor() { throw new Error('Native service unavailable') }
    })
    expect(await createExtensionDetector()).toBeInstanceOf(JavaScriptDetector)
  },
)
