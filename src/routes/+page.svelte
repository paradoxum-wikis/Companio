<script lang="ts">
	import {
		Zap,
		Trophy,
		Book,
		MessageCircle,
		Gamepad2,
		Wrench,
		ArrowRight,
		ExternalLink,
	} from "@lucide/svelte";
	import DiscordWidget from "$lib/components/Discord.svelte";
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
	<meta name="theme-color" content="#900c3f" />
	<meta name="apple-mobile-web-app-title" content="AEWiki Companion" />
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<meta
		name="apple-mobile-web-app-status-bar-style"
		content="black-translucent"
	/>
	<link rel="canonical" href="https://ae.tds-editor.com/" />
	<link rel="apple-touch-icon" href="favicon.png" />
	<link rel="icon" href="favicon.png" />
</svelte:head>

<div class="page-root">
	<!-- Background mesh -->
	<div class="bg-mesh" aria-hidden="true">
		<div class="mesh-orb orb-1"></div>
		<div class="mesh-orb orb-2"></div>
		<div class="mesh-orb orb-3"></div>
		<div class="grid-lines"></div>
	</div>

	<main>
		<!-- Hero -->
		<section class="hero">
			<h1 class="hero-title">
				<span class="hero-title-line1">Welcome,</span>
				<span class="hero-title-line2">Alter Egoist</span>
			</h1>

			<p class="hero-sub">
				To the companio! For the more quirky things of ALTER EGO Wiki
				and Tower Defense Simulator Wiki!.<br />(/▿＼)
			</p>
		</section>

		<!-- Main grid -->
		<section class="cards-section">
			<div class="section-label">Tools & Resources</div>

			<div class="cards-grid">
				<!-- Weekly Recap -->
				<a
					href="/recap/"
					class="card card-featured card-recap"
					aria-label="Weekly Recap"
				>
					<div class="card-accent-bar"></div>
					<div class="card-icon-row">
						<div class="card-icon">
							<Trophy />
						</div>
					</div>
					<div class="card-body">
						<h2 class="card-title">Weekly Recap</h2>
						<p class="card-desc">
							Browse the contributor leaderboard and track who's
							been building the ALTERPEDIA each week.
						</p>
					</div>
					<div class="card-footer">
						<span class="card-link"
							>Browse Tool<ArrowRight class="link-icon" /></span
						>
					</div>
				</a>

				<!-- Deathbattle -->
				<a
					href="/deathbattle/"
					class="card card-deathbattle"
					aria-label="Deathbattle Statistics"
				>
					<div class="card-accent-bar"></div>
					<div class="card-icon-row">
						<div class="card-icon">
							<Zap />
						</div>
					</div>
					<div class="card-body">
						<h2 class="card-title">Deathbattle Stats</h2>
						<p class="card-desc">
							Combat stats and rankings from the ALTERSHAPER
							Discord bot.
						</p>
					</div>
					<div class="card-footer">
						<span class="card-link"
							>Browse Tool<ArrowRight class="link-icon" /></span
						>
					</div>
				</a>

				<!-- Page Resources -->
				<a
					href="/page-resources/"
					class="card card-resources"
					aria-label="Page Resources"
				>
					<div class="card-accent-bar"></div>
					<div class="card-icon-row">
						<div class="card-icon">
							<Wrench />
						</div>
					</div>
					<div class="card-body">
						<h2 class="card-title">Page Resources</h2>
						<p class="card-desc">
							Access and download game assets, icons, and
							thumbnails for wiki pages.
						</p>
					</div>
					<div class="card-footer">
						<span class="card-link"
							>Browse Tool<ArrowRight class="link-icon" /></span
						>
					</div>
				</a>

				<!-- ALTERPEDIA -->
				<a
					href="https://alter-ego.fandom.com/wiki/"
					target="_blank"
					rel="noopener noreferrer"
					class="card card-wiki"
					aria-label="ALTER EGO Wiki"
				>
					<div class="card-accent-bar"></div>
					<div class="card-icon-row">
						<div class="card-icon">
							<Book />
						</div>
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
							>Visit Wiki<ExternalLink class="link-icon" /></span
						>
					</div>
				</a>

				<!-- TDS Wiki -->
				<a
					href="https://tds.fandom.com/wiki/"
					target="_blank"
					rel="noopener noreferrer"
					class="card card-wiki"
					aria-label="Tower Defense Simulator Wiki"
				>
					<div class="card-accent-bar"></div>
					<div class="card-icon-row">
						<div class="card-icon">
							<Book />
						</div>
						<div class="card-badge">Fandom</div>
					</div>
					<div class="card-body">
						<h2 class="card-title">Tower Defense Simulator</h2>
						<p class="card-desc">
							The official Tower Defense Simulator Wiki!
						</p>
					</div>
					<div class="card-footer">
						<span class="card-link"
							>Visit Wiki<ExternalLink class="link-icon" /></span
						>
					</div>
				</a>

				<!-- X page -->
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
							<MessageCircle />
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
							>Follow Us<ExternalLink class="link-icon" /></span
						>
					</div>
				</a>

				<!-- AE Before -->
				<a
					href="https://aeb.tds-editor.com/"
					target="_blank"
					rel="noopener noreferrer"
					class="card card-game"
					aria-label="ALTER EGO: Before"
				>
					<div class="card-accent-bar"></div>
					<div class="card-icon-row">
						<div class="card-icon">
							<Gamepad2 />
						</div>
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
							>Play Demo<ExternalLink class="link-icon" /></span
						>
					</div>
				</a>
			</div>
		</section>

		<!-- Discord -->
		<section class="discord-section">
			<div class="section-label">Community</div>
			<div class="discord-layout">
				<div class="discord-copy">
					<h2 class="discord-heading">Enter the Asylum!</h2>
					<p class="discord-sub">
						Join us and many other Alter Egoists, in the most
						delusional and unhinged yet also insightful and
						informative, Discord server!
					</p>
					<ul class="discord-perks">
						<li>What's in there, you may ask? Well, we got:</li>
						<li>
							&nbsp;<span class="perk-dot"></span> A welcoming community..!
						</li>
						<li>
							&nbsp;<span class="perk-dot"></span> General tomfoolery...
						</li>
						<li>
							&nbsp;<span class="perk-dot"></span> A lot of crackpot
							theories...
						</li>
						<li>
							&nbsp;<span class="perk-dot"></span> Random people getting
							beaten up...
						</li>
						<li>
							&nbsp;<span class="perk-dot"></span> Ocassional philosophical
							discussions!
						</li>
						<li>
							&nbsp;<span class="perk-dot"></span> The most recent news
							for ALTER EGO, of course!
						</li>
					</ul>
				</div>
				<DiscordWidget />
			</div>
		</section>
	</main>
