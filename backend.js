'use strict';
/**
 * The artifacts plugin's backend: one published tool that names a page and
 * never reads one. `run.artifact` hands the path to the core, which
 * measures it against the roots of the app whose session called the tool
 * and answers the id its document is served under; the record kept here is
 * that id and the name the panel prints.
 */
const { defineApp, p } = require('@hearthscale/app');

/** The one record the panel reads: the artifact this plugin last raised. */
const CURRENT = 'artifact';

module.exports = defineApp({
  async activate(ctx) {
    await ctx.tools.register({
      name: 'artifact_show',
      parameters: p.object(
        { path: p.string('The absolute path of the .html file to show') },
        ['path'],
      ),
      execute: async (args, run) => {
        const path = String(args.path);
        const id = await run.artifact(path);
        const name = path.split(/[\\/]/).pop();
        await ctx.store.set(CURRENT, { id, name, path });
        await ctx.events.emit({ type: 'shown', data: { id }, durable: false });
        return (
          `${name} is on screen in the Artifact panel and its own script is running. ` +
          `The person sees it; you do not, and it cannot send you anything.`
        );
      },
    });
  },
});
