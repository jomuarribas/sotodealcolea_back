const { isUser, isAdmin } = require("../../middlewares/auth");
const { getIncident, getIncidents, registerIncident, deleteIncident, updateIncident } = require("../controllers/incident");

const incidentsRoutes = require("express").Router();

incidentsRoutes.get('/', [isAdmin], getIncidents);
incidentsRoutes.get('/:id', [isAdmin], getIncident);
incidentsRoutes.post('/register', [isUser], registerIncident);
incidentsRoutes.delete('/:id', [isAdmin], deleteIncident);
incidentsRoutes.put('/:id', [isAdmin], updateIncident);

module.exports = incidentsRoutes;