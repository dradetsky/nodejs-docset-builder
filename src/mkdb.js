const fs = require('fs')
const path = require('path')

const Database = require('better-sqlite3')

const dbpath = 'docSet.dsidx'
const datapath = 'index-data.json'

const createSql = 'CREATE TABLE searchIndex(id INTEGER PRIMARY KEY, name TEXT, type TEXT, path TEXT)'

function createDb(dbpath, datapath) {
  const data = loadData(datapath)
  const db = new Database(dbpath)
  createTable(db)
  insertData(db, data)
}

function loadData(datapath) {
  const data = JSON.parse(fs.readFileSync(datapath, 'utf8'))
  return data
}

function createTable(db) {
  db.prepare(createSql).run()
}

function insertData(db, data) {
  const qstr = 'INSERT INTO searchIndex (name, type, path) values (?, ?, ?)'
  const stmt = db.prepare(qstr)

  // XXX this is way too slow, i must be using it wrong
  //
  // probably i ought to emit csv, not json, and just use the raw load
  // stuff
  for (let row of Object.values(data)) {
    stmt.run(row.textRaw, row.type, row.full)
  }
}

function test() {
  createDb(dbpath, datapath)
}

test()
