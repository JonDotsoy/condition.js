import classNames from "classnames";
import style from "./style.module.css";
import { useCallback, useEffect, useId, useState, useSyncExternalStore, useTransition, type FC } from "react";
import { globalCondition } from "../../stores/global_condition";

type Update = (operation: string, values: any) => any;
type UpdateList = (values: any) => any;


const defaultUpdate: Update = (operation, values) => {
};

const defaultUpdateList: UpdateList = (values) => {
};

const optionSelectedList: Record<string, string> = {
  equal: "=",
  greaterThan: ">",
  lessThan: "<",
  greaterThanOrEqual: ">=",
  lessThanOrEqual: "<=",
  and: "and",
  or: "or",
  not: "not",
};

const ListJSONConditionEditor: FC<{ depth?: number, update?: UpdateList }> = ({ depth = 0, update = defaultUpdateList }) => {
  type A = { id: string, operation?: string, values?: any };

  const [list, setList] = useState<A[]>([
    // { id: crypto.randomUUID() },
  ]);

  useEffect(() => {
    update(list.map(e => {
      if (!e.operation) return []
      return {
        [e.operation]: e.values
      }
    }));
  }, [list]);

  const add = () => setList((list) => [...list, { id: crypto.randomUUID() }]);
  const remove = (id: string) =>
    setList((list) => list.filter((item) => item.id !== id));

  return (
    <>
      <div className="grid grid-cols-1 gap-3">
        {list.map((item) => {
          return (
            <div
              key={item.id}
              className="grid grid-cols-[1fr_auto] gap-3 items-center"
            >
              <JSONConditionEditor
                key={item.id}
                depth={depth}
                update={(operation, values) => {
                  setList((list) => {
                    return list.map(subItem => {
                      if (subItem.id === item.id) {
                        return { ...subItem, operation, values }
                      }
                      return subItem
                    })
                  })
                }}
              ></JSONConditionEditor>
              <div>
                <button
                  type="button"
                  className="border rounded-lg px-2 py-1 text-black/30 hover:text-black/90 hover:shadow transition-all"
                  onClick={() => remove(item.id)}
                >
                  X
                </button>
              </div>
            </div>
          );
        })}
        <div className="grid justify-start">
          <button
            type="button"
            className="px-3 py-0 border rounded transition-all hover:shadow text-black/60 hover:text-black/90"
            onClick={add}
          >
            Agregar
          </button>
        </div>
      </div>
    </>
  );
};


const InputWithType: FC<{
  placeholder?: string,
  onChange?: (value: any) => void
}> = ({ placeholder, onChange }) => {
  const [type, setType] = useState('text');
  const [memoryValue, setMemoryValue] = useState('');


  const setValue = (type: string, value: string) => {
    setType(type);
    setMemoryValue(value);

    onChange?.(type === 'number' ? Number(value) : value);
  }


  return <div className={style.inputWithType}>
    <select onChange={e => { e.preventDefault(); setValue(e.target.value, memoryValue) }}
      defaultValue={type}
    >
      <option value="text">text</option>
      <option value="number">number</option>
    </select>
    <input
      type={type}
      placeholder={placeholder}
      onChange={(e) => { setValue(type, e.target.value) }}
    />
  </div>
}


export const JSONConditionEditor: FC<{ depth?: number; update?: Update }> = ({
  depth = 0,
  update = defaultUpdate,
}) => {
  const formId = useId();
  const [optionSelected, setOptionSelected] = useState("equal");
  const [conditionValue, setConditionValue] = useState<any>(["",""]);

  const useMultiChoice = ["and", "or", "not"].includes(optionSelected);

  if (depth > 3)
    return (
      <>
        <span className="text-black/40">max depth reached</span>
      </>
    );

  useEffect(() => {
    update(optionSelected, conditionValue);
  }, [optionSelected, conditionValue]);

  const changeS = useCallback((value: string) => {
    setOptionSelected(value);
    const useMultiChoice = ["and", "or", "not"].includes(value);
    if (!useMultiChoice) setConditionValue(["",""])
  }, [useMultiChoice, conditionValue]);

  const setField = (name: string) => {
    setConditionValue((v: any) => {
      return [name, Array.isArray(v) ? v[1] : ""];
    });
  };

  const setValue = (val: string) => {
    setConditionValue((v: any) => {
      return [Array.isArray(v) ? v[0] : "", val];
    });
  };

  return (
    <>
      <div
        onSubmit={(e) => e.preventDefault()}
        className={classNames(
          "shadow border border-gray-50 w-full p-2 grid grid-cols-[1fr_auto_1fr] gap-2 items-center",
        )}
      >
        <select
          className={classNames(style.input, "col-span-3")}
          defaultValue={optionSelected}
          onChange={(e) => changeS(e.target.value)}
        >
          <option value="equal">equal</option>
          <option value="greaterThan">greaterThan</option>
          <option value="lessThan">lessThan</option>
          <option value="greaterThanOrEqual">greaterThanOrEqual</option>
          <option value="lessThanOrEqual">lessThanOrEqual</option>
          <option value="and">and</option>
          <option value="or">or</option>
          <option value="not">not</option>
        </select>
        {!useMultiChoice && (
          <>
            <input
              type="text"
              className={style.input}
              list="field_list"
              placeholder="Field path"
              onChange={(e) => setField(e.target.value)}
            />
            <div className="font-mono items-center">
              {optionSelectedList[optionSelected]}
            </div>
            <InputWithType
              placeholder="Value expected"
              onChange={(value) => setValue(value)}
            />
            {/* <input
              type="text"
              className={style.input}
              list="field-list"
              placeholder="Value expected"
              onChange={(e) => setValue(e.target.value)}
            /> */}
          </>
        )}
        {optionSelected === "not" && (
          <>
            <div className="col-span-3 p-2">
              <JSONConditionEditor
                depth={depth + 1}
                update={(operation, values) => {
                  setConditionValue({ [operation]: values });
                }}
              ></JSONConditionEditor>
            </div>
          </>
        )}
        {["and", "or"].includes(optionSelected) && (
          <>
            <div className="col-span-3 p-2 grid grid-cols-[auto_1fr] gap-4">
              <div className="grid grid-rows-3">
                <span className="grid justify-center">
                  <span className="block w-[1px] h-full bg-gradient-to-t from-black/10 to-black/0"></span>
                </span>
                <span className="grid justify-center">
                  <span className="block w-[1px] h-full bg-black/10"></span>
                </span>
                <span className="grid justify-center">
                  <span className="block w-[1px] h-full bg-gradient-to-b from-black/10 to-black/0"></span>
                </span>
              </div>
              <ListJSONConditionEditor
                depth={depth + 1}
                update={(values) => {
                  setConditionValue(values);
                }}
              ></ListJSONConditionEditor>
            </div>
          </>
        )}
      </div>
    </>
  );
};


export const GlobalJSONConditionEditor = () => {
  return <>
    <JSONConditionEditor
      depth={0}
      update={(operation, values) => globalCondition.set({ [operation]: values })}
    ></JSONConditionEditor>
  </>
}