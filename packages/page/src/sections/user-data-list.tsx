import { useMemo, useSyncExternalStore } from "react";
import { userSampleData } from "../stores/user-sample-data";
import { flatten } from "flat";

export const UserDataList = () => {
  const userDate = useSyncExternalStore(userSampleData.subscribe, () =>
    userSampleData.get(),
  );

  const keys = useMemo(() => Object.keys(flatten(userDate)), [userDate]);

  return (
    <>
      <datalist id="field_list">
        {keys.map((k) => (
          <option key={k} value={k}></option>
        ))}
      </datalist>
    </>
  );
};
