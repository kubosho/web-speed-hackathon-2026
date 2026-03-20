# Performance Optimization Workflow

Applies when modifying code for performance improvement in this repository.

## Outcome

Every optimization is backed by measurement. The history shows what improved, by how much, and why the change was made.

## Constraints

- Measurement tool: `pnpm lighthouse` (from `/application`, server running at localhost:3000)
- Article file: `/Users/kubosho/src/github.com/kubosho/articles/articles/web-speed-hackathon-2026.md`
- Sabotage code and legitimate bottlenecks get the same treatment — no shortcuts for "obvious" fixes.

## Invariants

These conditions must hold true at each stage. When violated, the fix restores them.

### A hypothesis exists before any code change

Optimization without a hypothesis is guesswork. Measurement without a hypothesis is data collection.

**Check**: Before modifying any file for performance.

- Hypothesis stated (what is slow, why, which metric reflects it) → proceed
- No hypothesis → stop. Read code, run Lighthouse, form a hypothesis first.

### Baseline is captured before the change

Without a before measurement, improvement cannot be confirmed.

**Check**: Before implementing the optimization.

- `pnpm lighthouse` ran, target metric recorded → proceed
- Not yet measured → run `pnpm lighthouse`, record the target metric

### The tool measures what the hypothesis claims

Lighthouse measures specific things. If the hypothesis is about server response time but you are reading FCP, the measurement does not answer the question.

**Check**: After capturing baseline, before implementing.

- Metric aligns with hypothesis → proceed
- Mismatch → choose a different metric or tool, or revise the hypothesis

### Target metric improved after the change

**Check**: After implementing the optimization.

- `pnpm lighthouse` ran, target metric improved → proceed to commit
- Target metric did not improve → revert the change. The hypothesis was wrong.
- Other metrics regressed significantly → investigate before committing

### Before/after metrics are recorded in the article

**Check**: Before committing.

- Article updated with: what changed, why, before/after metrics, key code snippet → proceed
- Not yet recorded → append a section to the article file
