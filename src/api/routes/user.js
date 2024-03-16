const { isUser, isAdmin } = require("../../middlewares/auth");
const { upUserImg } = require("../../middlewares/uploadImg");
const { getUsers, getUser, registerUser, verificationUser, loginUser, updateUser, deleteUser, formalitieEmail, helpEmail } = require("../controllers/user");

const usersRoutes = require("express").Router();

usersRoutes.get('/', [isAdmin], getUsers);
usersRoutes.get('/:id', [isUser], getUser);
usersRoutes.post('/register', registerUser);
usersRoutes.post('/login', loginUser);
usersRoutes.get('/verification/:token', verificationUser);
usersRoutes.put('/:id', [isUser, upUserImg.single("img")], updateUser);
usersRoutes.delete('/:id', [isAdmin], deleteUser);
usersRoutes.post('/formalitie', [isUser], formalitieEmail)
usersRoutes.post('/help', [isUser], helpEmail)

module.exports = usersRoutes;