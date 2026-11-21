# Security Policy

The Central Macatuba - ID documentation project takes security reports
seriously. This policy applies to this repository, its documentation website,
its build and deployment workflows, and the code and examples maintained here.

## Reporting a vulnerability

Please do not disclose suspected vulnerabilities in a public issue, pull
request, discussion, or other public channel.

Use GitHub's private vulnerability reporting for this repository:

1. Open the repository on GitHub.
2. Select **Security** → **Advisories**.
3. Choose **Report a vulnerability** and submit the report privately.

If the private reporting option is unavailable, do not publish technical
details. Contact the repository maintainers through an existing private
communication channel associated with the project and ask for a secure
reporting route.

## What to include

A useful report should include, where possible:

- A concise description and the affected URL, file, workflow, or component.
- Reproduction steps and the expected versus actual behavior.
- The potential security impact and realistic attack prerequisites.
- Relevant logs, screenshots, or proof-of-concept material, with secrets and
  personal data removed.
- Any suggested mitigation.

Please avoid accessing, modifying, or deleting data that does not belong to
you; do not disrupt service availability; and stop testing once the issue is
confirmed.

## Scope

This policy covers security weaknesses in:

- The published documentation site and its configuration.
- Repository permissions, GitHub Actions workflows, and deployment settings
  maintained in this repository.
- Dependencies and build tooling used by this documentation project.
- Security-sensitive instructions or executable examples maintained here.

This repository is for public documentation. Reports about vulnerabilities
in the identity service or other Central Macatuba services should be directed
through the responsible service's established private reporting channel,
rather than disclosed in this documentation repository.

## Coordinated disclosure

Please allow the maintainers a reasonable opportunity to investigate and
prepare a fix before making vulnerability details public. Do not assume a
specific response or remediation deadline; the maintainers will coordinate
next steps with the reporter where possible.

Public disclosure should avoid exposing users to unnecessary risk and should
take applicable legal and privacy requirements into account.

## Supported versions

Security fixes are generally applied to the current maintained version of
the documentation and its deployment configuration. Older commits and
unmaintained branches may not receive updates.
