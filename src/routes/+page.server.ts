import { db } from '$lib/connectDB';
import { fail } from '@sveltejs/kit';
import type { User } from '../app';
import type { Actions } from './$types';
import bcrypt from 'bcrypt';
import type { SqliteError } from 'better-sqlite3';

export const actions = {
	login: async ({ request }) => {
		const data = await request.formData();
		const cpf = data.get('cpf');
		if (!cpf) {
			return fail(400, { cpf, missing: true });
		}
		const user = db.prepare('SELECT * FROM User WHERE cpf = ?').get([cpf]) as User;
		if (!user) {
			return fail(404, { cpf, notFound: true });
		}
		delete user.senha;
		return user;
	},
	register: async ({ request }) => {
		const data = await request.formData();
		const cpf = data.get('cpf');
		const nome = data.get('nome');
		const email = data.get('email');
		const senha = data.get('senha');
		if (!cpf || !nome || !email || !senha) {
			return fail(400, { cpf, email, nome, missing: true });
		}
		try {
			const user = db.prepare('INSERT INTO User VALUES(@active, @cpf, @nome, @email, @senha)').run({
				active: 'TRUE',
				cpf: cpf.toString(),
				nome: nome.toString(),
				email: email.toString(),
				senha: bcrypt.hashSync(senha.toString(), 10)
			});
			if (user.changes == 0) {
				fail(500, {});
			}
		} catch (error) {
			const err = error as SqliteError;
			if (err.code == 'SQLITE_CONSTRAINT_PRIMARYKEY') {
				console.log('Usuário já cadastrado');
				fail(400, { alreadyExists: true });
			}
		}
	},
	deletar: async ({ request }) => {
		const data = await request.formData();
		const cpf = data.get('cpf');
		if (!cpf) {
			fail(400, { cpf, missing: true });
		}
		try {
			const user = db.prepare('DELETE FROM User WHERE cpf = ?').run([cpf]);
			if (user.changes == 0) {
				fail(404, { notFound: true });
			}
		} catch (error) {
			console.log(error);
		}
	}
} satisfies Actions;
