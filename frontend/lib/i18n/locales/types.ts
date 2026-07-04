import { en } from './en';

export type Translations = {
  [K in keyof typeof en]: (typeof en)[K] extends string
    ? string
    : (typeof en)[K] extends object
      ? { [P in keyof (typeof en)[K]]: string }
      : never;
};