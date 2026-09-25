<script lang="ts">
	import {
		Zap,
		Trophy,
		Book,
		MessageCircle,
		Gamepad2,
		Wrench,
		Swords,
		ArrowRight,
		ExternalLink,
	} from "@lucide/svelte";
	import DiscordWidget from "$lib/components/Discord.svelte";
	import PageShell from "$lib/components/PageShell.svelte";
</script>

<svelte:head>
	<title>Paradoxum Wikis Companio</title>
	<meta
		name="description"
		content="The companion site for the ALTER EGO Wiki. Access weekly contributor leaderboards, browse the ALTERPEDIA, and join our Discord community."
	/>
	<meta
		name="keywords"
		content="ALTER EGO, Wiki, Companion, Leaderboard, ALTERPEDIA, Discord, Community"
	/>
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://ae.tds-editor.com/" />
	<meta property="og:title" content="Paradoxum Wikis Companio" />
	<meta
		property="og:description"
		content="The companion site for the ALTER EGO Wiki. Access weekly contributor leaderboards, browse the ALTERPEDIA, and join our Discord community."
	/>
	<meta property="og:image" content="https://ae.tds-editor.com/banner.png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta
		property="og:image:alt"
		content="ALTER EGO Wiki - Join our community"
	/>
	<meta property="og:site_name" content="Paradoxum Wikis Companio" />
	<meta property="og:locale" content="en_US" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content="@isALTEREGOout" />
	<meta name="twitter:creator" content="@isALTEREGOout" />
	<meta name="twitter:title" content="Paradoxum Wikis Companio" />
	<meta
		name="twitter:description"
		content="The companion site for the ALTER EGO Wiki. Access weekly contributor leaderboards, browse the ALTERPEDIA, and join our Discord community."
	/>
	<meta name="twitter:image" content="https://ae.tds-editor.com/banner.png" />
	<meta
		name="twitter:image:alt"
		content="ALTER EGO Wiki - Join our community"
	/>
	<link rel="canonical" href="https://ae.tds-editor.com/" />
</svelte:head>

