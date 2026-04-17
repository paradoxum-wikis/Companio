<script lang="ts">
  import { onMount } from 'svelte';
  import Trophy from '@lucide/svelte/icons/trophy';
  import Book from '@lucide/svelte/icons/book';
  import MessageCircle from '@lucide/svelte/icons/message-circle';
  import Gamepad2 from '@lucide/svelte/icons/gamepad-2';
  import Zap from '@lucide/svelte/icons/zap';
  import Wrench from '@lucide/svelte/icons/wrench';
  import ArrowRight from '@lucide/svelte/icons/arrow-right';
  import ExternalLink from '@lucide/svelte/icons/external-link';

  onMount(async () => {
    await import('../components/discord');
  });
</script>

<svelte:head>
  <title>ALTER EGO Wiki Companion</title>
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
  <meta property="og:title" content="ALTER EGO Wiki Companion" />
  <meta
    property="og:description"
    content="The companion site for the ALTER EGO Wiki. Access weekly contributor leaderboards, browse the ALTERPEDIA, and join our Discord community."
  />
  <meta property="og:image" content="https://ae.tds-editor.com/banner.png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="ALTER EGO Wiki - Join our community" />
  <meta property="og:site_name" content="ALTER EGO Wiki Companion" />
  <meta property="og:locale" content="en_US" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@isALTEREGOout" />
  <meta name="twitter:creator" content="@isALTEREGOout" />
  <meta name="twitter:title" content="ALTER EGO Wiki Companion" />
  <meta
    name="twitter:description"
    content="The companion site for the ALTER EGO Wiki. Access weekly contributor leaderboards, browse the ALTERPEDIA, and join our Discord community."
  />
  <meta name="twitter:image" content="https://ae.tds-editor.com/banner.png" />
  <meta name="twitter:image:alt" content="ALTER EGO Wiki - Join our community" />

  <meta name="theme-color" content="#900c3f" />
  <meta name="apple-mobile-web-app-title" content="AEWiki Companion" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

  <link rel="canonical" href="https://ae.tds-editor.com/" />
  <link
    rel="icon"
    href="https://static.wikia.nocookie.net/alter-ego/images/4/4a/Site-favicon.ico"
  />
  <link
    rel="apple-touch-icon"
    href="https://static.wikia.nocookie.net/alter-ego/images/4/4a/Site-favicon.ico"
  />

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link
    href="https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,300..900;1,300..900&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<main class="relative isolate px-6 pt-16 pb-24 sm:pt-24 sm:pb-32 lg:px-8">
  <!-- Hero Section -->
  <div class="mx-auto max-w-7xl text-center">
    <div class="mb-10 flex justify-center">
      <img
        src="/wikilogo.png"
        alt="ALTER EGO Wiki Logo"
        class="h-28 sm:h-36 object-contain drop-shadow-xl hover:scale-105 transition-transform duration-500"
      />
    </div>
    <h1 class="text-4xl font-extrabold tracking-tight sm:text-6xl mb-6 text-foreground">
      Welcome, <span class="text-transparent bg-clip-text bg-linear-to-r from-primary to-accent">Alter Egoist!</span>
    </h1>
    <p class="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-16 leading-relaxed">
      Explore the ALTER EGO Wiki ecosystem with our various tools and resources on this companion site.
    </p>
  </div>

  <!-- Interactive Grid -->
  <div class="mx-auto max-w-6xl">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">

      <!-- Card 1 -->
      <a href="/recap/" class="group relative flex flex-col items-start justify-between rounded-2xl border border-border bg-card p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-primary overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <div class="rounded-xl bg-primary/10 p-3 text-primary mb-6 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
          <Trophy class="size-6" />
        </div>
        <div>
          <h3 class="text-xl font-bold text-card-foreground mb-3">Weekly Recap</h3>
          <p class="text-muted-foreground text-sm leading-relaxed mb-6">
            Discover top contributors and weekly statistics from the ALTERPEDIA.
          </p>
        </div>
        <div class="mt-auto flex items-center text-sm font-semibold text-primary">
          View Leaderboard <ArrowRight class="ml-1.5 size-4 transition-transform group-hover:translate-x-1" />
        </div>
      </a>

      <!-- Card 2 -->
      <a href="https://alter-ego.fandom.com/wiki/" target="_blank" rel="noopener noreferrer" class="group relative flex flex-col items-start justify-between rounded-2xl border border-border bg-card p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-primary overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <div class="rounded-xl bg-primary/10 p-3 text-primary mb-6 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
          <Book class="size-6" />
        </div>
        <div>
          <h3 class="text-xl font-bold text-card-foreground mb-3">ALTER EGO Wiki</h3>
          <p class="text-muted-foreground text-sm leading-relaxed mb-6">
            Visit the ALTERPEDIA for ALTER EGO content and perhaps even contribute to the community!
          </p>
        </div>
        <div class="mt-auto flex items-center text-sm font-semibold text-primary">
          Browse Wiki <ExternalLink class="ml-1.5 size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </div>
      </a>

      <!-- Card 3 -->
      <a href="https://x.com/isALTEREGOout" target="_blank" rel="noopener noreferrer" class="group relative flex flex-col items-start justify-between rounded-2xl border border-border bg-card p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-primary overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <div class="rounded-xl bg-primary/10 p-3 text-primary mb-6 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
          <MessageCircle class="size-6" />
        </div>
        <div>
          <h3 class="text-xl font-bold text-card-foreground mb-3">Fan Page</h3>
          <p class="text-muted-foreground text-sm leading-relaxed mb-6">
            Stay updated with the latest ALTER EGO news and community discussions.
          </p>
        </div>
        <div class="mt-auto flex items-center text-sm font-semibold text-primary">
          Follow Us! <ExternalLink class="ml-1.5 size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </div>
      </a>

      <!-- Card 4 -->
      <a href="https://aeb.tds-editor.com/" target="_blank" rel="noopener noreferrer" class="group relative flex flex-col items-start justify-between rounded-2xl border border-border bg-card p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-primary overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <div class="rounded-xl bg-primary/10 p-3 text-primary mb-6 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
          <Gamepad2 class="size-6" />
        </div>
        <div>
          <h3 class="text-xl font-bold text-card-foreground mb-3">ALTER EGO: Before</h3>
          <p class="text-muted-foreground text-sm leading-relaxed mb-6">
            Play the first tech demo of the ALTER EGO fan game made by us!
          </p>
        </div>
        <div class="mt-auto flex items-center text-sm font-semibold text-primary">
          Play Game <ExternalLink class="ml-1.5 size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </div>
      </a>

      <!-- Card 5 -->
      <a href="/deathbattle/" class="group relative flex flex-col items-start justify-between rounded-2xl border border-border bg-card p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-primary overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <div class="rounded-xl bg-primary/10 p-3 text-primary mb-6 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
          <Zap class="size-6" />
        </div>
        <div>
          <h3 class="text-xl font-bold text-card-foreground mb-3">Deathbattle Statistics</h3>
          <p class="text-muted-foreground text-sm leading-relaxed mb-6">
            View combat statistics and leaderboards from our Discord ALTERSHAPER bot.
          </p>
        </div>
        <div class="mt-auto flex items-center text-sm font-semibold text-primary">
          View Statistics <ArrowRight class="ml-1.5 size-4 transition-transform group-hover:translate-x-1" />
        </div>
      </a>

      <!-- Card 6 -->
      <a href="/page-resources/" class="group relative flex flex-col items-start justify-between rounded-2xl border border-border bg-card p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-primary overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <div class="rounded-xl bg-primary/10 p-3 text-primary mb-6 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
          <Wrench class="size-6" />
        </div>
        <div>
          <h3 class="text-xl font-bold text-card-foreground mb-3">Page Resources</h3>
          <p class="text-muted-foreground text-sm leading-relaxed mb-6">
            Access various tools and resources for game pages.
          </p>
        </div>
        <div class="mt-auto flex items-center text-sm font-semibold text-primary">
          Open Resources <ArrowRight class="ml-1.5 size-4 transition-transform group-hover:translate-x-1" />
        </div>
      </a>

    </div>
  </div>

  <!-- Community Section -->
  <div class="mx-auto max-w-4xl pt-10 border-t border-border/50">
    <div class="text-center mb-10">
      <h2 class="text-3xl font-extrabold tracking-tight text-foreground">Join the Community</h2>
      <p class="text-muted-foreground mt-3 text-lg">Connect with other Alter Egoists on our Discord server.</p>
    </div>

    <div class="rounded-2xl border border-border bg-card shadow-sm overflow-hidden flex items-center justify-center p-2 sm:p-6 bg-gradient-to-b from-card to-muted/20">
      <div class="discord-widget w-full min-h-75 flex items-center justify-center rounded-xl" id="discordWidget">
        <div class="flex flex-col items-center text-muted-foreground">
          <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mb-4"></div>
          <span class="font-medium">Loading Discord server...</span>
        </div>
      </div>
    </div>
  </div>
</main>
