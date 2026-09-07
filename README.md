# Artifacts

The Hearthscale plugin that makes an artifact run. Attach its `artifacts`
connector to any app, place its **Artifact** panel into that app's window,
and the app's agent can raise a single `.html` page it wrote — a calculator,
a form, a small tool — where the page's own script answers clicks.

## What it may reach

Nothing. `disclosures.network` is empty, so the page is served under
`connect-src 'none'` and every request it tries is refused by the browser.
Its `script-src` is computed, on every load, from the hashes of that one
file's own inline scripts, so it runs its own code and no other. It has no
route back to the model: an artifact reads and draws, and the agent is what
calls a model.

## What it may read

The plugin names a path and never reads one. `artifact_show` hands the path
to the platform, which measures it against the roots of the app whose
session called the tool — so attaching this connector widens nothing that
app could not already open, and the plugin holds no root of its own.

## The folder

| File | What it is |
| --- | --- |
| `app.json` | The manifest: the `artifacts` connector, one tool, one panel. |
| `backend.js` | The tool body: it names the path and records the document. |
| `ui.js` | The panel: a sandboxed frame over the document the core serves. |
| `icon.svg` | The mark the client draws wherever the plugin appears. |

## Working on it

With a Hearthscale platform running on this machine:

```
hearthscale dev .
```

links this folder into the running platform and rebuilds on every change.

## Releasing

```
hearthscale pack .
```

builds the zip to attach to a GitHub release whose tag equals `version` in
`app.json`.

## Licence

MIT. See `LICENSE`.
