export const capitalizeFirstLetter = (str) => {
  if (str.length === 0) return str;
  const res = str.charAt(0).toUpperCase() + str.slice(1);
  console.log(res);
  return res;
};

export const toLowerCase = (str) => {
  return str.toLowerCase();
};

export function removeLastCharacter(str) {
  if (str.length === 0) return str; // Devuelve el string tal cual si está vacío
  return str.slice(0, -1); // Quita la última letra usando slice
}
