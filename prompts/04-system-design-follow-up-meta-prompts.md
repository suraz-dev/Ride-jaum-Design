# System Design Follow-up Meta Prompts

## Universal system task

```text
Continue RideJaunm system design. Read docs/11-system-design.md and implementation/system-design-task-manifest.md. Execute only [S# task]. Before editing, inspect current contracts and identify data migration/rollback, authorization/privacy, idempotency, retries and failure modes. Do not select a provider or create external infrastructure without approval. After implementation, run contract/migration/security tests and report APIs/events affected, evidence, metrics/alerts and unresolved risk.
```

## API/event review

```text
Review [API OR EVENT] without editing. Check versioning, typed error envelope, authentication/authorization, idempotency, pagination/limits, PII and location minimization, schema evolution, ordering/duplication, retry/DLQ behavior, observability and client offline compatibility. Return prioritized findings and required tests.
```

## Geospatial/offline task

```text
Implement [GEO TASK] using source/version/provenance/freshness fields. Distinguish base-map and hazard freshness. Validate and quarantine untrusted source/community data. Route candidates must return constraints and uncertainty; pack manifests must be resumable, integrity checked, attributed and explicit about partial coverage.
```

## Safety task

```text
Implement/review [SAFETY TASK] as a safety-plane change. Preserve append-only incident transitions and a separate channel-attempt record with evidence. Distinguish device sent, peer acknowledged, provider accepted, and human confirmed. Never simulate notification or dispatch success. Include rate/abuse controls, privacy/audit analysis, failure injection and a rollback plan.
```
