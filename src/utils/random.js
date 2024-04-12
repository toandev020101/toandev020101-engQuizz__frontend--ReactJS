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

export const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};
