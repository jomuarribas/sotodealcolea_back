const { csvToJson } = require("../../utils/csvToJson");
const Incident = require("../models/incident");
const Residential = require("../models/residential");

// GET ALL
const getIncidents = async (req, res, next) => {
  try {
    const allIncidents = await Incident.find()
    return res.status(200).json(allIncidents)
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

// GET INCIDENT
const getIncident = async (req, res, next) => {
  try {
    const oneIncident = await Incident.findById(req.params.id)
    return res.status(200).json(oneIncident);

  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

// REGISTER INCIDENT
const registerIncident = async (req, res, next) => {
  try {
    const addIncident = new Incident(req.body);

    const associatedResidence = await Residential.findOne({ memberNumber: req.body.memberNumber });

    if (!associatedResidence) {
      return res.status(400).json({ error: "No se puede registrar una incidencia si no existe una parcela asociada" });
    } else {
      const savedIncident = await addIncident.save();

      associatedResidence.incidents.push(savedIncident._id);
      await associatedResidence.save();

      return res.status(201).json({ message: 'Incidencia registrada' });
    }

  } catch (error) {
    return res.status(400).json(error.message);
  }
};

// DELETE INCIDENT
const deleteIncident = async (req, res, next) => {
  try {
    const { id } = req.params

    const incident = await Incident.findById(id)
    if (!incident) {
      return res.status(404).json({ error: 'Incidencia no encontrada' });
    }

    const residential = await Residential.findOne({ incidents: id });
    if (!residential) {
      return res.status(404).json({ error: 'Residencia asociada no encontrada' });
    }

    const indexResidential = residential.incidents.indexOf(id);
    if (indexResidential !== -1) {
      residential.incidents.splice(indexResidential, 1);
      await residential.save();
    }

    const incidentDeleted = await Incident.findByIdAndDelete(id);

    return res.status(201).json({ message: `La incidencia (${incident.subject}) ha sido eliminada` });

  } catch (error) {
    return res.status(400).json({ error: "No ha podido eliminarse la incidencia", error });
  }
};

// UPDATE INCIDENT
const updateIncident = async (req, res, next) => {
  try {
    const { id } = req.params
    const incident = await Incident.findOne({ _id: id });

    const newIncident = new Incident(req.body)
    newIncident._id = id

    if (!incident) {
      return res.status(404).json({ error: 'Incidencia no encontrada' });
    }

    const newIncidentData = req.body;
    const updatedIncident = await Incident.findByIdAndUpdate(id, newIncidentData);

    const residential = await Residential.findOne({ incidents: id });
    if (!residential) {
      return res.status(404).json({ error: 'Residencia asociada no encontrada' });
    }

    const index = residential.incidents.indexOf(id);
    if (index !== -1) {
      residential.incidents.splice(index, 1);
      residential.incidents.push(updatedIncident._id);
      await residential.save();
    }

    return res.status(200).json({ message: "Incidencia actualizada" })

  } catch (error) {

    return res.status(400).json({ error: 'La incidencia no ha podido actualizarse' });
  }
}

module.exports = { getIncidents, getIncident, registerIncident, deleteIncident, updateIncident };