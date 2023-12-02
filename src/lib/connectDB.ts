import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const devdbpath = path.join(__dirname.split(path.sep).slice(0, -2).join(path.sep), 'db', 'dev.db3');
export const db = new Database(devdbpath);
