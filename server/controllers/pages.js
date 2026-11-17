// Render HTML pages using the existing shared header and footer.
const fs = require('node:fs');
const path = require('node:path');

const client = path.join(__dirname, '../../client');

// Existing pages request handlers. Each function receives an Express request and response.
module.exports = function () {
  return {
    // Send the root URL to the home page.
    redirectHome: (req, res) => res.redirect('/index.html'),
    // Insert the existing header and footer before serving an HTML page.
    renderPage: (req, res, next) => {
      const file = path.join(client, path.basename(req.path));
      if (!fs.existsSync(file)) return next();
      let html = fs.readFileSync(file, 'utf8');
      for (const part of ['header', 'footer']) html = html.replace(`<!-- shared:${part} -->`, fs.readFileSync(path.join(__dirname, '../partials', part + '.html'), 'utf8'));
      res.type('html').send(html);
    }
  };
};
