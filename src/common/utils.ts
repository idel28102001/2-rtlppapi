export const compareAccess = (a, b) => {
  if (a.tariff.accessLevel > b.tariff.accessLevel) {
    return -1;
  }
  if (a.tariff.accessLevel < b.tariff.accessLevel) {
    return 1;
  }
  return 0;
};
