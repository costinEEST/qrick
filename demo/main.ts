import { createPanel } from '../src/core/panel'
import { panelCss } from '../src/core/styles'

const style = document.createElement('style')
style.append(document.createTextNode(panelCss))
document.head.append(style)

const params = new URLSearchParams(location.search)
const storeShot = params.has('store-shot')
const scanShot = storeShot && params.has('scan')
if (storeShot) document.body.classList.add('store-shot')

const panel = createPanel({
  scanInitially: scanShot,
  value: storeShot
    ? 'https://example.com/articles/share-this-page?utm_source=newsletter'
    : location.href,
})
document.getElementById('mount')!.append(panel.root)
if (scanShot) {
  document.querySelector('.store-copy h1')!.textContent = 'Scan a QR code'
  document.querySelector('.store-copy p')!.textContent = 'Read codes with your camera. Everything stays on your device.'
}

document.getElementById('open-dialog')!.addEventListener('click', () => {
  void import(/* @vite-ignore */ `../src/bookmarklet/entry?t=${Date.now()}`)
})
