export type GetProperties<T> = Pick<
  T,
  {
    [K in keyof T]: T[K] extends () => any ? undefined : K;
  }[keyof T]
>;
