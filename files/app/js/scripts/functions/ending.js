function ending(number, titles) {
  const cases = [2, 0, 1, 1, 1, 2];

  if (number % 100 > 4 && number % 100 < 20) {
    return titles[2];
  }

  return titles[cases[(number % 10 < 5) ? number % 10 : 5]];
}

export default ending;
