const multer = require("multer");
const fs = require("fs");
const path = require("path");
const restaurant = require("../../model/schema/restaurant");
const mongoose = require("mongoose");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = "uploads/restaurant/Item";
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uploadDir = "uploads/restaurant/Item";
    const fileName = file.originalname;
    const filePath = path.join(uploadDir, fileName);

    if (fs.existsSync(filePath)) {
      const timestamp = Date.now() + Math.floor(Math.random() * 90);
      const uniqueFileName = `${fileName.split(".")[0]}-${timestamp}.${
        fileName.split(".")[1]
      }`;
      cb(null, uniqueFileName);
    } else {
      cb(null, fileName);
    }
  },
});

const upload = multer({ storage });

const addItems = async (req, res) => {
  console.log("req.body =>", req.body);
  console.log("req.file =>", req.file);

  // Validate if the image is uploaded
  if (!req.file) {
    return res.status(400).json({ error: "Image is required to add the item" });
  }

  try {
    req.body.createdDate = new Date();
    let imagePath = `uploads/restaurant/Item/${req.file.filename}`;
    console.log("image path==============>", imagePath);

    // Check if an item with the same name and category already exists
    const existingItem = await restaurant.findOne({
      hotelId: req.body.hotelId,
      category: req.body.category,
      itemName: req.body.itemName,
    });

    if (existingItem) {
      return res
        .status(400)
        .json({ error: "Item with the same name and category already exists" });
    }

    // Create new item if no duplicate is found
    const restaurantObj = new restaurant({
      hotelId: req.body.hotelId,
      category: req.body.category,
      itemName: req.body.itemName,
      itemImage: imagePath,
      amount: req.body.amount,
      createdDate: req.body.createdDate,
    });

    console.log("restaurant obj =>", restaurantObj);
    await restaurantObj.save();

    res.status(200).json(restaurantObj);
  } catch (err) {
    console.error("Failed to add item:", err);
    res.status(400).json({ error: "Failed to add item" });
  }
};

//view all item api-------------------------
const getAllItems = async (req, res) => {
  const hotelId = req.params.hotelId;
  try {
    let restaurantData = await restaurant.aggregate([
      {
        $match: {
          hotelId: new mongoose.Types.ObjectId(hotelId),
        },
      },
      {
        $project: {
          _id: 1,
          category: 1,
          itemName: 1,
          amount: 1,
          createdDate: 1,
          itemImage: 1,
        },
      },
      {
        // Sort by createdDate in descending order
        $sort: { createdDate: -1 },
      },
    ]);

    if (!restaurantData || restaurantData.length === 0)
      return res.status(404).json({ message: "No Data Found." });
    res.status(200).json({ restaurantData });
  } catch (error) {
    console.error("Failed to fetch item data:", error);
    res.status(400).json({ error: "Failed to fetch item data" });
  }
};

//delete specific item api----------------
const deleteItem = async (req, res) => {
  try {
    console.log("req.params.id ==>", req.params.id);
    const item = await restaurant.deleteOne({ _id: req.params.id });
    console.log("item =>", item);

    res.status(200).json({ message: "delete successfully!!", item });
  } catch (err) {
    res.status(404).json({ message: "error", err });
  }
};

const importItem = async (req, res) => {
  console.log("in importItem controller");
  console.log("req.params =>", req.params.id);
  console.log("==>", req.body);

  const items = req.body;
  console.log("items =>", items);

  if (!items || !Array.isArray(items)) {
    return res.status(400).send({ message: "Invalid data format" });
  }

  try {
    console.log("in try..me");
    const normalizedItems = items.map((item) => ({
      category: item["Category"],
      itemName: item["Item Name"],
      itemImage: item["Image"] || "uploads/restaurant/Item/foodImg.jpg",
      amount: item["Amount"],
      hotelId: req.params.id,
    }));

    console.log("normalizedItems==>", normalizedItems);
    await restaurant.insertMany(normalizedItems);
    res.status(200).send({ message: "Items imported successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Failed to import items" });
  }
};

const editItem = async (req, res) => {
  console.log("req.body on edit ............ =>", req.body);
  console.log("req.params.id =>", req.params.id);
  console.log("req.file =>", req.file);

  let imagePath = "";

  if (req.file === undefined) {
    // Find the current reservation
    const currentItem = await restaurant.findById(req.params.id);
    console.log("currentItem==>", currentItem);

    imagePath = currentItem.itemImage;
    console.log("imagePath if me  ==>", imagePath);
  } else {
    imagePath = `uploads/restaurant/Item/${req.file.filename}`;
    console.log("image path =====>", imagePath);
    console.log("filename else me  =>", req.file.filename);
  }

  try {
    console.log("in try..");

    const result = await restaurant.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          category: req.body.category,
          itemName: req.body.itemName,
          amount: req.body.amount,
          itemImage: imagePath,
        },
      },
      { new: true }
    );
    console.log(" result ===>", result);
    res.status(200).json({ result, message: "successfully Edit" });
  } catch (error) {
    console.log("error =>", error);
  }
};

const deleteManyItem = async (req, res) => {
  console.log("------ in deleteManyItem -------");
  try {
    console.log("in try...");
    const ids = req.body.data.ids;
    console.log("IDs to delete:", ids);

    const result = await restaurant.deleteMany({ _id: { $in: ids } });
    console.log("result =>", result);

    res.status(200).json({ message: "Items deleted successfully", result });
  } catch (error) {
    console.log("error ==>", error);
    res.status(500).json({ message: "Failed to delete items", error });
  }
};

module.exports = {
  addItems,
  deleteItem,
  upload,
  getAllItems,
  importItem,
  editItem,
  deleteManyItem,
};
