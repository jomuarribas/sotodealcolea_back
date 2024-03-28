
![Logo](https://res.cloudinary.com/dbnmjx6vr/image/upload/v1709246885/Logo_SDA_reytxe.webp)


# CDV Soto de Alcolea (Backend)

Backend para proyecto Full Stack (MERN Stack).

Aplicación web para gestionar un club social con 240 socios.

## Tecnologías y librerias usadas

**Server:** Node, Express, mongoose, cors

**Ficheros:** Cloudinary, csv-parser, multer

**Otras:** bcrypt, Json Web Token, Nodemailer, Dotenv

**Developer:** Nodemon


## Despliegues

Backend desplegado en Render

- [https://sotodealcolea-back.vercel.app](https://sotodealcolea-back.vercel.app)

Frontend desplegado en Netlify

- [https://sotodealcolea.vercel.app/](https://sotodealcolea.vercel.app/)
## Inicialización local

Instalación de dependencias

```bash
  npm install
```

Iniciar el servidor

```bash
  npm run start
```


## Rutas Generales

Listado de usuarios registrados

```bash
  /users
```

Listado de viviendas "Parcelas"

```bash
  /residientials
```

Listado de gastos por vivienda

```bash
  /expenses
```

Listado que recoge todas las incidencias

```bash
  /incidents
```
## Carga de ficheros CSV

### Carga de viviendas

```http
  POST /residentials/change
```

| name      | value    | Description                |
| :-------- | :------- | :------------------------- |
| `csvFile` | `.csv`   | Requiere ser usuario con rol admin. |

Con la carga de este fichero lo que conseguimos es tener todas las viviendas de la comunidad. Se proporciona archivo ".csv" de ejemplo en la carpeta "uploads"

#### La cabecera del fichero ".csv" debe ser:

memberNumber, street, number, dimension, debt, sanctions

### Descripción:

**memberNumber:** Número de socio.

**street:** Calle donde su ubica la parcela.

**number:**, Número de la parcela.

**dimension:** Ocupación que tiene el terreno.

**debt:** Si existen deudas que recaigan sobre esa parcela.

**sanctions:** Si existe algún tipo de sanción sobre esa parcela.

### Carga de gastos

```http
  POST /expenses/change
```

| name      | value    | Description                |
| :-------- | :------- | :------------------------- |
| `csvFile` | `.csv`   | Requiere ser usuario con rol admin. |

#### La cabecera del fichero ".csv" debe ser:

memberNumber, year, month, comunity, cannon, water, electricity

### Descripción:

**memberNumber:** Número de socio.

**year:** Año del recibo.

**month**:** Mes del recibo.

**comunity:** Gasto fijo correspondiente a la comunidad de vecinos.

**cannon:** Cargo extra para los gastos globales del centro.

**water:** Gasto de agua

**electricity:** Gasto de la luz.

### Información adicional importante:

Cuando se produce la carga del fichero de gastos se asocia automaticamente con los datos de las parcelas, cada gasto se asocia a la vivienda que le corresponde por eso es importante realizar primero la carga de viviendas y luego la carga de gastos.


## Licencia

[AGPL 3.0](https://choosealicense.com/licenses/agpl-3.0/)


## Autor               

- [@jomuarribas](https://www.github.com/jmarribas)


## 🔗 Links
[![portfolio](https://img.shields.io/badge/my_portfolio-000?style=for-the-badge&logo=ko-fi&logoColor=white)](https://jomuarribas.dev/)
[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/jomuarribas/)

