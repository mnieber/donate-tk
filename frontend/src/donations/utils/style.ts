export const lg_mb = { marginBottom: `4rem` };
export const lg_ml = { marginLeft: `4rem` };
export const lg_mr = { marginRight: `4rem` };
export const lg_mt = { marginTop: `4rem` };
export const md_mb = { marginBottom: `2rem` };
export const md_ml = { marginLeft: `2rem` };
export const md_mr = { marginRight: `2rem` };
export const md_mt = { marginTop: `2rem` };
export const sm_mb = { marginBottom: `1rem` };
export const sm_ml = { marginLeft: `1rem` };
export const sm_mr = { marginRight: `1rem` };
export const sm_mt = { marginTop: `1rem` };
export const xs_mb = { marginBottom: `0.5rem` };
export const xs_ml = { marginLeft: `0.5rem` };
export const xs_mr = { marginRight: `0.5rem` };
export const xs_mt = { marginTop: `0.5rem` };
export const tiny_mt = { marginTop: `0.125rem` };

export const style = (...parts: any[]) =>
  parts.reduce((acc, x) => Object.assign({}, acc, x), {});
