const { isUser, isAdmin } = require("../../middlewares/auth");
const { upFileCsv } = require("../../middlewares/uploadCsvFile");
const { getExpenses, getExpense, registerExpense, deleteExpense, updateExpense, changeCsvExpenses } = require("../controllers/expense");

const expensesRoutes = require("express").Router();

expensesRoutes.get('/', [isAdmin], getExpenses);
expensesRoutes.get('/:id', [isAdmin], getExpense);
expensesRoutes.post('/register', [isAdmin], registerExpense);
expensesRoutes.delete('/:id', [isAdmin], deleteExpense);
expensesRoutes.put('/:id', [isAdmin], updateExpense);
expensesRoutes.post('/change', [isAdmin, upFileCsv.single("csvFile")], changeCsvExpenses)

module.exports = expensesRoutes;