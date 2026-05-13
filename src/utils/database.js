import { Capacitor } from '@capacitor/core';
import { SQLiteConnection, CapacitorSQLite } from '@capacitor-community/sqlite';

const platform = Capacitor.getPlatform();
const sqlite = new SQLiteConnection(CapacitorSQLite);
let db = null;

const DB_NAME = 'parejas_db';

async function getConnection() {
  if (db) return db;

  const ret = await sqlite.checkConnectionsConsistency();
  const isConn = (ret.result && ret.result === true);

  if (isConn) {
    db = await sqlite.retrieveConnection(DB_NAME, false);
  } else {
    db = await sqlite.createConnection(DB_NAME, false, 'no-encryption', 1, false);
    await db.open();
  }
  return db;
}

export async function initDatabase() {
  const connection = await getConnection();

  const schema = `
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user TEXT NOT NULL,
      emoji TEXT,
      cat TEXT NOT NULL,
      desc TEXT NOT NULL,
      amount INTEGER NOT NULL,
      shared INTEGER NOT NULL DEFAULT 1,
      ts TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS goals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      emoji TEXT,
      target INTEGER NOT NULL,
      current INTEGER NOT NULL DEFAULT 0,
      color TEXT
    );

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      key TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      initial TEXT NOT NULL,
      color TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      emoji TEXT NOT NULL,
      shared_default INTEGER NOT NULL DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      key TEXT NOT NULL UNIQUE,
      value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS budgets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      month TEXT NOT NULL UNIQUE,
      amount INTEGER NOT NULL
    );
  `;

  await connection.execute(schema);
}

export async function seedData(initialUsers, initialCategories, initialGoals, initialSettings, initialBudgets) {
  const connection = await getConnection();

  // Seed users if empty
  const userRes = await connection.query('SELECT COUNT(*) as count FROM users;');
  const userCount = userRes.values?.[0]?.count ?? 0;
  if (userCount === 0 && initialUsers) {
    for (const u of initialUsers) {
      await connection.run(
        `INSERT INTO users (key, name, initial, color)
         VALUES (?, ?, ?, ?);`,
        [u.key, u.name, u.initial, u.color]
      );
    }
  }

  // Seed categories if empty
  const catRes = await connection.query('SELECT COUNT(*) as count FROM categories;');
  const catCount = catRes.values?.[0]?.count ?? 0;
  if (catCount === 0 && initialCategories) {
    for (const c of initialCategories) {
      await connection.run(
        `INSERT INTO categories (name, emoji, shared_default)
         VALUES (?, ?, ?);`,
        [c.name, c.emoji, c.shared_default ? 1 : 0]
      );
    }
  }

  // Seed goals if empty
  const goalRes = await connection.query('SELECT COUNT(*) as count FROM goals;');
  const goalCount = goalRes.values?.[0]?.count ?? 0;
  if (goalCount === 0 && initialGoals) {
    for (const g of initialGoals) {
      await connection.run(
        `INSERT INTO goals (id, name, emoji, target, current, color)
         VALUES (?, ?, ?, ?, ?, ?);`,
        [g.id, g.name, g.emoji, g.target, g.current, g.color]
      );
    }
  }

  // Seed settings if empty
  const settingsRes = await connection.query('SELECT COUNT(*) as count FROM settings;');
  const settingsCount = settingsRes.values?.[0]?.count ?? 0;
  if (settingsCount === 0 && initialSettings) {
    for (const s of initialSettings) {
      await connection.run(
        `INSERT INTO settings (key, value)
         VALUES (?, ?);`,
        [s.key, s.value]
      );
    }
  }

  // Seed budgets if empty
  const budgetRes = await connection.query('SELECT COUNT(*) as count FROM budgets;');
  const budgetCount = budgetRes.values?.[0]?.count ?? 0;
  if (budgetCount === 0 && initialBudgets) {
    for (const b of initialBudgets) {
      await connection.run(
        `INSERT INTO budgets (month, amount)
         VALUES (?, ?);`,
        [b.month, b.amount]
      );
    }
  }
}

