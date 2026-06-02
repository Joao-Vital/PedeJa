const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const productController = require('../controllers/productController');

const router = express.Router();

const UPLOAD_DIR = path.join(__dirname, '..', 'uploads', 'produtos');
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
	destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
	filename: (_req, file, cb) => {
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
		cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
	},
});

const fileFilter = (_req, file, cb) => {
	const allowed = /jpeg|jpg|png|gif|webp/;
	const extValid = allowed.test(path.extname(file.originalname).toLowerCase());
	const mimeValid = allowed.test(file.mimetype.toLowerCase());

	if (extValid && mimeValid) {
		return cb(null, true);
	}
	return cb(new Error('Formato de imagem inválido.')); 
};

const upload = multer({
	storage,
	fileFilter,
	limits: { fileSize: 4 * 1024 * 1024 },
});

router
	.route('/')
	.get(productController.listProducts)
	.post(upload.single('foto'), productController.createProduct);

router
	.route('/:id')
	.get(productController.getProductById)
	.put(upload.single('foto'), productController.updateProduct)
	.delete(productController.deleteProduct);

module.exports = router;
