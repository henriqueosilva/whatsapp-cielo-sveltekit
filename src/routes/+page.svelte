<script lang="ts">
	import { invalidate, invalidateAll } from '$app/navigation';
	import { createCounter } from '$lib/counterStore';
	import { simpleUser } from '$lib/userStore';
	import { json } from '@sveltejs/kit';
	import type { Cnpj, User } from '../app';
	import type { ActionData, PageData } from './$types';

	const counter = createCounter(10);
	let mensagemErro = '';
	let nome = $simpleUser.nome;
	let idade = $simpleUser.idade;
	let ativo = $simpleUser.ativo;
	let empresas: Cnpj[] | undefined = undefined;
	let dataInicio = 0;
	let dataFim = 0;
	export let form: ActionData;
	export let data: PageData;
	$: {
		/* console.log($simpleUser);
		console.log(empresas);*/
		console.log(form);
		console.log(empresas);
		console.log(data);
		if (data.empresas) empresas = data.empresas;
	}
	const save = () => {
		simpleUser.update((st) => ({
			nome: nome,
			idade: idade,
			ativo: ativo
		}));
	};

	const buscaEmpresas = async () => {
		if (dataInicio != 0 && dataFim != 0) {
			const response = await (
				await fetch(`/api/empresas?dataInicio=${dataInicio}&dataFim=${dataFim}`)
			).json();
			if (response.status == 'erro') {
				mensagemErro = response.msg;
				return;
			}
		}
		const response = await (await fetch('/api/empresas')).json();
		if (response.status == 'erro') {
			mensagemErro = response.msg;
			return;
		}
		empresas = response;
	};

	const mandarMensagem = (empresa: Cnpj): void => {
		if (!empresa.telefones) return;
		fetch('/api/empresas/contato', {
			method: 'POST',
			body: JSON.stringify({ cnpj: empresa.cnpj })
		});
		empresas
			?.filter((empresa) => empresa.cnpj == empresa.cnpj)
			?.forEach((empresa) => (empresa.contactado = empresa.contactado += 1));
		invalidateAll();
		const phone = '55' + empresa.telefones.split('&')[0].split('-').join('');
		const message = `Olá, boa tarde, tudo bem!?`;
		const target = `https://api.whatsapp.com/send?phone=${encodeURIComponent(
			phone
		)}&text=${encodeURIComponent(message)}`;
		window.open(target, '_blank')?.focus();
	};
</script>

<h2>{mensagemErro}</h2>
<label
	>Data Inicio
	<input type="date" name="dataInicio" bind:value={dataInicio} />
</label>
<label
	>Data Fim
	<input type="date" name="dataFim" bind:value={dataFim} />
</label>
<button
	on:click={() => {
		invalidateAll();
	}}><a href="/?dataInicio={dataInicio}&dataFim={dataFim}">Buscar Empresas</a></button
>
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
					<td>Contactado</td>
					<td>Ação</td>
				</tr>
			</thead>
			<tbody>
				{#each empresas as empresa}
					<tr id={empresa.cnpj}>
						<td>{empresa.cnpj}</td>
						<td>{empresa.nome_fantasia}</td>
						<td>{empresa.data_abertura.split('T')[0]}</td>
						<td>{empresa.situacao_cadastral}</td>
						<td>{empresa.logradouro}</td>
						<td>{empresa.bairro}</td>
						<td>{empresa.municipio}</td>
						<td>{`${empresa.telefones ? empresa.telefones : 'carregando...'}`}</td>
						<td>{empresa.uf}</td>
						<td>{empresa.contactado}</td>
						<button on:click={() => mandarMensagem(empresa)}>Enviar Mensagem</button>
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
