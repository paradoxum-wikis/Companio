<script lang="ts">
	import { onMount, onDestroy } from "svelte";
	import { RecapService } from "../../components/recapService.js";
	import type { RecapData } from "../../types.js";
	import "./recap.css";

	import {
		CircleStar,
		Trophy,
		Award,
		Inbox,
		UserIcon,
		Calendar,
		Users,
		ChartColumn,
		Activity,
		ChevronLeft,
		ChevronRight,
		TriangleAlert,
		ListOrdered,
	} from "@lucide/svelte";

	let currentDate = $state("");
	let prevDisabled = $state(false);
	let nextDisabled = $state(true);

	let recapData = $state<RecapData | null>(null);
	let loading = $state(true);
	let errorMessage = $state<string | null>(null);

	let totalContributions = $derived(
		recapData?.contributors.reduce(
			(sum, c) => sum + Number(c.contributions),
			0,
		) || 0,
	);

	let averagePerUser = $derived(
		recapData?.contributors.length
			? Math.round(totalContributions / recapData.contributors.length)
			: 0,
	);

	const palette = [
		"#FF1744",
		"#00E676",
		"#2979FF",
		"#FFD600",
		"#F50057",
		"#00B8D4",
		"#FF9100",
		"#C51162",
		"#76FF03",
		"#D500F9",
		"#FF3D00",
		"#64DD17",
		"#304FFE",
		"#FFEA00",
		"#00BFAE",
		"#AA00FF",
	];

	function getPaletteColor(index: number) {
		return palette[index % palette.length];
	}

	function countUp(node: HTMLElement, target: string | number) {
		const targetNum = Number(target);
		if (isNaN(targetNum) || targetNum === 0) return;

		let current = 0;
		const increment = Math.max(1, Math.ceil(targetNum / 30));
		const timer = setInterval(() => {
			current += increment;
			if (current >= targetNum) {
				node.textContent = targetNum.toString();
				clearInterval(timer);
			} else {
				node.textContent = current.toString();
			}
		}, 20);

		return {
			destroy() {
				clearInterval(timer);
			},
		};
	}

	async function init() {
		currentDate = await RecapService.getCurrentWeekDate();
		loadRecapData();
	}

	function navigateWeek(days: number): void {
		if (days < 0) {
			currentDate = RecapService.subtractDays(
				currentDate,
				Math.abs(days),
			);
		} else {
			currentDate = RecapService.addDays(currentDate, days);
		}

		RecapService.updateUrlWithDate(currentDate);
		loadRecapData();
	}

	async function loadRecapData(): Promise<void> {
		loading = true;
		errorMessage = null;
		updateNavigationButtons();

		try {
			recapData = await RecapService.fetchRecapData(currentDate);
		} catch (error) {
			console.error("Failed to load recap data:", error);
			if (error instanceof Error) {
				errorMessage = error.message.includes("404")
					? "No recap data available for this date."
					: error.message;
			} else {
				errorMessage = "Failed to load recap data.";
			}
			recapData = null;
		} finally {
			loading = false;
		}
	}

	function updateNavigationButtons(): void {
		const today = RecapService.formatDate(new Date());
		const currentDateObj = new Date(currentDate + "T00:00:00");
		const todayObj = new Date(today + "T00:00:00");

		nextDisabled = currentDateObj >= todayObj;
		prevDisabled = false;
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === "ArrowLeft" && !prevDisabled) {
			navigateWeek(-7);
		} else if (e.key === "ArrowRight" && !nextDisabled) {
			navigateWeek(7);
		}
	}

	async function handlePopstate() {
		currentDate = await RecapService.getCurrentWeekDate();
		loadRecapData();
	}

	onMount(() => {
		init();
		window.addEventListener("popstate", handlePopstate);
		document.addEventListener("keydown", handleKeydown);

		return () => {
			window.removeEventListener("popstate", handlePopstate);
			document.removeEventListener("keydown", handleKeydown);
		};
	});
</script>

