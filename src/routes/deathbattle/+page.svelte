<script lang="ts">
  import { onMount } from 'svelte';
  import { DeathBattleRenderer } from '../../components/deathBattleRenderer.js';
  import { DeathBattleService } from '../../components/deathBattleService.js';
  import '../../styles/recap.css';
  import '../../styles/deathbattle.css';

  let renderer: DeathBattleRenderer;

  async function loadBattleStats(): Promise<void> {
    renderer.showCasualLoading();
    renderer.showRankedLoading();

    try {
      const stats = await DeathBattleService.fetchBattleStats();
      renderer.renderCasualStats(stats);
      renderer.renderRankedStats(stats);
    } catch (error) {
      console.error("Failed to load battle stats:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to load battle statistics.";
      renderer.showCasualError(errorMessage);
      renderer.showRankedError(errorMessage);
    }
  }

  async function loadBattleRecords(): Promise<void> {
    renderer.showRecordsLoading();

    try {
      const records = await DeathBattleService.fetchBattleRecords();
      renderer.renderBattleRecords(records);
    } catch (error) {
      console.error("Failed to load battle records:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to load battle records.";
      renderer.showRecordsError(errorMessage);
    }
  }

  onMount(() => {
    renderer = new DeathBattleRenderer();
    loadBattleStats();
    loadBattleRecords();
  });
</script>

<svelte:head>
  <title>Deathbattle Statistics | Paradoxum Wikis Companio</title>
  <meta
    name="description"
    content="View combat statistics and leaderboards from our Discord ALTERSHAPER bot."
  />
  <meta
    name="keywords"
    content="ALTER EGO, Wiki, Deathbattle, Statistics, Leaderboard, Discord, Bot"
  />

  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://ae.tds-editor.com/deathbattle/" />
  <meta property="og:title" content="Deathbattle Statistics | Paradoxum Wikis Companio" />
  <meta
    property="og:description"
    content="View combat statistics and leaderboards from our Discord ALTERSHAPER bot."
  />
  <meta property="og:image" content="https://ae.tds-editor.com/banner.png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="ALTER EGO Wiki Deathbattle - View Statistics" />
  <meta property="og:site_name" content="Paradoxum Wikis Companio" />
  <meta property="og:locale" content="en_US" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@isALTEREGOout" />
  <meta name="twitter:creator" content="@isALTEREGOout" />
  <meta name="twitter:title" content="Deathbattle Statistics | Paradoxum Wikis Companio" />
  <meta
    name="twitter:description"
    content="View combat statistics and leaderboards from our Discord ALTERSHAPER bot."
  />
  <meta name="twitter:image" content="https://ae.tds-editor.com/banner.png" />
  <meta name="twitter:image:alt" content="ALTER EGO Wiki Deathbattle - View Statistics" />

  <meta name="theme-color" content="#900c3f" />
  <meta name="apple-mobile-web-app-title" content="AEWiki Companion" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

  <link rel="canonical" href="https://ae.tds-editor.com/deathbattle/" />

  <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Deathbattle Statistics | Paradoxum Wikis Companio",
      "description": "View combat statistics and leaderboards from our Discord ALTERSHAPER bot.",
      "url": "https://ae.tds-editor.com/deathbattle/",
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
            "name": "Deathbattle Statistics",
            "item": "https://ae.tds-editor.com/deathbattle/"
          }
        ]
      }
    }
  </script>
</svelte:head>

