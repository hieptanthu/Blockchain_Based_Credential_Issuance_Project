const SchoolRouter = require("./School");
const allRoutes = [SchoolRouter];

const initializeRoutes = (app) => {
  allRoutes.forEach((router) => {
    app.use(`/${router.name}`, router.route);
  });
  return app;
};

module.exports = { initializeRoutes };
