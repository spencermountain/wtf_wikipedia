import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'

const headers = { 'Api-User-Agent': 'wtf-plugin-i18n build script (github.com/spencermountain/wtf_wikipedia)' }
const wait = (ms) => new Promise((res) => setTimeout(res, ms))

// polite, sequential GET → json
const getJson = async (url) => {
  await wait(250)
  const res = await fetch(url, { headers })
  if (!res.ok) {
    throw new Error(`http ${res.status} on ${url}`)
  }
  return res.json()
}

// raw fetched data lives in ./data/, committed so builds are reproducible offline
const dataDir = new URL('./data/', import.meta.url)
const readData = (name) => JSON.parse(readFileSync(new URL(name, dataDir), 'utf8'))
const writeData = (name, obj) => {
  mkdirSync(dataDir, { recursive: true })
  writeFileSync(new URL(name, dataDir), JSON.stringify(obj, null, 2))
}

const today = () => new Date().toISOString().slice(0, 10)

export { getJson, readData, writeData, today }
