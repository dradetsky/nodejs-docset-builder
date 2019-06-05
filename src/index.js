const fs = require('fs').promises
const path = require('path')

const glob = require('glob')

const jsonOut = path.join(__dirname, '../index-data.json')

const skipFiles = [
  '_toc',
  'all'
]

const branchesToVisit = [
    'classMethods',
    'vars',
    'modules',
    'classes',
    'methods',
    'events',
    'properties'
]

const notAlphaNumerics = /[^a-z0-9]+/g
const edgeUnderscores = /^_+|_+$/g
const notAlphaStart = /^[^a-z]/

const g_recs = {}
let g_prefix

// XXX maybe should be `api/${prefix}...`
function fullKey(id, prefix) {
  const full = `${prefix}.html#${prefix}_${id}`
  return full
}

function getIdText(text) {
  text = text.toLowerCase()
    .replace(notAlphaNumerics, '_')
    .replace(edgeUnderscores, '')
    .replace(notAlphaStart, '_$&')
  return text
}

// XXX maybe add disambiguation increment logic
function getId(text) {
  return getIdText(text)
}

function getJsonFiles(docsBase) {
  const target = path.join(docsBase, '*.json')
  const files0 = glob.sync(target)
  const files = files0.filter(x => ! skipFiles.includes(path.basename(x, '.json')))
  return files
}

async function writeSearchIndexData() {
  await fs.writeFile(jsonOut, JSON.stringify(g_recs), 'utf8')
}

async function visitFile(filepath) {
  const text = await fs.readFile(filepath, 'utf8')
  const data = JSON.parse(text)
  visit(data)
}

function visit(obj) {
  visitThis(obj)
  visitChilds(obj)
}

function visitThis(obj) {
  let id

  // sufficient to identify property node?
  if (obj.type === 'Object') {
    id = getId(obj.name)
  } else if (obj.textRaw) {
    id = getId(obj.textRaw)
  }

  if (id) {
    const { textRaw, type } = obj
    if (type !== 'module') {
      const full = fullKey(id, g_prefix)
      const rec = { textRaw, type, id, full }
      debugger
      g_recs[id] = rec
    }
  }
}

function visitChilds(obj) {
  branchesToVisit.map(b => obj[b] && obj[b].map(e => visit(e)))
}

// buildSearchIndexData: <explain>
//
// docsBase the root of the already-built nodejs doc dir
// (nodejs/out/doc/api)
async function buildSearchIndexData(docsBase) {
  const files = getJsonFiles(docsBase)
  for (let f of files) {
    let prefix = path.basename(f, '.json')
    g_prefix = prefix
    await visitFile(f)
  }
  await writeSearchIndexData()
}

// XXX dev only
const docsBase = path.join(__dirname, '../api')


async function test() {
  console.log(getJsonFiles(docsBase))
}

// test()
buildSearchIndexData(docsBase)
