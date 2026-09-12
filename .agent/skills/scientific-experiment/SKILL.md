# SKILL — SCIENTIFIC EXPERIMENT

## Goal
Run a hypothesis-driven experiment with reproducible evidence.

## Workflow
1. State hypothesis.
2. State counter-hypothesis.
3. Define expected signal.
4. Define baseline.
5. Define dataset.
6. Define metrics.
7. Define kill / success criteria.
8. Record environment.
9. Execute real run.
10. Save raw output.
11. Analyze without overwriting raw results.
12. Record unexpected observations.
13. Test alternative explanations.
14. Conclude KEEP / MODIFY / KILL / INCONCLUSIVE.
15. Generate AI R&D Deliverables (Academic, Analysis, Process, Benchmark).
16. Create next task or backlog item.

## Deliverables (AI R&D Protocol)
Every concluded experiment MUST output the following 4 deliverables:
1. **Academic Paper** (`*_academic_paper.md`): State of the art, formalized concepts and mathematical/theoretical foundation.
2. **Full Analysis (Whitebox)** (`*_full_analysis.md`): Total transparency. Why we did it, what emerged, the hypothesis, estimated benefits, and raw data.
3. **Process Manual (SOP)** (`*_process_manual.md`): Operational procedure. If the hypothesis creates a new process/series of actions for AI agents, document it as a usable manual.
4. **Commercial Benchmark (Blackbox)** (`*_commercial_benchmark.md`): Professional presentation showing results, benchmarks, and KPIs, without revealing the underlying secrets ("le pot aux roses").

## Evidence System (Strict KPI Rule)
- All evidence MUST be backed by REAL KPIs and REAL DATA.
- Prohibited: Mocks, fakes, superficial demos, or simulated data.
- The experiment must include a strict **Manifesto** declaring the validity of the data source.

## Never
- infer success from one attractive example
- overwrite negative runs
- convert synthetic controls into empirical evidence
- skip raw-result preservation

## Key Performance Indicators (KPIs)
To measure agent scientific efficacy, analyze the following metrics:
- **First-Time Pass Rate**: Was the hypothesis validated on the first execution (without requiring debug iterations)?
- **Evidence Density**: Ratio of code written vs. checks passed. High density means minimal code for maximum verifiable impact.
- **Cycle Time**: Time elapsed from `Hypothesis` formulation to `Conclusion` log.
