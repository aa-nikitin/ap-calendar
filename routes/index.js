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
const {
  addHall,
  editHall,
  editHallCover,
  deleteHall,
  getHalls,
  getHallsPurpose
} = require('../controllers/halls');
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
const { getBookingPlanWeek, getBookingPrice, addOrders } = require('../controllers/booking');
const {
  getPriceParams,
  addPrice,
  getPrices,
  copyPrices,
  deletePrice,
  editPrice,
  deletePrices
} = require('../controllers/prices');
const { getHolidays, addHolidays, deleteHolidays } = require('../controllers/holidays');
const { getPaykeeper, changePaykeeper } = require('../controllers/paykeeper');
const { getPrepayment, changePrepayment } = require('../controllers/prepayment');
const { getMailPost, changeMailPost, sendMailTest } = require('../controllers/mail-post');
const {
  getDiscounts,
  addDiscounts,
  editDiscounts,
  deleteDiscounts
} = require('../controllers/discounts');

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
router.get('/halls-purpose', getHallsPurpose);
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
router.post('/booking-price', getBookingPrice);
router.post('/booking-add-orders', addOrders);

router.put('/work-shedule', authJwt, changeWorkShedule);
router.get('/work-shedule', getWorkShedule);

router.get('/price-params', getPriceParams);
router.post('/price', authJwt, addPrice);
router.delete('/price/:id', authJwt, deletePrice);
router.put('/price/:id', authJwt, editPrice);
router.get('/prices', authJwt, getPrices);
router.post('/prices', authJwt, copyPrices);
router.delete('/prices', authJwt, deletePrices);

router.get('/holidays', authJwt, getHolidays);
router.post('/holidays', authJwt, addHolidays);
router.delete('/holidays/:id', authJwt, deleteHolidays);

router.get('/paykeeper', authJwt, getPaykeeper);
router.put('/paykeeper', authJwt, changePaykeeper);

router.get('/prepayment', authJwt, getPrepayment);
router.put('/prepayment', authJwt, changePrepayment);

router.get('/mail-post', authJwt, getMailPost);
router.put('/mail-post', authJwt, changeMailPost);
router.get('/send-mail-post', authJwt, sendMailTest);

router.get('/discounts', getDiscounts);
router.post('/discounts', addDiscounts);
router.put('/discounts/:id', editDiscounts);
router.delete('/discounts/:id', deleteDiscounts);

module.exports = router;
