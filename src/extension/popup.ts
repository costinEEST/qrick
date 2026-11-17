/**
 * Popup entry point.
 *
 * The extension asks for `activeTab` only. Clicking the toolbar button grants
 * it for the current tab, which is enough to read that tab's URL — no host
 * permissions, no "can read all your data on every website" warning.
 */
import { createExtensionDetector } from '../core/scanner-decoder'
import { createPanel } from '../core/panel'
import { panelCss } from '../core/styles'
import { isInternalPage } from '../core/link'

/** Firefox and Safari expose `browser`; Chrome and Edge expose `chrome`. */
interface TabsApi {
  runtime: { getURL(path: string): string }
  tabs: {
    create(info: { url: string }): Promise<unknown>
    query(info: { active: boolean; currentWindow: boolean }): Promise<{ url?: string }[]>
  }
}
const api = ((globalThis as unknown as { browser?: TabsApi; chrome?: TabsApi }).browser ??
  (globalThis as unknown as { chrome?: TabsApi }).chrome) as TabsApi | undefined

function injectStyles() {
  const style = document.createElement('style')
  style.append(document.createTextNode(panelCss))
  document.head.append(style)
}

async function activeTabUrl(): Promise<string | undefined> {
  try {
    const [tab] = (await api?.tabs.query({ active: true, currentWindow: true })) ?? []
    return tab?.url
  } catch {
    return undefined
  }
}

async function main() {
  injectStyles()
  const mount = document.getElementById('mount')
  if (!mount) return

  const url = await activeTabUrl()
  const internal = isInternalPage(url)

  const panel = createPanel({
    createDetector: createExtensionDetector,
    scanInitially: location.search === '?scan',
    onScan: location.search === '?scan' ? undefined : () => {
      if (api) void api.tabs.create({ url: api.runtime.getURL('popup.html?scan') })
    },
    value: internal ? '' : (url ?? ''),
    title: 'Create a QR code',
    emptyNote: internal
      ? 'This browser page has no link to share. Paste one instead.'
      : 'Paste a link to make a QR code.',
  })

  if (location.search === '?scan') {
    document.body.style.width = 'min(480px, 100%)'
    document.body.style.margin = '0 auto'
  }
  mount.append(panel.root)
  panel.focus()
}

void main()
