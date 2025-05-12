

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/0.bb4a3529.js","_app/immutable/chunks/scheduler.56c500b2.js","_app/immutable/chunks/index.c3cae4b7.js"];
export const stylesheets = [];
export const fonts = [];
