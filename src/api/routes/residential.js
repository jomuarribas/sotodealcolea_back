const { isAdmin, isUser } = require("../../middlewares/auth");
const { upFileCsv } = require("../../middlewares/uploadCsvFile");
const { upUserImg } = require("../../middlewares/uploadImg");
const { getResidentials, getResidential, registerResidential, deleteResidential, changeCsvResidentials, updateResidential } = require("../controllers/residential");

const residentialsRoutes = require("express").Router();

residentialsRoutes.get('/', [isUser], getResidentials);
residentialsRoutes.get('/:id', [isUser], getResidential);
residentialsRoutes.post('/register', [isAdmin], registerResidential);
residentialsRoutes.delete('/:id', [isAdmin], deleteResidential);
residentialsRoutes.post('/change', [isAdmin, upFileCsv.single("csvFile")], changeCsvResidentials)
residentialsRoutes.put('/:id', [isUser, upFileCsv.single("img")], updateResidential)

module.exports = residentialsRoutes;