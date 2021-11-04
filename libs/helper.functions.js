module.exports.arrToObj = (arr) =>
  arr.reduce((newObj, item) => {
    newObj[item.value] = item;
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

module.exports.formatPrice = (price) => price.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ');
