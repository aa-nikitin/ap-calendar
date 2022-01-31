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
  getPlanMonth,
  deletePlan,
  checkPlanFree,
  checkPlanTime,
  planTimeForEdit,
  cancalledPlan,
  clientPlan
} = require('../controllers/plan');
const { changeWorkShedule, getWorkShedule } = require('../controllers/work-shedule');
const {
  getBookingPlanWeek,
  getBookingPrice,
  addOrders,
  bookingFetch,
  bookingNotice
} = require('../controllers/booking');
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
const { getPlanDetails, recalcEstimate } = require('../controllers/plan-details');
const {
  getPayments,
  addPayments,
  deletePayments,
  getTotalPayments,
  sendBill
} = require('../controllers/payments');
const {
  getServices,
  addServices,
  editServices,
  deleteServices
} = require('../controllers/services');
const { checkPayment } = require('../controllers/checkPay');
const { getFinance } = require('../controllers/finance');
const {
  addPlanPrice,
  getPlanPriceById,
  deletePlanPriceById,
  editPlanPrice,
  addServicesPlanPrice
} = require('../controllers/plan-price');
const { getPriceInfoByIdPlan } = require('../controllers/price-info');

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
router.post('/plan-month', authJwt, getPlanMonth); // authJwt
router.post('/plan-date', authJwt, addPlanDate);
router.put('/plan-date', authJwt, addPlanDate);
router.delete('/plan-date', authJwt, deletePlan);
router.post('/plan-check-free', authJwt, checkPlanFree);
router.post('/plan-check-time', authJwt, checkPlanTime);
router.post('/plan-time-for-edit', authJwt, planTimeForEdit);
router.put('/plan-canceled', authJwt, cancalledPlan);
router.get('/plan-client/:id', clientPlan);

router.post('/booking-plan-week', getBookingPlanWeek);
router.post('/booking-price', getBookingPrice);
router.post('/booking-add-orders', addOrders);
router.post('/booking-fetch', bookingFetch);
router.post('/booking-notice', bookingNotice);

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

router.get('/discounts', authJwt, getDiscounts);
router.post('/discounts', authJwt, addDiscounts);
router.put('/discounts/:id', authJwt, editDiscounts);
router.delete('/discounts/:id', authJwt, deleteDiscounts);

router.get('/plan-details/:id', getPlanDetails);

router.get('/payments/:id', getPayments);
router.get('/payments-total/:id', getTotalPayments);
router.post('/payments', authJwt, addPayments);
router.delete('/payments/:id', authJwt, deletePayments);
router.post('/send-bill', authJwt, sendBill);

router.get('/services', getServices);
router.post('/services', authJwt, addServices);
router.put('/services/:id', authJwt, editServices);
router.delete('/services/:id', authJwt, deleteServices);

router.get('/check-pay', checkPayment);

router.post('/finance', getFinance); // authJwt,

router.post('/plan-price', addPlanPrice); // authJwt,
router.get('/plan-price/:id', getPlanPriceById); // authJwt,
router.delete('/plan-price/:id', deletePlanPriceById); // authJwt,
router.put('/plan-price/:id', editPlanPrice); // authJwt,
router.post('/plan-price-from-services', addServicesPlanPrice); // authJwt,

router.get('/price-info/:id', getPriceInfoByIdPlan); // authJwt,
router.post('/recalc-estimate', recalcEstimate); // authJwt,

module.exports = router;
