module.exports.arrToObj = (arr) =>
  arr.reduce((newObj, item) => {
    newObj[item.value] = item;
    return newObj;
  }, {});

module.exports.formatPrice = (price) => price.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ');
