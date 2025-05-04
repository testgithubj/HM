const inventory = require("../../model/schema/inventory");
const mongoose = require("mongoose");


// add item code
const addItems = async (req, res) => {
    try {
      // Add created date to the body
      req.body.createdDate = new Date();
  
      // Try to create a new laundry item
      const laundaryObject = await inventory.create(req.body);
  
      // Check if the item was created successfully
      if (laundaryObject) {
        res.status(201).json(laundaryObject); // Status 201 for successful creation
      } else {
        // If no item was created, return a bad request error
        res.status(400).json({ error: "Failed to Add item" });
      }
    } catch (err) {
      // Log detailed error for debugging
      console.error("Failed to add item:", err);
  
      // Return a generic error message to the client
      res.status(500).json({ error: "Internal server error. Failed to Add item." });
    }
  };

//   display item code
  const getAllItems = async (req, res) => {
    const hotelId = req.params.hotelId;
  
    try {
      const laundaryData = await inventory.find({ hotelId }).sort({ createdDate: -1 });
      if (!laundaryData)
        return res.status(404).json({ message: "no Data Found." });
      res.status(200).json({ laundaryData });
    } catch (error) {
      console.error("Failed to fetch Laundary data:", error);
      res.status(400).json({ error: "Failed to fetch Laundary data" });
    }
  };

//   display f&b item

const getAllFandBItems = async (req, res) => {
    const hotelId = req.params.hotelId;
  
    try {
      // Update the query to filter items by department "F&B"
      const laundaryData = await inventory.find({ hotelId, department: 'F&B' }).sort({ createdDate: -1 });
      
      if (!laundaryData || laundaryData.length === 0) {
        return res.status(404).json({ message: "No Data Found for F&B Department." });
      }
      
      res.status(200).json({ laundaryData });
    } catch (error) {
      console.error("Failed to fetch Laundary data:", error);
      res.status(400).json({ error: "Failed to fetch Laundary data" });
    }
  };

//   display kitechen item only

const getAllKitchenItems = async (req, res) => {
    const hotelId = req.params.hotelId;
  
    try {
      // Update the query to filter items by department "F&B"
      const laundaryData = await inventory.find({ hotelId, department: 'Kitchen' }).sort({ createdDate: -1 });
      
      if (!laundaryData || laundaryData.length === 0) {
        return res.status(404).json({ message: "No Data Found for F&B Department." });
      }
      
      res.status(200).json({ laundaryData });
    } catch (error) {
      console.error("Failed to fetch Laundary data:", error);
      res.status(400).json({ error: "Failed to fetch Laundary data" });
    }
  };
  
//   display House Keeping item only

const getAllHouseKeepingItems = async (req, res) => {
    const hotelId = req.params.hotelId;
  
    try {
      // Update the query to filter items by department "F&B"
      const laundaryData = await inventory.find({ hotelId, department: 'House Keeping' }).sort({ createdDate: -1 });
      
      if (!laundaryData || laundaryData.length === 0) {
        return res.status(404).json({ message: "No Data Found for F&B Department." });
      }
      
      res.status(200).json({ laundaryData });
    } catch (error) {
      console.error("Failed to fetch Laundary data:", error);
      res.status(400).json({ error: "Failed to fetch Laundary data" });
    }
  };

//   display Laundary items only
const getAllLaundryItems = async (req, res) => {
    const hotelId = req.params.hotelId;
  
    try {
      // Update the query to filter items by department "F&B"
      const laundaryData = await inventory.find({ hotelId, department: 'Laundary' }).sort({ createdDate: -1 });
      
      if (!laundaryData || laundaryData.length === 0) {
        return res.status(404).json({ message: "No Data Found for F&B Department." });
      }
      
      res.status(200).json({ laundaryData });
    } catch (error) {
      console.error("Failed to fetch Laundary data:", error);
      res.status(400).json({ error: "Failed to fetch Laundary data" });
    }
  };

//   update code
  const editItem = async (req, res) => {
    console.log("in editItem controller ..... ======>",req.params.id);
    console.log("req.body ..... ======>",req.body);
  
    
    try {
      let result = await inventory.updateOne(
        { _id: req.params.id },
        { $set: req.body }
      );
      res.status(200).json(result);
    } catch (err) {
      console.error("Failed to Update Laundary:", err);
      res.status(400).json({ error: "Failed to Update Laundary" });
    }
  };

//   item delete code
const deleteItem = async (req, res) => {
  try {
    const item = await inventory.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "done", item });
  } catch (err) {
    res.status(404).json({ message: "error", err });
  }
};

module.exports = {
    addItems,
    getAllItems,
    editItem,
    deleteItem,
    getAllFandBItems,
    getAllKitchenItems,
    getAllHouseKeepingItems,
    getAllLaundryItems,
  };
  