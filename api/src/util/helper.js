const createDateString = async (day) => {
  let today = new Date();
  if (day) {
    today.setDate(today.getDate() + day);
  }
  return today.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
    .split('/')
    .join('');
};

module.exports = {
  createDateString
}