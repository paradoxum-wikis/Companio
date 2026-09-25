<script lang="ts">
	import { onMount } from "svelte";
	import { RecapService } from "$lib/recap/service";
	import type { RecapData } from "$lib/types";
	import PageShell from "$lib/components/PageShell.svelte";
	import RecapHeader from "$lib/components/recap/RecapHeader.svelte";
	import RecapStats from "$lib/components/recap/RecapStats.svelte";
	import RecapLeaderboard from "$lib/components/recap/RecapLeaderboard.svelte";
	import RecapCharts from "$lib/components/recap/RecapCharts.svelte";

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

	let analytics = $derived(recapData?.analytics ?? null);

	async function handleModeSwitch() {
		currentDate = await RecapService.getCurrentWeekDate(wikiMode, true);
		RecapService.updateUrlWithDate(currentDate, wikiMode);
		loadRecapData();
	}

	async function init() {
		const params = new URLSearchParams(window.location.search);
		const wikiParam = params.get("wiki");
		if (wikiParam === "aew" || wikiParam === "tdsw") {
			wikiMode = wikiParam;
		}

		currentDate = await RecapService.getCurrentWeekDate(wikiMode);
		loadRecapData();
	}

	async function navigateWeek(direction: "prev" | "next") {
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

	async function loadRecapData() {
		loading = true;
		errorMessage = null;
		updateNavigationButtons();
		try {
			recapData = await RecapService.fetchRecapData(wikiMode, currentDate);
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

	async function updateNavigationButtons() {
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

<PageShell>
	<RecapHeader
		bind:wikiMode
		{prevDisabled}
		{nextDisabled}
		onModeSwitch={handleModeSwitch}
		onNavigate={navigateWeek}
	/>

	<RecapStats
		{currentDate}
		totalContributors={recapData ? recapData.totalContributors : null}
		top3Impact={recapData ? top3Impact : null}
		averagePerUser={recapData ? averagePerUser : null}
	/>

	<div class="h-px bg-border my-8"></div>

	<RecapLeaderboard
		{loading}
		{errorMessage}
		contributors={recapData?.contributors}
		{totalContributions}
		{wikiMode}
		{currentDate}
	/>

	{#if analytics}
		<div class="h-px bg-border my-8"></div>
		<RecapCharts {analytics} />
	{/if}
</PageShell>
