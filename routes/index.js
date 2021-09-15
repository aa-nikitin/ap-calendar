const { Router } = require('express');
const { check } = require('express-validator');
const passport = require('passport');
const authJwt = passport.authenticate('jwt', { session: false });

const { login, registration, authFromToken } = require('../controllers/auth');
const {
  addClient,
  editClient,
  deleteClient,
  getClient,
  getClients,
  deleteClients
} = require('../controllers/clients');
const { addHall, editHall, editHallCover, deleteHall, getHalls } = require('../controllers/halls');
const { uploadHallPhotos, deleteHallPhoto } = require('../controllers/hall-photos');

const router = Router();

// let form = new formidable.IncomingForm();

// auth
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

// clients
router.get('/clients', authJwt, getClients);
router.delete('/clients', authJwt, deleteClients);
router.get('/client/:id', authJwt, getClient);
router.post('/client', authJwt, addClient);
router.put('/client/:id', authJwt, editClient);
router.delete('/client/:id', authJwt, deleteClient);
// router.delete('/pizzas/:id', deletePizza);

// halls
router.get('/halls', getHalls);
router.post('/hall', addHall);
router.put('/hall/:id', editHall);
router.put('/hall-cover/', editHallCover);
router.delete('/hall/:id', deleteHall);

router.post('/upload-photos', uploadHallPhotos);
router.delete('/delete-photo', deleteHallPhoto);

module.exports = router;
