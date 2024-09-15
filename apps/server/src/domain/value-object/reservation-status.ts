export const pending = Symbol();
export const success = Symbol();
export const fail = Symbol();
export type Status = typeof pending | typeof success | typeof fail;
