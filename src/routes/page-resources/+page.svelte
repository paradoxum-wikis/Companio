<script lang="ts">
	import { onMount } from "svelte";
	import {
		TriangleAlert,
		Award,
		ExternalLink,
		Settings2,
	} from "@lucide/svelte";
	import * as Card from "$lib/components/ui/card/index.js";
	import { RobloxApiService } from "../../modules/service.js";
	import { getFromCache, saveToCache } from "../../modules/cacheManage.js";
	import { getCachedImageUrl } from "../../modules/imageCache.js";
	import type { GameDataCache, GameType } from "../../modules/types.js";
	import GameSwitcher from "../../components/page-resources/GameSwitcher.svelte";
	import Gallery from "../../components/page-resources/Gallery.svelte";
	import GameDetails from "../../components/page-resources/GameDetails.svelte";
	import HeroSection from "../../components/page-resources/HeroSection.svelte";
	import LoadingButton from "../../components/page-resources/LoadingButton.svelte";
	import Settings from "../../components/page-resources/Settings.svelte";

	let currentGame = $state<GameType>("TDS");
	let loading = $state(false);
	let gameData = $state<GameDataCache | null>(null);
	let error = $state<string | null>(null);
	let hasLoadedOnce = $state(false);
	let cachedGameIconUrl = $state<string | null>(null);
	let originalGameIconUrl = $state<string | null>(null);
	let cachedThumbnails = $state<Array<{ url: string; alt: string }>>([]);

	const buttonText = $derived(
		hasLoadedOnce ? "Refresh Data" : "Load Game Details",
	);

	function handleGameSwitch(gameType: GameType) {
		if (currentGame === gameType) return;

		currentGame = gameType;
		RobloxApiService.setCurrentGame(gameType);

		const cachedData = getFromCache(gameType);
		if (cachedData && cachedData.gameType === gameType) {
			populateFromCache(cachedData);
			hasLoadedOnce = true;
		} else {
			gameData = null;
			cachedGameIconUrl = null;
			originalGameIconUrl = null;
			cachedThumbnails = [];
			error = null;
		}
	}

	async function loadGameData() {
		loading = true;
		error = null;

		try {
			let originalGameIconUrlFromAPI: string | null = null;

			try {
				const iconResult = await RobloxApiService.fetchGameIcon();
				if (
					iconResult.data?.[0]?.state === "Completed" &&
					iconResult.data[0].imageUrl
				) {
					originalGameIconUrlFromAPI = iconResult.data[0].imageUrl;
				}
			} catch (iconError) {
				console.error("Failed to fetch game icon:", iconError);
			}

			const gameResult = await RobloxApiService.fetchGameData();
			if (gameResult.data?.[0]) {
				const game = gameResult.data[0];
				const mediaResult = await RobloxApiService.fetchGameMedia();
				const galleryUrls: Array<{ url: string; alt: string }> = [];

				for (const media of mediaResult.data || []) {
					if (media.imageId && media.approved) {
						const imageUrl =
							await RobloxApiService.getImageUrlFromAssetDelivery(
								media.imageId,
							);
						if (imageUrl) {
							galleryUrls.push({
								url: imageUrl,
								alt:
									media.altText ||
									`Game Image ${media.imageId}`,
							});
						}
					}
				}

				if (originalGameIconUrlFromAPI) {
					cachedGameIconUrl = await getCachedImageUrl(
						originalGameIconUrlFromAPI,
					);
				}

				const cachedGalleryUrls: Array<{ url: string; alt: string }> =
					[];
				for (const thumbnail of galleryUrls) {
					const cachedUrl = await getCachedImageUrl(thumbnail.url);
					cachedGalleryUrls.push({
						url: cachedUrl,
						alt: thumbnail.alt,
					});
				}
				cachedThumbnails = cachedGalleryUrls;

				const cacheData: GameDataCache = {
					timestamp: Date.now(),
					gameType: currentGame,
					gameDetails: {
						id: game.id,
						rootPlaceId: game.rootPlaceId,
						name: game.name,
						developer: game.creator.name,
						developerId: game.creator.id,
						developerType: game.creator.type,
						description: game.description,
						price: game.price || null,
						universeAvatarType: game.universeAvatarType,
						subgenres: {
							genre_l1: game.genre_l1 || null,
							genre_l2: game.genre_l2 || null,
							isAllGenre: game.isAllGenre,
						},
						settings: {
							allowedGearGenres: game.allowedGearGenres,
							allowedGearCategories: game.allowedGearCategories,
							isGenreEnforced: game.isGenreEnforced,
							copyingAllowed: game.copyingAllowed,
							createVipServersAllowed:
								game.createVipServersAllowed,
							studioAccessToApisAllowed:
								game.studioAccessToApisAllowed,
						},
						creator: {
							hasVerifiedBadge: game.creator.hasVerifiedBadge,
							isRNVAccount: game.creator.isRNVAccount,
						},
					},
					gameStats: {
						activePlayers: game.playing,
						totalVisits: game.visits,
						maxPlayers: game.maxPlayers,
						favoritesCount: game.favoritedCount,
						genre: game.genre,
						created: game.created,
						updated: game.updated,
						isFavoritedByUser: game.isFavoritedByUser,
					},
					gameIconUrl: originalGameIconUrlFromAPI,
					galleryUrls,
				};

				gameData = cacheData;
				saveToCache(cacheData);
				hasLoadedOnce = true;
				originalGameIconUrl = originalGameIconUrlFromAPI;
			}
		} catch (err) {
			error =
				err instanceof Error ? err.message : "Unknown error occurred";
		} finally {
			loading = false;
		}
	}

	async function populateFromCache(cache: GameDataCache) {
		gameData = cache;
		error = null;
		originalGameIconUrl = cache.gameIconUrl;

		if (cache.gameIconUrl) {
			cachedGameIconUrl = await getCachedImageUrl(cache.gameIconUrl);
		}

		const cachedGalleryUrls: Array<{ url: string; alt: string }> = [];
		for (const thumbnail of cache.galleryUrls) {
			const cachedUrl = await getCachedImageUrl(thumbnail.url);
			cachedGalleryUrls.push({
				url: cachedUrl,
				alt: thumbnail.alt,
			});
		}
		cachedThumbnails = cachedGalleryUrls;
	}

	function handleClearCache() {
		gameData = null;
		cachedGameIconUrl = null;
		originalGameIconUrl = null;
		cachedThumbnails = [];
		hasLoadedOnce = false;
		error = null;
	}

	onMount(async () => {
		const cachedData = getFromCache(currentGame);
		if (cachedData && cachedData.gameType === currentGame) {
			hasLoadedOnce = true;
			await populateFromCache(cachedData);
		}
	});
