export const chooseRandomItemFromArray = (items: any[]) => {
  const index = Math.floor(Math.random() * items.length);
  return items[index];
};
