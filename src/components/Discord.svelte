<script lang="ts">
	import { onMount } from 'svelte';

	interface DiscordMember {
		id: string;
		username: string;
		status: 'online' | 'idle' | 'dnd' | 'offline';
		avatar_url: string;
	}

	interface DiscordWidgetData {
		name: string;
		instant_invite: string | null;
		members: DiscordMember[];
		presence_count: number;
	}

	const GUILD_ID = '1362084781134708907';
	const INVITE_CODE = 'yfZUQ3h4cf';

	let widgetData = $state<DiscordWidgetData | null>(null);
	let serverIconUrl = $state<string | null>(null);
	let loading = $state(true);
	let failed = $state(false);

	onMount(async () => {
		try {
			const [widgetRes, inviteRes] = await Promise.all([
				fetch(`https://discord.com/api/guilds/${GUILD_ID}/widget.json`),
				fetch(`https://discord.com/api/v10/invites/${INVITE_CODE}`)
			]);

		if (!widgetRes.ok) throw new Error(`Status ${widgetRes.status}`);
		widgetData = await widgetRes.json();

		if (inviteRes.ok) {
			const inviteData = await inviteRes.json();
				const icon = inviteData.guild?.icon;
				if (icon) {
					const ext = icon.startsWith('a_') ? 'gif' : 'png';
						serverIconUrl = `https://cdn.discordapp.com/icons/${GUILD_ID}/${icon}.${ext}?size=64`;
					}
				}
			} catch (e) {
				console.warn('[DiscordWidget] Failed to load:', e);
				failed = true;
			} finally {
				loading = false;
			}
	});

	const onlineCount = $derived(
		widgetData?.members.filter(m => m.status === 'online').length ?? 0
	);

	const displayMembers = $derived(widgetData?.members.slice(0, 24) ?? []);
</script>

