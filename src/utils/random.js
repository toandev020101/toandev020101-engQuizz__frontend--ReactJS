export const randomInRange = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const randomArrayInRange = (min, max, count) => {
  const randomArray = [];

  let random = 0;
  while (count > randomArray.length) {
    random = randomInRange(min, max);
    if (randomArray.includes(random)) continue;
    randomArray.push(random);
  }

  return randomArray;
};
