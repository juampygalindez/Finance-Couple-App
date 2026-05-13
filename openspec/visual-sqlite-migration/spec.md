# Delta Spec: visual-sqlite-migration

## Non-Functional Requirements

- **NF-1** — The app MUST start without perceptible delay; DB reads on mount SHALL be batched in a single `Promise.all`.
- **NF-2** — `npm run build` and `npx cap sync` MUST pass without errors after the change.
- **NF-3** — Rollback MUST be possible by reverting to the commit immediately before migration.

## Data Model Changes

| Table | Action | Columns |
|-------|--------|---------|
| `users` | ADD | `id INTEGER PK`, `key TEXT`, `name TEXT`, `initial TEXT`, `color TEXT` |
| `categories` | ADD | `id INTEGER PK`, `name TEXT`, `emoji TEXT`, `shared_default INTEGER` |
| `settings` | ADD | `id INTEGER PK`, `key TEXT UNIQUE`, `value TEXT` |
| `budgets` | ADD | `id INTEGER PK`, `month TEXT UNIQUE`, `amount INTEGER` |
| `transactions` | — | (schema unchanged; add UPDATE/DELETE APIs) |
| `goals` | — | (schema unchanged; remove constant seed) |

## API Changes

### ADDED
- `getUsers()`, `seedUsers(initialUsers)`
- `getCategories()`, `seedCategories(initialCategories)`
- `getSettings()`, `setSetting(key, value)`
- `getBudget(month)`, `setBudget(month, amount)`
- `updateTransaction(id, tx)`, `deleteTransaction(id)`

### MODIFIED
- `initDatabase()` — create `users`, `categories`, `settings`, `budgets` tables.
- `seedData()` — remove `INIT_FEED` and `INIT_GOALS` parameters; seed new tables if empty.

## ADDED Requirements

### Requirement: User Management
The system MUST store per-user names, initials, and colors in SQLite.

#### Scenario: Seed on first launch
- GIVEN the `users` table is empty
- WHEN `initDatabase` runs
- THEN default users are inserted and returned by `getUsers()`

### Requirement: Category Management
The system MUST support dynamic categories with emoji and sharing defaults.

#### Scenario: Categories from DB
- GIVEN the app starts
- WHEN `getCategories()` is called
- THEN results come from the `categories` table

### Requirement: Settings Persistence
The system MUST persist division model, split percentage, and category toggles across restarts.

#### Scenario: Save and restore model
- GIVEN a user selects the '50-50' model
- WHEN `setSetting('divisionModel', '50-50')` is called and the app restarts
- THEN `getSettings()` returns '50-50' for `divisionModel`

#### Scenario: Category share toggles survive
- GIVEN a user toggles 'Café' to unshared
- WHEN `setSetting('catMap', JSON.stringify(catMap))` is called and the app restarts
- THEN the toggle state restores from the `settings` table

### Requirement: Budget Management
The system MUST store and allow editing of the monthly budget.

#### Scenario: Dynamic budget
- GIVEN `setBudget('2026-05', 600000)` was called
- WHEN Dashboard renders in May 2026
- THEN the budget bar uses 600000

### Requirement: Transaction Full CRUD
The system MUST support update and delete operations.

#### Scenario: Edit transaction
- GIVEN a transaction exists with id=1
- WHEN user changes the amount in DetailModal and confirms
- THEN `updateTransaction(1, tx)` persists the change and the feed refreshes

#### Scenario: Delete transaction
- GIVEN a transaction exists with id=1
- WHEN user taps delete in DetailModal
- THEN `deleteTransaction(1)` removes it and the feed refreshes

## MODIFIED Requirements

### Requirement: Transaction Feed
The feed MUST read exclusively from the DB.
(Previously: fell back to `INIT_FEED` on SQLite error.)

#### Scenario: No hardcoded fallback
- GIVEN SQLite returns an error during query
- WHEN the feed loads
- THEN an empty feed is shown instead of `INIT_FEED`

### Requirement: Goals Tracking
Goals MUST read exclusively from the DB.
(Previously: seeded from `INIT_GOALS` constants on empty table.)

#### Scenario: DB-only goals
- GIVEN the `goals` table has data
- WHEN Goals screen renders
- THEN only DB rows display; no constant seed is injected

### Requirement: Dashboard
Dashboard MUST show dynamic month label, real budget, and real notification count.
(Previously: hardcoded 'Abril 2026', budget 500000, bell badge '2'.)

#### Scenario: Dynamic month
- GIVEN the current date is May 2026
- WHEN the Dashboard header renders
- THEN the label shows 'Mayo 2026'

#### Scenario: Real budget from DB
- GIVEN the `budgets` table has 450000 for the current month
- WHEN the budget bar renders
- THEN the max value is 450000

#### Scenario: Real notification count
- GIVEN there are 5 unacknowledged notifications
- WHEN the bell icon renders
- THEN the badge shows 5

## REMOVED Requirements

### Requirement: Hardcoded Domain Data
(Reason: moved to SQLite.)

- `INIT_FEED` seed usage in `App.jsx`
- `INIT_GOALS` seed usage in `App.jsx`
- `USERS` constant consumed by `Dashboard`, `AddModal`, `DetailModal`, `Stats`, `Settings`
- `CATEGORIES` constant consumed by `AddModal`, `Settings`, `Stats`

## UI/Behavior Changes per Screen

| Screen | Change |
|--------|--------|
| **Dashboard** | Dynamic month label; budget from `budgets`; real notification count; user colors from DB |
| **Settings** | Persist `divisionModel`, `jPct`, `catMap` to `settings`; load users/categories from DB |
| **AddModal** | Load categories from DB; load user names/colors from DB |
| **DetailModal** | Add Edit and Delete actions; wire to `updateTransaction`/`deleteTransaction` |
| **Stats** | Remove fabricated AI insight text; compute summary from actual `feed` data |
| **Goals** | Read exclusively from DB; remove `INIT_GOALS` fallback |
