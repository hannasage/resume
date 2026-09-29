# AGENTS.md: resume

This repository follows the Sage Ops standard:
`sageadvicellc/workbench`, `docs/specs/2026-09-27-sage-ops-standard.md`.

This repository sits under the `hannasage` GitHub account, not
`sageadvicellc`. Some parts of the standard assume an organization and do
not apply here. This section says which.

## What applies

- **Branch and gate discipline.** Branch from an updated `main`. Never
  commit directly to `main`. Run the four gates before every commit:
  `npm run typecheck`, `npm run lint`, `npm run test`, `npm run build`, all
  at zero errors. `.github/workflows/ci.yml` runs the same four gates on
  every pull request and on every push to `main`.
- **Draft pull requests.** Open every pull request as a draft. The project
  owner reviews and merges by hand; no automatic merger runs on this
  repository.
- **Public-repository hygiene.** This repository is public. A commit
  message, a pull request body, or an issue never names a person, quotes a
  private conversation, or links a private chat or session. Write "the
  project owner" in place of a name.
- **Commit attribution.** End a commit message and a pull request
  description with the attribution lines the working session gives you.

## What does not apply

- **The security reviewer.** `scripts/pr-security-review.py` runs in
  `sageadvicellc/workbench` only. No automated security review runs here.
- **`pm-merge` and the PR sweeper.** Both are `sageadvicellc`-only
  mergers. Every pull request here waits for the project owner.
- **Repository rulesets and GitHub Projects.** The standard's ruleset and
  Project-field sections assume an organization account. Neither is set
  up on this repository.
- **Sage Ops labels.** `github/labels.yml` in the workbench repository can
  register a public repository under a different account (see its
  `owner` field), but a live application depends on the standard's usual
  registration path, which needs settings this session could not read for
  this repository. Until that is resolved, this repository carries no
  Sage Ops labels.
