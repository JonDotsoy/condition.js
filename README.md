# condition.js

Conditions for JSON. Receive conditions from outside.

**Expressions:**

- equal
- greaterThan
- lessThan
- greaterThanOrEqual
- lessThanOrEqual
- and
- or
- not

**Sample:**

```ts
import { evaluateCondition } from "@jondotsoy/condition";

const condition: ConditionDTO = {
  and: [
    {
      equal: ["a.b", 3],
    },
    {
      not: {
        equal: ["a.c", 4],
      },
    },
  ],
};

const context = {
  a: {
    b: 3,
    c: 3,
  },
};

evaluateCondition(condition, context); // => true
```
