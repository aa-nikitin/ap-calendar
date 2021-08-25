const { Router } = require('express');
const { auth, registration } = require('../controllers/auth');
const router = Router();

// let form = new formidable.IncomingForm();

router.get('/auth', auth);
router.post('/registration', registration);
// router.put('/pizzas/:id', editPizza);
// router.delete('/pizzas/:id', deletePizza);

module.exports = router;
