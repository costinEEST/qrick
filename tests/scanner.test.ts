import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createScanner, type DetectorFactory } from '../src/core/scanner'

const flush = async () => { for (let i = 0; i < 16; i++) await Promise.resolve() }
const nativeDetect = vi.fn()
beforeEach(() => {
  nativeDetect.mockResolvedValue([])
  vi.stubGlobal('BarcodeDetector', class {
    static async getSupportedFormats() { return ['qr_code'] }
    detect = nativeDetect
  })
})
afterEach(() => { vi.resetAllMocks(); vi.restoreAllMocks(); vi.unstubAllGlobals(); document.body.replaceChildren() })
function setup(getUserMedia: () => Promise<MediaStream>, createDetector?: DetectorFactory) {
  Object.defineProperty(navigator, 'mediaDevices', { configurable: true, value: { getUserMedia } })
  vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue()
  const scanner = createScanner(vi.fn(), createDetector)
  document.body.append(scanner.root)
  return scanner
}

describe('camera scanner', () => {
  it('stops tracks returned after the scanner was closed', async () => {
    let resolve!: (stream: MediaStream) => void
    const stop = vi.fn()
    const scanner = setup(() => new Promise((done) => { resolve = done }))
    scanner.root.querySelector('button')!.click()
    await flush()
    scanner.destroy()
    resolve({ getTracks: () => [{ stop }] } as unknown as MediaStream)
    await flush()
    expect(stop).toHaveBeenCalledOnce()
  })

  it('uses native QR detection and stops the camera without opening unsafe URLs', async () => {
    const stop = vi.fn()
    nativeDetect.mockResolvedValue([{ rawValue: 'javascript:alert(1)' }])
    const scanner = setup(async () => ({ getTracks: () => [{ stop }] }) as unknown as MediaStream)
    Object.defineProperty(scanner.root.querySelector('video'), 'readyState', { value: 2 })
    scanner.root.querySelector('button')!.click()
    await flush()
    expect(nativeDetect).toHaveBeenCalledOnce()
    expect(stop).toHaveBeenCalledOnce()
    expect(scanner.root.querySelector('textarea')!.value).toBe('javascript:alert(1)')
    expect(scanner.root.querySelector('a')!.hasAttribute('href')).toBe(false)
    scanner.destroy()
  })

  it('explains permission denial and permits retry', async () => {
    const scanner = setup(async () => { throw new DOMException('Denied', 'NotAllowedError') })
    scanner.root.querySelector('button')!.click()
    await flush()
    expect(scanner.root.textContent).toContain('Camera access denied')
    expect(scanner.root.querySelector('button')!.disabled).toBe(false)
    scanner.destroy()
  })

  it.each(['missing', 'unsupported', 'throws'])('does not request camera access when native QR support is %s', async (native) => {
    const getUserMedia = vi.fn()
    vi.stubGlobal('BarcodeDetector', native === 'missing' ? undefined : class {
      static async getSupportedFormats() {
        if (native === 'throws') throw new Error('Unavailable')
        return ['ean_13']
      }
    })
    const scanner = setup(getUserMedia)
    scanner.root.querySelector('button')!.click()
    await flush()
    expect(getUserMedia).not.toHaveBeenCalled()
    expect(scanner.root.textContent).toContain('does not support native QR scanning')
    const link = scanner.root.querySelector<HTMLAnchorElement>('.qrick__status a')!
    expect(link.textContent).toBe('QRick extension')
    expect(link.href).toBe('https://github.com/costinEEST/url-to-qr/releases')
    expect(link.target).toBe('_blank')
    expect(link.rel).toBe('noopener noreferrer')
    scanner.destroy()
  })

  it('uses the injected WASM decoder even when native detection is available', async () => {
    const stop = vi.fn()
    const detect = vi.fn().mockResolvedValue([{ rawValue: 'https://example.com/' }])
    const createDetector = vi.fn().mockResolvedValue({ detect })
    const scanner = setup(async () => ({ getTracks: () => [{ stop }] }) as unknown as MediaStream, createDetector)
    Object.defineProperty(scanner.root.querySelector('video'), 'readyState', { value: 2 })
    scanner.root.querySelector('button')!.click()
    await flush()
    expect(createDetector).toHaveBeenCalledOnce()
    expect(detect).toHaveBeenCalledOnce()
    expect(nativeDetect).not.toHaveBeenCalled()
    expect(stop).toHaveBeenCalledOnce()
    scanner.destroy()
  })

  it('does not request the camera when decoder initialization fails', async () => {
    const getUserMedia = vi.fn()
    const scanner = setup(getUserMedia, vi.fn().mockRejectedValue(new Error('WASM unavailable')))
    scanner.root.querySelector('button')!.click()
    await flush()
    expect(getUserMedia).not.toHaveBeenCalled()
    expect(scanner.root.querySelector('button')!.disabled).toBe(false)
    expect(scanner.root.textContent).toContain('Could not start the scanner')
    scanner.destroy()
  })
  it.each(['stop', 'hidden', 'pagehide'])('releases camera tracks on %s', async (action) => {
    const stop = vi.fn()
    const scanner = setup(async () => ({ getTracks: () => [{ stop }] }) as unknown as MediaStream)
    scanner.root.querySelector('button')!.click()
    await flush()
    if (action === 'stop') scanner.root.querySelectorAll('button')[1]!.click()
    if (action === 'hidden') {
      vi.spyOn(document, 'hidden', 'get').mockReturnValue(true)
      document.dispatchEvent(new Event('visibilitychange'))
    }
    if (action === 'pagehide') window.dispatchEvent(new Event('pagehide'))
    expect(stop).toHaveBeenCalledOnce()
    expect(scanner.root.querySelector('video')!.srcObject).toBeNull()
    scanner.destroy()
  })

  it('ignores a detection that finishes after cancellation', async () => {
    let resolve!: (value: { rawValue: string }[]) => void
    nativeDetect.mockReturnValue(new Promise((done) => { resolve = done }))
    const stop = vi.fn()
    const scanner = setup(async () => ({ getTracks: () => [{ stop }] }) as unknown as MediaStream)
    Object.defineProperty(scanner.root.querySelector('video'), 'readyState', { value: 2 })
    scanner.root.querySelector('button')!.click()
    await flush()
    scanner.stop()
    resolve([{ rawValue: 'https://example.com/late' }])
    await flush()
    expect(scanner.root.querySelector('textarea')!.hidden).toBe(true)
    expect(stop).toHaveBeenCalledOnce()
    scanner.destroy()
  })

})
