import { Puff } from "react-loader-spinner";

export const Spinner = () => {
  return (
    <Puff
      height="80"
      width="80"
      radius={1}
      color="#54e7ff"
      ariaLabel="puff-loading"
      wrapperStyle={{}}
      wrapperClass=""
      visible={true}
    />
  );
};