export async function getTransactions() {
  const connection = await getConnection();
  const res = await connection.query('SELECT * FROM transactions ORDER BY ts DESC;');
  return (res.values || []).map(row => ({
    ...row,
    amount: Number(row.amount),
    shared: Boolean(row.shared),
    ts: new Date(row.ts),
  }));
}

export async function addTransaction(tx) {
  const connection = await getConnection();
  await connection.run(
    `INSERT INTO transactions (user, emoji, cat, desc, amount, shared, ts)
     VALUES (?, ?, ?, ?, ?, ?, ?);`,
    [tx.user, tx.emoji, tx.cat, tx.desc, tx.amount, tx.shared ? 1 : 0, tx.ts.toISOString()]
  );
}

export async function updateTransaction(id, tx) {
  const connection = await getConnection();
  await connection.run(
    `UPDATE transactions 
     SET user = ?, emoji = ?, cat = ?, desc = ?, amount = ?, shared = ?, ts = ?
     WHERE id = ?;`,
    [tx.user, tx.emoji, tx.cat, tx.desc, tx.amount, tx.shared ? 1 : 0, tx.ts.toISOString(), id]
  );
}

export async function deleteTransaction(id) {
  const connection = await getConnection();
  await connection.run(
    `DELETE FROM transactions WHERE id = ?;`,
    [id]
  );
}

export async function getGoals() {
  const connection = await getConnection();
  const res = await connection.query('SELECT * FROM goals;');
  return (res.values || []).map(row => ({
    ...row,
    target: Number(row.target),
    current: Number(row.current),
  }));
}

export async function updateGoal(id, newCurrent) {
  const connection = await getConnection();
  await connection.run(
    `UPDATE goals SET current = ? WHERE id = ?;`,
    [newCurrent, id]
  );
}

export async function getUsers() {
  const connection = await getConnection();
  const res = await connection.query('SELECT * FROM users ORDER BY id;');
  return res.values || [];
}

export async function seedUsers(initialUsers) {
  const connection = await getConnection();
  for (const u of initialUsers) {
    await connection.run(
      `INSERT OR IGNORE INTO users (key, name, initial, color)
       VALUES (?, ?, ?, ?);`,
      [u.key, u.name, u.initial, u.color]
    );
  }
}

export async function getCategories() {
  const connection = await getConnection();
  const res = await connection.query('SELECT * FROM categories ORDER BY id;');
  return (res.values || []).map(row => ({
    ...row,
    shared_default: Boolean(row.shared_default),
  }));
}

export async function seedCategories(initialCategories) {
  const connection = await getConnection();
  for (const c of initialCategories) {
    await connection.run(
      `INSERT OR IGNORE INTO categories (name, emoji, shared_default)
       VALUES (?, ?, ?);`,
      [c.name, c.emoji, c.shared_default ? 1 : 0]
    );
  }
}

export async function getSettings() {
  const connection = await getConnection();
  const res = await connection.query('SELECT * FROM settings;');
  const settings = {};
  (res.values || []).forEach(row => {
    settings[row.key] = row.value;
  });
  return settings;
}

export async function setSetting(key, value) {
  const connection = await getConnection();
  await connection.run(
    `INSERT INTO settings (key, value)
     VALUES (?, ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value;`,
    [key, value]
  );
}

export async function getBudget(month) {
  const connection = await getConnection();
  const res = await connection.query(
    'SELECT * FROM budgets WHERE month = ?;',
    [month]
  );
  if (res.values && res.values.length > 0) {
    return {
      ...res.values[0],
      amount: Number(res.values[0].amount),
    };
  }
  return null;
}

export async function setBudget(month, amount) {
  const connection = await getConnection();
  await connection.run(
    `INSERT INTO budgets (month, amount)
     VALUES (?, ?)
     ON CONFLICT(month) DO UPDATE SET amount = excluded.amount;`,
    [month, amount]
  );
}

export async function closeDatabase() {
  if (db) {
    await db.close();
    await sqlite.closeConnection(DB_NAME, false);
    db = null;
  }
}
