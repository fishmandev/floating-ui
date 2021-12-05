const visit = require('unist-util-visit');
const shiki = require('shiki');
const path = require('path');
const fs = require('fs');

module.exports = () =>
  async function transformer(tree) {
    const highlighter = await shiki.getHighlighter({
      theme: JSON.parse(
        fs.readFileSync(
          path.join(__dirname, 'assets', 'moonlight-ii.json'),
          'utf-8'
        )
      ),
    });

    const loadedLanguages = highlighter.getLoadedLanguages();
    const ignoreUnknownLanguage = true;

    visit(tree, 'code', visitor);

    function visitor(node) {
      const lang =
        ignoreUnknownLanguage &&
        !loadedLanguages.includes(node.lang)
          ? null
          : node.lang;

      const highlighted = highlighter.codeToHtml(
        node.value,
        lang
      );
      node.type = 'html';
      node.value = highlighted;
    }
  };
