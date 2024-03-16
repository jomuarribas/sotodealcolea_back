const { csvToJson } = require("../../utils/csvToJson");
const Residential = require("../models/residential")
const fs = require('fs');

// GET ALL
const getResidentials = async (req, res, next) => {
  try {
    const allResidentials = await Residential.find()
      .populate("users")
      .populate("incidents")
      .populate("expenses")
    return res.status(200).json(allResidentials)
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

// GET RESIDENTIAL
const getResidential = async (req, res, next) => {
  try {
    const oneResidential = await Residential.findById(req.params.id)
      .populate("users")
      .populate("incidents")
      .populate("expenses")
    return res.status(200).json(oneResidential);

  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

// REGISTER RESIDENTIAL
const registerResidential = async (req, res, next) => {
  try {
    const addResidential = new Residential(req.body);
    if (req.file) { addResidential.img = req.file.path }

    const residentialStreetDup = await Residential.findOne({ street: req.body.street });
    const residentialNumberDup = await Residential.findOne({ number: req.body.number });

    if (residentialStreetDup && residentialNumberDup) {
      return res.status(400).json({ error: "Esta parcela ya existe" });
    } else {
      const saveResidential = await addResidential.save();
      return res.status(201).json({ message: 'Parcela registrada' });
    }

  } catch (error) {
    return res.status(400).json(error.message);
  }
};

// DELETE RESIDENTIAL
const deleteResidential = async (req, res, next) => {
  try {
    const { id } = req.params

    const residential = await Residential.findById(id)
    if (!residential) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const username = residential.username;

    const userDeleted = await Residential.findByIdAndDelete(id);
    if (residential.img) { deleteImg(userDeleted.img) }

    return res.status(201).json({ message: `La parcela ${residential.memberNumber} ha sido eliminada` });

  } catch (error) {
    return res.status(400).json({ error: "No ha podido eliminarse la pardela" });
  }
};

//CHANGE CSVFILE
const changeCsvResidentials = async (req, res, next) => {
  try {
    if (!req.file || req.file.mimetype !== 'text/csv') {
      return res.status(400).json({ error: "No se ha proporcionado un archivo CSV o no es un archivo válido" });
    }

    const jsonData = await csvToJson(req.file.path)

    const duplicates = [];
    for (const data of jsonData) {
      const existingResidential = await Residential.findOne(data);
      if (existingResidential) {
        duplicates.push(data);
      }
    }
    if (duplicates.length > 0) {
      fs.unlinkSync(req.file.path)
      return res.status(400).json({ error: "Se han encontrado parcelas duplicadas" })
    }

    const result = await Residential.insertMany(jsonData);

    fs.unlinkSync(req.file.path)

    res.status(200).json({ message: "Los datos se han insertado correctamente en la base de datos" });

  } catch (error) {
    fs.unlinkSync(req.file.path)
    res.status(500).json({ error: "Error al procesar el archivo CSV", error });
  }

}

// UPDATE RESIDENTIAL
const updateResidential = async (req, res, next) => {
  try {
    const { id } = req.params
    const residential = await Residential.findById({ _id: id });

    const newResidential = new Residential(req.body)
    newResidential._id = id

    if (!residential) {
      return res.status(404).json({ error: 'Parcela no encontrada' });
    }

    if (req.body.users) {
      newResidential.users = [...residential.users, req.body.users];
    } else { newResidential.users = residential.users }

    if (req.body.expenses) {
      newResidential.expenses = [...residential.expenses, req.body.expenses];
    } else { newResidential.expenses = residential.expenses }

    if (req.body.incidents) {
      newResidential.incidents = [...residential.incidents, req.body.incidents];
    } else { newResidential.incidents = residential.incidents }

    if (req.file) {
      if (residential.img) {
        deleteImg(residential.img);
        newResidential.img = req.file.path;
      } else {
        newResidential.img = req.file.path;
      }
    }

    const residentialUpdate = await Residential.findByIdAndUpdate(id, newResidential, { new: true })

    return res.status(200).json({ message: "Parcela actualizada", residential: residentialUpdate })

  } catch (err) {

    return res.status(400).json({ error: 'La parcela no ha podido actualizarse' });
  }
}


module.exports = { getResidentials, getResidential, registerResidential, deleteResidential, changeCsvResidentials, updateResidential };