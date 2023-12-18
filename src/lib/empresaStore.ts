import { writable } from 'svelte/store';

export function createEmpresa() {
	const { subscribe, update } = writable();

	return {
		subscribe,
		update
	};
}
