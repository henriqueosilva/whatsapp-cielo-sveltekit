import { db } from '$lib/connectDB';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const { cnpj } = await request.json();
	try {
		db.prepare('UPDATE Empresa SET contactado = contactado + 1 WHERE cnpj = ?').run([cnpj]);
	} catch (err) {
		console.log(err);
	}
	return new Response();
};
