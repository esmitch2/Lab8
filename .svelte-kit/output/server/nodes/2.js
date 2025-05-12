import * as universal from '../entries/pages/_page.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+page.js";
export const imports = ["_app/immutable/nodes/2.bcb617d9.js","_app/immutable/chunks/scheduler.56c500b2.js","_app/immutable/chunks/index.c3cae4b7.js","_app/immutable/chunks/each.b5c05e6c.js"];
export const stylesheets = ["_app/immutable/assets/2.1e71a158.css"];
export const fonts = [];
