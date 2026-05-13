# Design: visual-sqlite-migration

## Technical Approach

Move all domain data (users, categories, settings, budget) from hardcoded JS constants into SQLite. `App.jsx` becomes the single data loader: on mount it creates new tables, seeds defaults if empty, and batches all reads via one `Promise.all`. Child components receive data through props and call handler props that write to DB and refresh state. Inline styles remain, but the most duplicated visual patterns are extracted into a new `tokens.js` file to reduce copy-paste.

## Architecture Decisions

| Decision | Choice | Alternatives | Rationale |
|----------|--------|--------------|-----------|
| Styling | Keep inline styles | CSS modules / styled-components | Current codebase is 100% inline. Migrating styles is out of scope and adds risk. |
| State mgmt | Lifted state in `App.jsx` | React Context, Zustand, Redux | App has only 5 screens. Context adds boilerplate with no measurable gain. |
| Data source | SQLite as SSOT | Keep constants + SQLite hybrid | Spec requires zero hardcoded data in components. Constants remain in git only as seed fallback. |
| Token reuse | Extract `tokens.js` for duplicated objects | Migrate all styles | We only deduplicate the highest-frequency patterns (cards, inputs, modal sheets) to keep the refactor bounded. |

## Database Schema

```sql
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  key TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  initial TEXT NOT NULL,
  color TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  emoji TEXT NOT NULL,
  shared_default INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS budgets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  month TEXT NOT NULL UNIQUE,
  amount INTEGER NOT NULL
);
```

Existing `transactions` and `goals` tables are unchanged.

## Data Flow

```
App.jsx (useEffect on mount)
   │
   ├─→ initDatabase()  → SQLite CREATE TABLE IF NOT EXISTS (all tables)
   ├─→ seedData()      → SQLite INSERT defaults only if tables empty
   └─→ Promise.all([
         getUsers(), getCategories(), getSettings(),
         getBudget(month), getTransactions(), getGoals()
       ])
            │
            ▼
   ├─ setUsers ──────→ Dashboard, AddModal, DetailModal, Stats, Settings
   ├─ setCategories ──→ AddModal, Settings, Stats
   ├─ setSettings ────→ Settings (read / write)
   ├─ setBudget ──────→ Dashboard
   ├─ setFeed ────────→ Dashboard, Stats
   └─ setGoals ───────→ Goals
```

## State Management

- `App.jsx` owns all shared state: `users`, `categories`, `settings`, `budget`, `feed`, `goals`.
- Reads are batched in a single `Promise.all` inside one `useEffect`.
- Writes happen in handler functions (`handleAddExpense`, `handleUpdateGoal`, `handleUpdateTransaction`, `handleDeleteTransaction`, `handleSettingChange`, `handleBudgetChange`). Each handler:
  1. Calls the DB layer.
  2. Re-fetches the affected table.
  3. Calls the corresponding `set*` to update React state.
- `Settings` may call `setSetting` directly and optimistically update its local UI, but the authoritative value is reloaded on next app start.

## Migration Strategy

- **Schema creation**: `initDatabase` runs `CREATE TABLE IF NOT EXISTS` for the four new tables. Existing `transactions` and `goals` are untouched.
- **Seeding**: `seedData` checks `COUNT(*)` for each new table. If empty, it inserts defaults derived from the old constants (`USERS`, `CATEGORIES`, a default budget, default settings). It **no longer** accepts `initialFeed` / `initialGoals` as arguments; `INIT_FEED` and `INIT_GOALS` usage is removed from `App.jsx`.
- **Rollback**: Revert to the commit before this change. Constants still exist in git history, so the app functions identically to the pre-migration state.

## Component Changes Breakdown

| File | Action | Description |
|------|--------|-------------|
| `src/utils/database.js` | Modify | Add new table schemas, seeders, `getUsers`, `getCategories`, `getSettings`, `setSetting`, `getBudget`, `setBudget`, `updateTransaction`, `deleteTransaction`. Remove `seedData` parameters. |
| `src/data/constants.js` | Modify | Strip `USERS`, `CATEGORIES`, `INIT_FEED`, `INIT_GOALS`. Keep `T` color tokens. |
| `src/data/tokens.js` | Create | Shared inline style objects: `cardStyle`, `modalSheetStyle`, `inputStyle`, `sectionHeaderStyle`. |
| `src/App.jsx` | Modify | Batch-load all data; add `users`, `categories`, `settings`, `budget` state; pass them to children; remove fallback to constants on error. |
| `src/components/Dashboard.jsx` | Modify | Month label from `new Date()`; budget from `budget` prop; notification count from real data; user colors from `users` prop. |
| `src/components/Settings.jsx` | Modify | Receive `users`, `categories`, `settings` props; persist `divisionModel`, `jPct`, `catMap` via `setSetting`; load toggles from DB. |
| `src/components/AddModal.jsx` | Modify | Receive `categories` and `users` props instead of importing constants. |
| `src/components/DetailModal.jsx` | Modify | Add Edit and Delete buttons; call new `onUpdateTransaction` / `onDeleteTransaction` props. |
| `src/components/Stats.jsx` | Modify | Remove fabricated AI insight paragraph; keep computed category bars and user split. |
| `src/components/Goals.jsx` | — | No changes; already receives `goals` prop. |

## Error Handling

- All DB calls are wrapped in `try/catch`.
- **Boot read failure**: `App.jsx` catches and sets empty arrays (`[]`) for `feed` and `goals`. The spec explicitly removes the hardcoded fallback.
- **Write failure**: Log to console. For now we do not show a toast (no UI library). The local React state is updated only after a successful re-fetch, so a failed write will not corrupt the UI.
- **SQLite unavailable** (e.g. web browser without Capacitor): App shows empty states. This is acceptable because the target runtime is the Capacitor wrapper.

## Visual Token Consolidation Plan

- Create `src/data/tokens.js` exporting objects like:
  - `cardStyle` → `{ background: T.card, border: \`1px solid ${T.border}\`, borderRadius: 20, padding: 16 }`
  - `modalSheetStyle` → `{ background: T.surface, borderRadius: '24px 24px 0 0', ... }`
  - `inputStyle` → `{ width: '100%', background: T.card, border: ..., borderRadius: 13, padding: '13px 16px', color: T.text, fontFamily: 'DM Sans', outline: 'none' }`
- Apply these in components where the same 4+ property object is repeated. Do **not** refactor every inline style; keep layout-specific overrides local.

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Manual | Boot with empty DB | Verify tables are created and seeded |
| Manual | Settings change + restart | Verify `divisionModel` and `catMap` persist |
| Manual | Edit / Delete transaction | Verify `DetailModal` actions and feed refresh |
| Build | `npm run build` | Must pass without errors |
| Sync | `npx cap sync` | Must pass after build |

## Open Questions

- None.
