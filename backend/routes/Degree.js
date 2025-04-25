const { Router } = require("express");
const Degree_Model = require("../models/Degree");
const DegreeRouter = Router();

DegreeRouter.post("/search", async (req, res, next) => {
  try {
    let search = {};
    if (req.body?.data) {
      search = req.body.data;
    }

    const dataOut = await Degree_Model.find(search);

    res.status(200).send(dataOut);
  } catch (error) {
    console.log(error);
    res.status(404).send({
      success: false,
      message: error,
    });
  }
});

DegreeRouter.post("/", async (req, res, next) => {
  try {
    const {
      body: { data },
    } = req;

    // Check if data is an array
    if (!Array.isArray(data)) {
      return res.status(400).send("Data must be an array of items.");
    }

    const dataOut = await Degree_Model.insertMany(data);

    res.status(200).send(dataOut);
  } catch (error) {
    console.error("Error during insert:", error);
    res.status(500).send({
      success: false,
      message:
        error.message || "An error occurred while processing your request.",
    });
  }
});

DegreeRouter.put("/:_id", async (req, res, next) => {
  try {
    const {
      body: { data },
      params: { _id },
    } = req;

    const dataOut = await Degree_Model.findByIdAndUpdate({ _id }, data);

    res.status(200).send(dataOut);
  } catch (error) {
    res.status(404).send({
      success: false,
      message: error,
    });
  }
});

module.exports = { route: DegreeRouter, name: "Degree" };
