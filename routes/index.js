const { Router } = require('express');
const passport = require('passport');
const authJwt = passport.authenticate('jwt', { session: false });

const { login, registration, loginToken } = require('../controllers/auth');
const router = Router();

// let form = new formidable.IncomingForm();

router.post('/auth', login);
router.post('/registration', registration);
router.post('/authFromToken', loginToken);
// router.put('/pizzas/:id', editPizza);
// router.delete('/pizzas/:id', deletePizza);

module.exports = router;
