// Convert request failures into consistent JSON error responses.

module.exports = function (app) {
  app.use((error, req, res, next) => {
    if (res.headersSent) return next(error);
    const status = error.status || (error.name === 'ValidationError' ? 400 : 500);
    if (status === 500) console.error('Request failed:', error.message);
    res.status(status).json({ error: status === 500 ? 'Unable to complete this request.' : error.message });
  });
};
