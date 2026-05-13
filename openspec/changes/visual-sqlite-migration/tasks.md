# Tasks: Visual SQLite Migration

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~500 lines (±50) |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | PR 1 → PR 2 → PR 3 → PR 4 |
| Delivery strategy | ask-on-risk |
| Chain strategy | stacked-to-main |

Decision needed before apply: Yes
Chained PRs recommended: Yes
Chain strategy: stacked-to-main
400-line budget risk: High

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Database infrastructure + constants cleanup | PR 1 | Base: main; creates tables, APIs, removes hardcoded data |
| 2 | App.jsx data loading foundation | PR 2 | Base: main; batch loading, new state, handlers |
| 3 | UI components (Dashboard + Settings) | PR 3 | Base: main; dynamic data from props |
| 4 | Modals + Stats polish | PR 4 | Base: main; Edit/Delete, remove AI text |

---

## Phase 1: Database Infrastructure (PR 1)

**Dependencies:** None  
**Files:** `src/utils/database.js`, `src/data/constants.js`

- [ ] 1.1 Add new table schemas to `initDatabase()`: `users`, `categories`, `settings`, `budgets`
- [ ] 1.2 Create `getUsers()`, `seedUsers(initialUsers)` APIs
- [ ] 1.3 Create `getCategories()`, `seedCategories(initialCategories)` APIs
- [ ] 1.4 Create `getSettings()`, `setSetting(key, value)` APIs
- [ ] 1.5 Create `getBudget(month)`, `setBudget(month, amount)` APIs
- [ ] 1.6 Create `updateTransaction(id, tx)`, `deleteTransaction(id)` APIs
- [ ] 1.7 Modify `seedData()` to remove parameters and seed new tables if empty
- [ ] 1.8 Remove `USERS`, `INIT_FEED`, `INIT_GOALS`, `CATEGORIES` from `constants.js`
- [ ] 1.9 Keep `T` color tokens in `constants.js`

**Acceptance Criteria:**
- `npm run build` passes
- `npx cap sync` passes
- DB layer exports all new functions
- Constants file only exports `T`

---

## Phase 2: Data Loading Foundation (PR 2)

**Dependencies:** Phase 1 (DB APIs exist)  
**Files:** `src/App.jsx`

- [ ] 2.1 Add state hooks: `users`, `categories`, `settings`, `budget`
- [ ] 2.2 Replace sequential DB calls with `Promise.all([getUsers(), getCategories(), getSettings(), getBudget(month), getTransactions(), getGoals()])`
- [ ] 2.3 Add `handleUpdateTransaction(id, tx)` handler
- [ ] 2.4 Add `handleDeleteTransaction(id)` handler
- [ ] 2.5 Add `handleSettingChange(key, value)` handler
- [ ] 2.6 Add `handleBudgetChange(month, amount)` handler
- [ ] 2.7 Pass new props to children: `users`, `categories`, `settings`, `budget`, `onUpdateTransaction`, `onDeleteTransaction`
- [ ] 2.8 Remove hardcoded fallback (`setFeed(INIT_FEED)`) on DB error

**Acceptance Criteria:**
- App loads without perceptible delay
- Console shows no errors
- All handlers call DB and refresh state

---

## Phase 3: UI Components — Dashboard & Settings (PR 3)

**Dependencies:** Phase 2 (props available)  
**Files:** `src/components/Dashboard.jsx`, `src/components/Settings.jsx`

### Dashboard Changes
- [ ] 3.1 Receive `users`, `budget` props
- [ ] 3.2 Replace hardcoded `'Abril 2026'` with dynamic month label (`new Date()`)
- [ ] 3.3 Replace hardcoded `budget = 500000` with `budget` prop
- [ ] 3.4 Replace hardcoded notification count `'2'` with real count (from props or computed)
- [ ] 3.5 Update user color references from `USERS[tx.user].color` to `users.find(...).color`
- [ ] 3.6 Update user name references from `USERS[tx.user].name` to `users.find(...).name`

### Settings Changes
- [ ] 3.7 Receive `users`, `categories`, `settings` props
- [ ] 3.8 Initialize `model` from `settings.divisionModel` (default '70-30')
- [ ] 3.9 Initialize `jPct` from settings (default 70)
- [ ] 3.10 Initialize `catMap` from `settings.catMap` (parsed JSON)
- [ ] 3.11 Call `onSettingChange('divisionModel', model)` when model changes
- [ ] 3.12 Call `onSettingChange('jPct', jPct)` when slider changes
- [ ] 3.13 Call `onSettingChange('catMap', JSON.stringify(catMap))` when toggles change
- [ ] 3.14 Render users from `users` prop instead of hardcoded `USERS`
- [ ] 3.15 Render categories from `categories` prop instead of `CATEGORIES`

**Acceptance Criteria:**
- Dashboard shows current month (e.g., 'Mayo 2026')
- Settings persist and restore after app restart
- No console errors

---

## Phase 4: Modals + Stats Polish (PR 4)

**Dependencies:** Phase 2 (props available)  
**Files:** `src/components/AddModal.jsx`, `src/components/DetailModal.jsx`, `src/components/Stats.jsx`

### AddModal Changes
- [ ] 4.1 Receive `categories`, `users` props
- [ ] 4.2 Replace `CATEGORIES` import usage with `categories` prop
- [ ] 4.3 Replace `USERS` import usage with `users` prop

### DetailModal Changes
- [ ] 4.4 Receive `users`, `onUpdateTransaction`, `onDeleteTransaction` props
- [ ] 4.5 Add "Edit" button that opens editable form
- [ ] 4.6 Add "Delete" button with confirmation
- [ ] 4.7 Call `onUpdateTransaction(id, updatedTx)` on edit confirm
- [ ] 4.8 Call `onDeleteTransaction(id)` on delete confirm
- [ ] 4.9 Replace `USERS[tx.user]` with `users.find(...)`

### Stats Changes
- [ ] 4.10 Receive `users`, `categories` props
- [ ] 4.11 Remove fabricated AI insight paragraph (lines 28-31)
- [ ] 4.12 Replace `USERS` import usage with `users` prop
- [ ] 4.13 Replace `CATEGORIES` import usage with `categories` prop

**Acceptance Criteria:**
- AddModal shows categories from DB
- DetailModal Edit/Delete work and refresh feed
- Stats shows real data, no AI text
- `npm run build` and `npx cap sync` pass

---

## Phase 5: Optional Polish

**Dependencies:** All previous phases  
**Files:** `src/data/tokens.js` (new)

- [ ] 5.1 Create `src/data/tokens.js` with `cardStyle`, `modalSheetStyle`, `inputStyle`
- [ ] 5.2 Apply tokens in components where 4+ property objects repeat

**Acceptance Criteria:**
- No functional changes
- Code is cleaner

---

## Implementation Notes

### Dependency Graph
```
Phase 1 ──┬──→ Phase 2 ──┬──→ Phase 3
          │              └──→ Phase 4
          └──→ Phase 5 (optional)
```

### Rollback Strategy
Each PR is independently revertible. If issues arise:
1. Revert the specific PR
2. Constants remain in git history for reference
3. DB schema is additive only (no destructive migrations)

### Testing Checklist (per PR)
- [ ] `npm run build` passes
- [ ] `npx cap sync` passes
- [ ] Manual boot test with empty DB
- [ ] Manual persistence test (change → restart → verify)
