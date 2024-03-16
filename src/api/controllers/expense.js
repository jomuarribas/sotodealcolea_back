const { csvToJson } = require("../../utils/csvToJson");
const Expense = require("../models/expense");
const Residential = require("../models/residential");
const fs = require('fs');

// GET ALL
const getExpenses = async (req, res, next) => {
  try {
    const allExpenses = await Expense.find()
    return res.status(200).json(allExpenses)
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

// GET EXPENSE
const getExpense = async (req, res, next) => {
  try {
    const oneExpense = await Expense.findById(req.params.id)
    return res.status(200).json(oneExpense);

  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

// REGISTER EXPENSE
const registerExpense = async (req, res, next) => {
  try {
    const addExpense = new Expense(req.body);

    const associatedResidence = await Residential.findOne({ memberNumber: req.body.memberNumber });

    if (!associatedResidence) {
      return res.status(400).json({ error: "No se pueden asociar unos gastos a una parcela que no existe" });
    } else {
      const savedExpense = await addExpense.save();

      associatedResidence.expenses.push(savedExpense._id);
      await associatedResidence.save();

      return res.status(201).json({ message: 'Gastos registrados' });
    }

  } catch (error) {
    return res.status(400).json(error.message);
  }
};

// DELETE EXPENSE
const deleteExpense = async (req, res, next) => {
  try {
    const { id } = req.params

    const expense = await Expense.findById(id)
    if (!expense) {
      return res.status(404).json({ error: 'Gastos no encontrados' });
    }

    const residential = await Residential.findOne({ expenses: id });
    if (!residential) {
      return res.status(404).json({ error: 'Residencia asociada no encontrada' });
    }

    const indexResidential = residential.expenses.indexOf(id);
    if (indexResidential !== -1) {
      residential.expenses.splice(indexResidential, 1);
      await residential.save();
    }

    const expenseDeleted = await Expense.findByIdAndDelete(id);

    return res.status(201).json({ message: `Los gastos de ${expense.month} del ${expense.year} han sido eliminados` });

  } catch (error) {
    return res.status(400).json({ error: "No ha podido eliminarse los gastos", error });
  }
};

// UPDATE EXPENSE
const updateExpense = async (req, res, next) => {
  try {
    const { id } = req.params
    const expense = await Expense.findOne({ _id: id });

    const newExpense = new Expense(req.body)
    newExpense._id = id

    if (!expense) {
      return res.status(404).json({ error: 'Gastos no encontrados' });
    }

    const newExpenseData = req.body;
    const updatedExpense = await Expense.findByIdAndUpdate(id, newExpenseData);

    const residential = await Residential.findOne({ expenses: id });
    if (!residential) {
      return res.status(404).json({ error: 'Residencia asociada no encontrada' });
    }

    const index = residential.expenses.indexOf(id);
    if (index !== -1) {
      residential.expenses.splice(index, 1);
      residential.expenses.push(updatedExpense._id);
      await residential.save();
    }

    return res.status(200).json({ message: "Gastos actualizados" })

  } catch (error) {

    return res.status(400).json({ error: 'Los gastos no han podido actualizarse' });
  }
}

//CHANGE CSVFILE
const changeCsvExpenses = async (req, res, next) => {
  try {
    if (!req.file || req.file.mimetype !== 'text/csv') {
      return res.status(400).json({ error: "No se ha proporcionado un archivo CSV o no es un archivo válido." });
    }

    const jsonData = await csvToJson(req.file.path)

    const duplicates = [];
    for (const data of jsonData) {
      const existingExpense = await Expense.findOne(data);
      if (existingExpense) {
        duplicates.push(data);
      }
    }
    if (duplicates.length > 0) {
      fs.unlinkSync(req.file.path)
      return res.status(400).json({ error: "Se han encontrado gastos duplicados" })
    }

    const result = await Expense.insertMany(jsonData);

    for (const expense of result) {
      const residential = await Residential.findOne({ memberNumber: expense.memberNumber });
      if (residential) {
        residential.expenses.push(expense._id);
        await residential.save();
      }
    }

    fs.unlinkSync(req.file.path)

    res.status(200).json({ message: "Los gastos se han subido correctamente en la base de datos" });

  } catch (error) {
    fs.unlinkSync(req.file.path)
    res.status(500).json({ error: "Error al procesar el archivo CSV", error });
  }

}

module.exports = { getExpenses, getExpense, registerExpense, deleteExpense, updateExpense, changeCsvExpenses };