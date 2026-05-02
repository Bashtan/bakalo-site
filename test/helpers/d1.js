import { DatabaseSync } from 'node:sqlite';

export function createD1Mock(schemaSql) {
  const db = new DatabaseSync(':memory:');
  db.exec(schemaSql);
  return new D1Mock(db);
}

class D1Mock {
  constructor(db) { this._db = db; }
  prepare(sql) { return new D1Statement(this._db, sql); }
}

class D1Statement {
  constructor(db, sql) {
    this._db = db;
    this._sql = sql;
    this._args = [];
  }
  bind(...args) { this._args = args; return this; }
  async first() { return this._db.prepare(this._sql).get(...this._args) ?? null; }
  async all() { return { results: this._db.prepare(this._sql).all(...this._args) }; }
  async run() { this._db.prepare(this._sql).run(...this._args); return { success: true }; }
}
