/**
 * The Artifact panel's body: a frame over the document the core serves at
 * `/artifact/<id>`. The frame carries `sandbox="allow-scripts"` and no
 * `allow-same-origin`, so the page runs on an opaque origin and reaches
 * neither this realm's bridge nor anything else of the product. Every
 * mount reads the record again and navigates the frame, so re-opening the
 * tab shows the file as it is on disc now.
 */
export default function activate(app) {
  app.panel('artifact', (element) => {
    element.style.cssText = 'height:100%;display:flex;flex-direction:column;';

    const empty = document.createElement('div');
    empty.textContent = 'Nothing yet. Ask for a page and it opens here.';
    empty.style.cssText =
      'flex:1;display:grid;place-items:center;padding:24px;text-align:center;' +
      'color:var(--dim);font-size:var(--fs-sm);';

    const frame = document.createElement('iframe');
    frame.setAttribute('sandbox', 'allow-scripts');
    frame.setAttribute('title', 'Artifact');
    frame.style.cssText = 'flex:1;width:100%;border:0;background:#fff;display:none;';

    element.append(empty, frame);

    const load = async () => {
      const record = await app.storage.remote.get('artifact');
      if (!record) return;
      frame.src = `/artifact/${record.id}`;
      frame.style.display = 'block';
      empty.style.display = 'none';
    };

    const off = app.events(`app:${app.app.id}/shown`, () => {
      void load();
    });
    void load();

    return () => {
      off();
      element.replaceChildren();
    };
  });
}
