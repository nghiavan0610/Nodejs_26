const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/img'));
  },
  filename: (req, file, cb) => {
    const prefix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${prefix}-${file.originalname}`);
  },
});

const filter = (req, file, cb) => {
  // const ext = path.extname(file.originalname);
  const ext = file.mimetype.split('/')[1];
  if (ext !== 'jpg' && ext !== 'jpeg' && ext !== 'png' && ext !== 'gif') {
    return cb(new Error('Only images are allowed'), false);
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter: filter,
});

module.exports = upload;
