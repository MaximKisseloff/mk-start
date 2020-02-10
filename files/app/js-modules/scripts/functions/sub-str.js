const softSubstr = function (value, length = 25, ending = '...') {
  // eslint-disable-next-line prefer-template
  const text = (value + '').trim();

  if (text.length <= length - ending.length) {
    return text;
  }

  return text.substr(0, length) + ending;
};

export default softSubstr;
