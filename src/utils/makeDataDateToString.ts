export const makeDataDateToString = (data: any) => {
    if (!data) return;
    return Object.values(data).map((item: any) => {
      return {
        ...item,
        date: new Date(item.date).toLocaleDateString(),
      };
    });
  };