</script>

<svelte:head>
	<title>Page Resources | Paradoxum Wikis Companio</title>
	<meta
		name="description"
		content="Browse cached game details, icons, and thumbnails for Tower Defense Simulator and ALTER EGO."
	/>
</svelte:head>

<div class="page-root">
	<div class="bg-mesh" aria-hidden="true">
		<div class="mesh-orb orb-1"></div>
		<div class="mesh-orb orb-2"></div>
		<div class="mesh-orb orb-3"></div>
		<div class="grid-lines"></div>
	</div>

	<main>
		<HeroSection {currentGame} />

		<section class="utility-shell">
			<div class="section-label">Controls</div>
			<div class="utility-grid">
				<GameSwitcher {currentGame} onGameSwitch={handleGameSwitch} />
				<LoadingButton {loading} {buttonText} onClick={loadGameData} />
			</div>
		</section>

		{#if error}
			<div class="status-shell">
				<Card.Root>
					<Card.Content>
						<div class="status-copy">
							<div class="status-icon error">
								<TriangleAlert />
							</div>
							<div>
								<h2>Unable to load page resources</h2>
								<p>{error}</p>
							</div>
						</div>
					</Card.Content>
				</Card.Root>
			</div>
		{/if}

		<section class="content-shell">
			<div class="section-label">Assets</div>
			<Gallery
				gameIconUrl={cachedGameIconUrl}
				{originalGameIconUrl}
				thumbnails={cachedThumbnails}
			/>
		</section>

		<section class="content-shell">
			<div class="section-label">Metadata</div>
			<GameDetails {gameData} />
		</section>

		<section class="meta-grid">
			{#if currentGame === "TDS"}
				<Card.Root class="h-full">
					<Card.Header>
						<div class="info-heading">
							<div class="status-icon warning">
								<Award />
							</div>
							<div>
								<Card.Title>Badges Information</Card.Title>
								<Card.Description>
									Badge player counts now live on the wiki
									itself.
								</Card.Description>
							</div>
						</div>
					</Card.Header>
					<Card.Content>
						<p class="info-copy">
							The badge list has been moved to the
							<a
								href="https://tds.fandom.com/wiki/Badges"
								target="_blank"
								rel="noopener noreferrer"
							>
								Badges article
							</a>.
						</p>
					</Card.Content>
				</Card.Root>
			{/if}

			<Card.Root class="h-full">
				<Card.Header>
					<div class="info-heading">
						<div class="status-icon neutral">
							<Settings2 />
						</div>
						<div>
							<Card.Title>Settings</Card.Title>
							<Card.Description>
								Clear locally cached data and downloaded image
								blobs.
							</Card.Description>
						</div>
					</div>
				</Card.Header>
				<Card.Content>
					<Settings onClearCache={handleClearCache} />
				</Card.Content>
			</Card.Root>
		</section>
	</main>
</div>

<style>
	main {
		position: relative;
		z-index: 1;
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 1.5rem 4rem;
	}

	.section-label {
		font-size: 0.68rem;
		font-weight: 700;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--primary);
		margin-bottom: 1rem;
		display: flex;
		align-items: center;
		gap: 0.75rem;

		&::before,
		&::after {
			content: "";
			flex: 1;
			height: 1px;
			background: var(--border);
		}
	}

	.section-label::before {
		max-width: 2rem;
	}

	.utility-shell,
	.content-shell {
		margin-top: 2rem;
	}

	.utility-grid {
		display: grid;
		grid-template-columns: 1.2fr 0.8fr;
		gap: 1rem;
		align-items: stretch;
	}

	.status-shell {
		margin-top: 1.5rem;
	}

	:global(.status-shell [data-slot="card"]) {
		background: color-mix(in oklab, var(--destructive) 9%, var(--card));
		border-color: color-mix(
			in oklab,
			var(--destructive) 35%,
			var(--border)
		);
	}

	:global(.status-shell [data-slot="card-content"]) {
		padding: 1.25rem 1.5rem;
	}

	.status-copy {
		display: flex;
		align-items: flex-start;
		gap: 1rem;
	}

	.status-copy h2 {
		margin: 0 0 0.3rem;
		font-size: 1rem;
		font-weight: 700;
		color: var(--foreground);
	}

	.status-copy p {
		margin: 0;
		color: var(--muted-foreground);
		line-height: 1.6;
	}

	.meta-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
		margin-top: 2rem;
	}

	.info-heading {
		display: flex;
		align-items: flex-start;
		gap: 0.9rem;
	}

	.info-copy {
		margin: 0;
		line-height: 1.65;
		color: var(--muted-foreground);
	}

	.info-copy a {
		color: var(--foreground);
		text-decoration: none;
		font-weight: 600;
	}

	.status-icon {
		width: 2.5rem;
		height: 2.5rem;
		border-radius: 0.85rem;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.status-icon.error {
		background: color-mix(in oklab, var(--destructive) 18%, transparent);
		color: var(--destructive);
	}

	.status-icon.warning {
		background: oklch(0.95 0.04 90);
		color: oklch(0.55 0.14 85);
	}

	.status-icon.neutral {
		background: var(--muted);
		color: var(--foreground);
	}

	@media (max-width: 900px) {
		.utility-grid,
		.meta-grid {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 640px) {
		main {
			padding-left: 1rem;
			padding-right: 1rem;
		}

		.status-copy {
			flex-direction: column;
			align-items: flex-start;
		}
	}
</style>
