# SKILL — TASK DECOMPOSITION

## Goal
Transform a PRD/roadmap into a deterministic task dependency graph.

## Five passes
1. Extract deliverables.
2. Extract dependencies.
3. Decompose into verifiable tasks.
4. Define evidence and done conditions.
5. Validate the graph.

## Hierarchy
PROJECT
→ MILESTONE
→ TASK
→ SUBTASK
→ CHECK / EVIDENCE

## Task requirements
Every task must define:
- id
- title
- milestone
- objective
- status
- depends_on
- subtasks
- inputs
- outputs
- tests
- evidence
- done_when
- next

## Granularity
TASK = one independently verifiable outcome.
SUBTASK = necessary step inside a task.

Split a task when it has:
- multiple independent outputs
- separate dependencies
- separate validation cycles

## Graph validation
Before saving:
- no duplicate IDs
- no missing dependencies
- no dependency cycles
- no task without done_when
- every PRD deliverable covered
- every success criterion mapped to validation
- identify critical path
- identify parallelizable tasks
- identify first READY task

## State
Only the first admissible task becomes ACTIVE unless parallelism is explicitly authorized.
