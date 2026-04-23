<script lang="ts">
	import { ChevronDown, ExternalLink, Info } from "@lucide/svelte";
	import * as Card from "$lib/components/ui/card/index.js";
	import type { GameDataCache } from "../../modules/types.js";
	import {
		formatArray,
		formatBoolean,
		formatDate,
		formatNumber,
	} from "../../modules/formatter.js";

	type DetailRow = {
		label: string;
		value: string;
		raw?: string;
	};

	type DetailSection = {
		key: string;
		title: string;
		rows: DetailRow[];
	};

	let { gameData }: { gameData: GameDataCache | null } = $props();

	const gameTitle = $derived(
		gameData?.gameDetails.name || "No game data loaded yet",
	);
	const developer = $derived(
		gameData?.gameDetails.developer || "Unknown developer",
	);
	const description = $derived(
		gameData?.gameDetails.description ||
			"Load the selected game to inspect its current description, creator info, and raw resource metadata.",
	);

	const developerLink = $derived(
		!gameData
			? "#"
			: gameData.gameDetails.developerType.toLowerCase() === "user"
				? `https://www.roblox.com/users/${gameData.gameDetails.developerId}/profile`
				: `https://www.roblox.com/communities/${gameData.gameDetails.developerId}`,
	);

	const formattedStats = $derived(
		gameData
			? {
					activePlayers: formatNumber(
						gameData.gameStats.activePlayers,
					),
					totalVisits: formatNumber(gameData.gameStats.totalVisits),
					favoritesCount: formatNumber(
						gameData.gameStats.favoritesCount,
					),
					created: formatDate(gameData.gameStats.created),
					updated: formatDate(gameData.gameStats.updated),
					price:
						gameData.gameDetails.price === null
							? "Free"
							: `R$ ${gameData.gameDetails.price}`,
					vipServers: formatBoolean(
						gameData.gameDetails.settings.createVipServersAllowed,
					),
					copyingAllowed: formatBoolean(
						gameData.gameDetails.settings.copyingAllowed,
					),
					allowedGear: formatArray(
						gameData.gameDetails.settings.allowedGearGenres,
					),
					genreEnforced: formatBoolean(
						gameData.gameDetails.settings.isGenreEnforced,
					),
					verifiedBadge: formatBoolean(
						gameData.gameDetails.creator.hasVerifiedBadge,
					),
					rnvAccount: formatBoolean(
						gameData.gameDetails.creator.isRNVAccount,
					),
					apiAccess: formatBoolean(
						gameData.gameDetails.settings.studioAccessToApisAllowed,
					),
				}
			: null,
	);

	const formattedSubgenres = $derived.by(() => {
		if (!gameData) return "None";

		const subgenres = [];
		const genre_l1 = gameData.gameDetails.subgenres.genre_l1;
		const genre_l2 = gameData.gameDetails.subgenres.genre_l2;

		if (genre_l1 && genre_l1 !== "All") subgenres.push(genre_l1);
		if (genre_l2 && genre_l2 !== "All") subgenres.push(genre_l2);

		return subgenres.length > 0 ? subgenres.join(", ") : "None";
	});

	const detailSections = $derived.by((): DetailSection[] => {
		if (!gameData || !formattedStats) return [];

		return [
			{
				key: "stats",
				title: "Game Statistics",
				rows: [
					{
						label: "Active Players",
						value: formattedStats.activePlayers,
						raw: String(gameData.gameStats.activePlayers),
					},
					{
						label: "Total Visits",
						value: formattedStats.totalVisits,
						raw: String(gameData.gameStats.totalVisits),
					},
					{
						label: "Max Players",
						value: String(gameData.gameStats.maxPlayers),
					},
					{
						label: "Favorites",
						value: formattedStats.favoritesCount,
						raw: String(gameData.gameStats.favoritesCount),
					},
					{
						label: "Genre",
						value: gameData.gameStats.genre,
					},
					{
						label: "Created",
						value: formattedStats.created,
						raw: gameData.gameStats.created,
					},
					{
						label: "Last Updated",
						value: formattedStats.updated,
						raw: gameData.gameStats.updated,
					},
				],
			},
			{
				key: "attributes",
				title: "Game Attributes",
				rows: [
					{
						label: "Price",
						value: formattedStats.price,
						raw:
							gameData.gameDetails.price === null
								? "null"
								: String(gameData.gameDetails.price),
					},
					{
						label: "Avatar Type",
						value: gameData.gameDetails.universeAvatarType,
					},
					{
						label: "Subgenres",
						value: formattedSubgenres,
						raw: `l1: ${gameData.gameDetails.subgenres.genre_l1 || "None"}, l2: ${gameData.gameDetails.subgenres.genre_l2 || "None"}`,
					},
					{
						label: "Allowed Gear",
						value: formattedStats.allowedGear,
						raw: JSON.stringify(
							gameData.gameDetails.settings.allowedGearGenres,
						),
					},
					{
						label: "VIP Servers",
						value: formattedStats.vipServers,
						raw: String(
							gameData.gameDetails.settings
								.createVipServersAllowed,
						),
					},
					{
						label: "Copying Allowed",
						value: formattedStats.copyingAllowed,
						raw: String(
							gameData.gameDetails.settings.copyingAllowed,
						),
					},
					{
						label: "Genre Enforced",
						value: formattedStats.genreEnforced,
						raw: String(
							gameData.gameDetails.settings.isGenreEnforced,
						),
					},
				],
			},
			{
				key: "creator",
				title: "Creator Details",
				rows: [
					{
						label: "Creator Type",
						value: gameData.gameDetails.developerType,
					},
					{
						label: "Verified Badge",
						value: formattedStats.verifiedBadge,
						raw: String(
							gameData.gameDetails.creator.hasVerifiedBadge,
						),
					},
					{
						label: "RNV Account",
						value: formattedStats.rnvAccount,
						raw: String(gameData.gameDetails.creator.isRNVAccount),
					},
				],
			},
			{
				key: "technical",
				title: "Technical Details",
				rows: [
					{
						label: "Universe ID",
						value: String(gameData.gameDetails.id),
					},
					{
						label: "Place ID",
						value: String(gameData.gameDetails.rootPlaceId),
					},
					{
						label: "API Access",
						value: formattedStats.apiAccess,
						raw: String(
							gameData.gameDetails.settings
								.studioAccessToApisAllowed,
						),
					},
				],
			},
		];
	});

	function shouldShowRaw(row: DetailRow) {
		return Boolean(row.raw && row.raw !== row.value);
	}
