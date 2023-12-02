import { writable } from 'svelte/store';

export function createCounter(n: number | undefined) {
	const { subscribe, update } = writable(n);

	return {
		subscribe,
		increment: () => update((n) => n + 1),
		decrement: () => update((n) => n - 1),
		addTen: () => update((n) => (n += 10))
	};
}
