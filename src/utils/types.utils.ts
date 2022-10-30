export type GetProperties<T> = Pick<
  T,
  {
    [K in keyof T]: T[K] extends () => any ? undefined : K;
  }[keyof T]
>;

export type PropsExcept<T, O extends string> = Pick<
  T,
  {
    [K in keyof T]: K extends O ? undefined : K;
  }[keyof T]
>;
