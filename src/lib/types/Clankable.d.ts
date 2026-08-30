export type Clankable = | Array<Clankable> | ClankPrimitive | Map<string, Clankable> | {[key: string]: Clankable}

type ClankPrimitive = typeof Infinity | boolean | string | null | undefined
