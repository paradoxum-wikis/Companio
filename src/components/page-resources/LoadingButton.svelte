<script lang="ts">
	import { Download, LoaderCircle } from "@lucide/svelte";
	import { Button } from "$lib/components/ui/button/index.js";
	import * as Card from "$lib/components/ui/card/index.js";

	let {
		loading,
		buttonText,
		onClick,
	}: {
		loading: boolean;
		buttonText: string;
		onClick: () => void;
	} = $props();
</script>

<Card.Root class="h-full">
	<Card.Header>
		<Card.Title>Fetch Current Data</Card.Title>
		<Card.Description
			>Refresh the selected game's cached assets.</Card.Description
		>
	</Card.Header>

	<Card.Content class="grid gap-4 content-start">
		<Button
			class="min-h-12 w-full font-bold"
			size="lg"
			onclick={onClick}
			disabled={loading}
		>
			{#if loading}
				<LoaderCircle class="size-4 animate-spin" />
				My Ego is Lord Exoing
			{:else}
				<Download />
				{buttonText}
			{/if}
		</Button>

		<p class="help-copy">
			Icons and thumbnails become downloadable after the fetch completes.
		</p>
	</Card.Content>
</Card.Root>

<style>
	.help-copy {
		margin: 0;
		font-size: 0.85rem;
		color: var(--muted-foreground);
		line-height: 1.55;
	}
</style>
