module.exports = (payments) => {
  let income = 0;
  let expense = 0;
  payments.forEach((item) => {
    if (item.paymentType === 'income') {
      income += Number(item.paymentSum);
    } else if (item.paymentType === 'expenses') {
      expense += Number(item.paymentSum);
    }
  });
  const total = income - expense;
  const totalPayments = { income, expense, total };

  return totalPayments;
};
