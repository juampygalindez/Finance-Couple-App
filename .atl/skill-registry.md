# Skill Registry: Finance-Couple-App

Auto-generated skill registry for this project.

## User Skills

These skills are available from the user's agent configuration:

| Skill | Trigger |
|-------|---------|
| **branch-pr** | PR creation workflow for Agent Teams Lite following the issue-first enforcement system. Trigger: When creating a pull request, opening a PR, or preparing changes for review. |
| **chained-pr** | Split large changes into chained or stacked pull requests that protect reviewer focus and stay within Gentle AI's 400-line cognitive review budget. Trigger: when a PR would exceed 400 changed lines, when planning chained PRs, stacked PRs, or reviewable slices. |
| **cognitive-doc-design** | Design documentation that reduces reader cognitive load through progressive disclosure, chunking, signposting, tables, checklists, and recognition over recall. Trigger: when writing guides, READMEs, RFCs, onboarding docs, architecture docs, or review-facing documentation. |
| **comment-writer** | Write warm, direct, human comments for PRs, issues, reviews, chats, and async collaboration. Trigger: when drafting or posting feedback, review comments, maintainer replies, Slack messages, or GitHub comments. |
| **go-testing** | Go testing patterns for Gentleman.Dots, including Bubbletea TUI testing. Trigger: When writing Go tests, using teatest, or adding test coverage. |
| **issue-creation** | Issue creation workflow for Agent Teams Lite following the issue-first enforcement system. Trigger: When creating a GitHub issue, reporting a bug, or requesting a feature. |
| **judgment-day** | Parallel adversarial review protocol that launches two independent blind judge sub-agents simultaneously to review the same target, synthesizes their findings, applies fixes, and re-judges until both pass or escalates after 2 iterations. Trigger: When user says "judgment day", "judgment-day", "review adversarial", "dual review", "doble review", "juzgar", "que lo juzguen". |
| **sdd-apply** | Implement tasks from the change, writing actual code following the specs and design. Trigger: When the orchestrator launches you to implement one or more tasks from a change. |
| **sdd-archive** | Sync delta specs to main specs and archive a completed change. Trigger: When the orchestrator launches you to archive a change after implementation and verification. |
| **sdd-design** | Create technical design document with architecture decisions and approach. Trigger: When the orchestrator launches you to write or update the technical design for a change. |
| **sdd-explore** | Explore and investigate ideas before committing to a change. Trigger: When the orchestrator launches you to think through a feature, investigate the codebase, or clarify requirements. |
| **sdd-init** | Initialize Spec-Driven Development context in any project. Detects stack, conventions, testing capabilities, and bootstraps the active persistence backend. Trigger: When user wants to initialize SDD in a project, or says "sdd init", "iniciar sdd", "openspec init". |
| **sdd-onboard** | Guided end-to-end walkthrough of the SDD workflow using the real codebase. Trigger: When the orchestrator launches you to onboard a user through the full SDD cycle. |
| **sdd-propose** | Create a change proposal with intent, scope, and approach. Trigger: When the orchestrator launches you to create or update a proposal for a change. |
| **sdd-spec** | Write specifications with requirements and scenarios (delta specs for changes). Trigger: When the orchestrator launches you to write or update specs for a change. |
| **sdd-tasks** | Break down a change into an implementation task checklist. Trigger: When the orchestrator launches you to create or update the task breakdown for a change. |
| **sdd-verify** | Validate that implementation matches specs, design, and tasks. Trigger: When the orchestrator launches you to verify a completed (or partially completed) change. |
| **skill-creator** | Creates new AI agent skills following the Agent Skills spec. Trigger: When user asks to create a new skill, add agent instructions, or document patterns for AI. |
| **skill-registry** | Create or update the skill registry for the current project. Scans user skills and project conventions, writes .atl/skill-registry.md, and saves to engram if available. Trigger: When user says "update skills", "skill registry", "actualizar skills", "update registry", or after installing/removing skills. |
| **work-unit-commits** | Structure commits as deliverable work units instead of file-type batches, with tests and docs kept beside the code they verify. Trigger: when implementing a change, preparing commits, splitting PRs, or planning chained or stacked PRs. |

## Project Conventions

These files define project-specific conventions:

| File | Purpose |
|------|---------|
| [AGENTS.md](/home/juan/projects/Finance-Couple-App/AGENTS.md) | Agent notes for Finance-Couple-App: stack, conventions, gotchas |

## Stack-Specific Skill Mapping

Based on detected stack: **React 18 + Vite + Capacitor**

| Task Type | Relevant Skills |
|-----------|-----------------|
| New feature | sdd-propose → sdd-spec → sdd-tasks → sdd-apply → sdd-verify → sdd-archive |
| Bug fix | sdd-propose → sdd-spec → sdd-tasks → sdd-apply → sdd-verify → sdd-archive |
| Code review | judgment-day |
| Create PR | branch-pr |
| Large change (>400 lines) | chained-pr |
| Create issue | issue-creation |
| Project onboarding | sdd-onboard |

## Testing Notes

- **No test runner detected** — Strict TDD Mode disabled
- Install a test framework (Vitest recommended) to enable TDD

---

*Generated: 2026-05-13 by sdd-init*
