// in routes/stuff.js

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const saucesCtrl = require('../controllers/sauces');




// ================ POST =====================
router.post('/', auth, multer, saucesCtrl.createSauce);

// ================== PUT ======================
router.put('/:id', auth, multer, saucesCtrl.modifySauce);

// ================== DELETE ======================
router.delete('/:id', auth, saucesCtrl.deleteSauce);

// ================== GET ======================
router.get('/:id', auth, saucesCtrl.getOneSauce);

// ================== GET ======================
router.get('/', auth, saucesCtrl.getAllSauces);

// ================ POST =====================
router.post('/:id/like', auth, saucesCtrl.likeIdSauce);

    

module.exports = router;