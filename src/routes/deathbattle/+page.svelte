<script lang="ts">
	import { onMount } from "svelte";
	import {
		Award,
		Calendar,
		CircleStar,
		Heart,
		Inbox,
		LoaderCircle,
		RotateCw,
		Swords,
		TriangleAlert,
		Trophy,
		Users,
		Zap,
	} from "@lucide/svelte";
	import * as Card from "$lib/components/ui/card/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import StatCard from "$lib/components/StatCard.svelte";
	import { DeathBattleService } from "$lib/deathbattle/service.js";
	import type { BattleStats, BattleRecord } from "../../types.js";

	type Tab = "normal" | "ranked" | "records";
	type Venue = "all" | "alter-ego" | "735394249863987241";

	let activeTab = $state<Tab>("normal");
	let stats = $state<BattleStats[]>([]);
	let records = $state<BattleRecord[]>([]);
	let loadingStats = $state(true);
	let loadingRecords = $state(true);
	let errorStats = $state<string | null>(null);
	let errorRecords = $state<string | null>(null);

	let selectedVenue = $state<Venue>("all");
	let currentPage = $state(1);
	let itemsPerPage = $state(25);

	const normalPlayers = $derived(
		stats
			.filter((p) => p.totalBattles > 0)
			.sort((a, b) => {
				const aMin = a.totalBattles >= 3;
				const bMin = b.totalBattles >= 3;
				if (aMin && !bMin) return -1;
				if (!aMin && bMin) return 1;
				if (b.weightedScore !== a.weightedScore)
					return b.weightedScore - a.weightedScore;
				return b.totalBattles - a.totalBattles;
			}),
	);

	const rankedPlayers = $derived(
		stats
			.filter((p) => p.rankedTotalBattles > 0)
			.sort((a, b) => {
				const aMin = a.rankedTotalBattles >= 5;
				const bMin = b.rankedTotalBattles >= 5;
				if (aMin && !bMin) return -1;
				if (!aMin && bMin) return 1;
				if (b.rankedWeightedScore !== a.rankedWeightedScore)
					return b.rankedWeightedScore - a.rankedWeightedScore;
				return b.rankedTotalBattles - a.rankedTotalBattles;
			}),
	);

	const normalStats = $derived({
		totalPlayers: normalPlayers.length,
		totalBattles: normalPlayers.reduce((s, p) => s + p.totalBattles, 0),
		lastBattle: getLastBattle(
			normalPlayers
				.map((p) => p.lastCasualBattleAt)
				.filter((d): d is string => !!d),
		),
	});

	const rankedStats = $derived({
		totalPlayers: rankedPlayers.length,
		totalBattles: rankedPlayers.reduce(
			(s, p) => s + p.rankedTotalBattles,
			0,
		),
		lastBattle: getLastBattle(
			rankedPlayers
				.map((p) => p.lastRankedBattleAt)
				.filter((d): d is string => !!d),
		),
	});

	const filteredRecords = $derived(
		selectedVenue === "all"
			? records
			: records.filter((r) => {
					if (selectedVenue === "alter-ego")
						return (
							r.guildId === "1362084781134708907" || !r.guildId
						);
					return r.guildId === selectedVenue;
				}),
	);

	const totalPages = $derived(
		Math.ceil(filteredRecords.length / itemsPerPage),
	);

	const paginatedRecords = $derived(
		filteredRecords.slice(
			(currentPage - 1) * itemsPerPage,
			currentPage * itemsPerPage,
		),
	);

	function getLastBattle(dates: string[]): string {
		if (dates.length === 0) return "-";
		const latest = dates.reduce((l, c) =>
			new Date(c) > new Date(l) ? c : l,
		);
		return DeathBattleService.formatRelativeTime(latest);
	}

	function getVenueName(guildId?: string): string {
		if (guildId === "735394249863987241")
			return "Tower Defense Simulator Wiki";
		if (guildId === "1362084781134708907" || !guildId)
			return "ALTER EGO Wiki";
		return "Unknown Venue";
	}

	async function loadData() {
		loadingStats = true;
		loadingRecords = true;
		errorStats = null;
		errorRecords = null;

		try {
			stats = await DeathBattleService.fetchBattleStats();
		} catch (err) {
			errorStats =
				err instanceof Error
					? err.message
					: "Failed to load battle statistics.";
		} finally {
			loadingStats = false;
		}

		try {
			records = await DeathBattleService.fetchBattleRecords();
		} catch (err) {
			errorRecords =
				err instanceof Error
					? err.message
					: "Failed to load battle records.";
		} finally {
			loadingRecords = false;
		}
	}

	function handleVenueChange(venue: Venue) {
		selectedVenue = venue;
		currentPage = 1;
	}

	onMount(() => {
		loadData();
	});
