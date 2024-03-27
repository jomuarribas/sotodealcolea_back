const nodemailer = require("nodemailer");

const receiveHelpEmail = async (email, residential, subject, message, completName) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'webmailsmtp.register.it',
      port: 465,
      secure: true,
      auth: {
        user: process.env.REG_EMAIL,
        pass: process.env.REG_PASSWORD,
      }
    });

    const mailOptions = {
      from: `${email}`,
      to: 'info@sotodealcolea.com',
      subject: `Solicitud de ayuda de: ${residential},`,
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
        <h1>Nueva solicitud de Ayuda</h1>
        <hr>
        <h3>${completName} de ${residential}</h3>
        <p>Email: ${email}</p>
        <p>Asunto:</p>
        <p>${subject}</p>
        <p></p>
        <p>Mensaje:</p>
        <p>${message}</p>
        
        CDV Soto de Alcolea
    </div>
</body>
</html>`
    };

    await transporter.sendMail(mailOptions);
    console.log('Correo electrónico enviado con éxito');

  } catch (error) {
    console.error('Error al enviar correo electrónico:', error)
  }
}

module.exports = { receiveHelpEmail }