const purposeArr = [
  { name: 'Фото', value: 'photo', text: 'фото' },
  { name: 'Видео', value: 'video', text: 'видео' },
  { name: 'Мероприятие', value: 'event', text: 'мероприятия' },
  { name: 'Семинар', value: 'seminar', text: 'семинара' }
];
module.exports.purposeArr = purposeArr;
module.exports.goalArr = [{ name: 'Для всего', value: 'all', text: 'для всего' }, ...purposeArr];

module.exports.weekdayArr = [
  { name: 'Всю неделю', value: 'all-week' },
  { name: 'Будние', value: 'weekdays' },
  { name: 'Выходные/Праздники', value: 'weekend' },
  { name: 'По дням', value: 'by-days' }
];

module.exports.worktimeArr = [
  { name: 'Весь день', value: 'all-day' },
  { name: 'По времени', value: 'by-time' }
];

module.exports.validityPeriodArr = [
  { name: 'Всегда', value: 'always' },
  { name: 'Ограниченный', value: 'limited' }
];

module.exports.conditionArr = [
  { name: 'Всегда', value: 'always' },
  { name: 'По дате', value: 'limited' },
  { name: 'Дней до брони', value: 'days-before-booking' }
];

module.exports.daysBeforeBookingArr = [
  { name: 'День в день', value: 'day-to-day' },
  { name: '1 день', value: 'one-day' },
  { name: '2 дня', value: 'two-day' },
  { name: '3 дня', value: 'three-day' }
];

module.exports.priceArr = [
  { name: 'Аренда', value: 'rent', text: '' },
  { name: 'Доплата', value: 'surcharge', text: 'Доплата' },
  { name: 'Доплата за чел.', value: 'surcharge-per', text: 'Доплата за чел.' },
  { name: 'Доплата за чел./ч', value: 'surcharge-per-hour', text: 'Доплата за чел.' }
];

module.exports.daysOfWeekArr = [
  { name: 'Пн', value: '0' },
  { name: 'Вт', value: '1' },
  { name: 'Ср', value: '2' },
  { name: 'Чт', value: '3' },
  { name: 'Пт', value: '4' },
  { name: 'Сб', value: '5' },
  { name: 'Вс', value: '6' }
];

module.exports.statusArr = [
  { name: 'Заявка', value: 'application' },
  { name: 'Бронь', value: 'booking' },
  { name: 'Завершено', value: 'completed' }
];

module.exports.paymentTypeArr = [
  { name: 'Платно', value: 'paid' },
  { name: 'Бесплатно', value: 'free' },
  { name: 'Бартер', value: 'barter' },
  { name: 'Для себя', value: 'myself' }
];

module.exports.paymentMethodArr = [
  { name: 'Безналичный', value: 'сashless' },
  { name: 'Наличный', value: 'сash' }
];