<svelte:head>
	<title>Weekly Recap | Paradoxum Wikis Companio</title>
	<meta
		name="description"
		content="Weekly contributor leaderboard for the ALTER EGO Wiki. Track top contributors and their weekly contributions."
	/>
	<meta
		name="keywords"
		content="ALTER EGO, Wiki, Weekly Recap, Leaderboard, Contributors, ALTERPEDIA, Statistics"
	/>
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://ae.tds-editor.com/recap/" />
	<meta
		property="og:title"
		content="Weekly Recap | Paradoxum Wikis Companio"
	/>
	<meta
		property="og:description"
		content="Weekly contributor leaderboard for the ALTER EGO Wiki. Track top contributors and their weekly contributions."
	/>
	<meta property="og:image" content="https://ae.tds-editor.com/banner.png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta
		property="og:image:alt"
		content="ALTER EGO Wiki Weekly Recap - Track top contributors"
	/>
	<meta property="og:site_name" content="Paradoxum Wikis Companio" />
	<meta property="og:locale" content="en_US" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content="@isALTEREGOout" />
	<meta name="twitter:creator" content="@isALTEREGOout" />
	<meta
		name="twitter:title"
		content="Weekly Recap | Paradoxum Wikis Companio"
	/>
	<meta
		name="twitter:description"
		content="Weekly contributor leaderboard for the ALTER EGO Wiki. Track top contributors and their weekly contributions."
	/>
	<meta name="twitter:image" content="https://ae.tds-editor.com/banner.png" />
	<meta
		name="twitter:image:alt"
		content="ALTER EGO Wiki Weekly Recap - Track top contributors"
	/>
	<meta name="theme-color" content="#900c3f" />
	<meta name="apple-mobile-web-app-title" content="AEWiki Companion" />
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<meta
		name="apple-mobile-web-app-status-bar-style"
		content="black-translucent"
	/>
	<link rel="canonical" href="https://ae.tds-editor.com/recap/" />
</svelte:head>

