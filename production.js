'use strict';

export default (app, httpPort) => {
  app.enable('trust proxy');
  app.use((req, res, next) => {
    if (req.secure) {
      // request was via https, so do no special handling
      next();
    } else {
        // request was via http, so redirect to https
        // if express app run under proxy with sub path URL
        const proxypath = process.env.PROXY_PASS || ''

    res.redirect(`https://${req.headers.host}${proxypath}${req.url}`);
    }
  });

  app.listen(httpPort);
};
