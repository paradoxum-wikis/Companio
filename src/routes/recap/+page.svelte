<script lang="ts">
	import { onMount } from "svelte";
	import { RecapService } from "$lib/recap/service.js";
	import type { RecapData } from "../../types.js";
	import "./recap.css";

	import * as Chart from "$lib/components/ui/chart/index.js";
	import * as Card from "$lib/components/ui/card/index.js";
	import { scaleBand } from "d3-scale";
	import { BarChart, PieChart, Arc, Text, LineChart } from "layerchart";
	import { curveNatural } from "d3-shape";
	import { cubicInOut } from "svelte/easing";

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

	const timelineChartConfig = {
		edits: { label: "Edits", color: "var(--chart-1)" },
	} satisfies Chart.ChartConfig;

	const hourChartConfig = {
		edits: { label: "Edits", color: "var(--chart-2)" },
	} satisfies Chart.ChartConfig;

	const pageChartConfig = {
		edits: { label: "Edits", color: "var(--chart-3)" },
	} satisfies Chart.ChartConfig;

	let wikiMode = $state<"aew" | "tdsw">("aew");
	let currentDate = $state("");
	let prevDisabled = $state(false);
	let nextDisabled = $state(true);
	let recapData = $state<RecapData | null>(null);
	let loading = $state(true);
	let errorMessage = $state<string | null>(null);

	let totalContributions = $derived(
		recapData?.contributors?.reduce(
			(sum, c) => sum + Number(c.contributions),
			0,
		) ?? 0,
	);

	let top3Impact = $derived.by(() => {
		if (!recapData?.contributors?.length || totalContributions === 0)
			return "0%";

		const top3Sum = recapData.contributors
			.slice(0, 3)
			.reduce((sum, c) => sum + Number(c.contributions), 0);

		return Math.round((top3Sum / totalContributions) * 100) + "%";
	});

	let averagePerUser = $derived(
		recapData?.contributors?.length
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

	function getPaletteColor(i: number) {
		return palette[i % palette.length];
	}

	async function handleModeSwitch() {
		currentDate = await RecapService.getCurrentWeekDate(wikiMode, true);
		RecapService.updateUrlWithDate(currentDate, wikiMode);
		loadRecapData();
	}

	function countUp(node: HTMLElement, target: string | number) {
		const n = Number(target);
		if (isNaN(n) || n === 0) return;
		let cur = 0;
		const inc = Math.max(1, Math.ceil(n / 30));
		const t = setInterval(() => {
			cur += inc;
			if (cur >= n) {
				node.textContent = n.toString();
				clearInterval(t);
			} else node.textContent = cur.toString();
		}, 20);
		return {
			destroy() {
				clearInterval(t);
			},
		};
	}

	const KNOWN_NS = [
		"MediaWiki",
		"User",
		"File",
		"Template",
		"Category",
		"Help",
		"Talk",
		"Template talk",
		"User talk",
		"Module",
	];

	const analytics = $derived.by(() => {
		if (!recapData?.rawData?.length) return null;
		const raw = recapData.rawData as any[];

		const hourCounts = Array(24).fill(0);
		const isoDateCounts: Record<string, number> = {};
		const nsCounts: Record<string, number> = {};
		const pageCounts: Record<string, number> = {};
		let totalAdded = 0,
			totalRemoved = 0;
		let typeEdit = 0,
			typeNew = 0,
			typeUpload = 0,
			typeRemoval = 0;

		for (const entry of raw) {
			const d = new Date(entry.timestamp);
			hourCounts[d.getHours()]++;

			const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
			isoDateCounts[iso] = (isoDateCounts[iso] || 0) + 1;

			const embed = entry.embeds?.[0];
			if (!embed) continue;
			const title: string = embed.title || "";

			// Edit type
			const isBlank =
				embed.description === "Blanked the page" ||
				(embed.fields || []).some((f: any) => f.value === "Blanking");
			if (title.startsWith("Uploaded")) typeUpload++;
			else if (title.includes("(N!)")) typeNew++;
			else if (isBlank) typeRemoval++;
			else typeEdit++;

			// Namespace
			let ns = "Main";
			if (title.startsWith("Uploaded")) {
				ns = "File";
			} else {
				const colon = title.indexOf(":");
				if (colon > 0) {
					const candidate = title.substring(0, colon);
					if (KNOWN_NS.includes(candidate)) ns = candidate;
				}
			}
			nsCounts[ns] = (nsCounts[ns] || 0) + 1;

			// Page name
			const cleanTitle = title
				.replace(/^Uploaded (?:a new version of )?/, "")
				.replace(/\s*\(\s*(?:\(N!\)\s+)?[+-]?\d+\s*\)\s*$/, "")
				.trim();
			if (cleanTitle)
				pageCounts[cleanTitle] = (pageCounts[cleanTitle] || 0) + 1;

			// Byte
			const m = title.match(/\(\s*(?:\(N!\)\s+)?([+-]?\d+)\s*\)\s*$/);
			if (m) {
				const n = parseInt(m[1]);
				if (!isNaN(n)) {
					if (n > 0) totalAdded += n;
					else if (n < 0) totalRemoved += Math.abs(n);
				}
			}
		}

		// Chart data
		const timelineData = Object.entries(isoDateCounts)
			.sort(([a], [b]) => a.localeCompare(b))
			.map(([iso, edits]) => ({
				day: new Date(iso + "T12:00:00").toLocaleDateString("en-US", {
					month: "short",
					day: "numeric",
				}),
				edits,
			}));

		const hourChartData = hourCounts.map((edits, i) => ({
			hour: `${i.toString().padStart(2, "0")}h`,
			edits,
		}));

		const nsEntries = Object.entries(nsCounts).sort((a, b) => b[1] - a[1]);
		const nsChartData = nsEntries.map(([ns, count], i) => ({
			ns,
			count,
			color: `var(--chart-${(i % 5) + 1})`,
		}));
		const nsChartConfig = {
			count: { label: "Edits" },
			...Object.fromEntries(
				nsEntries.map(([ns], i) => [
					ns,
					{ label: ns, color: `var(--chart-${(i % 5) + 1})` },
				]),
			),
		} as Chart.ChartConfig;

		const editTypeData = [
			{ type: "Edit", count: typeEdit, color: "var(--chart-1)" },
			{ type: "New Page", count: typeNew, color: "var(--chart-2)" },
			{ type: "Upload", count: typeUpload, color: "var(--chart-3)" },
			{ type: "Delete", count: typeRemoval, color: "var(--chart-4)" },
		].filter((d) => d.count > 0);
		const editTypeConfig = {
			count: { label: "Count" },
			...Object.fromEntries(
				editTypeData.map((d) => [
					d.type,
					{ label: d.type, color: d.color },
				]),
			),
		} as Chart.ChartConfig;

		const topPagesRaw = Object.entries(pageCounts)
			.sort((a, b) => b[1] - a[1])
			.slice(0, 8);
		const pageChartData = topPagesRaw.map(([page, edits]) => ({
			page: (page.includes(":")
				? page.split(":").slice(1).join(":")
				: page
			)
				.replace(/\s*\(.*\)$/, "")
				.trim()
				.slice(0, 22),
			fullPage: page,
			edits,
		}));

		return {
			timelineData,
			hourChartData,
			nsChartData,
			nsChartConfig,
			editTypeData,
			editTypeConfig,
			pageChartData,
			totalAdded,
			totalRemoved,
			netChange: totalAdded - totalRemoved,
			total: raw.length,
		};
	});

	async function init() {
		const params = new URLSearchParams(window.location.search);
		const wikiParam = params.get("wiki");
		if (wikiParam === "aew" || wikiParam === "tdsw") {
			wikiMode = wikiParam;
		}

		currentDate = await RecapService.getCurrentWeekDate(wikiMode);
		loadRecapData();
	}

	async function navigateWeek(direction: "prev" | "next"): Promise<void> {
		if (direction === "prev") {
			currentDate = await RecapService.getPreviousDate(
				wikiMode,
				currentDate,
			);
		} else {
			currentDate = await RecapService.getNextDate(wikiMode, currentDate);
		}

		RecapService.updateUrlWithDate(currentDate, wikiMode);
		loadRecapData();
	}

	async function loadRecapData(): Promise<void> {
		loading = true;
		errorMessage = null;
		updateNavigationButtons();
		try {
			recapData = await RecapService.fetchRecapData(
				wikiMode,
				currentDate,
			);
		} catch (error) {
			errorMessage =
				error instanceof Error
					? error.message.includes("404")
						? "No recap data available for this date."
						: error.message
					: "Failed to load recap data.";
			recapData = null;
		} finally {
			loading = false;
		}
	}

	async function updateNavigationButtons(): Promise<void> {
		const dates = await RecapService.getAvailableDates(wikiMode);
		if (dates.length > 0) {
			const idx = dates.indexOf(currentDate);
			if (idx === -1) {
				nextDisabled =
					new Date(currentDate + "T00:00:00") >=
					new Date(RecapService.formatDate(new Date()) + "T00:00:00");
				prevDisabled = false;
			} else {
				prevDisabled = idx === 0;
				nextDisabled = idx === dates.length - 1;
			}
		} else {
			nextDisabled =
				new Date(currentDate + "T00:00:00") >=
				new Date(RecapService.formatDate(new Date()) + "T00:00:00");
			prevDisabled = false;
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === "ArrowLeft" && !prevDisabled) navigateWeek("prev");
		if (e.key === "ArrowRight" && !nextDisabled) navigateWeek("next");
	}

	async function handlePopstate() {
		const params = new URLSearchParams(window.location.search);
		const wikiParam = params.get("wiki");
		if (wikiParam === "aew" || wikiParam === "tdsw") {
			wikiMode = wikiParam;
		}
		currentDate = await RecapService.getCurrentWeekDate(wikiMode);
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
		content="Weekly contributor leaderboard for the ALTER EGO Wiki."
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
		content="Weekly contributor leaderboard for the ALTER EGO Wiki."
	/>
	<meta property="og:image" content="https://ae.tds-editor.com/banner.png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:site_name" content="Paradoxum Wikis Companio" />
	<meta property="og:locale" content="en_US" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content="@isALTEREGOout" />
	<meta
		name="twitter:title"
		content="Weekly Recap | Paradoxum Wikis Companio"
	/>
	<meta name="twitter:image" content="https://ae.tds-editor.com/banner.png" />
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

	<main class="page-enter">
		<!-- Header -->
		<div class="recap-header">
			<h1 class="header-title">
				<Trophy class="title-icon" />
				Weekly Contributor Leaderboard
			</h1>
			<div class="nav-controls">
				<select
					class="nav-btn"
					bind:value={wikiMode}
					onchange={() => handleModeSwitch()}
					aria-label="Select Wiki"
				>
					<option value="aew">ALTER EGO</option>
					<option value="tdsw">Tower Defense Simulator</option>
				</select>
				<button
					class="nav-btn"
					disabled={prevDisabled}
					onclick={() => navigateWeek("prev")}
					aria-label="Previous Week"
				>
					<ChevronLeft class="btn-icon" />
					<span class="hide-mobile">Previous Week</span>
					<span class="show-mobile">Previous</span>
				</button>
				<button
					class="nav-btn"
					disabled={nextDisabled}
					onclick={() => navigateWeek("next")}
					aria-label="Next Week"
				>
					<span class="hide-mobile">Next Week</span>
					<span class="show-mobile">Next</span>
					<ChevronRight class="btn-icon" />
				</button>
			</div>
		</div>

		<div class="nav-hint">
			<small>Use <kbd>←</kbd> and <kbd>→</kbd> to navigate weeks</small>
		</div>

		<!-- Top stat cards -->
		<section class="cards-section">
			<div class="cards-grid">
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
						<h2 class="card-title">Top 3's Impact</h2>
						<p class="card-desc stat-value">
							{recapData ? top3Impact : "-"}
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

		<!-- Leaderboard -->
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
								{@const avatarUrl =
									RecapService.extractAvatarUrl(
										contributor.avatar,
									)}
								{@const hasAvatar =
									contributor.avatar?.startsWith("http")}
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
										{#if i === 0}<Trophy
												class="text-yellow-400"
											/>
										{:else if i === 1}<Award
												class="text-gray-400"
											/>
										{:else if i === 2}<CircleStar
												class="text-amber-600"
											/>
										{:else}{i + 1}{/if}
									</div>

									{#if hasAvatar}
										<img
											src={avatarUrl}
											alt={contributor.userName}
											class="contributor-avatar shrink-0 h-12 w-12 rounded-full border border-border object-cover"
											onerror={(e) => {
												const el =
													e.currentTarget as HTMLImageElement;
												el.style.display = "none";
												(
													el.nextElementSibling as HTMLElement
												).style.display = "flex";
											}}
										/>
										<div
											class="contributor-avatar shrink-0 h-12 w-12 rounded-full border border-border items-center justify-center text-lg font-bold text-muted-foreground bg-muted"
											style="display:none"
										>
											{contributor.userName
												.charAt(0)
												.toUpperCase()}
										</div>
									{:else}
										<div
											class="contributor-avatar shrink-0 h-12 w-12 rounded-full border border-border flex items-center justify-center text-lg font-bold text-muted-foreground bg-muted"
										>
											{contributor.userName
												.charAt(0)
												.toUpperCase()}
										</div>
									{/if}

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
													>Administrator</span
												>
											{/if}
										</h6>
										{#if contributor.userId && contributor.userId !== "N/A"}
											<small
												class="text-muted-foreground flex items-center text-xs"
											>
												<UserIcon
													class="mr-1"
													size={12}
												/>
												User ID: {contributor.userId}
											</small>
										{/if}
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
											contributions
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
							style="width:{(Number(c.contributions) /
								totalContributions) *
								100}%;background:{getPaletteColor(i)}"
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
								class="inline-block mr-2 h-3 w-3 rounded-sm"
								style="background:{getPaletteColor(i)};"
							></span>
							{c.userName}
						</span>
					{/each}
				</div>
			{/if}
		</section>

		<!-- Analytics -->
		{#if analytics}
			<div class="section-divider"></div>

			<!-- Byte change -->
			<div class="analytics-summary">
				<div class="summary-stat">
					<span class="summary-val">{analytics.total}</span>
					<span class="summary-label">total edits</span>
				</div>
				<div class="summary-stat summary-stat-add">
					<span class="summary-val"
						>+{analytics.totalAdded.toLocaleString()}</span
					>
					<span class="summary-label">bytes added</span>
				</div>
				<div class="summary-stat summary-stat-rem">
					<span class="summary-val"
						>−{analytics.totalRemoved.toLocaleString()}</span
					>
					<span class="summary-label">bytes removed</span>
				</div>
				<div
					class="summary-stat"
					class:summary-stat-add={analytics.netChange > 0}
					class:summary-stat-rem={analytics.netChange < 0}
				>
					<span class="summary-val">
						{analytics.netChange >= 0
							? "+"
							: ""}{analytics.netChange.toLocaleString()}
					</span>
					<span class="summary-label">net change</span>
				</div>
			</div>

			<!-- Edits per day -->
			<Card.Root class="mb-4">
				<Card.Header class="pb-2">
					<Card.Title>Edits per Day</Card.Title>
				</Card.Header>
				<Card.Content>
					<Chart.Container
						config={timelineChartConfig}
						class="h-48 w-full"
					>
						<LineChart
							data={analytics.timelineData}
							x="day"
							xScale={scaleBand()}
							axis="x"
							series={[
								{
									key: "edits",
									label: "Edits",
									color: timelineChartConfig.edits.color,
								},
							]}
							props={{
								spline: {
									curve: curveNatural,
									strokeWidth: 2,
									motion: "tween",
								},
								highlight: { points: { r: 4 } },
								xAxis: { format: (v: string) => v },
							}}
						>
							{#snippet tooltip()}
								<Chart.Tooltip />
							{/snippet}
						</LineChart>
					</Chart.Container>
				</Card.Content>
			</Card.Root>

			<div class="analytics-grid">
				<!-- Edits by hour -->
				<Card.Root>
					<Card.Header class="pb-2">
						<Card.Title>Edits by Hour</Card.Title>
					</Card.Header>
					<Card.Content>
						<Chart.Container
							config={hourChartConfig}
							class="h-44 w-full"
						>
							<LineChart
								data={analytics.hourChartData}
								x="hour"
								xScale={scaleBand()}
								axis="x"
								series={[
									{
										key: "edits",
										label: "Edits",
										color: hourChartConfig.edits.color,
									},
								]}
								props={{
									spline: {
										curve: curveNatural,
										strokeWidth: 2,
										motion: "tween",
									},
									highlight: { points: { r: 3 } },
									xAxis: {
										ticks: [
											"00h",
											"06h",
											"12h",
											"18h",
											"23h",
										],
										format: (v: string) => v,
									},
								}}
							>
								{#snippet tooltip()}
									<Chart.Tooltip />
								{/snippet}
							</LineChart>
						</Chart.Container>
					</Card.Content>
				</Card.Root>

				<!-- Namespace breakdown -->
				<Card.Root class="flex flex-col">
					<Card.Header class="pb-2 items-center">
						<Card.Title>Namespaces</Card.Title>
					</Card.Header>
					<Card.Content class="flex-1">
						<Chart.Container
							config={analytics.nsChartConfig}
							class="mx-auto aspect-square max-h-44"
						>
							<PieChart
								data={analytics.nsChartData}
								key="ns"
								value="count"
								cRange={analytics.nsChartData.map(
									(d) => d.color,
								)}
								c="color"
								props={{ pie: { motion: "tween" } }}
							>
								{#snippet tooltip()}
									<Chart.Tooltip hideLabel />
								{/snippet}
								{#snippet arc({ props, visibleData, index })}
									<Arc {...props}>
										{#snippet children({ getArcTextProps })}
											{#if visibleData[index].count / analytics.total > 0.08}
												<Text
													value={visibleData[index]
														.ns}
													{...getArcTextProps(
														"centroid",
													)}
													font-size="11"
													class="fill-background"
												/>
											{/if}
										{/snippet}
									</Arc>
								{/snippet}
							</PieChart>
						</Chart.Container>
					</Card.Content>
					<Card.Footer class="flex-wrap gap-2 justify-center">
						{#each analytics.nsChartData as d}
							<span
								class="flex items-center gap-1 text-xs text-muted-foreground"
							>
								<span
									class="inline-block h-2.5 w-2.5 rounded-sm"
									style="background:{d.color}"
								></span>
								{d.ns}
								<span class="font-semibold text-foreground"
									>{d.count}</span
								>
							</span>
						{/each}
					</Card.Footer>
				</Card.Root>
			</div>

			<div class="analytics-grid mt-4">
				<!-- Edit type breakdown -->
				<Card.Root class="flex flex-col">
					<Card.Header class="pb-2 items-center">
						<Card.Title>Edit Types</Card.Title>
					</Card.Header>
					<Card.Content class="flex-1">
						<Chart.Container
							config={analytics.editTypeConfig}
							class="mx-auto aspect-square max-h-44"
						>
							<PieChart
								data={analytics.editTypeData}
								key="type"
								value="count"
								cRange={analytics.editTypeData.map(
									(d) => d.color,
								)}
								c="color"
								props={{ pie: { motion: "tween" } }}
							>
								{#snippet tooltip()}
									<Chart.Tooltip hideLabel />
								{/snippet}
								{#snippet arc({ props, visibleData, index })}
									<Arc {...props}>
										{#snippet children({ getArcTextProps })}
											{#if visibleData[index].count / analytics.total > 0.08}
												<Text
													value={visibleData[index]
														.type}
													{...getArcTextProps(
														"centroid",
													)}
													font-size="11"
													class="fill-background"
												/>
											{/if}
										{/snippet}
									</Arc>
								{/snippet}
							</PieChart>
						</Chart.Container>
					</Card.Content>
					<Card.Footer class="flex-wrap gap-2 justify-center">
						{#each analytics.editTypeData as d}
							<span
								class="flex items-center gap-1 text-xs text-muted-foreground"
							>
								<span
									class="inline-block h-2.5 w-2.5 rounded-sm"
									style="background:{d.color}"
								></span>
								{d.type}
								<span class="font-semibold text-foreground"
									>{d.count}</span
								>
							</span>
						{/each}
					</Card.Footer>
				</Card.Root>

				<!-- Top edited pages -->
				<Card.Root>
					<Card.Header class="pb-2">
						<Card.Title>Top Edited Pages</Card.Title>
					</Card.Header>
					<Card.Content>
						<Chart.Container
							config={pageChartConfig}
							class="h-44 w-full"
						>
							<BarChart
								data={analytics.pageChartData}
								xScale={scaleBand().padding(0.25)}
								x="page"
								axis="x"
								series={[
									{
										key: "edits",
										label: "Edits",
										color: pageChartConfig.edits.color,
									},
								]}
								props={{
									bars: {
										stroke: "none",
										rounded: "top",
										motion: {
											type: "tween",
											duration: 400,
											easing: cubicInOut,
										},
									},
									xAxis: {
										format: (v: string) => v,
										tickLabelProps: {
											svgProps: {
												"font-size": 9,
												"text-anchor": "end",
											},
											rotate: -35,
										},
									},
								}}
							>
								{#snippet tooltip()}
									<Chart.Tooltip />
								{/snippet}
							</BarChart>
						</Chart.Container>
					</Card.Content>
				</Card.Root>
			</div>
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

	.analytics-summary {
		display: flex;
		gap: 1rem;
		margin-bottom: 1rem;
		flex-wrap: wrap;
	}

	.summary-stat {
		flex: 1;
		min-width: 110px;
		background: var(--card);
		border: 1px solid var(--border);
		border-radius: 10px;
		padding: 0.9rem 1.1rem;
		display: flex;
		flex-direction: column;
		gap: 0.2rem;

		&.summary-stat-add .summary-val {
			color: oklch(0.62 0.18 145);
		}
		&.summary-stat-rem .summary-val {
			color: oklch(0.58 0.18 20);
		}
	}

	.summary-val {
		font-size: 1.3rem;
		font-weight: 800;
		color: var(--foreground);
		font-family: var(--font-heading);
		line-height: 1.1;
	}

	.summary-label {
		font-size: 0.68rem;
		color: var(--muted-foreground);
		text-transform: uppercase;
		letter-spacing: 0.1em;
	}

	.analytics-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
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
		.analytics-grid {
			grid-template-columns: 1fr;
		}
		.analytics-summary {
			gap: 0.5rem;
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
