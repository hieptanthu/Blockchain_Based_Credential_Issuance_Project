const SchoolRouter = require("./School");
const DegreeRouter = require("./Degree");
const allRoutes = [SchoolRouter, DegreeRouter];

const initializeRoutes = (app) => {
  allRoutes.forEach((router) => {
    app.use(`/${router.name}`, router.route);
  });
  return app;
};

module.exports = { initializeRoutes };