<PageShell>
	<section class="hero">
		<h1 class="hero-title">
			<span class="hero-title-line1">Welcome,</span>
			<span class="hero-title-line2">Alter Egoist</span>
		</h1>
		<p class="hero-sub">
			To the companio! For the more quirky things of ALTER EGO Wiki and
			Tower Defense Simulator Wiki!.<br />(/▿＼)
		</p>
	</section>

	<section class="cards-section">
		<div class="section-label">Balderdash</div>
		<div class="cards-grid">
			<a
				href="/recap/"
				class="card card-featured card-recap"
				aria-label="Weekly Recap"
			>
				<div class="card-accent-bar"></div>
				<div class="card-icon-row">
					<div class="card-icon"><Trophy class="size-5" /></div>
				</div>
				<div class="card-body">
					<h2 class="card-title">Weekly Recap</h2>
					<p class="card-desc">
						Browse the contributor leaderboard and track who's been
						building the ALTERPEDIA each week.
					</p>
				</div>
				<div class="card-footer">
					<span class="card-link"
						>Browse Tool<ArrowRight class="size-3.5" /></span
					>
				</div>
			</a>

			<a
				href="/deathbattle/"
				class="card card-deathbattle"
				aria-label="Deathbattle Statistics"
			>
				<div class="card-accent-bar"></div>
				<div class="card-icon-row">
					<div class="card-icon"><Zap class="size-5" /></div>
				</div>
				<div class="card-body">
					<h2 class="card-title">Deathbattle Stats</h2>
					<p class="card-desc">
						Combat stats and rankings from the ALTERSHAPER Discord
						bot.
					</p>
				</div>
				<div class="card-footer">
					<span class="card-link"
						>Browse Tool<ArrowRight class="size-3.5" /></span
					>
				</div>
			</a>

			<a
				href="/tournaments/"
				class="card card-tournaments"
				aria-label="Tournament Recap"
			>
				<div class="card-accent-bar"></div>
				<div class="card-icon-row">
					<div class="card-icon"><Swords class="size-5" /></div>
				</div>
				<div class="card-body">
					<h2 class="card-title">Tournament Recap</h2>
					<p class="card-desc">Recap of the 2026 Aphonos Playoffs.</p>
				</div>
				<div class="card-footer">
					<span class="card-link"
						>View Recap<ArrowRight class="size-3.5" /></span
					>
				</div>
			</a>

			<a
				href="/page-resources/"
				class="card card-resources"
				aria-label="Page Resources"
			>
				<div class="card-accent-bar"></div>
				<div class="card-icon-row">
					<div class="card-icon"><Wrench class="size-5" /></div>
				</div>
				<div class="card-body">
					<h2 class="card-title">Page Resources</h2>
					<p class="card-desc">
						Access and download game assets, icons, and thumbnails
						for wiki pages.
					</p>
				</div>
				<div class="card-footer">
					<span class="card-link"
						>Browse Tool<ArrowRight class="size-3.5" /></span
					>
				</div>
			</a>

			<a
				href="https://alter-ego.fandom.com/wiki/"
				target="_blank"
				rel="noopener noreferrer"
				class="card card-wiki"
				aria-label="ALTER EGO Wiki"
			>
				<div class="card-accent-bar"></div>
				<div class="card-icon-row">
					<div class="card-icon"><Book class="size-5" /></div>
					<div class="card-badge">Fandom</div>
				</div>
				<div class="card-body">
					<h2 class="card-title">ALTER EGO Wiki</h2>
					<p class="card-desc">
						Visit ALTER EGO Wiki and ALTERPEDIA!
					</p>
				</div>
				<div class="card-footer">
					<span class="card-link"
						>Visit Wiki<ExternalLink class="size-3.5" /></span
					>
				</div>
			</a>

			<a
				href="https://tds.wiki/w/"
				target="_blank"
				rel="noopener noreferrer"
				class="card card-wiki"
				aria-label="Tower Defense Simulator Wiki"
			>
				<div class="card-accent-bar"></div>
				<div class="card-icon-row">
					<div class="card-icon"><Book class="size-5" /></div>
				</div>
				<div class="card-body">
					<h2 class="card-title">Tower Defense Simulator</h2>
					<p class="card-desc">
						The official Tower Defense Simulator Wiki!
					</p>
				</div>
				<div class="card-footer">
					<span class="card-link"
						>Visit Wiki<ExternalLink class="size-3.5" /></span
					>
				</div>
			</a>

			<a
				href="https://x.com/isALTEREGOout"
				target="_blank"
				rel="noopener noreferrer"
				class="card card-twitter"
				aria-label="Fan Page on X"
			>
				<div class="card-accent-bar"></div>
				<div class="card-icon-row">
					<div class="card-icon">
						<MessageCircle class="size-5" />
					</div>
					<div class="card-badge">X</div>
				</div>
				<div class="card-body">
					<h2 class="card-title">Fan Page</h2>
					<p class="card-desc">
						Stay updated with the latest ALTER EGO news and
						community discussions.
					</p>
				</div>
				<div class="card-footer">
					<span class="card-link"
						>Follow Us<ExternalLink class="size-3.5" /></span
					>
				</div>
			</a>

			<a
				href="https://aeb.tds-editor.com/"
				target="_blank"
				rel="noopener noreferrer"
				class="card card-game"
				aria-label="ALTER EGO: Before"
			>
				<div class="card-accent-bar"></div>
				<div class="card-icon-row">
					<div class="card-icon"><Gamepad2 class="size-5" /></div>
				</div>
				<div class="card-body">
					<h2 class="card-title">ALTER EGO: Before</h2>
					<p class="card-desc">
						Play our first tech demo of the ALTER EGO (that is
						mostly TDS...) fan game.
					</p>
				</div>
				<div class="card-footer">
					<span class="card-link"
						>Play Demo<ExternalLink class="size-3.5" /></span
					>
				</div>
			</a>
		</div>
	</section>

	<section class="discord-section">
		<div class="section-label">Community</div>
		<div class="discord-layout">
			<div class="discord-copy">
				<h2 class="discord-heading">Enter the Asylum!</h2>
				<p class="discord-sub">
					Join us and many other Alter Egoists, in the most delusional
					and unhinged yet also insightful and informative, Discord
					server!
				</p>
				<ul class="discord-perks">
					<li>What's in there, you may ask? Well, we got:</li>
					<li>
						<span class="perk-dot"></span> A welcoming community..!
					</li>
					<li>
						<span class="perk-dot"></span> General tomfoolery...
					</li>
					<li>
						<span class="perk-dot"></span> A lot of crackpot theories...
					</li>
					<li>
						<span class="perk-dot"></span> Random people getting beaten
						up...
					</li>
					<li>
						<span class="perk-dot"></span> Ocassional philosophical discussions!
					</li>
					<li>
						<span class="perk-dot"></span> The most recent news for ALTER
						EGO, of course!
					</li>
				</ul>
			</div>
			<DiscordWidget />
		</div>
	</section>
</PageShell>

