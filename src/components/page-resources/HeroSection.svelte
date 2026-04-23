<script lang="ts">
	import { Sparkles } from "@lucide/svelte";
	import type { GameType } from "../../modules/types.js";

	let { currentGame }: { currentGame: GameType } = $props();

	const gameInfo: Record<
		GameType,
		{
			title: string;
			subtitle: string;
			backgroundImage: string;
			eyebrow: string;
		}
	> = {
		TDS: {
			title: "Tower Defense Simulator",
			subtitle: "Download things to upload to the wiki xd",
			backgroundImage: "/TDSHero.png",
			eyebrow: "Page Resources",
		},
		AE: {
			title: "ALTER EGO",
			subtitle: "Stalk the development of ALTER EGO >:)",
			backgroundImage: "/AEHero.png",
			eyebrow: "Page Resources",
		},
	};
</script>

<section
	class="hero-section"
	style:background-image={`linear-gradient(135deg, rgb(8 8 12 / 0.82), rgb(8 8 12 / 0.48)), url('${gameInfo[currentGame].backgroundImage}')`}
>
	<div class="hero-copy">
		<div class="hero-pill">
			<Sparkles class="size-4 shrink-0" />
			<span>{gameInfo[currentGame].eyebrow}</span>
		</div>

		<h1>{gameInfo[currentGame].title}</h1>
		<p>{gameInfo[currentGame].subtitle}</p>
	</div>
</section>

<style>
	.hero-section {
		margin-top: 1.5rem;
		padding: clamp(1.5rem, 3vw, 2rem);
		min-height: 14rem;
		border: 1px solid color-mix(in oklab, var(--border) 88%, transparent);
		border-radius: 1.5rem;
		background-position: center;
		background-size: cover;
		position: relative;
		overflow: hidden;
		box-shadow: 0 24px 70px rgb(0 0 0 / 0.2);
	}

	.hero-section::after {
		content: "";
		position: absolute;
		inset: auto -10% -35% auto;
		width: 18rem;
		height: 18rem;
		border-radius: 999px;
		background: radial-gradient(
			circle,
			color-mix(in oklab, var(--primary) 42%, transparent),
			transparent 72%
		);
		opacity: 0.8;
		pointer-events: none;
	}

	.hero-copy {
		position: relative;
		z-index: 1;
	}

	.hero-pill {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.45rem 0.8rem;
		border-radius: 999px;
		margin-bottom: 1rem;
		background: rgb(255 255 255 / 0.12);
		color: rgb(255 255 255 / 0.92);
		font-size: 0.78rem;
		font-weight: 700;
		letter-spacing: 0.04em;
		backdrop-filter: blur(8px);
	}

	h1 {
		margin: 0 0 0.75rem;
		font-size: clamp(2rem, 5vw, 3.6rem);
		line-height: 1.05;
		font-family: var(--font-heading);
		color: white;
	}

	p {
		margin: 0;
		max-width: 38rem;
		font-size: 1rem;
		line-height: 1.7;
		color: rgb(255 255 255 / 0.82);
	}
</style>
