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
  deleteClients,
  searchClient
} = require('../controllers/clients');
const { addHall, editHall, editHallCover, deleteHall, getHalls } = require('../controllers/halls');
const { uploadHallPhotos, deleteHallPhoto } = require('../controllers/hall-photos');
const { addPlanDate, getPlanHalls, checkPlanFree } = require('../controllers/plan');
const { changeWorkShedule } = require('../controllers/work-shedule');

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
router.post('/client-search', searchClient);
// router.delete('/pizzas/:id', deletePizza);

// halls
router.get('/halls', authJwt, getHalls);
router.post('/hall', authJwt, addHall);
router.put('/hall/:id', authJwt, editHall);
router.put('/hall-cover/', authJwt, editHallCover);
router.delete('/hall/:id', authJwt, deleteHall);

router.post('/upload-photos', authJwt, uploadHallPhotos);
router.delete('/delete-photo', authJwt, deleteHallPhoto);

router.post('/plan-halls', getPlanHalls);
router.post('/plan-date', addPlanDate);
router.post('/plan-check-free', checkPlanFree);

router.put('/work-shedule', changeWorkShedule);

module.exports = router;
