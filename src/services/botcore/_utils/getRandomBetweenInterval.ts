export const getRandomBetweenInterval = (min: number, max: number) => {
  const random = Math.random();
  return min + random * (max - min);
};
