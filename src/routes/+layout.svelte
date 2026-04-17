<script lang="ts">
	import 'bootstrap/dist/css/bootstrap.min.css';
	import 'bootstrap-icons/font/bootstrap-icons.css';
	import '../styles/main.css';
	import '../styles/theme.css';
	import '../styles/discord.css';

	import { ThemeManager } from '../components/themeManager';
	import { onMount } from 'svelte';

	let { children } = $props();

	onMount(() => {
		ThemeManager.init();
	});
</script>

<nav class="navbar navbar-expand-lg navbar-dark bg-wiki">
	<div class="container">
		<a class="navbar-brand" href="/">
			<img
				src="https://static.wikia.nocookie.net/alter-ego/images/4/4a/Site-favicon.ico"
				alt="ALTER EGO Wiki"
				width="24"
				height="24"
				class="me-1 d-none d-md-inline align-text-bottom"
			/>
			<span class="d-none d-md-inline">ALTER EGO Wiki Companion</span>
			<span class="d-md-none">AEWiki Companion</span>
		</a>
		<button id="themeToggle" class="theme-switcher me-auto" aria-label="Toggle theme">
			<i class="bi bi-moon-fill" id="themeIcon"></i>
		</button>
	</div>
</nav>

{@render children()}
