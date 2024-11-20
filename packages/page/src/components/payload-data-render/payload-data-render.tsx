import React, {  } from 'react';
import { CodeRender } from '../code-render/code-render.js';


export const PayloadDataRender: React.FC<{ payload: any }> = ({ payload }) => {
    return (
        <>
            <CodeRender payload={payload} displayTypes={['yaml', 'json']}></CodeRender>
        </>
    );
};
