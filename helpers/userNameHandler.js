module.exports = name => {
  if (typeof name !== 'string') return '';

  const handledUserNameArray = name
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z]/g, ' ')
    .split(' ');

  const resultArray = [];

  for (const item of handledUserNameArray) {
    if (item) resultArray.push(item.charAt(0).toUpperCase() + item.slice(1));
  }

  return resultArray.join(' ');
};
