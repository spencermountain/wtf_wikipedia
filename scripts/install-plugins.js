// Run `npm install` in each plugins/* subdirectory that has its own package.json.
// Wired up as the `prepare` script so it runs on local `npm install` and `git`
// installs, but NOT for downstream consumers of the published package.
import { readdirSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const pluginsDir = join(root, 'plugins')

if (!existsSync(pluginsDir)) {
  console.log('no plugins directory - nothing to install')
  process.exit(0)
}

const plugins = readdirSync(pluginsDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => join(pluginsDir, entry.name))
  .filter((dir) => existsSync(join(dir, 'package.json')))

for (const dir of plugins) {
  console.log(`installing ${dir}`)
  const result = spawnSync('npm', ['install'], { cwd: dir, stdio: 'inherit', shell: process.platform === 'win32' })
  if (result.status !== 0) {
    console.error(`failed to install ${dir}`)
    process.exit(result.status || 1)
  }
}