<style>
	.hero {
		text-align: center;
		padding: 5rem 1rem 1.5rem;
		animation: fadeUp 0.7s ease-out both;
	}

	.hero-title {
		display: flex;
		flex-direction: column;
		align-items: center;
		line-height: 1;
		margin-bottom: 1.25rem;
		font-family: var(--font-heading);
	}

	.hero-title-line1 {
		font-size: clamp(1.8rem, 5vw, 3rem);
		font-weight: 700;
		color: var(--muted-foreground);
		letter-spacing: -0.01em;
	}

	.hero-title-line2 {
		font-size: clamp(2.8rem, 9vw, 6rem);
		font-weight: 800;
		letter-spacing: -0.03em;
		color: var(--foreground);
		position: relative;
		line-height: 1.05;

		&::after {
			content: "";
			position: absolute;
			bottom: 6px;
			left: 0;
			right: 0;
			height: 3px;
			background: linear-gradient(
				to right,
				var(--primary),
				oklch(0.6 0.12 20)
			);
			border-radius: 2px;
			z-index: -1;
		}
	}

	.hero-sub {
		font-size: 1.05rem;
		color: var(--muted-foreground);
		max-width: 520px;
		margin: 1.5rem auto 2rem;
		line-height: 1.6;
	}

	.cards-section {
		margin-bottom: 4rem;
		animation: fadeUp 0.7s ease-out 0.15s both;
	}

	.cards-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1rem;

		@media (width < 56.25rem) {
			grid-template-columns: repeat(2, 1fr);
		}

		@media (width < 37.5rem) {
			grid-template-columns: 1fr;
		}
	}

	.card {
		position: relative;
		display: flex;
		flex-direction: column;
		padding: 1.5rem;
		border-radius: 12px;
		border: 1px solid var(--border);
		background: var(--card);
		color: var(--card-foreground);
		text-decoration: none;
		overflow: hidden;
		transition:
			transform 0.25s,
			box-shadow 0.25s,
			border-color 0.25s;
		cursor: pointer;
		--card-accent: var(--primary);

		&:hover {
			transform: translateY(-4px);
			box-shadow:
				0 12px 40px oklch(0 0 0 / 0.15),
				0 0 0 1px var(--card-accent);
			border-color: var(--card-accent);
			color: var(--card-foreground);

			.card-accent-bar {
				opacity: 1;
			}

			.card-icon {
				background: oklch(from var(--card-accent) l c h / 0.2);
			}

			.card-link {
				gap: 0.5rem;
			}
		}

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

		&.card-featured {
			grid-column: span 2;

			.card-title {
				font-size: 1.4rem;
			}

			@media (width < 37.5rem) {
				grid-column: span 1;
			}
		}

		&.card-game {
			--card-accent: oklch(0.55 0.15 300);
		}

		&.card-recap {
			--card-accent: oklch(0.55 0.18 20);
		}

		&.card-deathbattle {
			--card-accent: oklch(0.55 0.15 60);
		}

		&.card-resources {
			--card-accent: oklch(0.5 0.1 220);
		}

		&.card-tournaments {
			--card-accent: oklch(0.55 0.15 300);
		}

		&.card-wiki {
			--card-accent: oklch(0.55 0.15 140);
		}

		&.card-twitter {
			--card-accent: oklch(0.55 0.05 220);
		}
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
		opacity: 0;
		transition: opacity 0.25s;
	}

	.card-icon-row {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
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
		transition: background 0.2s;
		flex-shrink: 0;
	}

	.card-badge {
		font-size: 0.65rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		padding: 0.2rem 0.5rem;
		border-radius: 4px;
		background: var(--muted);
		color: var(--muted-foreground);
	}

	.card-body {
		flex: 1;
	}

	.card-title {
		font-size: 1.05rem;
		font-weight: 700;
		color: var(--foreground);
		margin: 0 0 0.4rem;
		font-family: var(--font-heading);
		letter-spacing: -0.01em;
		line-height: 1.2;
	}

	.card-desc {
		font-size: 0.85rem;
		color: var(--muted-foreground);
		line-height: 1.55;
		margin: 0;
	}

	.card-footer {
		margin-top: 1.25rem;
		padding-top: 1rem;
		border-top: 1px solid var(--border);
	}

	.card-link {
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
		font-size: 0.82rem;
		font-weight: 600;
		color: var(--card-accent);
		transition: gap 0.2s;
	}

	.discord-section {
		animation: fadeUp 0.7s ease-out 0.3s both;
	}

	.discord-layout {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 3rem;
		align-items: start;

		@media (width < 56.25rem) {
			grid-template-columns: 1fr;
			gap: 2rem;
		}
	}

	.discord-heading {
		font-size: 1.75rem;
		font-weight: 800;
		font-family: var(--font-heading);
		letter-spacing: -0.02em;
		margin: 0 0 0.75rem;
		line-height: 1.15;
	}

	.discord-sub {
		font-size: 0.9rem;
		color: var(--muted-foreground);
		line-height: 1.6;
		margin: 0 0 1.5rem;
	}

	.discord-perks {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.6rem;

		li {
			display: flex;
			align-items: center;
			gap: 0.6rem;
			font-size: 0.875rem;
			color: var(--muted-foreground);
		}
	}

	.perk-dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--primary);
		flex-shrink: 0;
	}
</style>
