const { Router } = require("express");
const Degree_Model = require("../models/Degree");
const ExcelJS = require("exceljs");
const imageSize = require("image-size").default;
const QRCode = require("qrcode");
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
      body: { data, user_address, urlClient },
    } = req;

    data.forEach((item) => {
      item.school_address = user_address;
      item.status = true;
      item.address_user_create = user_address;
    });

    const dataOut = await Degree_Model.insertMany(data);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Degrees");

    // Thêm tiêu đề cột
    worksheet.columns = [
      { header: "Code", key: "code", width: 20 },
      { header: "School Address", key: "school_address", width: 30 },
      { header: "Status", key: "status", width: 10 },
      { header: "Object ID", key: "objectId", width: 25 },
      { header: "User Created", key: "address_user_create", width: 30 },
      { header: "Created At", key: "createdAt", width: 20 },
      { header: "Updated At", key: "updatedAt", width: 20 },
      { header: "QR Code", key: "qr_code", width: 30 },
    ];

    for (let i = 0; i < dataOut.length; i++) {
      const degree = dataOut[i];
      const qrCodeURL = urlClient + degree.objectId;
      const qrCodeDataUrl = await QRCode.toDataURL(qrCodeURL);
      const imgBuffer = Buffer.from(qrCodeDataUrl.split(",")[1], "base64");
      const dimensions = await imageSize(imgBuffer);
      const imageId = workbook.addImage({
        base64: imgBuffer.toString("base64"),
        extension: "png",
      });

      const row = worksheet.addRow({
        ...degree.toObject(),
      });

      row.height = (dimensions.height || 100) * 0.75 + 10;

      worksheet.addImage(imageId, {
        tl: { col: 7, row: i + 1 },
        ext: { width: dimensions.width, height: dimensions.height },
      });
    }

    const buffer = await workbook.xlsx.writeBuffer();
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=degrees.xlsx");
    res.status(200).send(buffer);
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
      body: { status },
      params: { _id },
    } = req;

    const dataOut = await Degree_Model.findByIdAndUpdate(
      { _id },
      { status: status }
    );

    res.status(200).send(dataOut);
  } catch (error) {
    res.status(404).send({
      success: false,
      message: error,
    });
  }
});

module.exports = { route: DegreeRouter, name: "Degree" };
