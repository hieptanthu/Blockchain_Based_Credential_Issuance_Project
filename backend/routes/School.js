const { Router } = require("express");
const School_Model = require("../models/School");
const SchoolRouter = Router();

SchoolRouter.post("/search", async (req, res, next) => {
  try {
    let search = {};
    if (req.body?.data) {
      search = req.body.data;
    }

    const dataOut = await School_Model.find(search);

    res.status(200).send(dataOut);
  } catch (error) {
    console.log(error);
    res.status(404).send({
      success: false,
      message: error,
    });
  }
});

SchoolRouter.post("/", async (req, res, next) => {
  try {
    const {
      body: { data },
    } = req;

    const dataOut = await School_Model.create(data);
    res.status(200).send(dataOut);
  } catch (error) {
    res.status(404).send({
      success: false,
      message: error,
    });
  }
});

SchoolRouter.put("/:_id", async (req, res, next) => {
  try {
    const {
      body: { data },
      params: { _id },
    } = req;

    const dataOut = await School_Model.findByIdAndUpdate({ _id }, data);

    res.status(200).send(dataOut);
  } catch (error) {
    res.status(404).send({
      success: false,
      message: error,
    });
  }
});

module.exports = { route: SchoolRouter, name: "School" };
