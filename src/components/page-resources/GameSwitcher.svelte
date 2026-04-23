<script lang="ts">
	import { Bird, Gamepad2 } from "@lucide/svelte";
	import * as Card from "$lib/components/ui/card/index.js";
	import type { GameType } from "../../modules/types.js";

	let {
		currentGame,
		onGameSwitch,
	}: {
		currentGame: GameType;
		onGameSwitch: (game: GameType) => void;
	} = $props();

	const games = [
		{
			key: "TDS" as GameType,
			name: "Tower Defense Simulator",
			icon: Bird,
		},
		{
			key: "AE" as GameType,
			name: "ALTER EGO",
			icon: Bird,
		},
	];
</script>

<div class="game-switcher">
	<Card.Root class="h-full">
		<Card.Header>
			<div class="tds-icon-well tds-icon-well--muted">
				<Gamepad2 />
			</div>
			<div>
				<Card.Title>Select Game</Card.Title>
				<Card.Description
					>Switch the active resource source.</Card.Description
				>
			</div>
		</Card.Header>

		<Card.Content>
			{#each games as game}
				<button
					type="button"
					class:selected={currentGame === game.key}
					class="game-option"
					onclick={() => onGameSwitch(game.key)}
					aria-pressed={currentGame === game.key}
				>
					<div class="tds-inline-title tds-inline-title--center">
						<div class="tds-icon-well tds-icon-well--accent">
							<game.icon />
						</div>
						<div class="option-text">
							<div class="option-title">{game.name}</div>
						</div>
					</div>

					<span class="option-badge">
						{currentGame === game.key ? "Selected" : "Switch"}
					</span>
				</button>
			{/each}
		</Card.Content>
	</Card.Root>
</div>

<style>
	.game-switcher :global([data-slot="card-header"]) {
		display: flex;
		align-items: flex-start;
		gap: 0.9rem;
	}

	.game-switcher :global([data-slot="card-content"]) {
		display: grid;
		gap: 0.85rem;
	}

	.game-option {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 1rem;
		border: 1px solid var(--border);
		border-radius: 1rem;
		background: color-mix(in oklab, var(--card) 92%, transparent);
		text-align: left;
		cursor: pointer;
		transition:
			border-color 0.2s ease,
			background 0.2s ease,
			transform 0.2s ease;

		&:hover {
			background: var(--muted);
			transform: translateY(-1px);
		}

		&.selected {
			border-color: color-mix(
				in oklab,
				var(--primary) 65%,
				var(--border)
			);
			background: color-mix(in oklab, var(--primary) 9%, var(--card));
		}
	}

	.option-text {
		min-width: 0;
	}

	.option-title {
		font-size: 0.95rem;
		font-weight: 700;
		color: var(--foreground);
	}

	.option-badge {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.45rem 0.75rem;
		border-radius: 999px;
		font-size: 0.78rem;
		font-weight: 700;
		border: 1px solid var(--border);
		background: var(--background);
		color: var(--foreground);

		.game-option.selected & {
			background: var(--primary);
			border-color: var(--primary);
			color: var(--primary-foreground);
		}
	}

	@media (max-width: 640px) {
		.game-option {
			flex-direction: column;
			align-items: stretch;
		}
	}
</style>
