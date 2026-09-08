# SKILL — HEPHAISTOS CLI OPERATION

## Goal
Use the CLI as the daily project-control interface.

## Standard commands
Inspect:
- `.\hephaistos tasks`
- `.\hephaistos status`

Validate:
- `.\hephaistos check Txxx`

Complete:
- `.\hephaistos finish Txxx`

Git:
- follow the CLI-recommended `git add`, `git commit`, and `git push`

## Daily loop
1. `.\hephaistos tasks`
2. `.\hephaistos status`
3. execute only TASK_ACTIVE
4. create required artifacts/evidence
5. `.\hephaistos check Txxx`
6. fix failures
7. `.\hephaistos finish Txxx`
8. commit using task ID
9. push after watchdog passes
10. repeat

## Important
Never run `finish` as a declaration of intent.
`finish` is a validation request.

If `check` fails, repair evidence or implementation rather than bypassing the gate.
