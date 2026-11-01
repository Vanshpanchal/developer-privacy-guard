# Developer Privacy Guard

Local-first sanitizer for developer logs, configuration, and code. Use the browser interface or the Obsidian desktop plugin. Review every output; a completed scan does not guarantee that all sensitive data was found.

## Build and test

```bash
npm ci
npm run lint
npm run typecheck
npm test
npm run evaluate
npm run benchmark
npm run build
```

## Web interface

The static site is in `web/`. After `npm run build`, serve that folder with any static file server. For example:

```bash
python3 -m http.server 8000 --directory web
```

Keep that command running in a terminal and open `http://localhost:8000`. Stop the preview with Ctrl+C. The browser downloads the app and scans text locally. There is no application backend, account, upload, telemetry, cookie, or browser storage. Input, output, and identifier mappings stay in tab memory and are cleared with **Clear session** or when the tab closes. The site loads no remote fonts or scripts. A static host can observe ordinary page requests, but the app does not send pasted text to it.

### Publish with GitHub Pages

The [Pages workflow](.github/workflows/pages.yml) checks the project, builds the site, and publishes only the `web/` folder on each push to `main`. Its relative asset paths work under a project URL such as `https://<owner>.github.io/<repository>/`.

1. If this folder has no Git metadata, run `git init -b main`. Review `git status`, commit the project, create a public GitHub repository, and push `main`. Do not commit `node_modules`, local `.env` files, or real logs and credentials.
2. In the repository, open **Settings → Pages → Build and deployment** and set **Source** to **GitHub Actions**.
3. Check the **Actions** tab for the **Publish web app to GitHub Pages** workflow. When deployment succeeds, use the URL shown in **Settings → Pages**.

The workflow can also be run manually from the Actions tab. Publishing requires a repository and GitHub Pages enabled; this local folder alone is not a live website.

## Obsidian plugin

The plugin is in `obsidian-plugin/`. Copy its compiled `main.js`, `manifest.json`, and `styles.css` into `<vault>/.obsidian/plugins/developer-privacy-guard/`, reload Obsidian, and enable **Developer Privacy Guard** in Settings → Community plugins. Open it from the shield ribbon icon or command palette. Assign a shortcut through Obsidian's Hotkeys settings. Obsidian saves plugin preferences and custom regex definitions; raw pasted input and session identifiers are not saved.

## Design

`web` contains the static browser interface. `obsidian-plugin/src` contains the Obsidian view and settings tab. Both import the same `src/core` scanner and `src/detectors` rules. `tests` contains regression tests, a synthetic evaluation script, and benchmarks.

Scanning is manual. No verification API is used. See `SECURITY.md` for the threat model and limitations.
