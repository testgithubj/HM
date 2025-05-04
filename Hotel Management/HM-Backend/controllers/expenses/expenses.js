const expenses = require("../../model/schema/expense");
const {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} = require("date-fns");

const mongoose = require("mongoose");
const laundary = require("../../model/schema/laundary");

const { ObjectId } = require("mongoose").Types;
const moment = require("moment");

const addItems = async (req, res) => {
  try {
    const expensesObject = await expenses.create(req.body);
    res.status(200).json(expensesObject);
  } catch (err) {
    console.error("Failed to add expenses:", err);
    res.status(400).json({ error: "Failed to Add expenses" });
  }
};

//view all item api-------------------------
const getAllItems = async (req, res) => {
  const hotelId = new mongoose.Types.ObjectId(req.params.hotelId);
  console.log("hotel id aarh he ", hotelId);

  try {
    const expensesData = await expenses
      .find({ hotelId })
      .sort({ createdDate: -1 });
    console.log("expensesData ==>", expensesData);
    if (expensesData.length === 0)
      return res.status(204).json({ message: "no Data Found." });
    res.status(200).json({ expensesData });
  } catch (error) {
    console.error("Failed to fetch expenses data:", error);
    res.status(400).json({ error: "Failed to fetch expenses data" });
  }
};

//view single item api-------------------------
const getSingleItems = async (req, res) => {
  const hotelId = new mongoose.Types.ObjectId(req.params.hotelId);
  const expenseId = new mongoose.Types.ObjectId(req.params.id);
 
  try {
    const expensesData = await expenses.findOne({ hotelId, _id: expenseId });
 
    if (!expensesData) {
      return res.status(404).json({ message: "No data found." });
    }
 
    // Respond with the found data
    res.status(200).json({ expensesData });
  } catch (error) {
    // Handle errors
    console.error("Failed to fetch expenses data:", error);
    res.status(500).json({ error: "Failed to fetch expenses data." });
  }
};

// expense data for chart
const getExpensesForChart = async (req, res) => {
  const hotelId = new mongoose.Types.ObjectId(req.params.hotelId);
  const filterType = req.query.filterType || "month";

  try {
    let startDate, endDate;

    switch (filterType) {
      case "today":
        startDate = startOfDay(new Date());
        endDate = endOfDay(new Date());
        break;
      case "week":
        startDate = startOfWeek(new Date(), { weekStartsOn: 1 });
        endDate = endOfWeek(new Date(), { weekStartsOn: 1 });
        break;
      case "month":
      default:
        startDate = startOfMonth(new Date());
        endDate = endOfMonth(new Date());
        break;
    }

    const expensesData = await expenses.aggregate([
      {
        $match: {
          hotelId,
          createdDate: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: "$category",
          amount: { $sum: "$amount" },
        },
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          amount: "$amount",
        },
      },
    ]);

    const laundaryData = await laundary.aggregate([
      {
        $match: {
          hotelId,
          createdDate: {
            $gte: startDate,
            $lte: endDate,
          },
          status: true,
        },
      },
      {
        $group: {
          _id: "laundary",
          amount: { $sum: { $multiply: ["$amount", { $toInt: "$quantity" }] } },
        },
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          amount: "$amount",
        },
      },
    ]);

    if (!expensesData || expensesData.length === 0) {
      return res.status(404).json({ message: "No Data Found." });
    }

    // Merge expensesData and laundaryData
    const combinedData = [...expensesData, ...laundaryData];

    // Calculate total expense
    const totalExpense = combinedData.reduce(
      (total, item) => total + item.amount,
      0
    );

    res.status(200).json({ expensesData: combinedData, totalExpense });
  } catch (error) {
    console.error("Failed to fetch expenses data:", error);
    res.status(400).json({ error: "Failed to fetch expenses data" });
  }
};

//delete specific item api----------------
const deleteItem = async (req, res) => {
  try {
    const item = await expenses.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "done", item });
  } catch (err) {
    res.status(404).json({ message: "error", err });
  }
};

const editItem = async (req, res) => {
  try {
    let result = await expenses.updateOne(
      { _id: req.params.id },
      { $set: req.body }
    );
    res.status(200).json(result);
  } catch (err) {
    console.error("Failed to Update expenses:", err);
    res.status(400).json({ error: "Failed to Update expenses" });
  }
};

const getExpensesByDate = async (req, res) => {
  console.log("req.params data ===>", req.params);
  try {
    let matchedDateExpenses = [];
    console.log("In try block---------------------");
    const hotelId = new ObjectId(req.params.id);
    console.log("hotelId ==>", hotelId);

    const data = await expenses.find({
      hotelId: hotelId,
    });
    console.log(" data here ==>", data);

    if (data && data.length > 0) {
      const selectedDate = new Date(req.params.date);
      console.log("selectedDate ==>", selectedDate);

      const formattedSelectedDate = moment(selectedDate).format("YYYY-MM-DD");
      console.log("formattedSelectedDate ==>", formattedSelectedDate);

      for (let item of data) {
        const itemDate = moment(item.createdDate);
        const formattedItemDate = itemDate.format("YYYY-MM-DD");
        console.log("formattedItemDate ==>", formattedItemDate);

        if (formattedItemDate === formattedSelectedDate) {
          matchedDateExpenses.push(item);
          console.log("checkInDate is the same as selectedDate");
        } else {
          console.log("checkInDate is not the same as selectedDate");
        }
      }
      console.log("matchedDateExpenses======>", matchedDateExpenses);
    }
    res.status(200).json({
      message: "Successfully found data",
      matchedDateExpenses: matchedDateExpenses,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Failed to fetch reservation data" });
  }
};

module.exports = {
  addItems,
  deleteItem,
  getAllItems,
  editItem,
  getExpensesForChart,
  getExpensesByDate,
  getSingleItems
};
