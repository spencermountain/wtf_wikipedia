/* eslint-disable no-console */
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, readFileSync, realpathSync, rmSync, symlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const pluginDir = process.cwd()
const pkg = JSON.parse(readFileSync(path.join(pluginDir, 'package.json'), 'utf8'))
const exports = process.argv.length > 2 ? process.argv.slice(2) : ['default']
const temporary = mkdtempSync(path.join(tmpdir(), 'wtf-package-'))
const modules = path.join(temporary, 'node_modules')
const run = (command, args, cwd = temporary) => execFileSync(command, args, { cwd, stdio: 'pipe' })

try {
  // Extract the actual publish artifacts. No source-tree files or devDependencies
  // are visible to the consumer, and the unreleased core never comes from npm.
  for (const directory of [root, pluginDir]) {
    const manifest = JSON.parse(readFileSync(path.join(directory, 'package.json'), 'utf8'))
    const archive = path.join(temporary, `${manifest.name}.tgz`)
    const destination = path.join(modules, manifest.name)
    run('pnpm', ['pack', '--out', archive], directory)
    mkdirSync(destination, { recursive: true })
    run('tar', ['-xzf', archive, '-C', destination, '--strip-components=1'])
    // Reuse the installed runtime dependencies, exposing only what this package declares.
    for (const dependency of Object.keys(manifest.dependencies || {})) {
      const target = path.join(destination, 'node_modules', dependency)
      mkdirSync(path.dirname(target), { recursive: true })
      symlinkSync(realpathSync(path.join(directory, 'node_modules', dependency)), target, 'dir')
    }
  }
  const packed = JSON.parse(readFileSync(path.join(modules, pkg.name, 'package.json'), 'utf8'))
  assert.equal(packed.peerDependencies.wtf_wikipedia, pkg.peerDependencies.wtf_wikipedia)
  writeFileSync(path.join(temporary, 'package.json'), JSON.stringify({ private: true, type: 'module' }))
  const smoke = "if (wtf('Hello').text() !== 'Hello') throw new Error('Plugin smoke test failed')\n"
  const esm = `import wtf from 'wtf_wikipedia'\nimport * as plugins from '${pkg.name}'\n`
    + exports.map((name) => `wtf.extend(plugins.${name})\n`).join('') + smoke
  const cjs = `import wtf = require('wtf_wikipedia')\nimport plugins = require('${pkg.name}')\n`
    + exports.map((name) => `wtf.extend(${name === 'default' ? 'plugins' : `plugins.${name}`})\n`).join('') + smoke
  writeFileSync(path.join(temporary, 'consumer.mts'), esm)
  writeFileSync(path.join(temporary, 'consumer.cts'), cjs)
  writeFileSync(path.join(temporary, 'consumer.mjs'), esm)
  writeFileSync(path.join(temporary, 'consumer.cjs'), cjs.replace(/import (\w+) = require/g, 'const $1 = require'))
  run(process.execPath, ['consumer.mjs'])
  run(process.execPath, ['consumer.cjs'])
  run(process.execPath, [path.join(root, 'node_modules/typescript/bin/tsc'),
    '--noEmit', '--strict', '--target', 'es2022', '--module', 'nodenext',
    '--moduleResolution', 'nodenext', 'consumer.mts', 'consumer.cts'])
  console.log(`${pkg.name}: packed ESM, CommonJS, and types passed`)
} catch (error) {
  if (error.stdout) process.stderr.write(error.stdout)
  if (error.stderr) process.stderr.write(error.stderr)
  throw error
} finally {
  rmSync(temporary, { recursive: true, force: true })
}
