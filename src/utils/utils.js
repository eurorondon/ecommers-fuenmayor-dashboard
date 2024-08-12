export const capitalizeFirstLetter = (str) => {
  if (str.length === 0) return str;
  const res = str.charAt(0).toUpperCase() + str.slice(1);
  console.log(res);
  return res;
};

export const toLowerCase = (str) => {
  return str.toLowerCase();
};
