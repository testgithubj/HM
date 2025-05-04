const express = require("express");
const expenses = require("./expenses");

const router = express.Router();

router.post("/add", expenses.addItems);
router.get("/viewallexpenses/:hotelId", expenses.getAllItems);
router.get("/viewexpensesforchart/:hotelId", expenses.getExpensesForChart);
router.get("/viewSinlgeExpenses/:hotelId/:id", expenses.getSingleItems);
router.patch("/delete/:id", expenses.deleteItem);
router.patch("/edit/:id", expenses.editItem);
router.get("/viewSinlgeExpenses/:hotelId/:id", expenses.getSingleItems);

router.get("/viewByDate/:id/:date", expenses.getExpensesByDate);

module.exports = router;
