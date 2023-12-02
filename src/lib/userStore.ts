import { writable } from 'svelte/store';

export const simpleUser = writable({
	nome: '',
	idade: 0,
	ativo: true
});
