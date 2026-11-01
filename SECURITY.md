---
tags: []
type: project-doc
status: draft
description: "Threat model, handling guidance and known scanner limits for Developer Privacy Guard."
project: developer-privacy-guard
created: 2026-11-01
updated: 2026-11-01
generated:
  by: codex/gpt-6
  at: 2026-11-01T01:55:47+05:30
---

# Security and limitations

## Threat model

The web app and Obsidian plugin help a developer reduce accidental disclosure when copying logs into an AI assistant. They cannot prove output safe. They perform no credential verification, remote lookup, telemetry, background scan or note read/write. Pasted input and token mappings are held in memory until cleared or the view or tab closes. The normal export action is the explicit copy button; scanner exceptions disable that button.

The web app is static and uses no backend, cookies, localStorage, IndexedDB, or service worker. Its content security policy blocks network connections from the app. A static host still receives ordinary requests for the page files, so use a trusted host. Browser extensions and other software with access to the page may still read its contents.

Session confidential identifiers and protected domains are held only in memory. The Obsidian plugin saves custom regex rule definitions in its settings; these must contain patterns rather than literal sensitive values. The web app has no persistent settings or custom regex editor.

Anonymization is not encryption. Placeholders may preserve enough context to infer a person or system. Public client identifiers and private credentials serve different purposes; do not treat a public key as a private secret or vice versa. Follow your organization's data-handling policy. Other installed Obsidian plugins can have broad access to the app, and clipboard managers or OS sync may retain copied output. For especially sensitive workflows, use a dedicated non-synced vault with a minimal plugin set.

## Known gaps

- Pattern matching misses uncommon, encoded, split, encrypted or novel credentials, contextual secrets, and arbitrary personal information. It cannot assess business confidentiality.
- The current provider detector set is curated, not Secretlint parity. Secretlint core and six individual vendor rules are bundled; its recommended preset, source creator and GCP rule failed a browser-targeted esbuild probe due to Node `fs` or `path` imports. See [Secretlint](https://github.com/secretlint/secretlint) and [Obsidian sample plugin](https://github.com/obsidianmd/obsidian-sample-plugin).
- The synthetic evaluation is a narrow controlled benchmark. A separate adversarial set in `tests/evaluate.ts` records misses. Passing it does not establish real-world precision or recall.
- Custom regex rules use a deliberately limited grammar. They may miss desired values; validate them with synthetic examples. User-entered rule text is persisted in settings, so do not put literal sensitive data into patterns.
- A malformed or split private key blocks export when a `BEGIN`/`END` count differs, but arbitrary PEM corruption or alternative key encodings can escape detection.
- Large inputs can cause transient memory and UI cost. A line longer than the chunk threshold is rejected; the 1 MB limit is an engineering cap, not a responsiveness guarantee.
- The read-only output area remains selectable for manual copying. A user can also copy raw input directly; neither interface controls OS clipboard history.

## Reporting

Open an issue in the project repository when one exists, using synthetic reproductions only. Never include a genuine credential or private log in a bug report.
