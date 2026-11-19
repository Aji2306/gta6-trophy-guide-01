# GTA 6 Trophy Guide & Tracker

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/Aji2306/gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/Aji2306/gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

An offline static guide and progress tracker for all 55 Grand Theft Auto VI PlayStation 5 trophies (1 Platinum, 2 Gold, 6 Silver, 46 Bronze). Crafted for the make.fun competition (`gta6-trophy-guide-01`), this application features comprehensive, original trophy guides citing Exophase and PSNProfiles, a persistent `localStorage` checklist with JSON export/import support, interactive kind and grade filters, live search, spoiler toggling, a step-by-step platinum roadmap, and a dedicated missable trophies view.

## Features

- **Complete Trophy Index:** All 55 PS5 trophies with rarity, grade, category kind, PSN tracked counters, and detailed strategies.
- **Interactive Checklist:** Persistent `localStorage` tracking with export/import functionality.
- **Filtering & Search:** Instant search by title/description and filters by trophy kind (Story, Missable, Collectibles, Activities, Online) and grade (Platinum, Gold, Silver, Bronze).
- **Platinum Roadmap:** Chronological breakdown of campaign progression, side activities, and cleanup phases.
- **Missables Tracker:** Dedicated view emphasizing point-of-no-return and time-sensitive trophies.
- **Spoiler Protection:** Toggle to hide story spoilers across descriptions and guides.

## Running Locally

To run the application locally:

```bash
node serve.ts
```

Then open your browser at **http://127.0.0.1:8080**.

## Building Submission Output

To build the submission output bundle (`/output` or custom directory via `MAKEFUN_OUTPUT_DIR`):

```bash
MAKEFUN_OUTPUT_DIR=out node main.ts
```

## Screenshots

The application includes four 1280x800 high-resolution screenshots capturing key views:

1. **`screenshots/1-checklist.jpg`** — The primary Checklist & Guide view featuring trophy progress statistics, filters, search bar, and the detailed trophy guide inspector pane.
2. **`screenshots/2-roadmap.jpg`** — The Platinum Roadmap view presenting the structured chronological phases from story campaign to 100% completion.
3. **`screenshots/3-missables.jpg`** — The Missable Trophies view highlighting time-sensitive and point-of-no-return achievements.
4. **`screenshots/4-collectibles.jpg`** — The Collectibles and Activities view tracking world items, stunt jumps, and side missions across Leonida.
