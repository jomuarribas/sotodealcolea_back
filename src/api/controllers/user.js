const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { generateSign } = require('../../config/jwt');
const User = require("../models/user");
const { sendRegisterEmail } = require('../../utils/sendRegisterEmail');
const { deleteImg } = require('../../utils/deleteImg');
const { receiveFormalitieEmail } = require('../../utils/receiveFormalitieEmail');
const { receiveHelpEmail } = require('../../utils/receiveHelpEmail');

// GET ALL
const getUsers = async (req, res, next) => {
  try {
    const AllUsers = await User.find()
      .populate("residential")
    return res.status(200).json(AllUsers);

  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

// GET USER
const getUser = async (req, res, next) => {
  try {
    const oneUser = await User.findById(req.params.id)
      .populate("residential")

    if (!oneUser || oneUser === null) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    return res.status(200).json(oneUser);

  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

// REGISTER USER
const registerUser = async (req, res, next) => {
  try {
    const addUser = new User(req.body);
    if (req.file) { addUser.img = req.file.path }

    const userDuplicated = await User.findOne({ username: req.body.username });
    const emailDuplicated = await User.findOne({ email: req.body.email });
    const residentialStreetDup = await User.findOne({ residential: req.body.residential?.street });
    const residentialNumberDup = await User.findOne({ residential: req.body.residential?.number });
    const categoryDuplicated = await User.findOne({ category: req.body.category });

    if (userDuplicated) {
      return res.status(400).json({ error: "Este usuario ya existe" });
    } else if (emailDuplicated) {
      return res.status(400).json({ error: "El mail que has introducido ya existe" });
    } else if (residentialStreetDup && residentialNumberDup && categoryDuplicated === "member") {
      return res.status(400).json({
        error: `Ya existe un socio para la parcela ${req.body.residential.street} ${req.body.residential.number}, solo puede haber uno por parcela`
      });
    } else if (req.body.rol || req.body.verified) {
      return res.status(400).json({ error: "Solo un administrador puede introducir datos como ROL o VERIFIED" });
    } else {
      const saveUser = await addUser.save();
      sendRegisterEmail(req.body.email, req.body.name);
      return res.status(201).json({ message: 'Usuario registrado' });
    }

  } catch (error) {
    return res.status(400).json({ error: "No se ha podido realizar el registro, inténtalo de nuevo" });
  }
};

// VERIFICATION USER
const verificationUser = async (req, res, next) => {
  try {
    const decoded = jwt.verify(req.params.token, 'secret');
    const email = decoded.email;

    await User.findOneAndUpdate({ email }, { verified: true });


    return res.status(200).json({ message: "Correo verificado" });

  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
};
// FORMALITIE EMAIL
const formalitieEmail = async (req, res, next) => {
  try {
    receiveFormalitieEmail(
      req.body.email,
      req.body.residential,
      req.body.formalitie,
      req.body.message,
      req.body.completName
    );

    return res.status(200).json({ message: "Trámite enviado con exito." });

  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
};

// HELP EMAIL
const helpEmail = async (req, res, next) => {
  try {
    receiveHelpEmail(
      req.body.email,
      req.body.residential,
      req.body.subjet,
      req.body.message,
      req.body.completName
    );

    return res.status(200).json({ message: "Ayuda solicitada con exito." });

  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
};

// LOGIN USER
const loginUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (user === null) {
      return res.status(400).json({ error: 'El usuario o contraseña no existen' });
    }

    const verified = user.verified;

    if (user) {
      if (!verified) {
        return res.status(403).json({ error: 'Tienes que verificar el email para poder loguearte' });
      }
      else if (bcrypt.compareSync(req.body.password, user.password)) {
        const token = generateSign(user._id);
        return res.status(200).json({ message: "Usuario logueado", user: user, token: token });
      }
      else {
        return res.status(400).json({ error: 'La contraseña es incorrecta' });
      }
    }

  } catch (error) {
    return res.status(400).json({ error: error });
  }
};

// UPDATE USERS
const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params
    const user = await User.findById({ _id: id });

    const newUser = new User(req.body)
    newUser._id = id

    if (!req.body.verified) {
      newUser.verified = user.verified
    }
    if (!req.body.rol) {
      newUser.rol = user.rol
    }

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    if (user.rol !== 'admin' && (req.body.rol || req.body.verified)) {
      return res.status(403).json({ error: 'Solo un administrador puede actualizar el rol o la verificación' });
    }

    if (req.file) {
      if (user.img) {
        deleteImg(user.img);
        newUser.img = req.file.path;
      } else {
        newUser.img = req.file.path;
      }
    }

    const userUpdate = await User.findByIdAndUpdate(id, newUser, { new: true })

    return res.status(200).json({ message: "Usuario actualizado", user: userUpdate });

  } catch (err) {

    return res.status(400).json({ error: 'El usuario no ha podido actualizarse' });
  }
}

// DELETE USER
const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params

    const user = await User.findById(id)
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const username = user.username;

    const userDeleted = await User.findByIdAndDelete(id);
    if (user.img) { deleteImg(userDeleted.img) }

    return res.status(200).json(`El usuario ${user.username} ha sido eliminado`);

  } catch (error) {
    return res.status(400).json({ error: "No ha podido eliminarse el usuario" });
  }
};

module.exports = { getUsers, getUser, registerUser, verificationUser, loginUser, updateUser, deleteUser, formalitieEmail, helpEmail }