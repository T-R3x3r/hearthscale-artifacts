# Developing Artifacts

`README.md` is the text the Marketplace shows under **About** on the listing of Artifacts, so it is written for the people who install it. This file is for the people who work on it.

Artifacts is a headless app: it has no rail button. It offers its one tool,
`show`, to the apps it is attached to on their settings pages. Its one view,
`page`, is a surface placed `inline` and in a `modal`: it draws under each
`show` result, and the bar moves it into a tab or over the chat. A surface
placed only there keeps the app headless.

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
| `app.json` | The manifest: one tool, offered to the apps Artifacts is attached to, and the view surface that renders its calls. |
| `backend.js` | The tool body: it checks the input and tells the agent the page is on screen. |
| `views/page.js` | The view, a module with no build step: a bar with Run again, and the page's frame. |
| `icon.svg` | The mark the client draws wherever the app appears. |

## Working on it

With a Hearthscale platform running on this machine:

```sh
hearthscale dev .
```

links this folder into the running platform, picks up every change, and
asks once in the window before any code runs.

## Releasing

Install the Hearthscale registry's GitHub App on this repository once. Then
every release whose tag equals `version` in `app.json` is picked up by the
Marketplace.

```sh
hearthscale pack .
```

builds the package to attach to the release.

## Licence

MIT. See `LICENSE`.
