import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const images = [
  ['store-assets/chrome/promo-small-440x280.png', 440, 280, true],
  ['store-assets/shared/screenshot-popup-1280x800.png', 1280, 800, true],
  ['store-assets/shared/screenshot-scanner-1280x800.png', 1280, 800, true],
  ...[16, 32, 48, 128].map((size) => [`src/extension/public/icons/icon-${size}.png`, size, size, false]),
]
for (const [file, width, height, opaque] of images) {
  const png = readFileSync(resolve(root, file))
  if (png.subarray(0, 8).toString('hex') !== '89504e470d0a1a0a' ||
      png.readUInt32BE(16) !== width || png.readUInt32BE(20) !== height) {
    throw new Error(`${file}: expected a ${width}×${height} PNG`)
  }
  if (opaque && (png[24] !== 8 || png[25] !== 2)) {
    throw new Error(`${file}: store screenshots and tiles must use 24-bit RGB without alpha`)
  }
}
console.log('assets      screenshot, tile, and icon dimensions/formats verified')
