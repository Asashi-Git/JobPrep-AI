// src/database/database.js
import mariadb from 'mariadb';
import fs from 'fs';
import path from 'path';

let pool;

async function getSecret(secretName) {
  try {
    const secretPath = path.join('/run/secrets', secretName);
    const secret = await fs.promises.readFile(secretPath, 'utf8');
    return secret.trim();
  } catch (error) {
    console.error(`Error while reading ${secretName}:`, error);
    return null;
  };
};

export async function createPool() {
  try {
    const dbUser = await getSecret('db_user');
    const dbPassword = await getSecret('db_password');
    const dbName = await getSecret('db_name');

    pool = mariadb.createPool({
      host: 'mariadb',
      user: dbUser,
      password: dbPassword,
      database: dbName,
      connectionLimit: 5
    });
  } catch (error) {
    console.error(`Error while creating pool:`, error);
    return null;
  };
};

export async function testDatabaseConnection() {
  let conn;
  try {
    conn = await pool.getConnection();
    console.log("Connected successfully!");
    const tables = await conn.query("SHOW TABLES");
    console.log(tables);
  } catch (error) {
    console.error(`Database connection failed:`, error);
  } finally {
    if (conn) {
      conn.release();
    }
  };
};