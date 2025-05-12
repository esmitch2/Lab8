export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["RECREATION_BikeFacilities.geojson.txt","bluebikes-traffic-2024-03.csv","favicon.png","robots.txt"]),
	mimeTypes: {".txt":"text/plain",".csv":"text/csv",".png":"image/png"},
	_: {
		client: {"start":"_app/immutable/entry/start.e44e3325.js","app":"_app/immutable/entry/app.c43203ae.js","imports":["_app/immutable/entry/start.e44e3325.js","_app/immutable/chunks/scheduler.56c500b2.js","_app/immutable/chunks/singletons.8aa9cb35.js","_app/immutable/chunks/parse.bee59afc.js","_app/immutable/entry/app.c43203ae.js","_app/immutable/chunks/scheduler.56c500b2.js","_app/immutable/chunks/index.c3cae4b7.js"],"stylesheets":[],"fonts":[]},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/3.js')),
			__memo(() => import('./nodes/4.js')),
			__memo(() => import('./nodes/5.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/about",
				pattern: /^\/about\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/sverdle",
				pattern: /^\/sverdle\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/sverdle/how-to-play",
				pattern: /^\/sverdle\/how-to-play\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 5 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		}
	}
}
})();
