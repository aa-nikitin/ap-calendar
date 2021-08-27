const { Router } = require('express');
const { check } = require('express-validator');
// const passport = require('passport');
// const authJwt = passport.authenticate('jwt', { session: false });

const { login, registration, authFromToken } = require('../controllers/auth');
const router = Router();

// let form = new formidable.IncomingForm();

router.post('/login', login);
router.post(
  '/registration',
  [
    check('login', 'Минимальная длина логина 4 символа').isLength({ min: 4 }),
    check('password', 'Минимальная длина пароля 6 символов').isLength({ min: 6 })
  ],
  registration
);
router.post('/authFromToken', authFromToken);
// router.put('/pizzas/:id', editPizza);
// router.delete('/pizzas/:id', deletePizza);

module.exports = router;
