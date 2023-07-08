const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://server-side-8bnl.onrender.com',
      changeOrigin: true,
    })
  );
};

