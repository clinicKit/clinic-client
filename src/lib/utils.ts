export const cn = (...classes: (string | undefined | false)[]): string =>
  classes.filter(Boolean).join(' ');