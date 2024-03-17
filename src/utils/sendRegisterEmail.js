const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");

const sendRegisterEmail = async (email, name) => {
  try {
    const token = jwt.sign({ email }, "secret", { expiresIn: "1h" })
    const verificationLink = `http://sotodealcolea.netlify.app/verification/${token}`

    const transporter = nodemailer.createTransport({
      host: 'authsmtp.securemail.pro',
      port: 465,
      secure: true,
      auth: {
        user: process.env.REG_EMAIL,
        pass: process.env.REG_PASSWORD,
      }
    });

    const mailOptions = {
      from: '"CDV Soto de Alcolea" <info@sotodealcolea.com>',
      to: `${email}`,
      subject: 'Verifica tu cuenta de usuario',
      html: `
    <html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Correo electrónico</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 20px 0;
        }
        .container {
            max-width: 500px;
            text-align: center;
            margin: 10px auto;
            padding: 20px;
            background-color: #fff;
            border-radius: 20px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        h1 {
            color: #DF040C;
        }
        p {
            color: #666;
        }
        img {
          aling-items: center;
          width: 100px;
      }
    </style>
</head>
<body>
    <div class="container">
        <img src="https://res.cloudinary.com/dbnmjx6vr/image/upload/v1709246885/Logo_SDA_reytxe.webp" alt="Logo Soto de Alcolea">
        <h1>¡Bienvenid@ al Soto!</h1>
        <hr>
        <h3>${name}, estás a un solo paso de ser Campista 2.0.</h3>
        <p>Ahora necesitamos que confirmes tu email (${email}) en el enlace que te indicamos a 
        continuación:</p>
        <a href="${verificationLink}">Verifica tu correo aquí</a>
        <p>Una vez realizada la verificación podrás acceder a la plataforma 
        con el usuario y contraseña que has indicado en el registro.</p>
        <p>Un saludo!</p>
        CDV Soto de Alcolea
    </div>
</body>
</html>`
    };

    await transporter.sendMail(mailOptions);
    console.log('Correo electrónico de verificación enviado con éxito');

  } catch (error) {
    console.error('Error al enviar correo electrónico de verificación:', error)
  }
}

module.exports = { sendRegisterEmail }