import { useMemo, useSyncExternalStore } from "react"
import { PayloadCodeRender } from "../components/payload-code-render/payload-code-render"
import { userSampleData } from "../stores/user-sample-data"
import { globalCondition } from "../stores/global_condition";
import { evaluateCondition } from "@jondotsoy/condition"; 


export const CodeImplementation = () => {
    const userDate = useSyncExternalStore(userSampleData.subscribe, () => userSampleData.get());
    const conditions: any = useSyncExternalStore(globalCondition.subscribe, () => globalCondition.get());

    const res = useMemo(() => {
        try {
            return evaluateCondition(conditions, userDate);
        } catch (ex) {
            console.log(ex)
        }
        return false;
    }, [
        userDate, conditions
    ]);

    return <>
        <PayloadCodeRender payload={[
            `import { evaluateCondition } from "@jondotsoy/condition";`,
            ``,
            `evaluateCondition(conditions, data); // => ${res}`,
        ].join('\n')}></PayloadCodeRender>
    </>
}