<main class="container mt-4">
  <div class="row">
    <div class="col-12">
      <div class="text-center mb-4">
        <h1 class="h2 mb-3">
          <i class="bi bi-lightning-charge me-2 text-warning"></i>
          Deathbattle Statistics
        </h1>
        <p class="text-muted">
          Combat statistics from our Discord Deathbattle bot
        </p>
      </div>

      <!-- Tab Navigation -->
      <ul class="nav nav-tabs mb-4" id="battleTabs" role="tablist">
        <li class="nav-item" role="presentation">
          <button
            class="nav-link active"
            id="casual-tab"
            data-bs-toggle="tab"
            data-bs-target="#casual"
            type="button"
            role="tab"
            aria-controls="casual"
            aria-selected="true"
          >
            <i class="bi bi-lightning-charge me-1"></i>
            Normal Battles
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button
            class="nav-link"
            id="ranked-tab"
            data-bs-toggle="tab"
            data-bs-target="#ranked"
            type="button"
            role="tab"
            aria-controls="ranked"
            aria-selected="false"
          >
            <i class="bi bi-trophy me-1"></i>
            Ranked Battles
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button
            class="nav-link"
            id="records-tab"
            data-bs-toggle="tab"
            data-bs-target="#records"
            type="button"
            role="tab"
            aria-controls="records"
            aria-selected="false"
          >
            <i class="bi bi-journal-text me-1"></i>
            Battle Records
          </button>
        </li>
      </ul>

      <!-- Tab Content -->
      <div class="tab-content" id="battleTabsContent">
        <!-- Normal Battles Tab -->
        <div class="tab-pane fade show active" id="casual" role="tabpanel" aria-labelledby="casual-tab">
          <div class="row mb-4">
            <div class="col-md-4 mb-3">
              <div class="card h-100">
                <div class="card-body text-center d-flex flex-column justify-content-center">
                  <h5 class="card-title">
                    <i class="bi bi-people me-2"></i>
                    Total Players
                  </h5>
                  <p class="card-text h4" id="casualTotalPlayers">-</p>
                </div>
              </div>
            </div>
            <div class="col-md-4 mb-3">
              <div class="card h-100">
                <div class="card-body text-center d-flex flex-column justify-content-center">
                  <h5 class="card-title">
                    <i class="bi bi-lightning me-2"></i>
                    Total Battles
                  </h5>
                  <p class="card-text h4" id="casualTotalBattles">-</p>
                </div>
              </div>
            </div>
            <div class="col-md-4 mb-3">
              <div class="card h-100">
                <div class="card-body text-center d-flex flex-column justify-content-center">
                  <h5 class="card-title">
                    <i class="bi bi-calendar3 me-2"></i>
                    Last Battle
                  </h5>
                  <p class="card-text h4" id="casualLastBattle">-</p>
                </div>
              </div>
            </div>
          </div>

          <div class="card mb-4">
            <div class="card-header">
              <h4 class="card-title mb-0">
                <i class="bi bi-list-ol me-2"></i>
                Normal Leaderboard
              </h4>
            </div>
            <div class="card-body p-0">
              <div id="casualLoading" class="text-center p-4">
                <div class="spinner-border" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-2">Loading battle statistics...</p>
              </div>
              <div id="casualError" class="alert alert-danger m-3" style="display: none">
                <i class="bi bi-exclamation-triangle me-2"></i>
                <span id="casualErrorMessage">Error loading data</span>
              </div>
              <div id="casualLeaderboard" class="list-group list-group-flush">
                <!-- Casual leaderboard items will be inserted here -->
              </div>
            </div>
          </div>
        </div>

        <!-- Ranked Battles Tab -->
        <div class="tab-pane fade" id="ranked" role="tabpanel" aria-labelledby="ranked-tab">
          <div class="row mb-4">
            <div class="col-md-4 mb-3">
              <div class="card h-100">
                <div class="card-body text-center d-flex flex-column justify-content-center">
                  <h5 class="card-title">
                    <i class="bi bi-people me-2"></i>
                    Total Players
                  </h5>
                  <p class="card-text h4" id="rankedTotalPlayers">-</p>
                </div>
              </div>
            </div>
            <div class="col-md-4 mb-3">
              <div class="card h-100">
                <div class="card-body text-center d-flex flex-column justify-content-center">
                  <h5 class="card-title">
                    <i class="bi bi-trophy me-2"></i>
                    Total Battles
                  </h5>
                  <p class="card-text h4" id="rankedTotalBattles">-</p>
                </div>
              </div>
            </div>
            <div class="col-md-4 mb-3">
              <div class="card h-100">
                <div class="card-body text-center d-flex flex-column justify-content-center">
                  <h5 class="card-title">
                    <i class="bi bi-calendar3 me-2"></i>
                    Last Ranked Battle
                  </h5>
                  <p class="card-text h4" id="rankedLastBattle">-</p>
                </div>
              </div>
            </div>
          </div>

          <div class="card mb-4">
            <div class="card-header">
              <h4 class="card-title mb-0">
                <i class="bi bi-award me-2"></i>
                Ranked Leaderboard
              </h4>
            </div>
            <div class="card-body p-0">
              <div id="rankedLoading" class="text-center p-4">
                <div class="spinner-border" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-2">Loading ranked statistics...</p>
              </div>
              <div id="rankedError" class="alert alert-danger m-3" style="display: none">
                <i class="bi bi-exclamation-triangle me-2"></i>
                <span id="rankedErrorMessage">Error loading data</span>
              </div>
              <div id="rankedLeaderboard" class="list-group list-group-flush">
                <!-- Ranked leaderboard items will be inserted here -->
              </div>
            </div>
          </div>
        </div>

        <!-- Battle Records Tab -->
        <div class="tab-pane fade" id="records" role="tabpanel" aria-labelledby="records-tab">
          <div class="card mb-4">
            <div class="card-header">
              <h4 class="card-title mb-0">
                <i class="bi bi-clock-history me-2"></i>
                Recent Battle Records
              </h4>
            </div>
            <div class="card-body p-0">
              <div id="recordsLoading" class="text-center p-4">
                <div class="spinner-border" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-2">Loading battle records...</p>
              </div>
              <div id="recordsError" class="alert alert-danger m-3" style="display: none">
                <i class="bi bi-exclamation-triangle me-2"></i>
                <span id="recordsErrorMessage">Error loading data</span>
              </div>

              <!-- Venue Filter Buttons -->
              <div class="nav nav-tabs my-2 justify-content-end me-2" role="tablist">
                <button class="nav-link active venue-filter" data-venue="all" role="tab" aria-selected="true" aria-controls="battleRecords">
                  <i class="bi bi-globe me-2"></i>All Venues
                </button>
                <button class="nav-link venue-filter" data-venue="alter-ego" role="tab" aria-selected="false" aria-controls="battleRecords">
                  <i class="bi bi-book me-2"></i>ALTER EGO Wiki
                </button>
                <button class="nav-link venue-filter" data-venue="735394249863987241" role="tab" aria-selected="false" aria-controls="battleRecords">
                  <i class="bi bi-book me-2"></i>Tower Defense Simulator Wiki
                </button>
              </div>

              <div id="battleRecords" class="list-group list-group-flush">
                <!-- js here -->
              </div>

              <!-- Pagination Controls -->
              <div id="recordsPagination" class="d-flex justify-content-between align-items-center p-3 border-top" style="display: none !important">
                <div class="d-flex align-items-center gap-2">
                  <small class="text-muted">
                    <label for="recordsPerPage">Items per page:</label>
                  </small>
                  <select id="recordsPerPage" class="form-select form-select-sm" style="width: auto">
                    <option value="10">10</option>
                    <option value="25" selected>25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </select>
                </div>

                <div class="d-flex align-items-center gap-2">
                  <small class="text-muted" id="recordsInfo">-</small>
                </div>

                <div class="d-flex gap-1">
                  <button id="recordsFirstPage" class="btn btn-sm btn-outline-secondary" disabled aria-label="First page">
                    <i class="bi bi-chevron-double-left"></i>
                  </button>
                  <button id="recordsPrevPage" class="btn btn-sm btn-outline-secondary" disabled aria-label="Previous page">
                    <i class="bi bi-chevron-left"></i>
                  </button>
                  <span id="recordsPageNumbers" class="d-flex gap-1">
                    <!-- Page numbers -->
                  </span>
                  <button id="recordsNextPage" class="btn btn-sm btn-outline-secondary" aria-label="Next page">
                    <i class="bi bi-chevron-right"></i>
                  </button>
                  <button id="recordsLastPage" class="btn btn-sm btn-outline-secondary" aria-label="Last page">
                    <i class="bi bi-chevron-double-right"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</main>
