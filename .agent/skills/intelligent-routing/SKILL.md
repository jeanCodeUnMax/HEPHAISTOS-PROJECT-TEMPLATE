---
name: Intelligent Routing
description: Analyse CLI output and task metadata to route tasks to the most competent agent profile.
---

# SKILL — INTELLIGENT ROUTING

## Goal
Ensure the right specialist agent works on the right task by analyzing the `depends_on_skill` requirements.

## Workflow
1. When Hephaistos returns to `IDLE` after a task, it broadcasts the next recommended task and its `depends_on_skill` (e.g., `[DevOps, Frontend]`).
2. Read these required skills.
3. If your agent profile matches the required skills, run `.\hephaistos start TXXX` to claim it.
4. If your agent profile does NOT match, do not claim the task. Output a clear hand-off message: *"Passation requise. Appel à l'agent spécialisé en [Skill] pour prendre en charge la tâche TXXX."*
5. The overarching orchestrator or the user will then summon the correct agent.

## Rules
- **NEVER** force-start a task outside your core competency.
- **ALWAYS** check the `depends_on_skill` array in the task YAML before claiming.
- Log any hand-off decisions in the task's `decision_log` if applicable.
