export const sortData = (data: any) => {
  if (!data) return;
  const sortedData = data.sort((a: any, b: any) => {
    // I have this order number: 1/2023 and I want to sort it by the number before the slash
    const aOrderNumber = parseInt(a.orderNumber.split("/")[0]);
    const bOrderNumber = parseInt(b.orderNumber.split("/")[0]);
    if (aOrderNumber > bOrderNumber) {
      return -1;
    }
    if (aOrderNumber < bOrderNumber) {
      return 1;
    }
    return 0;
  });
  return sortedData;
};
