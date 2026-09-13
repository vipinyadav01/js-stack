# PostHog Self-driving setup report

## Summary

PostHog Self-driving is configured for the JS-Stack web builder and CLI. Session Replay and Error Tracking were already enabled, Support was enabled, and native responders for health checks, error tracking, and support tickets were enabled.

The focused scout troop now has seven active scouts, including two custom scouts approved for the CLI and stack-builder journeys. Findings should begin appearing in the [Self-driving inbox](https://us.posthog.com/project/223522/inbox) within about 30 minutes.

## AI data processing

Approved by the organization-level setup gate.

## GitHub

GitHub was already connected before this setup. No GitHub Issues responder was enabled because no connected tools were selected.

## Products enabled

| Product                 | Result          | Web SDK check                                                                           |
| ----------------------- | --------------- | --------------------------------------------------------------------------------------- |
| Session Replay          | Already enabled | Clean: `web/src/providers/posthog-provider.tsx` does not disable session recording.     |
| Error Tracking          | Already enabled | Clean: the same client initialization does not set `capture_exceptions: false`.         |
| Support (Conversations) | Enabled         | Connect an inbound email, inbox, or Slack channel in PostHog before tickets can arrive. |

## Signal sources

| Signal source                          | Action                                                                            | Configuration ID                       |
| -------------------------------------- | --------------------------------------------------------------------------------- | -------------------------------------- |
| `signals_scout` / `cross_source_issue` | Left on by default; no opt-out row exists.                                        | —                                      |
| `health_checks` / `health_issue`       | Enabled                                                                           | `01a09cab-200f-7bb6-a200-833566c6aeaa` |
| `error_tracking` / `issue_created`     | Enabled                                                                           | `01a09cab-20ab-7305-bac1-5fcb813b203a` |
| `error_tracking` / `issue_reopened`    | Enabled                                                                           | `01a09cab-2009-78a2-a35e-be3da6756b1d` |
| `error_tracking` / `issue_spiking`     | Enabled                                                                           | `01a09cab-206c-7494-b8d7-2e24e0a36081` |
| `conversations` / `ticket`             | Enabled                                                                           | `01a09cab-210d-75e8-9a04-16c03fbd31f5` |
| Session replay responder               | Deliberately not created; Replay Vision scanners are its only Self-driving route. | —                                      |
| Connected-tool responders              | Skipped; no tools were selected.                                                  | —                                      |

## Connected tools

| Tool                                         | Result                                                       |
| -------------------------------------------- | ------------------------------------------------------------ |
| GitHub Issues, Linear, Jira, Sentry, Zendesk | Not used — none were selected in the connected-tools prompt. |

## Scout troop

**Active scouts (7):**

| Scout                                      | Coverage                                                                                           |
| ------------------------------------------ | -------------------------------------------------------------------------------------------------- |
| `signals-scout-general`                    | Cross-product patterns and surfaces without a specialist.                                          |
| `signals-scout-product-analytics`          | Product-flow, funnel, retention, lifecycle, and path regressions.                                  |
| `signals-scout-web-analytics`              | Traffic, attribution, landing-page, and web acquisition health.                                    |
| `signals-scout-feature-flags`              | Feature-flag evaluation shifts and stale flag debt.                                                |
| `signals-scout-health-checks`              | Actionable PostHog setup health issues.                                                            |
| `signals-scout-cli-generation-reliability` | CLI command and project-generation failure-share regressions by command, configuration, and phase. |
| `signals-scout-stack-builder-handoff`      | Interactive builder entry and progression to generated or copied CLI commands.                     |

**Disabled built-in scouts (22):**

| Scout                              | Reason                                                                                                  |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `signals-scout-ai-observability`   | No LLM telemetry was found in this repo.                                                                |
| `signals-scout-anomaly-detection`  | No established high-value dashboard or insight set was available to watch.                              |
| `signals-scout-apm`                | No APM or OpenTelemetry surface was found.                                                              |
| `signals-scout-conversations`      | Support has no connected inbound channel yet.                                                           |
| `signals-scout-csp-violations`     | No CSP reporting configuration was found.                                                               |
| `signals-scout-customer-analytics` | No B2B account-analytics surface was confirmed.                                                         |
| `signals-scout-data-pipelines`     | No active CDP destination, batch export, or Hog flow was confirmed.                                     |
| `signals-scout-data-warehouse`     | No warehouse source was selected or connected in this setup.                                            |
| `signals-scout-error-tracking`     | Covered by the native Error Tracking responder.                                                         |
| `signals-scout-experiments`        | No active experiment was confirmed.                                                                     |
| `signals-scout-inbox-validation`   | Fresh setup; there are no resolved reports to validate yet.                                             |
| `signals-scout-insight-alerts`     | No existing insight-alert surface was confirmed.                                                        |
| `signals-scout-logs`               | Logs usage was not confirmed from the repo.                                                             |
| `signals-scout-mcp-tool-calls`     | MCP telemetry is not a primary product surface for this setup.                                          |
| `signals-scout-observability-gaps` | The focused health-check scout covers immediate setup health; enable later for broader recommendations. |
| `signals-scout-replay-vision`      | No Replay Vision scanners were available to aggregate yet.                                              |
| `signals-scout-revenue-analytics`  | No payment or revenue data surface was found.                                                           |
| `signals-scout-session-replay`     | Intended to be covered by Replay Vision scanners rather than a duplicate scout route.                   |
| `signals-scout-skills-store`       | Skills-store hygiene is not a primary product surface.                                                  |
| `signals-scout-surveys`            | No surveys are running.                                                                                 |
| `signals-scout-tasks`              | PostHog Tasks usage was not confirmed.                                                                  |
| `signals-scout-web-vitals`         | The web client currently disables performance capture, so no web-vitals surface was confirmed.          |

| Run budget           | Verified value |
| -------------------- | -------------- |
| Maximum runs per day | 100            |
| Runs used today      | 0              |
| Runs remaining today | 100            |

Announcement: “Scouts are in early access. Each project gets up to 100 scout runs a day. Contact team-self-driving@posthog.com if you need more.”

## Custom scouts

| Custom scout                               | What it watches                                                                                                                         | Signal-vs-noise discriminator                                                                                                                       | Why it is separate                                                                                                                      |
| ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `signals-scout-cli-generation-reliability` | The CLI lifecycle documented in `src/analytics/posthog.ts` and `web/src/lib/analytics/events.ts`.                                       | A sustained, broad failure-share increase across users or configurations—not raw failure count or a one-off local failure.                          | The generic product scout watches saved flows; it does not specifically diagnose CLI generation phases and configuration concentration. |
| `signals-scout-stack-builder-handoff`      | The interactive stack builder in `web/src/app/new/_components/stack-builder.tsx` and its telemetry in `web/src/hooks/use-analytics.ts`. | Builder activity continues while progression to generated or copied commands regresses, or builder entry goes silent while the site remains active. | Web traffic coverage does not detect a builder-only handoff failure, and a conversion watcher can miss entry-volume collapse.           |

Considered but ruled out: error tracking is covered by its native responder; survey, revenue, AI, APM, CSP, warehouse, and support-channel surfaces were not confirmed; session replay is reserved for Replay Vision scanners. Both proposed custom scouts were approved and created. If either becomes noisy, set its scout config’s `emit` value to `false` in PostHog to keep it running in dry-run mode.

## Replay Vision scanners

A Replay Vision scanner is an LLM that watches individual session recordings on a schedule and pushes credible on-screen defects to the inbox. It is the only part of this setup that spends Replay Vision quota; findings arrive at half weight and require corroboration before they are promoted into a report.

| Required monitor         | Result  | Scope / estimate                                                                                                                                                        |
| ------------------------ | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Breakage monitor         | Skipped | The required shared Replay Vision brief was unavailable in this environment, so no locked scaffold or completion-flow query was invented. Spend could not be estimated. |
| User-frustration monitor | Skipped | The required shared Replay Vision brief was unavailable in this environment, so no locked scaffold was invented. Spend could not be estimated.                          |

Session Replay is enabled, but the project has no recordings yet. Once the two monitors are created from their shared briefs, they can start working as recordings arrive.

## Files modified or created

| File                             | Change                     |
| -------------------------------- | -------------------------- |
| `posthog-self-driving-report.md` | Created this setup report. |

No application source files were modified.

## Follow-ups

- [ ] Connect an inbound Support channel (email, inbox, or Slack) in PostHog so the enabled ticket responder can receive tickets.
- [ ] Set up the breakage and user-frustration Replay Vision monitors in PostHog once the shared scanner briefs are available; Session Replay is on, but no recordings have arrived yet.
- [ ] If using tool-specific work items later, enable the corresponding connected-tool responder after explicitly selecting and connecting GitHub Issues, Linear, Jira, Sentry, or Zendesk.
- [ ] Consider enabling `signals-scout-web-vitals` after web performance capture is enabled, and the specialist scouts for any newly adopted survey, revenue, AI, logs, CSP, support, warehouse, or experiment surface.
- [ ] The custom scouts should verify their exact live event schema before their first deep investigation; the current MCP connection lacks the event-schema read scope.

## What happens next

The scout coordinator should pick up the fresh configurations within about 30 minutes. Runs draw from the verified 100-run daily early-access budget, findings cluster into reports in the Self-driving inbox, and immediately actionable findings can begin coding tasks.
