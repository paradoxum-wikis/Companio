<script lang="ts">
	import "../styles/main.css";
	import "../styles/global.css";

	import { ModeWatcher, toggleMode } from "mode-watcher";
	import { SunIcon, MoonIcon, CodeXml } from "@lucide/svelte";

	let { children } = $props();
</script>

<ModeWatcher />

<nav class="w-full bg-primary text-white shadow-md sticky top-0 z-50">
	<div class="container mx-auto flex items-center justify-between py-2 px-4">
		<a
			class="flex items-center gap-2 text-white font-semibold text-lg no-underline hover:opacity-80 transition-opacity"
			href="/"
		>
			<img
				src="favicon.png"
				alt="ALTER EGO Wiki"
				class="w-6 h-6 hidden md:block"
			/>
			<span class="hidden md:inline">Paradoxum Wikis Companio</span>
			<span class="md:hidden">AEWiki Companion</span>
		</a>
		<button
			id="themeToggle"
			class="relative p-2 border border-white/30 rounded-md hover:bg-white/10 text-white transition-colors flex items-center justify-center w-10 h-10 cursor-pointer"
			aria-label="Toggle theme"
			onclick={toggleMode}
		>
			<SunIcon
				class="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90"
			/>
			<MoonIcon
				class="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0"
			/>
			<span class="sr-only">Toggle theme</span>
		</button>
	</div>
</nav>

{@render children()}

<footer class="site-footer">
	<span>Not affiliated with Paradoxum Games</span>
	<a
		href="https://github.com/paradoxum-wikis/Companio"
		target="_blank"
		rel="noopener noreferrer"
	>
		Source Code
		<CodeXml aria-hidden="true" />
	</a>
</footer>
