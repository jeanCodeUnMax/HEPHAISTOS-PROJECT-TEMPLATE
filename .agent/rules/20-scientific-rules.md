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

## Evidence
Evidence must distinguish:
- REAL
- SYNTHETIC
- MOCK

MOCK cannot support empirical claims.
SYNTHETIC may validate plumbing or controls, but must not be represented as real-world evidence.

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