<div class="page-root">
	<div class="bg-mesh" aria-hidden="true">
		<div class="mesh-orb orb-1"></div>
		<div class="mesh-orb orb-2"></div>
		<div class="mesh-orb orb-3"></div>
		<div class="grid-lines"></div>
	</div>

	<main>
		<div class="recap-header">
			<h1 class="header-title">
				<Trophy class="title-icon" />
				Weekly Contributor Leaderboard
			</h1>

			<div class="nav-controls">
				<button
					class="nav-btn"
					disabled={prevDisabled}
					onclick={() => navigateWeek(-7)}
					aria-label="Previous Week"
				>
					<ChevronLeft class="btn-icon" />
					<span class="hide-mobile">Previous Week</span>
					<span class="show-mobile">Previous</span>
				</button>
				<button
					class="nav-btn"
					disabled={nextDisabled}
					onclick={() => navigateWeek(7)}
					aria-label="Next Week"
				>
					<span class="hide-mobile">Next Week</span>
					<span class="show-mobile">Next</span>
					<ChevronRight class="btn-icon" />
				</button>
			</div>
		</div>

		<div class="nav-hint text-center">
			<small>
				You can use <kbd>←</kbd> and <kbd>→</kbd> to navigate weeks
			</small>
		</div>

		<section class="cards-section">
			<div class="cards-grid stats-grid">
				<div class="card card-recap">
					<div class="card-accent-bar"></div>
					<div class="card-icon-row">
						<div class="card-icon"><Calendar /></div>
					</div>
					<div class="card-body">
						<h2 class="card-title">Current Week</h2>
						<p class="card-desc stat-value">
							{currentDate
								? RecapService.formatDisplayDate(currentDate)
								: "Loading..."}
						</p>
					</div>
				</div>

				<div class="card card-deathbattle">
					<div class="card-accent-bar"></div>
					<div class="card-icon-row">
						<div class="card-icon"><Users /></div>
					</div>
					<div class="card-body">
						<h2 class="card-title">Total Contributors</h2>
						<p class="card-desc stat-value">
							{recapData ? recapData.totalContributors : "-"}
						</p>
					</div>
				</div>

				<div class="card card-resources">
					<div class="card-accent-bar"></div>
					<div class="card-icon-row">
						<div class="card-icon"><ChartColumn /></div>
					</div>
					<div class="card-body">
						<h2 class="card-title">Total Contributions</h2>
						<p class="card-desc stat-value">
							{recapData ? totalContributions : "-"}
						</p>
					</div>
				</div>

				<div class="card card-wiki">
					<div class="card-accent-bar"></div>
					<div class="card-icon-row">
						<div class="card-icon"><Activity /></div>
					</div>
					<div class="card-body">
						<h2 class="card-title">Average per User</h2>
						<p class="card-desc stat-value">
							{recapData ? averagePerUser : "-"}
						</p>
					</div>
				</div>
			</div>
		</section>

		<div class="section-divider"></div>

		<section class="leaderboard-section">
			<div class="card card-featured">
				<div class="card-accent-bar"></div>
				<div class="card-header">
					<ListOrdered class="header-icon" />
					<h2 class="card-title mb-0">Leaderboard</h2>
				</div>

				<div class="card-body p-0">
					<div class="list-group">
						{#if loading}
							<div class="state-container">
								<div class="spinner"></div>
								<p>Loading leaderboard data...</p>
							</div>
						{:else if errorMessage}
							<div class="state-container error-state">
								<TriangleAlert class="error-icon" />
								<span>{errorMessage}</span>
							</div>
						{:else if recapData?.contributors.length === 0}
							<div
								class="flex flex-col items-center justify-center p-8 text-center"
							>
								<Inbox
									class="mb-4 text-muted-foreground opacity-50"
									size={48}
								/>
								<h5
									class="text-muted-foreground font-semibold mb-1"
								>
									No contributors found
								</h5>
								<p class="text-muted-foreground text-sm m-0">
									No contribution data available for this
									week.
								</p>
							</div>
						{:else if recapData}
							{#each recapData.contributors as contributor, i}
								<button
									class="leaderboard-item text-left flex items-center gap-4 w-full cursor-pointer hover:bg-muted/50 transition-colors border-b border-border p-4 last:border-0"
									onclick={() =>
										window.open(
											`https://alter-ego.fandom.com/wiki/User:${encodeURIComponent(contributor.userName)}`,
											"_blank",
										)}
								>
									<div
										class="leaderboard-rank flex shrink-0 justify-center items-center w-10 {i <
										3
											? `rank-${i + 1}`
											: ''} font-bold text-lg"
									>
										{#if i === 0}
											<Trophy class="text-yellow-400" />
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

									<img
										src={RecapService.extractAvatarUrl(
											contributor.avatar,
										)}
										alt={contributor.userName}
										class="contributor-avatar shrink-0 h-12 w-12 rounded-full border border-border object-cover"
										onerror={(e) => {
											(
												e.currentTarget as HTMLImageElement
											).src =
												"https://vignette.wikia.nocookie.net/messaging/images/1/19/Avatar.jpg";
										}}
									/>

									<div
										class="contributor-info flex-1 min-w-0"
									>
										<h6
											class="m-0 mb-1 text-foreground font-semibold truncate text-base"
										>
											{contributor.userName}
											{#if contributor.isAdmin}
												<span
													class="admin-badge ml-2 px-2 py-0.5 text-[0.65rem] tracking-wider rounded font-bold bg-primary/10 text-primary"
												>
													Administrator
												</span>
											{/if}
										</h6>
										<small
											class="text-muted-foreground flex items-center text-xs"
										>
											<UserIcon class="mr-1" size={12} />
											User ID: {contributor.userId}
										</small>
									</div>

									<div class="text-right shrink-0">
										<div
											class="contributions-count text-primary text-xl font-bold"
											use:countUp={contributor.contributions}
										>
											0
										</div>
										<small
											class="text-muted-foreground contributions-text text-xs"
										>
											{contributor.contributionsText}
										</small>
									</div>
								</button>
							{/each}
						{/if}
					</div>
				</div>
			</div>

			{#if recapData && recapData.contributors.length > 0}
				<div
					class="mt-6 mb-4 flex h-6 w-full overflow-hidden rounded-md border border-border bg-muted"
				>
					{#each recapData.contributors as c, i}
						<div
							class="h-full transition-all duration-500 hover:opacity-80"
							style="width: {(Number(c.contributions) /
								totalContributions) *
								100}%; background: {getPaletteColor(i)}"
							title="{c.userName} ({c.contributions})"
						></div>
					{/each}
				</div>

				<div class="mb-4 flex flex-wrap items-center gap-3 px-1">
					{#each recapData.contributors as c, i}
						<span
							class="flex items-center text-sm text-muted-foreground font-medium"
						>
							<span
								class="inline-block mr-2 h-3 w-3 rounded-sm shadow-sm"
								style="background: {getPaletteColor(i)};"
							></span>
							{c.userName}
						</span>
					{/each}
				</div>
			{/if}
		</section>
	</main>
</div>

<style lang="scss">
	main {
		position: relative;
		z-index: 1;
		max-width: 1200px;
		margin: 0 auto;
		padding: 3rem 1.5rem 4rem;
		animation: fadeUp 0.7s ease-out both;
	}

	.recap-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-top: 1rem;
		padding-bottom: 0.5rem;
		position: sticky;
		top: 0;
		z-index: 10;
		margin-bottom: 0.25rem;
	}

	.header-title {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		font-family: var(--font-heading);
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--foreground);
		margin: 0;
	}

	.title-icon {
		color: var(--primary);
	}

	.nav-controls {
		display: flex;
		gap: 0.5rem;
	}

	.nav-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.5rem 1rem;
		border-radius: 8px;
		background: var(--background);
		border: 1px solid var(--border);
		color: var(--foreground);
		font-size: 0.9rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s;

		&:disabled {
			opacity: 0.5;
			cursor: not-allowed;
		}

		&:not(:disabled):hover {
			background: var(--muted);
			border-color: var(--border);
		}
	}

	.btn-icon {
		width: 16px;
		height: 16px;
	}

	.show-mobile {
		display: none;
	}
	.hide-mobile {
		display: inline;
	}

	.nav-hint {
		color: var(--muted-foreground);
		font-size: 0.85rem;
		margin-bottom: 2rem;
		text-align: center;

		kbd {
			background: var(--muted);
			border: 1px solid var(--border);
			border-radius: 4px;
			padding: 0.1rem 0.4rem;
			font-family: monospace;
			color: var(--foreground);
		}
	}

	.cards-section {
		margin-bottom: 2rem;
	}

	.cards-grid {
		display: grid;
		gap: 1rem;
		grid-template-columns: repeat(4, 1fr);
	}

	.card {
		position: relative;
		display: flex;
		flex-direction: column;
		background: var(--card);
		border: 1px solid var(--border);
		border-radius: 12px;
		padding: 1.5rem;
		overflow: hidden;
		--card-accent: var(--primary);

		&::after {
			content: "";
			position: absolute;
			bottom: 0;
			right: 0;
			width: 24px;
			height: 24px;
			background: var(--background);
			clip-path: polygon(100% 0, 0% 100%, 100% 100%);
			opacity: 0.5;
		}
	}

	.card-recap {
		--card-accent: oklch(0.55 0.18 20);
	}
	.card-deathbattle {
		--card-accent: oklch(0.55 0.15 60);
	}
	.card-resources {
		--card-accent: oklch(0.5 0.1 220);
	}
	.card-wiki {
		--card-accent: oklch(0.55 0.15 140);
	}
	.card-featured {
		padding: 0;
		--card-accent: oklch(0.55 0.18 20);
	}

	.card-accent-bar {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 2px;
		background: linear-gradient(
			to right,
			transparent 0%,
			var(--card-accent) 30%,
			var(--card-accent) 70%,
			transparent 100%
		);
		opacity: 0.6;
	}

	.card-icon-row {
		display: flex;
		margin-bottom: 1rem;
	}

	.card-icon {
		width: 40px;
		height: 40px;
		border-radius: 8px;
		background: oklch(from var(--card-accent) l c h / 0.12);
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--card-accent);
	}

	.card-title {
		font-size: 1rem;
		font-weight: 700;
		color: var(--muted-foreground);
		margin: 0 0 0.4rem;
		font-family: var(--font-heading);
	}

	.stat-value {
		font-size: 1.5rem;
		font-weight: 800;
		color: var(--foreground);
		margin: 0;
	}

	.section-divider {
		height: 1px;
		background: var(--border);
		margin: 2rem 0;
	}

	.card-header {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 1.5rem 1.5rem 1rem;
		border-bottom: 1px solid var(--border);

		.card-title {
			color: var(--foreground);
			font-size: 1.25rem;
			margin: 0;
		}
	}

	.header-icon {
		color: var(--card-accent);
	}

	.state-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 3rem 1rem;
		color: var(--muted-foreground);
		gap: 1rem;
	}

	.error-state {
		color: var(--destructive);
		background: oklch(from var(--destructive) l c h / 0.1);
		border-radius: 8px;
		margin: 1rem;
		padding: 1.5rem;
		flex-direction: row;
	}

	.spinner {
		width: 2rem;
		height: 2rem;
		border: 3px solid var(--border);
		border-top-color: var(--primary);
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	@media (max-width: 900px) {
		.cards-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 768px) {
		.recap-header {
			flex-direction: column;
			align-items: flex-start;
			gap: 1rem;
		}
	}

	@media (max-width: 600px) {
		.cards-grid {
			grid-template-columns: 1fr;
		}
		.hide-mobile {
			display: none;
		}
		.show-mobile {
			display: inline;
		}
	}
</style>