</script>

<Card.Root class="overflow-visible">
	<Card.Header>
		<div>
			<Card.Title>{gameTitle}</Card.Title>
			<Card.Description>
				By
				{#if gameData}
					<a
						href={developerLink}
						target="_blank"
						rel="noopener noreferrer"
						class="developer-link"
					>
						{developer}
						<ExternalLink class="size-3.5 shrink-0" />
					</a>
				{:else}
					{developer}
				{/if}
			</Card.Description>
		</div>
	</Card.Header>

	<Card.Content class="grid gap-5">
		<div class="description-block">
			<h2>About</h2>
			<p>{description}</p>
		</div>

		{#if gameData && formattedStats}
			<div class="note-banner" role="note">
				<Info class="mt-1 size-3.5 shrink-0" />
				<span>
					Some details may be wrong since it doesn't take into account
					of Universes or Places inside the game.
				</span>
			</div>

			<div class="details-stack">
				{#each detailSections as section, index}
					<details class="detail-group" open={index === 0}>
						<summary>
							<span>{section.title}</span>
							<span class="summary-chevron">
								<ChevronDown class="size-3.5 shrink-0" />
							</span>
						</summary>
						<dl>
							{#each section.rows as row}
								<div class="detail-row">
									<dt>{row.label}</dt>
									<dd>
										<span class="main-value"
											>{row.value}</span
										>
										{#if shouldShowRaw(row)}
											<span class="raw-value"
												>({row.raw})</span
											>
										{/if}
									</dd>
								</div>
							{/each}
						</dl>
					</details>
				{/each}
			</div>
		{:else}
			<div class="empty-state">
				Load game data to reveal the universe stats, attributes, creator
				details, and technical values here.
			</div>
		{/if}
	</Card.Content>
</Card.Root>

<style>
	.developer-link {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		color: var(--foreground);
		text-decoration: none;
		font-weight: 600;
	}

	.description-block {
		display: grid;
		gap: 0.5rem;

		h2 {
			margin: 0;
			font-size: 0.95rem;
			font-weight: 700;
			color: var(--foreground);
		}

		p {
			margin: 0;
			white-space: pre-line;
			line-height: 1.7;
			color: var(--muted-foreground);
		}
	}

	.note-banner {
		display: flex;
		align-items: flex-start;
		gap: 0.5rem;
		padding: 0.75rem 1rem;
		border-radius: 1rem;
		background: var(--muted);
		color: var(--muted-foreground);
		font-size: 0.86rem;
		line-height: 1.55;
	}

	.details-stack {
		display: grid;
		gap: 0.85rem;
	}

	.detail-group {
		border: 1px solid var(--border);
		border-radius: 1rem;
		background: color-mix(in oklab, var(--card) 92%, transparent);
		overflow: hidden;
	}

	summary {
		list-style: none;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 1rem 1.1rem;
		cursor: pointer;
		font-weight: 700;
		color: var(--foreground);

		&::-webkit-details-marker {
			display: none;
		}
	}

	.summary-chevron :global(svg) {
		transition: transform 0.2s ease;
	}

	details[open] .summary-chevron :global(svg) {
		transform: rotate(180deg);
	}

	dl {
		margin: 0;
		padding: 0 1.1rem 1rem;
		display: grid;
		gap: 0.75rem;
	}

	.detail-row {
		display: grid;
		grid-template-columns: minmax(10rem, 0.75fr) minmax(0, 1fr);
		gap: 0.9rem;
		padding-top: 0.75rem;
		border-top: 1px solid
			color-mix(in oklab, var(--border) 85%, transparent);

		&:first-child {
			padding-top: 0;
			border-top: none;
		}
	}

	dt {
		color: var(--muted-foreground);
		font-weight: 600;
	}

	dd {
		margin: 0;
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
		color: var(--foreground);
	}

	.main-value {
		font-weight: 600;
	}

	.raw-value {
		color: var(--muted-foreground);
		font-size: 0.85rem;
	}

	.empty-state {
		padding: 1rem 1.1rem;
		border-radius: 1rem;
		border: 1px dashed var(--border);
		color: var(--muted-foreground);
		line-height: 1.6;
	}

	@media (max-width: 640px) {
		.detail-row {
			grid-template-columns: 1fr;
			gap: 0.35rem;
		}
	}
</style>
