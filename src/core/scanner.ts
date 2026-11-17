export interface Detector {
  detect(source: HTMLVideoElement): Promise<{ rawValue: string }[]>
}
interface DetectorConstructor {
  new (options: { formats: string[] }): Detector
  getSupportedFormats(): Promise<string[]>
}

export type DetectorFactory = () => Promise<Detector | undefined>

export async function createNativeDetector(): Promise<Detector | undefined> {
  try {
    const Native = (globalThis as unknown as { BarcodeDetector?: DetectorConstructor }).BarcodeDetector
    if (Native && (await Native.getSupportedFormats()).includes('qr_code')) {
      return new Native({ formats: ['qr_code'] })
    }
  } catch { /* Missing or unavailable QR detection is reported before requesting a camera. */ }
  return undefined
}

/** One capture session at a time; late permission/detection results are discarded. */
export function createScanner(onGenerate: (value: string) => void, createDetector: DetectorFactory = createNativeDetector) {
  const root = document.createElement('section')
  root.className = 'qrick__scanner'
  const video = document.createElement('video')
  video.muted = true
  video.autoplay = true
  video.playsInline = true
  video.setAttribute('aria-label', 'Camera preview')
  video.hidden = true
  const status = document.createElement('p')
  status.className = 'qrick__status'
  status.setAttribute('role', 'status')
  status.textContent = 'Start the camera and point it at a QR code. Images stay on your device.'
  const result = document.createElement('textarea')
  result.className = 'qrick__input'
  result.readOnly = true
  result.setAttribute('aria-label', 'Decoded QR content')
  result.hidden = true
  const actions = document.createElement('div')
  actions.className = 'qrick__actions'
  function button(label: string, action: () => void) {
    const node = document.createElement('button')
    node.type = 'button'
    node.className = 'qrick__scan-button qrick__mode'
    node.textContent = label
    node.addEventListener('click', action)
    return node
  }
  let session = 0
  let stream: MediaStream | undefined
  let timer: ReturnType<typeof setTimeout> | undefined
  let destroyed = false
  const start = button('Start camera', () => { void capture() })
  const stopButton = button('Stop camera', () => { stop(); status.textContent = 'Camera stopped.' })
  stopButton.hidden = true
  const copy = button('Copy text', () => {
    if (!navigator.clipboard?.writeText) { status.textContent = 'Select and copy the text above.'; return }
    void navigator.clipboard.writeText(result.value).then(
      () => { status.textContent = 'Copied.' },
      () => { status.textContent = 'Copy blocked. Select and copy the text above.' },
    )
  })
  const generate = button('Generate QR', () => onGenerate(result.value))
  const open = document.createElement('a')
  open.className = 'qrick__mode'
  open.textContent = 'Open link'
  open.target = '_blank'
  open.rel = 'noopener noreferrer'
  const resultActions = document.createElement('div')
  resultActions.className = 'qrick__actions'
  resultActions.append(copy, open, generate)
  resultActions.hidden = true
  actions.append(start, stopButton)
  root.append(video, status, actions, result, resultActions)
  function stop() {
    if (start.disabled) status.textContent = 'Camera stopped.'
    session++
    clearTimeout(timer)
    stream?.getTracks().forEach((track) => track.stop())
    stream = undefined
    video.srcObject = null
    video.hidden = true
    start.disabled = false
    stopButton.hidden = true
  }
  async function capture() {
    stop()
    status.removeAttribute('data-tone')
    const id = session
    result.hidden = resultActions.hidden = true
    if (!navigator.mediaDevices?.getUserMedia) {
      status.textContent = 'Camera unavailable. Use an HTTPS page or allow camera access in your browser.'
      return
    }
    start.disabled = true
    stopButton.hidden = false
    status.textContent = 'Preparing scanner…'
    try {
      const detector = await createDetector()
      if (id !== session || destroyed) return
      if (!detector) {
        stop()
        const extensionLink = document.createElement('a')
        extensionLink.href = 'https://github.com/costinEEST/url-to-qr/releases'
        extensionLink.target = '_blank'
        extensionLink.rel = 'noopener noreferrer'
        extensionLink.textContent = 'QRick extension'
        extensionLink.setAttribute('aria-label', 'QRick extension releases (opens in a new tab)')
        status.setAttribute('data-tone', 'unsupported')
        status.replaceChildren(
          'This browser does not support native QR scanning. Use the ',
          extensionLink,
          ' to scan. QR generation still works here.',
        )
        return
      }
      const activeDetector = detector
      status.textContent = 'Waiting for camera permission…'
      const acquired = await navigator.mediaDevices.getUserMedia({ audio: false, video: { facingMode: { ideal: 'environment' } } })
      if (destroyed || id !== session) { acquired.getTracks().forEach((track) => track.stop()); return }
      stream = acquired
      video.srcObject = stream
      video.hidden = false
      await video.play()
      if (id !== session) return
      status.textContent = 'Point the camera at a QR code.'
      async function frame() {
        if (id !== session || destroyed) return
        try {
          let value: string | undefined
          if (video.readyState >= 2) {
            value = (await activeDetector.detect(video))[0]?.rawValue
          }
          if (id !== session || destroyed) return
          if (value !== undefined) {
            stop()
            result.value = value
            result.hidden = resultActions.hidden = false
            open.hidden = true
            open.removeAttribute('href')
            try {
              const url = new URL(value)
              if (url.protocol === 'https:' || url.protocol === 'http:') { open.href = url.href; open.hidden = false }
            } catch { /* Plain text remains copyable. */ }
            status.textContent = 'QR code found. Camera stopped.'
            result.focus()
            return
          }
          timer = setTimeout(() => { void frame() }, 180)
        } catch {
          if (id !== session) return
          stop()
          status.textContent = 'Scanning failed. Try restarting the camera or use the QRick extension.'
        }
      }
      void frame()
    } catch (error) {
      if (id !== session || destroyed) return
      stop()
      const name = error && typeof error === 'object' && 'name' in error ? error.name : ''
      status.textContent = name === 'NotAllowedError'
        ? 'Camera access denied or blocked by this page. Allow camera access or try another HTTPS page.'
        : name === 'NotFoundError' ? 'No camera found.' : 'Could not start the scanner. Check camera permissions and try again.'
    }
  }
  const onHide = () => { if (document.hidden) stop() }
  document.addEventListener('visibilitychange', onHide)
  window.addEventListener('pagehide', stop)
  return { root, stop, destroy() { destroyed = true; stop(); document.removeEventListener('visibilitychange', onHide); window.removeEventListener('pagehide', stop) } }
}
