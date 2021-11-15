module.exports.arrToObj = (arr, key) =>
  arr.reduce((newObj, item) => {
    const newKey = key ? key : 'value';
    newObj[item[newKey]] = item;
    return newObj;
  }, {});

module.exports.parseFullName = (name) => {
  const clientNameArray = name.split(' ');
  const firstName = clientNameArray[0] ? clientNameArray[0] : '';
  const lastName = clientNameArray[1] ? clientNameArray[1] : '';
  return { firstName, lastName };
};

module.exports.transformEmpty = (value) => {
  return value ? value : '';
};

module.exports.maxItemArray = (array) => {
  return Math.max.apply(Math, array);
};

module.exports.formatPrice = (price) => price.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ');
