/**
 * The Artifacts view: the page an agent showed, under the call that showed
 * it, in a tab of its own or over the chat. The page runs in a frame with
 * `sandbox="allow-scripts"` and no `allow-same-origin`, so it runs on an
 * opaque origin: it reaches neither this view's bridge nor the window, and
 * this view hears nothing it sends. The frame inherits the view's policy,
 * under which it reaches no network.
 */
import {
  App,
  PostMessageTransport,
  McpUiMessageResultSchema as Answer,
} from '@modelcontextprotocol/ext-apps';

const SHEET = `
html, body { margin: 0; }
html[data-mode='fullscreen'], html[data-mode='fullscreen'] body,
html[data-mode='fullscreen'] .artifacts-root { height: 100%; }
.artifacts-root { display: flex; flex-direction: column; }
.artifacts-bar {
  flex: none; display: flex; align-items: center; gap: 4px;
  height: 38px; box-sizing: border-box; padding: 0 8px 0 14px;
  border-bottom: var(--bw) solid var(--tipline);
}
.artifacts-title {
  flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  font-size: var(--fs-sm); color: var(--mut);
}
.artifacts-glyph { display: block; width: 1em; height: 1em; line-height: 1; }
/* A tip shows in the bar beside its button: its plate is translucent and
   does not read over a page, which draws its own background. */
.artifacts-tip { top: 50%; right: calc(100% + 4px); transform: translateY(-50%); }
.hs-shell .hs-panel-button:active .artifacts-glyph { transform: var(--press); opacity: var(--press-fade); }
.artifacts-page { display: block; width: 100%; height: 440px; border: 0; }
html[data-mode='fullscreen'] .artifacts-page { flex: 1; height: auto; min-height: 0; }
`;

const app = new App({ name: 'Artifacts', version: '1.0.0' }, {});

/** A Remix Icon by its remixicon.com name, at a size in pixels. */
function glyph(name, size) {
  const mark = document.createElement('i');
  mark.className = `ri-${name} artifacts-glyph`;
  mark.style.fontSize = `${size}px`;
  mark.setAttribute('aria-hidden', 'true');
  return mark;
}

/** A square button of the bar with its tooltip, which a press closes
 *  until the pointer leaves. */
function barButton(onPress) {
  const button = document.createElement('span');
  button.className = 'hs-hovbox-ink hs-tipwrap hs-inkdim hs-panel-button';
  button.setAttribute('role', 'button');
  button.tabIndex = 0;
  const tip = document.createElement('span');
  tip.className = 'hs-tip hs-tooltip artifacts-tip';
  tip.dataset.sub = 'false';
  const words = document.createElement('span');
  words.className = 'hs-tooltip-title';
  tip.append(words);
  button.addEventListener('pointerdown', () => {
    button.dataset.tipClosed = 'true';
  });
  button.addEventListener('mouseleave', () => {
    delete button.dataset.tipClosed;
  });
  button.addEventListener('click', onPress);
  button.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    onPress();
  });
  return {
    element: button,
    set(icon, label) {
      button.setAttribute('aria-label', label);
      words.textContent = label;
      button.replaceChildren(glyph(icon, 14), tip);
    },
  };
}

const root = document.createElement('div');
root.className = 'artifacts-root';
const bar = document.createElement('div');
bar.className = 'artifacts-bar';
const title = document.createElement('span');
title.className = 'artifacts-title';

/** The page as the call gave it; null until the input arrives. */
let html = null;
let page = null;

/** Loads the page in a new frame, from its first state. */
function run() {
  if (html === null) return;
  const frame = document.createElement('iframe');
  frame.className = 'artifacts-page';
  frame.setAttribute('sandbox', 'allow-scripts');
  frame.setAttribute('referrerpolicy', 'no-referrer');
  frame.title = title.textContent;
  frame.srcdoc = html;
  if (page) page.replaceWith(frame);
  else root.append(frame);
  page = frame;
}

const again = barButton(run);
again.set('refresh-line', 'Run again');

/** Where the host draws the view. */
const mode = () => app.getHostContext().displayMode;

/** The way back under the call from a tab of its own, where the host
 *  draws no bar of its own over the view. */
const back = barButton(() => {
  void app.requestDisplayMode({ mode: 'inline' });
});
back.set('fullscreen-exit-line', 'Back to the chat');

/** The bar and the page's box for where the host draws the view. */
function place() {
  document.documentElement.dataset.mode = mode();
  back.element.hidden = mode() !== 'fullscreen';
}

bar.append(title, again.element, back.element);
root.append(bar);

app.ontoolinput = ({ arguments: input }) => {
  title.textContent = input.title;
  html = input.html;
  run();
  // The tab the page moves into takes its title.
  app
    .request({ method: 'hearthscale/ui/set-tab', params: { title: input.title } }, Answer)
    .catch(() => {});
};
app.onhostcontextchanged = place;

const style = document.createElement('style');
style.textContent = SHEET;
document.head.append(style);
document.body.append(root);

await app.connect(new PostMessageTransport(window.parent, window.parent));
place();
