# HEPHAISTOS WORKSPACE — CORE RULES

## Purpose
This workspace is controlled by a deterministic project/task workflow.
The agent must not rely on conversational memory as the source of truth.

## Source of truth order
1. `.hephaistos/project.yaml`
2. `.hephaistos/tasks.yaml`
3. `.hephaistos/state.yaml`
4. `.hephaistos/ledger.jsonl`
5. `docs/master/PROJECT_MASTER.md` (human-readable synchronized view)
6. Git history
7. Conversation context

If these disagree, the structured `.hephaistos/*` state wins unless explicitly corrupted.

## Mandatory operating loop
Before doing project work:
1. Read current project state.
2. Identify `MISSION`, active milestone, `TASK_ACTIVE`, dependencies, evidence requirements, and `NEXT_ACTION`.
3. Work only on the active task unless the manifest explicitly authorizes parallel work.
4. Classify unrelated discoveries as SUPPORT, BACKLOG, NEW_HYPOTHESIS, or REJECTED.
5. Do not silently switch tasks.

## State authority
The LLM may:
- understand
- brainstorm
- propose
- decompose
- implement
- document
- analyze
- recommend state transitions

The LLM must not self-certify completion merely by assertion.

Task completion must be based on:
- required artifacts
- dependency state
- tests
- evidence
- validation rules
- deterministic CLI checks

## Anti-drift
If work is attempted on a task whose required predecessor is incomplete:
- stop the requested task work
- report `ORDER VIOLATION`
- name missing prerequisites
- return to the first admissible task

Do not discard lateral ideas. Record them in backlog with provenance.

## One active task
Default: exactly one active TASK.
Parallel tasks are allowed only if the manifest explicitly declares them independent and parallelizable.

## No fake proof
Never use mock, stub, fake, or invented output as evidence of real execution.
Synthetic controls are allowed only when explicitly labeled `SYNTHETIC`.
Real-world claims require real execution evidence.

## Git
Git is the evidence ledger and history layer, not the primary task-state engine.
Before commit/push:
- task state must be coherent
- required evidence must exist
- watchdog/CLI checks must pass
- commit message must reference the relevant task ID

## Completion vocabulary
Use these states consistently:
- PENDING
- READY
- ACTIVE
- BLOCKED
- VALIDATING
- DONE
- FAILED
- SUPERSEDED
- BACKLOG

## 8. Never silently erase
Preserve:
- hypotheses
- negative results
- failed experiments
- abandoned branches
- unexpected signals
- rejected alternatives
- migration provenance

## 9. Structural Immutability
Never modify files inside the following core directories without EXPLICIT human validation:
- `.agent/rules/`
- `.agent/skills/`
- `.hephaistos/schemas/`
- `.hephaistos/scripts/`

The watchdog mechanically blocks changes to these paths. To update a template or rule, you must present the diff to the human, and the human MUST manually commit it. The AI is strictly forbidden from bypassing this lock, and does not have the authorization to bypass the commit hook.
