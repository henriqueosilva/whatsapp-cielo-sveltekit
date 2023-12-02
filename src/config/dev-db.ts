import sqlite3 from 'sqlite3-offline-next';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const main = async () => {
	const __filename = fileURLToPath(import.meta.url);
	const __dirname = path.dirname(__filename);
	const db = await (async () => {
		return await open({
			filename: path.join(__dirname.split(path.sep).slice(0, -2).join(path.sep), 'db', 'dev.db3'),
			driver: sqlite3.Database
		});
	})();

	db.migrate({
		migrationsPath: path.join(
			__dirname.split(path.sep).slice(0, -2).join(path.sep),
			'db',
			'migration',
			'dev'
		)
	});
};

main();
