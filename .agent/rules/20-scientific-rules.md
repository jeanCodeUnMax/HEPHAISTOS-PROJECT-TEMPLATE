# SCIENTIFIC PROTOCOL RULES

For scientific work, each experiment must preserve:

## Required structure
- HYPOTHESIS
- WHY
- EXPECTED_EFFECT
- COUNTER_HYPOTHESIS
- PROTOCOL
- BASELINE
- DATASET
- MEASUREMENTS
- ENVIRONMENT
- EXECUTION_MANIFEST
- RAW_RESULTS
- ANALYSIS
- UNEXPECTED_SIGNALS
- CONCLUSION
- DECISION
- NEXT_ACTION

## Decision vocabulary
Every concluded experiment ends with one:
- KEEP
- MODIFY
- KILL
- INCONCLUSIVE

## Evidence & Strict Data System
Evidence must distinguish:
- REAL
- SYNTHETIC
- MOCK

**STRICT RULE (The Manifesto):** 
- MOCK, FAKE, DEMO, or SIMULATED data are STRICTLY PROHIBITED for validating a hypothesis.
- Evidence MUST be based on REAL KPIs and REAL DATA.
- The experiment must include a Manifesto declaring the absolute authenticity of the data.
- SYNTHETIC data may validate plumbing or controls, but must never be represented as real-world evidence or used to conclude a hypothesis.

## Required R&D Deliverables
For any AI/Agent-oriented research, the conclusion of the experiment MUST generate the 4 specific outputs defined in the `scientific-experiment` skill:
1. The Academic Paper (Maths/State of the Art)
2. The Full Analysis (Whitebox / Intellectual reflection)
3. The Process Manual (SOP / Series of actions)
4. The Commercial Benchmark (Blackbox / Results without the secret sauce)

## Reproducibility
Where applicable record:
- model/version
- dataset/version
- seed
- dependencies
- hardware
- command
- config
- hashes
- timestamps
- output locations

## Scientific anti-confirmation
Do not ask only “are you sure?”.
For critical hypotheses use:
- reconstruction
- causality
- counterfactual
- contradiction
- reformulation/invariance
- transfer/application

## Negative results
Negative or null results are first-class evidence.
Never delete them merely because they do not support the hypothesis.
