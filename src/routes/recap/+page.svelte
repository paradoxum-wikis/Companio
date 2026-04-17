<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { RecapRenderer } from '../../components/recapRenderer.js';
  import { RecapService } from '../../components/recapService.js';
  import '../../styles/recap.css';

  let currentDate = $state('');
  let prevDisabled = $state(false);
  let nextDisabled = $state(true);
  let renderer: RecapRenderer;

  async function init() {
    renderer = new RecapRenderer();
    currentDate = await RecapService.getCurrentWeekDate();
    loadRecapData();
  }

  function navigateWeek(days: number): void {
    if (days < 0) {
      currentDate = RecapService.subtractDays(currentDate, Math.abs(days));
    } else {
      currentDate = RecapService.addDays(currentDate, days);
    }

    RecapService.updateUrlWithDate(currentDate);
    loadRecapData();
  }

  async function loadRecapData(): Promise<void> {
    renderer.showLoading();
    updateNavigationButtons();

    try {
      const data = await RecapService.fetchRecapData(currentDate);
      renderer.renderLeaderboard(data, currentDate);
    } catch (error) {
      console.error("Failed to load recap data:", error);
      let errorMessage = "Failed to load recap data.";

      if (error instanceof Error) {
        if (error.message.includes("404")) {
          errorMessage = "No recap data available for this date.";
        } else {
          errorMessage = error.message;
        }
      }

      renderer.showError(errorMessage, currentDate);
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
  <meta property="og:title" content="Weekly Recap | Paradoxum Wikis Companio" />
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
  <meta name="twitter:title" content="Weekly Recap | Paradoxum Wikis Companio" />
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

  <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Weekly Recap | Paradoxum Wikis Companio",
      "description": "Weekly contributor leaderboard for the ALTER EGO Wiki. Track top contributors and their weekly contributions.",
      "url": "https://ae.tds-editor.com/recap/",
      "isPartOf": {
        "@type": "WebSite",
        "name": "Paradoxum Wikis Companio",
        "url": "https://ae.tds-editor.com/"
      },
      "publisher": {
        "@type": "Organization",
        "name": "ALTER EGO Wiki Team"
      },
      "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://ae.tds-editor.com/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Weekly Recap",
            "item": "https://ae.tds-editor.com/recap/"
          }
        ]
      }
    }
  </script>
</svelte:head>

<main class="container mt-4">
  <div class="row">
    <div class="col-12">
      <div
        class="d-flex flex-column flex-md-row justify-content-md-between align-items-md-center mb-2 sticky-top py-2"
        style="
          margin-left: -0.5rem;
          margin-right: -0.5rem;
          background: var(--community-bg);
        "
      >
        <h1 class="h2 mb-3 mb-md-0">
          <i class="bi bi-trophy me-2"></i>
          Weekly Contributor Leaderboard
        </h1>

        <div class="d-flex flex-column flex-md-row gap-2">
          <button
            id="prevWeek"
            class="btn btn-outline-secondary"
            disabled={prevDisabled}
            onclick={() => navigateWeek(-7)}
            aria-label="Previous Week"
          >
            <i class="bi bi-chevron-left me-1"></i>
            <span class="d-none d-sm-inline">Previous Week</span>
            <span class="d-sm-none">Previous</span>
          </button>
          <button
            id="nextWeek"
            class="btn btn-outline-secondary"
            disabled={nextDisabled}
            onclick={() => navigateWeek(7)}
            aria-label="Next Week"
          >
            <span class="d-none d-sm-inline">Next Week</span>
            <span class="d-sm-none">Next</span>
            <i class="bi bi-chevron-right ms-1"></i>
          </button>
        </div>
      </div>

      <div class="text-center mb-3">
        <small class="text-muted">
          <i class="bi bi-keyboard me-1"></i>
          You can use <kbd>←</kbd> and <kbd>→</kbd> to navigate weeks
        </small>
      </div>

      <div class="row">
        <div class="col-xl-3 col-md-6 mb-3 mb-xl-0">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">
                <i class="bi bi-calendar3 me-2"></i>
                Current Week
              </h5>
              <p class="card-text" id="currentDate">Loading...</p>
            </div>
          </div>
        </div>
        <div class="col-xl-3 col-md-6 mb-3 mb-xl-0">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">
                <i class="bi bi-people me-2"></i>
                Total Contributors
              </h5>
              <p class="card-text" id="totalContributors">-</p>
            </div>
          </div>
        </div>
        <div class="col-xl-3 col-md-6 mb-3 mb-md-0">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">
                <i class="bi bi-clipboard-data me-2"></i>
                Total Contributions
              </h5>
              <p class="card-text" id="totalContributions">-</p>
            </div>
          </div>
        </div>
        <div class="col-xl-3 col-md-6 mb-0">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">
                <i class="bi bi-person-lines-fill me-2"></i>
                Average per User
              </h5>
              <p class="card-text" id="averagePerUser">-</p>
            </div>
          </div>
        </div>
      </div>

      <div class="sline"></div>

      <div class="card">
        <div class="card-header">
          <h3 class="card-title mb-0">
            <i class="bi bi-list-ol me-2"></i>
            Leaderboard
          </h3>
        </div>
        <div class="card-body p-0">
          <div id="loading" class="text-center p-4">
            <div class="spinner-border" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-2">Loading leaderboard data...</p>
          </div>
          <div
            id="error"
            class="alert alert-danger m-3"
            style="display: none"
          >
            <i class="bi bi-exclamation-triangle me-2"></i>
            <span id="errorMessage">Error loading data</span>
          </div>
          <div id="leaderboard" class="list-group list-group-flush">
            <!-- Leaderboard items will be inserted here -->
          </div>
        </div>
      </div>

      <div id="globalContributionsBar" class="mt-4 mb-3"></div>
      <div id="contributionsLegend" class="mb-4"></div>
    </div>
  </div>
</main>
