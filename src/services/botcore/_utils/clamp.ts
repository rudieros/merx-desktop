export const clamp = (value: number, min?: number, max?: number) => {
  if (max && value > max) {
    return max;
  }
  if (min && value < min) {
    return min;
  }
  return value;
};
