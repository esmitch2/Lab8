import * as universal from '../entries/pages/sverdle/how-to-play/_page.js';

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/sverdle/how-to-play/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/sverdle/how-to-play/+page.js";
export const imports = ["_app/immutable/nodes/5.f7ad1c02.js","_app/immutable/chunks/environment.9aa685ef.js","_app/immutable/chunks/scheduler.56c500b2.js","_app/immutable/chunks/index.c3cae4b7.js"];
export const stylesheets = ["_app/immutable/assets/5.89a9e780.css"];
export const fonts = [];
