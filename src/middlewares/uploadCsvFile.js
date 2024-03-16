const multer = require("multer");

const uploadCsvFile = multer.diskStorage({
  destination: function (req, file, cb) {
      const destinationFolder = 'src/uploads/';
      cb(null, destinationFolder);
  },
  filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now());
  }
});

const upFileCsv = multer({ storage: uploadCsvFile });

module.exports = { upFileCsv }