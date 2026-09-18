# Project declaration

> **This file is a template. Fill it in before the first change, and delete this blockquote.**
>
> Until it is filled in, the fleet has no declared stack and will stop before prescribing anything
> technical — deliberately. A stack chosen by accident, through whatever library the first agent
> reached for, is the most expensive default there is.
>
> Replace every `TODO` below. Delete any section that genuinely does not apply, rather than leaving
> it empty — an empty section reads as an unanswered question and will be re-asked at every gate.

## What this system is

TODO — two or three sentences. What it does, for whom, and the one thing it must not get wrong.

## Runtime and language

| | |
|---|---|
| Language and version | TODO |
| Pinned by | TODO — the lockfile or manifest that is authoritative |
| One command to build | `TODO` |
| One command to test | `TODO` |
| One command to lint and format | `TODO` |
| One command to type-check | `TODO` |
| Coverage bar | TODO — the number, and what it is measured over |

If any of these takes more than one command, that is a defect in the project rather than a fact about
it. Fix it before the first change; every agent and every new person pays that tax otherwise.

## Frameworks and libraries

- **Web / API**: TODO
- **Data access**: TODO
- **Background work**: TODO
- **Frontend**: TODO
- **Testing**: TODO

State which layer owns what, not just the names. "Which layer owns validation" is the question that
comes up in every review otherwise.

## Datastores

| Store | Holds | Migrations run by |
|---|---|---|
| TODO | TODO | TODO |

Note the credential shape tests expect locally — not just the version. See **testing-strategy**; this
one costs a day per person when it is left implicit.

## Identity and authorization

- **How a request proves who it is**: TODO
- **Where the authorization check happens**: TODO
- **Acting as the user versus as the service**: TODO — when each is correct
- **What gets audited, and where the event is emitted**: TODO

## Secrets

- **Where they live**: TODO
- **How a process obtains one**: TODO — federated or managed identity preferred; a static secret is an
  exception that needs a reason
- **Never**: in source, in a log, in an error, in a test fixture, in a manifest, or in an artifact

## Service boundaries

| Service | Owns | Talks to | Over |
|---|---|---|---|
| TODO | TODO | TODO | TODO |

## Deployment

- **Target**: TODO
- **Pipeline**: TODO — the central template's location
- **Artifact signing**: TODO
- **Infrastructure as code**: TODO
- **Rollback bar**: TODO — the time limit, with no rebuild

## Observability

- **Log shape**: TODO
- **Metrics**: TODO
- **Correlation id**: TODO — its name, where it is created, and how it propagates

## Conventions this project has settled

Anything an agent would otherwise re-litigate. Commit message format, error-handling shape, naming,
directory layout, API versioning, the language-specific spelling of the **clean-code** rules.

- TODO

## Recorded exceptions

Deviations from the above that a human approved. Each one names its ADR. A deviation with no ADR will
be re-litigated within the month.

| Deviation | Approved | ADR |
|---|---|---|
| — | — | — |
