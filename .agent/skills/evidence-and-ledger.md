# SKILL — EVIDENCE & LEDGER

## Goal
Make every important decision and result auditable.

## Evidence types
- source file
- execution log
- test report
- result dataset
- screenshot/report when appropriate
- manifest
- hash
- external reference
- signed Git commit

## Ledger event
For meaningful transitions record:
- timestamp
- project
- task
- event_type
- actor/tool
- input/reference
- output/reference
- result
- evidence
- note

## High-value event types
- TASK_CREATED
- TASK_STARTED
- CHECK_PASSED
- CHECK_FAILED
- TASK_DONE
- EXPERIMENT_RUN
- RESULT_RECORDED
- HYPOTHESIS_CREATED
- DECISION
- TOOL_USED
- GIT_COMMIT
- GIT_PUSH

Do not create noisy ledger events for every trivial keystroke.
