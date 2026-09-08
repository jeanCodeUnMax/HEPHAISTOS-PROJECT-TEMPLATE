# SKILL — CONTEXT RECOVERY / ANTI-AMNESIA

## Goal
Recover project intent after long sessions, model switches, or interruptions.

## Recovery order
1. `.hephaistos/project.yaml`
2. `.hephaistos/tasks.yaml`
3. `.hephaistos/state.yaml`
4. latest relevant ledger events
5. `docs/master/PROJECT_MASTER.md`
6. latest task-related Git commits
7. only then use conversation context

## Recovery summary
Produce:
- mission
- active hypothesis if any
- active experiment if any
- active task
- completed prerequisites
- missing completion conditions
- next action
- backlog items relevant to current work

Do not reconstruct missing facts from guesswork.
