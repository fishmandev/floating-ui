/* eslint-disable @typescript-eslint/no-var-requires */
const shiki = require('shiki');
const fs = require('fs');
const path = require('path');
const {JSDOM} = require('jsdom');

shiki
  .getHighlighter({
    theme: JSON.parse(
      fs.readFileSync(
        `${__dirname}/assets/moonlight-ii.json`,
        'utf-8'
      )
    ),
  })
  .then((highlighter) => {
    const content = fs.readFileSync(
      path.join(__dirname, 'out', 'index.html'),
      'utf-8'
    );

    const dom = new JSDOM(content);
    dom.window.document
      .querySelectorAll('pre > code')
      .forEach((codeBlock) => {
        codeBlock.innerHTML = highlighter.codeToHtml(
          codeBlock.innerHTML,
          'js'
        );
        fs.writeFileSync(
          path.join(__dirname, 'out', 'index.html'),
          dom.serialize()
        );
      });
  });
