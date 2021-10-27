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
const {
  addPlanDate,
  getPlanHalls,
  deletePlan,
  checkPlanFree,
  checkPlanTime,
  planTimeForEdit
} = require('../controllers/plan');
const { changeWorkShedule, getWorkShedule } = require('../controllers/work-shedule');
const { getBookingPlanWeek } = require('../controllers/booking');
const {
  getPriceParams,
  addPrice,
  getPrices,
  copyPrices,
  deletePrice,
  editPrice,
  deletePrices
} = require('../controllers/prices');

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
router.post('/clients', getClients);
router.delete('/clients', authJwt, deleteClients);
router.get('/client/:id', authJwt, getClient);
router.post('/client', authJwt, addClient);
router.put('/client/:id', authJwt, editClient);
router.delete('/client/:id', authJwt, deleteClient);
// router.delete('/pizzas/:id', deletePizza);

// halls
router.get('/halls', getHalls);
router.post('/hall', authJwt, addHall);
router.put('/hall/:id', authJwt, editHall);
router.put('/hall-cover/', authJwt, editHallCover);
router.delete('/hall/:id', authJwt, deleteHall);

router.post('/upload-photos', authJwt, uploadHallPhotos);
router.delete('/delete-photo', authJwt, deleteHallPhoto);

router.post('/plan-halls', authJwt, getPlanHalls);
router.post('/plan-date', authJwt, addPlanDate);
router.put('/plan-date', authJwt, addPlanDate);
router.delete('/plan-date', authJwt, deletePlan);
router.post('/plan-check-free', authJwt, checkPlanFree);
router.post('/plan-check-time', authJwt, checkPlanTime);
router.post('/plan-time-for-edit', authJwt, planTimeForEdit);

router.post('/booking-plan-week', getBookingPlanWeek);

router.put('/work-shedule', changeWorkShedule); //authJwt
router.get('/work-shedule', getWorkShedule); //authJwt

router.get('/price-params', getPriceParams); //authJwt
router.post('/price', addPrice); //authJwt
router.delete('/price/:id', deletePrice); //authJwt
router.put('/price/:id', editPrice); //authJwt
router.get('/prices', getPrices); //authJwt
router.post('/prices', copyPrices); //authJwt
router.delete('/prices', deletePrices); //authJwt

module.exports = router;