<div class="discord-shell">
	<div class="discord-inner">
		<!-- Header -->
		<div class="dc-header">
			{#if serverIconUrl}
			<img
					src={serverIconUrl}
					alt="Server Icon"
					class="dc-server-icon"
			/>
			{:else}
				<div class="dc-server-icon" style="background: #5865F2;"></div>
			{/if}
			<div>
				<div class="dc-server-name">
					{loading ? 'Loading...' : (widgetData?.name ?? 'ALTER EGO Wiki Discord')}
				</div>
				<div class="dc-server-sub">We are the proudly delusional, insane, and asinine patients of Angel Wing Hospital!</div>
			</div>
		</div>

		{#if loading}
			<div class="dc-loading">
				<div class="dc-spinner"></div>
				<span>Connecting to server...</span>
			</div>
		{:else if failed || !widgetData}
			<p class="dc-fallback-text">
				Join our Discord to chat with other fans, get updates, and help build the ultimate ALTER EGO resource!
			</p>
		{:else}
			<!-- Stats -->
			<div class="dc-stats">
				<div class="dc-stat">
					<span class="dc-dot dot-online"></span>
					<strong>{onlineCount}</strong> online
				</div>
				<div class="dc-stat">
					<span class="dc-dot dot-all"></span>
					<strong>{widgetData.presence_count}</strong> active now
				</div>
			</div>

			<!-- Members -->
			{#if displayMembers.length > 0}
				<div class="dc-members">
					{#each displayMembers as member}
						<div class="dc-member" title={member.username}>
							<span class="dc-member-dot {member.status}"></span>
							<span class="dc-member-name">{member.username}</span>
						</div>
					{/each}
					{#if (widgetData.members.length ?? 0) > 24}
						<div class="dc-member dc-member-more">
							+{widgetData.members.length - 24} more
						</div>
					{/if}
				</div>
			{/if}
		{/if}

		<a href='https://discord.com/invite/{INVITE_CODE}' target="_blank" rel="noopener noreferrer" class="dc-join-btn">
		<svg class="dc-discord-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
				<path d="M13.545 2.907a13.2 13.2 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.2 12.2 0 0 0-3.658 0 8 8 0 0 0-.412-.833.05.05 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.04.04 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032q.003.022.021.037a13.3 13.3 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019q.463-.63.818-1.329a.05.05 0 0 0-.01-.059l-.018-.011a9 9 0 0 1-1.248-.595.05.05 0 0 1-.02-.066l.015-.019q.127-.095.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.05.05 0 0 1 .053.007q.121.1.248.195a.05.05 0 0 1-.004.085 8 8 0 0 1-1.249.594.05.05 0 0 0-.03.03.05.05 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.2 13.2 0 0 0 4.001-2.02.05.05 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.03.03 0 0 0-.02-.019m-8.198 7.307c-.789 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612m5.316 0c-.788 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612"/>
		</svg>Join the Discord
		</a>
	</div>
</div>

<style>
	:root {
		--discord-brand: oklch(0.5774 0.2091 273.85);
	}

	.discord-shell {
		background: linear-gradient(
			135deg,
			var(--discord-brand) 0%,
			color-mix(in oklch, var(--discord-brand), white 10%) 50%,
			color-mix(in oklch, var(--discord-brand), white 30%) 100%
		);
		border-radius: 1em;
		padding: .125em;
	}

	.discord-inner {
		background: oklch(18% 0.01 240);
		border-radius: .875em;
		padding: 1.5em;
		display: flex;
		flex-direction: column;
		gap: 1em;
	}

	.dc-header {
		display: flex;
		align-items: center;
		gap: .75em;
	}

	.dc-server-icon {
		width: 3em;
		height: 3em;
		border-radius: 50%;
		border: .125em solid rgba(255,255,255,.15);
	}

	.dc-server-name {
		font-weight: 700;
		color: oklch(100% 0 0);
		font-size: 1em;
		line-height: 1.2;
	}

	.dc-server-sub {
		font-size: .75em;
		color: oklch(78% 0.02 240);
	}

	.dc-loading {
		display: flex;
		align-items: center;
		gap: .5em;
		color: oklch(78% 0.02 240);
		font-size: .85em;
	}

	.dc-spinner {
		width: 1em;
		height: 1em;
		border: .125em solid rgba(255,255,255,.15);
		border-top-color: color-mix(in oklch, var(--discord-brand), white 20%);
		border-radius: 50%;
		animation: spin .8s linear infinite;
	}

	@keyframes spin {
		to { transform: rotate(360deg); }
	}

	.dc-fallback-text {
		color: oklch(78% 0.02 240);
		font-size: .9em;
		line-height: 1.5;
		margin: 0;
	}

	.dc-stats {
		display: flex;
		gap: 1.5em;
	}

	.dc-stat {
		display: flex;
		align-items: center;
		gap: .4em;
		color: oklch(78% 0.02 240);
		font-size: .85em;

		strong {
			color: oklch(100% 0 0);
		}
	}


	.dc-dot {
		display: inline-block;
		width: .5em;
		height: .5em;
		border-radius: 50%;
	}

	.dot-online { background: oklch(78% 0.22 145); }
	.dot-all	{ background: oklch(78% 0.02 240); }

	.dc-members {
		display: flex;
		flex-wrap: wrap;
		gap: .4em;
		max-height: 6.25em;
		overflow: auto;
	}

	.dc-member {
		display: flex;
		align-items: center;
		gap: .3em;
		background: rgba(255,255,255,.07);
		border-radius: 1.25em;
		padding: .2em .6em;
		font-size: .78em;
		color: oklch(88% 0.01 240);
	}

	.dc-member-dot {
		display: inline-block;
		width: .4375em;
		height: .4375em;
		border-radius: 50%;
		flex-shrink: 0;

		&.online  { background: oklch(78% 0.22 145); }
		&.idle	  { background: oklch(85% 0.18 85);  }
		&.dnd	  { background: oklch(60% 0.2 15);   }
		&.offline { background: oklch(52% 0.03 240); }
	}

	.dc-member-name {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: 5.625em;
	}

	.dc-member-more {
		color: oklch(78% 0.02 240);
		font-style: italic;
	}

	.dc-join-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: .5em;
		background: var(--discord-brand);
		color: oklch(100% 0 0);
		font-weight: 600;
		font-size: .95em;
		padding: .65em 1.5em;
		border-radius: .5em;
		text-decoration: none;
		transition: background .2s, transform .2s;
		border: none;

		&:hover {
			background: color-mix(in oklch, var(--discord-brand), black 12%);
			transform: translateY(-.0625em);
			color: oklch(100% 0 0);
			text-decoration: none;
		}
	}

	.dc-discord-icon {
		width: 1.25em;
		height: 1.25em;
		flex-shrink: 0;
	}
</style>
