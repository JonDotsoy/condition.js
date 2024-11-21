import { useSyncExternalStore, type FC } from "react";
import { PayloadDataRender } from "../components/payload-data-render/payload-data-render";
import { globalCondition } from "../stores/global_condition";

const usePayload = () => {
  return useSyncExternalStore(globalCondition.subscribe, () =>
    globalCondition.get(),
  );
};

export const PayloadSection = () => {
  const payload = usePayload();

  return <PayloadDataRender payload={payload}></PayloadDataRender>;
};
