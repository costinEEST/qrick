import { createNativeDetector } from './scanner'
import { BarcodeDetector } from 'qr/decode.js'

/** Prefer native QR support; use the bundled JavaScript decoder when unavailable. */
export async function createExtensionDetector() {
  return (await createNativeDetector()) ?? new BarcodeDetector({ formats: ['qr_code'] })
}
