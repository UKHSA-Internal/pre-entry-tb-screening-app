export const getDateWithoutTime = function (dateObj: Date) {
  return dateObj.toISOString().split("T")[0];
};
