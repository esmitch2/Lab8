import * as server from '../entries/pages/sverdle/_page.server.js';

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/sverdle/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/sverdle/+page.server.js";
export const imports = ["_app/immutable/nodes/4.2fd65db4.js","_app/immutable/chunks/scheduler.56c500b2.js","_app/immutable/chunks/index.c3cae4b7.js","_app/immutable/chunks/each.b5c05e6c.js","_app/immutable/chunks/parse.bee59afc.js","_app/immutable/chunks/singletons.8aa9cb35.js"];
export const stylesheets = ["_app/immutable/assets/4.9d501049.css"];
export const fonts = [];
