const { Router } = require("express");
const School_Model = require("../models/School");
const SchoolRouter = Router();

SchoolRouter.get("/", async (req, res, next) => {
  try {
    const dataOut = await School_Model.find({});

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
  console.log("post school");
  console.log("School_Model", School_Model);
  console.log("req.body", req.body);
  console.log("req.body.data", req.body.data);
  const dataOut = await School_Model.create(req.body.data);
  console.log(dataOut);
  res.status(200).send({
    success: true,
    message: "School successfully create",
    dataOut,
  });
  try {
    const {
      body: { data },
    } = req;

    console.log(data);

    const dataOut = await School_Model.create(data);
    console.log(dataOut);
    res.status(200).send({
      success: true,
      message: "School successfully create",
      dataOut,
    });
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

    res.status(200).send({
      success: true,
      message: "School successfully  put",
      dataOut,
    });
  } catch (error) {
    res.status(404).send({
      success: false,
      message: error,
    });
  }
});

module.exports = { route: SchoolRouter, name: "School" };
