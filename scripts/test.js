import { spawn } from 'node:child_process'
import { globSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const mode = process.argv[2] || 'source'
if (!['source', 'built', 'network'].includes(mode)) throw new Error(`Unknown test mode: ${mode}`)
const patterns = mode === 'network'
  ? ['tests/**/*.network.js', 'tests/**/*.fetch.js']
  : ['tests/**/*.test.js']
const files = globSync(patterns).sort()
if (files.length === 0) throw new Error(`No ${mode} tests found in ${process.cwd()}`)

// Spawn directly so both Tape and the reporter must succeed, without shell globs or pipelines.
const suite = spawn(process.execPath, [fileURLToPath(new URL('../node_modules/tape/bin/tape', import.meta.url)), ...files], {
  env: { ...process.env, TESTENV: mode === 'built' ? 'prod' : 'source' },
  stdio: ['ignore', 'pipe', 'inherit'],
})
const reporter = spawn(process.execPath, [fileURLToPath(new URL('../node_modules/tap-dancer/src/cli.js', import.meta.url))], {
  stdio: ['pipe', 'inherit', 'inherit'],
})
suite.stdout.pipe(reporter.stdin)
reporter.stdin.on('error', () => suite.kill())
const completed = (child) => new Promise((resolve, reject) => {
  child.on('error', reject)
  child.on('close', (code) => resolve(code === 0))
})
const results = await Promise.all([completed(suite), completed(reporter)])
process.exitCode = results.every(Boolean) ? 0 : 1
