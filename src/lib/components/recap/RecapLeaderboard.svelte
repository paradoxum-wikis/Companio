<script lang="ts">
	import type { Contributor } from "$lib/types";
	import { RecapService } from "$lib/recap/service";
	import {
		getPaletteColor,
		getUserProfileUrl,
		getContributionTitle,
		countUp,
	} from "$lib/recap/helpers";
	import {
		CircleStar,
		Trophy,
		Award,
		Inbox,
		UserIcon,
		TriangleAlert,
		ListOrdered,
	} from "@lucide/svelte";
	import "./leaderboard.css";

	let {
		loading,
		errorMessage,
		contributors,
		totalContributions,
		wikiMode,
		currentDate,
	}: {
		loading: boolean;
		errorMessage: string | null;
		contributors: Contributor[] | undefined;
		totalContributions: number;
		wikiMode: "aew" | "tdsw";
		currentDate: string;
	} = $props();
</script>

<section class="leaderboard-section">
	<div class="card card-featured">
		<div class="card-accent-bar"></div>
		<div class="card-header">
			<ListOrdered class="header-icon" />
			<h2 class="card-title">Leaderboard</h2>
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
						<TriangleAlert class="size-5" />
						<span>{errorMessage}</span>
					</div>
				{:else if contributors?.length === 0}
					<div class="empty-state">
						<Inbox
							class="mb-4 size-12 text-muted-foreground opacity-50"
						/>
						<h5 class="text-muted-foreground font-semibold mb-1">
							No contributors found
						</h5>
						<p class="text-muted-foreground text-sm m-0">
							No contribution data available for this week.
						</p>
					</div>
				{:else if contributors}
					{#each contributors as contributor, i (contributor.userName)}
						{@const avatarUrl = RecapService.extractAvatarUrl(
							contributor.avatar,
						)}
						<button
							class="text-left flex items-center gap-4 w-full cursor-pointer hover:bg-muted/50 transition-colors border-b border-border p-4 last:border-0"
							onclick={() =>
								window.open(
									getUserProfileUrl(
										contributor.userName,
										wikiMode,
										currentDate,
									),
									"_blank",
								)}
						>
							<div
								class="flex shrink-0 justify-center items-center w-10 font-bold text-lg"
							>
								{#if i === 0}<Trophy class="text-yellow-400" />
								{:else if i === 1}<Award
										class="text-gray-400"
									/>
								{:else if i === 2}<CircleStar
										class="text-amber-600"
									/>
								{:else}{i + 1}{/if}
							</div>

							<img
								src={avatarUrl}
								alt={contributor.userName}
								class="shrink-0 h-12 w-12 rounded-full border border-border object-cover"
								onerror={(e) => {
									const el =
										e.currentTarget as HTMLImageElement;
									if (
										el.src !== RecapService.fallbackAvatar
									) {
										el.src = RecapService.fallbackAvatar;
									}
								}}
							/>

							<div class="flex-1 min-w-0">
								<h6
									class="m-0 mb-1 text-foreground font-semibold truncate text-base"
								>
									{contributor.userName}
									{#if contributor.isAdmin}
										<span
											class="ms-2 px-2 py-0.5 text-[0.65rem] tracking-wider rounded font-bold bg-primary/10 text-primary"
											>Administrator</span
										>
									{/if}
								</h6>
								{#if contributor.userId && contributor.userId !== "N/A"}
									<small
										class="text-muted-foreground flex items-center text-xs"
									>
										<UserIcon class="me-1" size={12} />
										User ID: {contributor.userId}
									</small>
								{/if}
							</div>

							<div class="text-right shrink-0">
								<div class="text-primary text-xl font-bold">
									<span
										use:countUp={contributor.contributions}
										>0</span
									>
									{#if contributor.hasRelevantContributions}
										<span
											class="text-muted-foreground text-sm font-semibold"
										>
											({Number(
												contributor.totalContributions ??
													contributor.contributions,
											).toLocaleString()})
										</span>
									{/if}
								</div>
								<small class="text-muted-foreground text-xs">
									contributions
								</small>
							</div>
						</button>
					{/each}
				{/if}
			</div>
		</div>
	</div>
	{#if contributors && contributors.length > 0}
		<div
			class="mt-6 mb-4 flex h-6 w-full overflow-hidden rounded-md border border-border bg-muted"
		>
			{#each contributors as c, i (c.userName)}
				<div
					class="h-full transition-all duration-500 hover:opacity-80"
					style="width:{(Number(c.contributions) /
						totalContributions) *
						100}%;background:{getPaletteColor(i)}"
					title={getContributionTitle(c)}
				></div>
			{/each}
		</div>
		<div class="mb-4 flex flex-wrap items-center gap-3 px-1">
			{#each contributors as c, i (c.userName)}
				<span
					class="flex items-center text-sm text-muted-foreground font-medium"
				>
					<span
						class="inline-block me-2 h-3 w-3 rounded-sm"
						style="background:{getPaletteColor(i)};"
					></span>
					{c.userName}
				</span>
			{/each}
		</div>
	{/if}
</section>
