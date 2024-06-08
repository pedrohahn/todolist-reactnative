import * as SQLite from "expo-sqlite";

let db;

const SQL_CREATE = `CREATE TABLE IF NOT EXISTS tasks (
id INTEGER PRIMARY KEY autoincrement, describe varchar(255) NOT NULL,)`;

function openDB() {
  if (!db) {
    db = SQLite.openDatabase("tasks.db");
  }

  db.execSync(SQL_CREATE);
}

export async function getAllTasks() {
  openDB();
  return await db.getAllAsync("SELECT * FROM tasks ORDER BY id DESC");
}

export async function insertTask(data) {
  openDB();
  const params = [data.describe];
  console.log(params);
  return await db.runAsync(
    "INSERT INTO tasks (describe) VALUES (?)",
    params
  );
}