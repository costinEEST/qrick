import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const dist = resolve(root, 'dist')
const { version } = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'))

execFileSync(process.execPath, [resolve(root, 'scripts/version.mjs'), '--check'], { stdio: 'inherit' })
execFileSync('npm', ['run', 'build'], { cwd: root, stdio: 'inherit' })
execFileSync(process.execPath, [resolve(root, 'scripts/build-extension.mjs'), '--zip', '--no-build'], {
  stdio: 'inherit',
})

const sourceName = `qrick-source-v${version}.zip`
const sourcePath = resolve(dist, sourceName)
rmSync(sourcePath, { force: true })
const sourceFiles = [
  '.editorconfig',
  '.nvmrc',
  '.python-version',
  'pyproject.toml',
  'uv.lock',
  'tools/skill-evaluation/pyproject.toml',
  'tools/skill-evaluation/uv.lock',
  'tools/skill-evaluation/.python-version',
  '.agents/skills',
  'CHANGELOG.md',
  'LICENSE',
  'THIRD-PARTY-NOTICES.txt',
  'PRIVACY.md',
  'README.md',
  'package.json',
  'package-lock.json',
  'tsconfig.json',
  'vite.config.ts',
  'vite.demo.config.ts',
  'vitest.config.ts',
  'bookmarklet',
  'demo',
  'scripts',
  'src',
  'tests',
  'docs',
  'store-listing',
  'store-assets',
]
execFileSync('zip', [
  '-qr', sourcePath, ...sourceFiles,
  '-x', '*/__pycache__/*', '*.pyc', '*.pyo', '.venv/*', '.DS_Store', '*/.DS_Store',
], { cwd: root })
console.log(`source     dist/${sourceName}`)

// Check the archives themselves, rather than only the unpacked build folders.
for (const name of [`qrick-chrome-v${version}.zip`, `qrick-firefox-v${version}.zip`, `qrick-safari-v${version}.zip`, sourceName]) {
  const entries = execFileSync('unzip', ['-Z1', resolve(dist, name)], { encoding: 'utf8' }).trim().split('\n')
  const required = name === sourceName
    ? ['.python-version', 'pyproject.toml', 'uv.lock', 'tools/skill-evaluation/pyproject.toml', 'tools/skill-evaluation/uv.lock', 'tools/skill-evaluation/.python-version', '.agents/skills/qrick-testing/SKILL.md', 'scripts/check_skills.py', 'tests/test_skill_tooling.py', 'package-lock.json', 'README.md', 'docs/release-review.md', 'store-listing/shared.md', 'scripts/validate-store-assets.mjs', 'store-assets/shared/screenshot-scanner-1280x800.png']
    : ['manifest.json', 'popup.html', 'popup.js', 'THIRD-PARTY-NOTICES.txt', 'icons/icon-128.png']
  for (const file of required) {
    if (!entries.includes(file)) throw new Error(`${name} is missing ${file}`)
  }
  if (entries.some((file) => /(^|\/)(node_modules|\.git|\.venv|__pycache__)(\/|$)/.test(file) || /\.(?:map|pyc|pyo)$/.test(file))) {
    throw new Error(`${name} contains excluded build or development files`)
  }
}
console.log('archives    required files and exclusions verified')


const names = [
  `qrick-chrome-v${version}.zip`,
  `qrick-firefox-v${version}.zip`,
  `qrick-safari-v${version}.zip`,
  sourceName,
]
const checksums = names.map((name) => {
  const digest = createHash('sha256').update(readFileSync(resolve(dist, name))).digest('hex')
  return `${digest}  ${name}`
})
writeFileSync(resolve(dist, 'SHA256SUMS.txt'), `${checksums.join('\n')}\n`)
console.log('checksums  dist/SHA256SUMS.txt')