</script>

<svelte:head>
	<title>Deathbattle Statistics | Paradoxum Wikis Companio</title>
	<meta
		name="description"
		content="View combat statistics and leaderboards from our Discord ALTERSHAPER bot."
	/>
</svelte:head>

<div class="page-root">
	<div class="bg-mesh" aria-hidden="true">
		<div class="mesh-orb orb-1"></div>
		<div class="mesh-orb orb-2"></div>
		<div class="mesh-orb orb-3"></div>
		<div class="grid-lines"></div>
	</div>

	<main class="page-enter">
		<header class="page-header">
			<div>
				<h1>
					<Zap class="title-icon" />
					Deathbattle Statistics
				</h1>
				<p>
					The folks here sure love beating the crap out of each other
					huh...
				</p>
			</div>
		</header>

		<nav class="tab-nav">
			<button
				class:active={activeTab === "normal"}
				onclick={() => (activeTab = "normal")}
				role="tab"
				aria-selected={activeTab === "normal"}
			>
				<Zap class="tab-icon" />
				Normal Battles
			</button>
			<button
				class:active={activeTab === "ranked"}
				onclick={() => (activeTab = "ranked")}
				role="tab"
				aria-selected={activeTab === "ranked"}
			>
				<Trophy class="tab-icon" />
				Ranked Battles
			</button>
			<button
				class:active={activeTab === "records"}
				onclick={() => (activeTab = "records")}
				role="tab"
				aria-selected={activeTab === "records"}
			>
				<RotateCw class="tab-icon" />
				Battle Records
			</button>
		</nav>

		{#if activeTab === "normal"}
			<section class="tab-panel">
				<div class="stat-grid">
					<StatCard
						label="Total Players"
						value={loadingStats ? "-" : normalStats.totalPlayers}
					>
						<Users />
					</StatCard>
					<StatCard
						label="Total Battles"
						value={loadingStats ? "-" : normalStats.totalBattles}
					>
						<Swords />
					</StatCard>
					<StatCard
						label="Last Battle"
						value={loadingStats ? "-" : normalStats.lastBattle}
					>
						<Calendar />
					</StatCard>
				</div>

				<Card.Root>
					<Card.Header>
						<Card.Title>Normal Leaderboard</Card.Title>
					</Card.Header>
					<Card.Content class="p-0">
						{#if loadingStats}
							<div class="state-container">
								<LoaderCircle
									class="size-8 animate-spin text-primary"
								/>
								<p>Loading battle statistics...</p>
							</div>
						{:else if errorStats}
							<div class="state-container error-state">
								<TriangleAlert class="size-5" />
								<span>{errorStats}</span>
							</div>
						{:else if normalPlayers.length === 0}
							<div class="state-container">
								<Inbox
									class="size-12 text-muted-foreground opacity-50"
								/>
								<p>No casual battle data available.</p>
							</div>
						{:else}
							<div class="leaderboard-list">
								{#each normalPlayers as player, i}
									<div class="leaderboard-item">
										<div
											class="rank-badge"
											class:top3={i < 3}
										>
											{#if i === 0}
												<Trophy
													class="text-yellow-400"
												/>
											{:else if i === 1}
												<Award class="text-gray-400" />
											{:else if i === 2}
												<CircleStar
													class="text-amber-600"
												/>
											{:else}
												{i + 1}
											{/if}
										</div>
										<div class="player-info">
											<div class="player-name">
												{player.userTag}
											</div>
											<div class="player-meta">
												ID: {player.userId}
												{#if player.lastCasualBattleAt}
													· Last: {DeathBattleService.formatRelativeTime(
														player.lastCasualBattleAt,
													)}
												{/if}
											</div>
										</div>
										<div class="battle-stats">
											<div class="record-row">
												<span class="win"
													>{player.wins}W</span
												>
												<span class="loss"
													>{player.losses}L</span
												>
											</div>
											<div
												class="score"
												class:high={player.weightedScore >=
													60}
												class:mid={player.weightedScore >=
													40 &&
													player.weightedScore < 60}
												class:low={player.weightedScore <
													40}
											>
												{player.weightedScore} WS
											</div>
											<div class="aux">
												{player.totalBattles} battles · {player.winRate}%
											</div>
										</div>
									</div>
								{/each}
							</div>
						{/if}
					</Card.Content>
				</Card.Root>
			</section>
		{:else if activeTab === "ranked"}
			<section class="tab-panel">
				<div class="stat-grid">
					<StatCard
						label="Total Players"
						value={loadingStats ? "-" : rankedStats.totalPlayers}
					>
						<Users />
					</StatCard>
					<StatCard
						label="Total Battles"
						value={loadingStats ? "-" : rankedStats.totalBattles}
					>
						<Trophy />
					</StatCard>
					<StatCard
						label="Last Battle"
						value={loadingStats ? "-" : rankedStats.lastBattle}
					>
						<Calendar />
					</StatCard>
				</div>

				<Card.Root>
					<Card.Header>
						<Card.Title>Ranked Leaderboard</Card.Title>
					</Card.Header>
					<Card.Content class="p-0">
						{#if loadingStats}
							<div class="state-container">
								<LoaderCircle
									class="size-8 animate-spin text-primary"
								/>
								<p>Loading ranked statistics...</p>
							</div>
						{:else if errorStats}
							<div class="state-container error-state">
								<TriangleAlert class="size-5" />
								<span>{errorStats}</span>
							</div>
						{:else if rankedPlayers.length === 0}
							<div class="state-container">
								<Inbox
									class="size-12 text-muted-foreground opacity-50"
								/>
								<p>No ranked battle data available.</p>
							</div>
						{:else}
							<div class="leaderboard-list">
								{#each rankedPlayers as player, i}
									<div class="leaderboard-item">
										<div
											class="rank-badge"
											class:top3={i < 3}
										>
											{#if i === 0}
												<Trophy
													class="text-yellow-400"
												/>
											{:else if i === 1}
												<Award class="text-gray-400" />
											{:else if i === 2}
												<CircleStar
													class="text-amber-600"
												/>
											{:else}
												{i + 1}
											{/if}
										</div>
										<div class="player-info">
											<div class="player-name">
												{player.userTag}
											</div>
											<div class="player-meta">
												ID: {player.userId}
												{#if player.lastRankedBattleAt}
													· Last: {DeathBattleService.formatRelativeTime(
														player.lastRankedBattleAt,
													)}
												{/if}
											</div>
										</div>
										<div class="battle-stats">
											<div class="record-row">
												<span class="win"
													>{player.rankedWins}W</span
												>
												<span class="loss"
													>{player.rankedLosses}L</span
												>
											</div>
											<div
												class="score"
												class:high={player.rankedWeightedScore >=
													60}
												class:mid={player.rankedWeightedScore >=
													40 &&
													player.rankedWeightedScore <
														60}
												class:low={player.rankedWeightedScore <
													40}
											>
												{player.rankedWeightedScore} WS
											</div>
											<div class="aux">
												{player.rankedTotalBattles} battles
												·
												{player.rankedWinRate}%
											</div>
										</div>
									</div>
								{/each}
							</div>
						{/if}
					</Card.Content>
				</Card.Root>
			</section>
		{:else}
			<section class="tab-panel">
				<Card.Root>
					<Card.Header>
						<Card.Title>Recent Battle Records</Card.Title>
						<div class="venue-pills">
							<button
								class="venue-pill"
								class:active={selectedVenue === "all"}
								onclick={() => handleVenueChange("all")}
							>
								All Venues
							</button>
							<button
								class="venue-pill"
								class:active={selectedVenue === "alter-ego"}
								onclick={() => handleVenueChange("alter-ego")}
							>
								ALTER EGO Wiki
							</button>
							<button
								class="venue-pill"
								class:active={selectedVenue ===
									"735394249863987241"}
								onclick={() =>
									handleVenueChange("735394249863987241")}
							>
								Tower Defense Simulator Wiki
							</button>
						</div>
					</Card.Header>
					<Card.Content class="p-0">
						{#if loadingRecords}
							<div class="state-container">
								<LoaderCircle
									class="size-8 animate-spin text-primary"
								/>
								<p>Loading battle records...</p>
							</div>
						{:else if errorRecords}
							<div class="state-container error-state">
								<TriangleAlert class="size-5" />
								<span>{errorRecords}</span>
							</div>
						{:else if filteredRecords.length === 0}
							<div class="state-container">
								<Inbox
									class="size-12 text-muted-foreground opacity-50"
								/>
								<p>No records for the selected venue.</p>
							</div>
						{:else}
							<div class="records-list">
								{#each paginatedRecords as record}
									{@const hpPercent =
										(record.winnerHpRemaining /
											record.winnerMaxHp) *
										100}
									<div class="record-item">
										<div class="record-header">
											<div>
												<span class="winner"
													>{record.winnerTag}</span
												>
												<span class="vs">defeated</span>
												<span class="loser"
													>{record.loserTag}</span
												>
											</div>
											<span
												class="type-badge"
												class:ranked={record.isRanked}
											>
												{record.isRanked
													? "Ranked"
													: "Normal"}
											</span>
										</div>
										<div class="record-meta">
											<span class="meta-item">
												{DeathBattleService.formatDate(
													record.battleDate,
												)}
											</span>
											<span class="meta-item"
												>{getVenueName(
													record.guildId,
												)}</span
											>
											<span class="meta-item">
												<Heart class="size-3 inline" />
												{record.winnerHpRemaining}/{record.winnerMaxHp}
												HP ({hpPercent.toFixed(0)}%)
											</span>
											<span class="meta-item"
												>{record.turns} turns</span
											>
											<span class="meta-item meta-subtle">
												{DeathBattleService.formatRelativeTime(
													record.battleDate,
												)}
											</span>
										</div>
									</div>
								{/each}
							</div>

							{#if totalPages > 1}
								<div class="pagination">
									<div class="pagination-info">
										<label for="per-page">Per page:</label>
										<select
											id="per-page"
											bind:value={itemsPerPage}
											onchange={() => (currentPage = 1)}
										>
											<option value={10}>10</option>
											<option value={25}>25</option>
											<option value={50}>50</option>
											<option value={100}>100</option>
										</select>
									</div>

									<span class="pagination-status">
										{(currentPage - 1) * itemsPerPage +
											1}–{Math.min(
											currentPage * itemsPerPage,
											filteredRecords.length,
										)} of {filteredRecords.length}
									</span>

									<div class="pagination-controls">
										<Button
											variant="outline"
											size="icon-sm"
											disabled={currentPage === 1}
											onclick={() => (currentPage = 1)}
											aria-label="First page"
										>
											«
										</Button>
										<Button
											variant="outline"
											size="icon-sm"
											disabled={currentPage === 1}
											onclick={() => currentPage--}
											aria-label="Previous"
										>
											‹
										</Button>
										<span class="page-indicator">
											{currentPage} / {totalPages}
										</span>
										<Button
											variant="outline"
											size="icon-sm"
											disabled={currentPage ===
												totalPages}
											onclick={() => currentPage++}
											aria-label="Next"
										>
											›
										</Button>
										<Button
											variant="outline"
											size="icon-sm"
											disabled={currentPage ===
												totalPages}
											onclick={() =>
												(currentPage = totalPages)}
											aria-label="Last page"
										>
											»
										</Button>
									</div>
								</div>
							{/if}
						{/if}
					</Card.Content>
				</Card.Root>
			</section>
		{/if}
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

	.page-header {
		padding: 2rem 0 1.5rem;
	}

	.page-header h1 {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin: 0 0 0.5rem;
		font-family: var(--font-heading);
		font-size: 1.75rem;
		font-weight: 700;
		color: var(--foreground);
	}

	.page-header h1 :global(svg) {
		color: var(--primary);
	}

	.page-header p {
		margin: 0;
		color: var(--muted-foreground);
	}

	.tab-nav {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 1.5rem;
		flex-wrap: wrap;
	}

	.tab-nav button {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.65rem 1rem;
		border: 1px solid var(--border);
		border-radius: 0.75rem;
		background: var(--card);
		color: var(--muted-foreground);
		font-size: 0.9rem;
		font-weight: 600;
		transition:
			border-color 0.2s,
			background 0.2s,
			color 0.2s;
	}

	.tab-nav button :global(svg) {
		width: 0.95rem;
		height: 0.95rem;
	}

	.tab-nav button:hover {
		background: var(--muted);
		color: var(--foreground);
	}

	.tab-nav button.active {
		background: var(--primary);
		border-color: var(--primary);
		color: var(--primary-foreground);
	}

	.tab-panel {
		display: grid;
		gap: 1rem;
	}

	.stat-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1rem;
	}

	.state-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 3rem 1rem;
		gap: 1rem;
		color: var(--muted-foreground);
	}

	.error-state {
		flex-direction: row;
		background: color-mix(in oklab, var(--destructive) 10%, transparent);
		border-radius: 0.85rem;
		margin: 1rem;
		padding: 1.5rem;
		color: var(--destructive);
	}

	.leaderboard-list,
	.records-list {
		display: grid;
	}

	.leaderboard-item {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1rem 1.5rem;
		border-bottom: 1px solid var(--border);
	}

	.leaderboard-item:last-child {
		border-bottom: none;
	}

	.rank-badge {
		width: 2.5rem;
		height: 2.5rem;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		font-weight: 800;
		font-size: 1.1rem;
		flex-shrink: 0;
		color: var(--muted-foreground);
	}

	.rank-badge.top3 {
		font-size: 1.3rem;
	}

	.player-info {
		flex: 1;
		min-width: 0;
	}

	.player-name {
		font-weight: 700;
		font-size: 0.95rem;
		color: var(--foreground);
	}

	.player-meta {
		font-size: 0.8rem;
		color: var(--muted-foreground);
		margin-top: 0.2rem;
	}

	.battle-stats {
		text-align: right;
		flex-shrink: 0;
	}

	.record-row {
		display: flex;
		gap: 0.75rem;
		justify-content: flex-end;
		margin-bottom: 0.3rem;
		font-weight: 600;
	}

	.win {
		color: oklch(0.62 0.18 145);
	}

	.loss {
		color: oklch(0.58 0.18 20);
	}

	.score {
		font-weight: 800;
		font-size: 1.1rem;
		font-family: var(--font-heading);
	}

	.score.high {
		color: oklch(0.62 0.18 145);
	}

	.score.mid {
		color: oklch(0.65 0.14 85);
	}

	.score.low {
		color: oklch(0.58 0.18 20);
	}

	.aux {
		font-size: 0.75rem;
		color: var(--muted-foreground);
		margin-top: 0.2rem;
	}

	.venue-pills {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.venue-pill {
		padding: 0.4rem 0.75rem;
		border: 1px solid var(--border);
		border-radius: 999px;
		background: var(--background);
		color: var(--muted-foreground);
		font-size: 0.8rem;
		font-weight: 600;
		transition:
			border-color 0.2s,
			background 0.2s,
			color 0.2s;
	}

	.venue-pill:hover {
		background: var(--muted);
		color: var(--foreground);
	}

	.venue-pill.active {
		background: var(--primary);
		border-color: var(--primary);
		color: var(--primary-foreground);
	}

	.record-item {
		padding: 1rem 1.5rem;
		border-bottom: 1px solid var(--border);
	}

	.record-item:last-child {
		border-bottom: none;
	}

	.record-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		margin-bottom: 0.5rem;
	}

	.winner {
		font-weight: 700;
		color: oklch(0.62 0.18 145);
	}

	.vs {
		color: var(--muted-foreground);
		font-size: 0.85rem;
		margin: 0 0.35rem;
	}

	.loser {
		color: oklch(0.58 0.18 20);
	}

	.type-badge {
		padding: 0.3rem 0.65rem;
		border-radius: 999px;
		background: var(--muted);
		color: var(--foreground);
		font-size: 0.75rem;
		font-weight: 700;
		white-space: nowrap;
	}

	.type-badge.ranked {
		background: oklch(0.95 0.04 90);
		color: oklch(0.55 0.14 85);
	}

	.record-meta {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		font-size: 0.8rem;
		color: var(--muted-foreground);
	}

	.meta-item {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
	}

	.meta-subtle {
		color: color-mix(in oklab, var(--muted-foreground) 70%, transparent);
	}

	.pagination {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 1rem 1.5rem;
		border-top: 1px solid var(--border);
	}

	.pagination-info {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.85rem;
		color: var(--muted-foreground);
	}

	.pagination-info select {
		padding: 0.3rem 0.6rem;
		border: 1px solid var(--border);
		border-radius: 0.5rem;
		background: var(--background);
		color: var(--foreground);
		font-size: 0.85rem;
	}

	.pagination-status {
		font-size: 0.85rem;
		color: var(--muted-foreground);
	}

	.pagination-controls {
		display: flex;
		align-items: center;
		gap: 0.35rem;
	}

	.page-indicator {
		padding: 0 0.75rem;
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--foreground);
	}

	@media (max-width: 900px) {
		.stat-grid {
			grid-template-columns: 1fr;
		}

		.pagination {
			flex-direction: column;
			align-items: stretch;
		}

		.pagination-controls {
			justify-content: center;
		}
	}

	@media (max-width: 640px) {
		main {
			padding-left: 1rem;
			padding-right: 1rem;
		}

		.leaderboard-item {
			flex-wrap: wrap;
		}

		.battle-stats {
			width: 100%;
			text-align: left;
			display: flex;
			justify-content: space-between;
			align-items: center;
		}
	}
</style>
