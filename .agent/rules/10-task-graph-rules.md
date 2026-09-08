# TASK GRAPH RULES

## Core model
A task is a verifiable state variable in a dependency graph.

Example:
- T001 = DONE
- T002 = ACTIVE
- T003 = BLOCKED

A task may start only if all mandatory dependencies are DONE.

## Task schema
Every TASK must define:
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

## Valid task
A task is valid only if:
- it has one primary objective
- it produces observable output
- completion is objectively checkable
- dependencies are explicit
- it can be validated independently

Reject vague tasks such as:
- improve system
- optimize
- work on X
- finalize
unless they include measurable outputs and done conditions.

## Subtasks
Subtasks describe internal execution steps.
Promote a subtask to a full TASK only when it has:
- independent output, or
- independent dependencies, or
- independent validation lifecycle

## Order
Do not assume numeric order is sufficient.
Use explicit dependencies.

T004 may depend on T001 and T003.
T002 and T003 may be parallel if explicitly declared independent.

## Drift response
If requested_task has incomplete prerequisites:

ORDER VIOLATION
Requested: <task>
Missing prerequisites: <list>
Expected next admissible task: <task>

Do not continue the blocked work.
