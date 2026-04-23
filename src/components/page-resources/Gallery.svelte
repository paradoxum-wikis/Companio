<script lang="ts">
	import { Download, Image, Images, Info } from "@lucide/svelte";
	import * as Card from "$lib/components/ui/card/index.js";
	import { downloadImage } from "../../modules/downloader.js";

	let {
		gameIconUrl,
		originalGameIconUrl,
		thumbnails,
	}: {
		gameIconUrl: string | null;
		originalGameIconUrl: string | null;
		thumbnails: Array<{ url: string; alt: string }>;
	} = $props();

	const showPlaceholders = $derived(thumbnails.length === 0);
	const displayThumbnails = $derived(
		showPlaceholders
			? Array.from({ length: 6 }, (_, i) => ({
					url: "/Placeholder.png",
					alt: `Thumbnail ${i + 1}`,
				}))
			: thumbnails,
	);

	async function handleGameIconClick() {
		const urlToUse = originalGameIconUrl || gameIconUrl;
		if (!urlToUse) return;

		try {
			const hdUrl = urlToUse.replace("/512/512/", "/1024/1024/");
			await downloadImage(hdUrl, "game-icon-hd");
		} catch (error) {
			console.warn(
				"[Gallery] HD download failed, falling back to the original icon:",
				error,
			);
			try {
				await downloadImage(urlToUse, "game-icon");
			} catch (fallbackError) {
				console.error("[Gallery] Icon download failed:", fallbackError);
				alert("Failed to download game icon");
			}
		}
	}

	function handleThumbnailClick(url: string, alt: string) {
		downloadImage(url, alt.replace(/\s+/g, "-").toLowerCase());
	}
</script>

<div class="gallery-grid">
	<Card.Root class="icon-card">
		<Card.Header>
			<div class="tds-inline-title">
				<div class="tds-icon-well tds-icon-well--accent">
					<Image />
				</div>
				<div>
					<Card.Title>Game Icon</Card.Title>
					<Card.Description>
						The icon that appears as the game's icon in the game
						list, duh.
					</Card.Description>
				</div>
			</div>
		</Card.Header>

		<Card.Content class="grid gap-4">
			<button
				type="button"
				class="download-surface icon-surface"
				onclick={handleGameIconClick}
				disabled={!gameIconUrl && !originalGameIconUrl}
				aria-label="Download game icon"
			>
				<img
					src={gameIconUrl ||
						"https://pbs.twimg.com/media/Fba0rk0XEAEn8Ix.jpg"}
					alt="Game Icon"
				/>
				<span class="surface-overlay">
					<Download />
					Download icon
				</span>
			</button>

			<p class="asset-note">
				<Info class="mt-0.5 size-3.5 shrink-0" />
				The download tries the larger 1024px image first, then falls back
				to the source icon if needed.
			</p>
		</Card.Content>
	</Card.Root>

	<Card.Root class="thumb-card">
		<Card.Header>
			<div class="tds-inline-title">
				<div class="tds-icon-well tds-icon-well--accent">
					<Images />
				</div>
				<div>
					<Card.Title>Thumbnails</Card.Title>
					<Card.Description
						>Images used in the main game page's slider, and the
						events section.</Card.Description
					>
				</div>
			</div>

			<div class="count-pill">{displayThumbnails.length} images</div>
		</Card.Header>

		<Card.Content class="grid gap-4">
			<div class="thumb-grid">
				{#each displayThumbnails as thumbnail}
					<button
						type="button"
						class="download-surface thumb-surface"
						onclick={() =>
							handleThumbnailClick(thumbnail.url, thumbnail.alt)}
						disabled={showPlaceholders}
						aria-label={`Download ${thumbnail.alt}`}
					>
						<img src={thumbnail.url} alt={thumbnail.alt} />
						<span class="surface-overlay">
							<Download />
							{showPlaceholders ? "Load data first" : "Download"}
						</span>
					</button>
				{/each}
			</div>

			{#if showPlaceholders}
				<p class="asset-note placeholder-note">
					<Info class="mt-0.5 size-3.5 shrink-0" />
					Showing placeholders for now. Load the selected game to fetch
					the real thumbnails.
				</p>
			{/if}
		</Card.Content>
	</Card.Root>
</div>

<style>
	.gallery-grid {
		display: grid;
		grid-template-columns: minmax(16rem, 21rem) minmax(0, 1fr);
		gap: 1rem;
	}

	:global(.icon-card [data-slot="card-header"]),
	:global(.thumb-card [data-slot="card-header"]) {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 1rem;
	}

	.count-pill {
		padding: 0.45rem 0.7rem;
		border-radius: 999px;
		background: var(--muted);
		color: var(--muted-foreground);
		font-size: 0.78rem;
		font-weight: 700;
		white-space: nowrap;
	}

	.download-surface {
		position: relative;
		border: 1px solid var(--border);
		border-radius: 1.1rem;
		background: color-mix(in oklab, var(--card) 90%, transparent);
		padding: 0;
		overflow: hidden;
		cursor: pointer;
		transition:
			transform 0.2s ease,
			border-color 0.2s ease,
			box-shadow 0.2s ease;

		&:hover:not(:disabled),
		&:focus-visible:not(:disabled) {
			transform: translateY(-2px);
			border-color: color-mix(
				in oklab,
				var(--primary) 60%,
				var(--border)
			);
			box-shadow: 0 18px 40px rgb(0 0 0 / 0.18);
		}

		&:disabled {
			cursor: not-allowed;
			opacity: 0.72;
		}
	}

	.icon-surface {
		aspect-ratio: 1;
		max-width: 15rem;
		justify-self: center;
	}

	.thumb-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(9rem, 1fr));
		gap: 0.85rem;
	}

	.thumb-surface {
		aspect-ratio: 16 / 9;
	}

	img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.icon-surface img {
		object-fit: contain;
		background:
			linear-gradient(
				135deg,
				color-mix(in oklab, var(--muted) 75%, transparent),
				transparent
			),
			var(--card);
	}

	.surface-overlay {
		position: absolute;
		inset: auto 0 0;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.45rem;
		padding: 0.8rem 1rem;
		background: linear-gradient(
			180deg,
			transparent,
			color-mix(in oklab, black 72%, transparent)
		);
		color: white;
		font-size: 0.82rem;
		font-weight: 700;
		opacity: 0;
		transition: opacity 0.2s ease;
	}

	.download-surface:hover:not(:disabled) .surface-overlay,
	.download-surface:focus-visible:not(:disabled) .surface-overlay {
		opacity: 1;
	}

	.asset-note {
		display: flex;
		align-items: flex-start;
		gap: 0.55rem;
		margin: 0;
		font-size: 0.84rem;
		line-height: 1.55;
		color: var(--muted-foreground);
	}

	.placeholder-note {
		padding-top: 0.25rem;
	}

	@media (max-width: 900px) {
		.gallery-grid {
			grid-template-columns: 1fr;
		}

		.icon-surface {
			max-width: 100%;
		}
	}

	@media (max-width: 640px) {
		:global(.thumb-card [data-slot="card-header"]) {
			flex-direction: column;
		}
	}
</style>
