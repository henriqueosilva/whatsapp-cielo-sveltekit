<script lang="ts">
	import { createCounter } from '$lib/counterStore';
	import { simpleUser } from '$lib/userStore';
	import type { Cnpj, User } from '../app';
	import type { ActionData } from './$types';

	const counter = createCounter(10);
	let mensagemErro = '';
	let nome = $simpleUser.nome;
	let idade = $simpleUser.idade;
	let ativo = $simpleUser.ativo;
	let empresas: Cnpj[] | undefined = undefined;
	export let form: ActionData;
	$: {
		/* console.log($simpleUser);
		console.log(empresas);
		console.log(form); */
		console.log(empresas);
	}
	const save = () => {
		simpleUser.update((st) => ({
			nome: nome,
			idade: idade,
			ativo: ativo
		}));
	};

	const buscaEmpresas = async () => {
		const response = await (await fetch('/api/empresas')).json();
		if (response.status == 'erro') {
			mensagemErro = response.msg;
			return;
		}
		empresas = response;
	};

	const mandarMensagem = (telefones: string | undefined): void => {
		if (!telefones) return;
		const phone = '55' + telefones.split('&')[0].split('-').join('');
		const message = 'Teste';
		const target = `https://api.whatsapp.com/send?phone=${encodeURIComponent(
			phone
		)}&text=${encodeURIComponent(message)}`;
		window.open(target, '_blank')?.focus();
	};
</script>

<h2>{mensagemErro}</h2>

<button on:click={buscaEmpresas}>Buscar Empresas</button>
<div>
	{#if empresas?.length}
		<table>
			<thead>
				<tr>
					<td>CNPJ</td>
					<td>Nome Fantasia</td>
					<td>Data Abertura</td>
					<td>Situação Cadastdal</td>
					<td>Logradouro</td>
					<td>Bairro</td>
					<td>Municipio</td>
					<td>Telefone</td>
					<td>UF</td>
					<td>Ação</td>
				</tr>
			</thead>
			<tbody>
				{#each empresas as empresa}
					<tr id={empresa.cnpj}>
						<td>{empresa.cnpj}</td>
						<td>{empresa.nome_fantasia}</td>
						<td>{empresa.data_abertura}</td>
						<td>{empresa.situacao_cadastral}</td>
						<td>{empresa.logradouro}</td>
						<td>{empresa.bairro}</td>
						<td>{empresa.municipio}</td>
						<td>{empresa.telefones}</td>
						<td>{empresa.uf}</td>
						<button on:click={() => mandarMensagem(empresa.telefones)}>Enviar Mensagem</button>
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}
</div>

<!-- <form method="post" action="?/login">
	<label>CPF <input name="cpf" type="text" value={form?.cpf || ''} /></label>
	<label>nome <input name="nome" type="text" value={form?.nome || ''} /></label>
	<label>email <input name="email" type="email" value={form?.email || ''} /></label>
	<label>senha <input name="senha" type="password" /></label>
	<button>Fazer Login</button>
	<button formaction="?/register">Registar</button>
	<button formaction="?/deletar">Deletar</button>
</form>
{#if form?.active}
	{form.active}
	{form.nome}
	{form.email}
	{form.cpf}
{/if}
{#if form?.notFound}
	<h2>Usuário não encontrado</h2>
{/if}
{#if form?.missing}
	<h2>CPF não informado</h2>
{/if}
<button on:click={counter.increment}> + </button>
<button on:click={counter.decrement}> - </button>
<button on:click={counter.addTen}> +10 </button>
<h2>{$counter}</h2>

<h3>{$simpleUser.nome}</h3>
<form on:submit|preventDefault={save}>
	<input type="text" bind:value={nome} />
	<input type="text" bind:value={idade} />
	<input type="checkbox" bind:checked={ativo} />
	<button type="submit">Save</button>
</form>
<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
 -->
<style>
	table,
	th,
	td {
		border: 1px solid black;
	}
</style>