</div>

<style lang="scss">
	.page-root {
		min-height: 100vh;
		position: relative;
		overflow-x: hidden;
	}

	.bg-mesh {
		position: fixed;
		inset: 0;
		pointer-events: none;
		z-index: 0;
		overflow: hidden;
	}

	.mesh-orb {
		position: absolute;
		border-radius: 50%;
		filter: blur(80px);
		opacity: 0.15;
	}

	.orb-1 {
		width: 600px;
		height: 600px;
		top: -200px;
		right: -100px;
		background: radial-gradient(
			circle,
			oklch(0.45 0.18 20),
			transparent 70%
		);
		animation: drift1 18s ease-out infinite alternate;
	}

	.orb-2 {
		width: 500px;
		height: 500px;
		bottom: 0;
		left: -150px;
		background: radial-gradient(
			circle,
			oklch(0.35 0.12 30),
			transparent 70%
		);
		animation: drift2 22s ease-out infinite alternate;
	}

	.orb-3 {
		width: 400px;
		height: 400px;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background: radial-gradient(
			circle,
			oklch(0.4 0.08 350),
			transparent 70%
		);
		animation: drift3 26s ease-out infinite alternate;
		opacity: 0.08;
	}

	@keyframes drift1 {
		from {
			transform: translate(0, 0);
		}
		to {
			transform: translate(-40px, 60px);
		}
	}
	@keyframes drift2 {
		from {
			transform: translate(0, 0);
		}
		to {
			transform: translate(60px, -40px);
		}
	}
	@keyframes drift3 {
		from {
			transform: translate(-50%, -50%) scale(1);
		}
		to {
			transform: translate(-50%, -50%) scale(1.15);
		}
	}

	.grid-lines {
		position: absolute;
		inset: 0;
		background-image:
			linear-gradient(
				to right,
				oklch(0.5 0.02 35 / 0.04) 1px,
				transparent 1px
			),
			linear-gradient(
				to bottom,
				oklch(0.5 0.02 35 / 0.04) 1px,
				transparent 1px
			);
		background-size: 60px 60px;
	}

	main {
		position: relative;
		z-index: 1;
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 1.5rem 4rem;
	}

	.hero {
		text-align: center;
		padding: 5rem 1rem 1.5rem;
		animation: fadeUp 0.7s ease-out both;
	}

	@keyframes fadeUp {
		from {
			opacity: 0;
			transform: translateY(24px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
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
			bottom: -4px;
			left: 0;
			right: 0;
			height: 3px;
			background: linear-gradient(
				to right,
				var(--primary),
				oklch(0.6 0.12 20)
			);
			border-radius: 2px;
		}
	}

	.hero-sub {
		font-size: 1.05rem;
		color: var(--muted-foreground);
		max-width: 520px;
		margin: 1.5rem auto 2rem;
		line-height: 1.6;
	}

	.section-label {
		font-size: 0.68rem;
		font-weight: 700;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--primary);
		margin-bottom: 1.5rem;
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

		&::before {
			max-width: 2rem;
		}
	}

	.cards-section {
		margin-bottom: 4rem;
		animation: fadeUp 0.7s ease-out 0.15s both;
	}

	.cards-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		grid-template-rows: auto auto;
		gap: 1rem;
	}

	.card-featured {
		grid-column: span 2;
	}

	.card-game {
		grid-column: span 2;
	}

	.card {
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 0;
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
			text-decoration: none;
			color: var(--card-foreground);
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
	.card-twitter {
		--card-accent: oklch(0.55 0.05 220);
	}
	.card-game {
		--card-accent: oklch(0.55 0.15 300);
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

		.card:hover & {
			opacity: 1;
		}
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

		.card:hover & {
			background: oklch(from var(--card-accent) l c h / 0.2);
		}
	}

	.card-badge {
		font-size: 0.65rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
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

		.card-featured & {
			font-size: 1.4rem;
		}
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

		.card:hover & {
			gap: 0.5rem;
		}
	}

	:global(.link-icon) {
		width: 14px;
		height: 14px;
		flex-shrink: 0;
	}

	.discord-section {
		animation: fadeUp 0.7s ease-out 0.3s both;
	}

	.discord-layout {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 3rem;
		align-items: start;
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

	@media (max-width: 900px) {
		.cards-grid {
			grid-template-columns: repeat(2, 1fr);
		}

		.card-featured,
		.card-game {
			grid-column: span 2;
		}

		.discord-layout {
			grid-template-columns: 1fr;
			gap: 2rem;
		}
	}

	@media (max-width: 600px) {
		.cards-grid {
			grid-template-columns: 1fr;
		}

		.card-featured,
		.card-game {
			grid-column: span 1;
		}
	}
</style>
