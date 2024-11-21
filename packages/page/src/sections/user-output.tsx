import { useSyncExternalStore, type FC } from "react";
import { PayloadDataRender } from "../components/payload-data-render/payload-data-render";
import { globalCondition } from "../stores/global_condition";
import { userSampleData } from "../stores/user-sample-data";

const usePayload = () => {
  return useSyncExternalStore(userSampleData.subscribe, () =>
    userSampleData.get(),
  );
};

export const UserOutput = () => {
  const payload = usePayload();

  return <PayloadDataRender payload={payload}></PayloadDataRender>;
};
