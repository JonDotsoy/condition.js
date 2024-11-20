import React, { useCallback, useMemo, useState, useSyncExternalStore } from 'react';
import { globalCondition } from '../../stores/global_condition.js';
import * as YAML from "yaml";
import style from "./code-render.module.css";
import hljs from 'highlight.js';
import { atom, type WritableStore } from 'nanostores';

const atoms = new Map<string, WritableStore>()

const selectAtom = (key: string, initialValue: string) => {
    const atomFound = atoms.get(key)
    if (atomFound) return atomFound;

    const initValue: string = globalThis.localStorage?.getItem(key) as any ?? initialValue;

    const newAtom = atom<string>(initValue);

    newAtom.listen(() => {
        globalThis.localStorage?.setItem(key, newAtom.get())
    });

    atoms.set(key, newAtom);
    return newAtom;
}


const converters: Record<string, (value: unknown) => string> = {
    json: value => JSON.stringify(value, null, 2),
    yaml: value => YAML.stringify(value),
    default: value => `${value}`
}

const useDisplayType = (displayTypes: string[]) => {
    const keyMemory = `payload-data-render-default-${displayTypes.join('-')}`;
    const atom = selectAtom(keyMemory, displayTypes[0]);

    return [
        useSyncExternalStore(atom.subscribe, () => atom.get()),
        (value: string) => atom.set(value),
    ]
}

export const CodeRender: React.FC<{ payload: any, displayTypes?: string[] }> = ({ payload, displayTypes = [] }) => {
    const [displayType, setDisplayType] = useDisplayType(displayTypes);

    const render = useCallback((): string => {
        return converters[displayType]?.(payload) ?? converters.default(payload)
    }, [displayType, payload])

    const choiceDisplayType = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        setDisplayType(event.currentTarget.dataset.value as any)
    }

    return (
        <>
            <div className={style.selected} x-selected={displayType}>
                {displayTypes.map(displayType => {
                    return <button key={displayType} type='button' data-value={displayType} onClick={choiceDisplayType}>{displayType}</button>
                })}
            </div>

            <pre
                className={style.payload}
                dangerouslySetInnerHTML={{
                    __html: hljs.highlight(render(), { language: displayType }).value
                }}
            ></pre>
        </>
    );
};
