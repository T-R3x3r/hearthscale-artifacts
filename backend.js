'use strict';
/**
 * The Artifacts backend: the one tool an agent calls to show a page. The
 * page travels in the call's input, which the `page` view renders under
 * the call; the backend keeps nothing and reads no file.
 */

module.exports = {
  tools: {
    show(input) {
      const title = input.title.trim();
      if (!title) throw new Error('title names the page in a few words');
      if (!input.html.trim()) throw new Error('html holds no page');
      return (
        `"${title}" is on screen under this call, and its own script is running. ` +
        'The person sees it; you do not, and it cannot send you anything.'
      );
    },
  },
};
