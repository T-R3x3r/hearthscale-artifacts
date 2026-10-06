# Artifacts

The Hearthscale app that makes a page run. Attach it to any app, and that
app's agent can show you a single page it writes — a calculator, a form, a
small tool — right in the conversation, where the page's own script answers
your clicks. The bar Hearthscale draws over the page moves it into a tab
of its own or over the chat, and back.

Artifacts is a headless app: it has no rail button. It offers its one tool,
`show`, to the apps you attach it to on their settings pages.

## What a page may reach

Nothing. A page runs in a frame with `sandbox="allow-scripts"` and no
`allow-same-origin`, so it runs on an opaque origin: it reaches neither the
view around it nor the window. The frame inherits the view's policy, and
Artifacts declares no host in `environment.network`, so every request the
page tries is refused. The page has no route back to the model: the agent
does not see it, and the view hears nothing the page sends.

## What it reads

Nothing. The page travels in the call's own input, `title` and `html`, and
the view renders it under that call. The backend keeps nothing and reads no
file; a conversation keeps every page it showed, each under its call.

## The folder

| File | What it is |
| --- | --- |
| `app.json` | The manifest: one tool, offered to the apps Artifacts is attached to, and the view that renders its calls. |
| `backend.js` | The tool body: it checks the input and tells the agent the page is on screen. |
| `views/page.js` | The view, a module with no build step: a bar with Run again, and Back to the chat in a tab of its own, and the page's frame. |
| `icon.svg` | The mark the client draws wherever the app appears. |

## Working on it

With a Hearthscale platform running on this machine:

```
hearthscale dev .
```

links this folder into the running platform, picks up every change, and
asks once in the window before any code runs.

## Releasing

Install the Hearthscale registry's GitHub App on this repository once. Then
every release whose tag equals `version` in `app.json` is picked up by the
Marketplace.

```
hearthscale pack .
```

builds the package to attach to the release.

## Licence

MIT. See `LICENSE`.
