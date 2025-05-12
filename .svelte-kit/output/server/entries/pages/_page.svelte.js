import { c as create_ssr_component, b as add_attribute, d as each, e as escape, f as spread, h as escape_object, i as escape_attribute_value } from "../../chunks/ssr.js";
import mapboxgl from "mapbox-gl";
import * as d3 from "d3";
const mapboxGl = "";
const _page_svelte_svelte_type_style_lang = "";
const css = {
  code: '@import url("$lib/global.css");#map.svelte-3wqi17.svelte-3wqi17{flex:1}#map.svelte-3wqi17 svg.svelte-3wqi17{position:absolute;z-index:1;width:100%;height:100%;pointer-events:none;&:has(circle.selected) circle:not(.selected) {\n			opacity: 0.3;\n		}}header.svelte-3wqi17.svelte-3wqi17{display:flex;gap:1em;align-items:baseline;margin-bottom:20px;display:block}circle.svelte-3wqi17.svelte-3wqi17{--color-departures:steelblue;--color-arrivals:darkorange;--color:color-mix(\n			in oklch,\n			var(--color-departures) calc(100% * var(--departure-ratio)),\n			var(--color-arrivals)\n		);fill:var(--color)}.legend.svelte-3wqi17.svelte-3wqi17{display:flex;gap:1px;margin-top:20px;width:100%}.legend.svelte-3wqi17>div.svelte-3wqi17{flex:1;padding:10px 20px;text-align:center;font-weight:bold;color:white;background-color:var(--color-departures)}.legend.svelte-3wqi17>div.svelte-3wqi17:nth-child(1){--color-departures:steelblue}.legend.svelte-3wqi17>div.svelte-3wqi17:nth-child(2){--color-departures:darkmagenta}.legend.svelte-3wqi17>div.svelte-3wqi17:nth-child(3){--color-departures:darkorange}',
  map: null
};
let selectedStation = null;
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let filteredTrips;
  let filteredDepartures;
  let filteredArrivals;
  let filteredStations;
  mapboxgl.accessToken = "pk.eyJ1IjoiZXNtaXRjaDIiLCJhIjoiY205Ym82bTBlMGk1dDJ3cHZ0Y2plbDBjMSJ9.w15FrONlbQzksaDlmfLL1g";
  let stations = [];
  let map;
  let trips = [];
  function getCoords(station) {
    let point = new mapboxgl.LngLat(+station.Long, +station.Lat);
    let { x, y } = map.project(point);
    return { cx: x, cy: y };
  }
  let radiusScale;
  let timeFilter = -1;
  let stationFlow = d3.scaleQuantize().domain([0, 1]).range([0, 0.5, 1]);
  let isochrone = null;
  function geoJSONPolygonToPath(feature) {
    const path = d3.path();
    const rings = feature.geometry.coordinates;
    for (const ring of rings) {
      for (let i = 0; i < ring.length; i++) {
        const [lng, lat] = ring[i];
        const { x, y } = map.project([lng, lat]);
        if (i === 0)
          path.moveTo(x, y);
        else
          path.lineTo(x, y);
      }
      path.closePath();
    }
    return path.toString();
  }
  $$result.css.add(css);
  radiusScale = d3.scaleSqrt().domain([0, d3.max(stations, (d) => d.totalTraffic) || 0]).range([0, 25]);
  new Date(0, 0, 0, 0, timeFilter).toLocaleString("en", { timeStyle: "short" });
  filteredTrips = trips;
  filteredDepartures = d3.rollup(filteredTrips, (v) => v.length, (d) => d.start_station_id);
  filteredArrivals = d3.rollup(filteredTrips, (v) => v.length, (d) => d.end_station_id);
  filteredStations = stations.map((station) => {
    const id = station.Number;
    const arr = filteredArrivals.get(id) ?? 0;
    const dep = filteredDepartures.get(id) ?? 0;
    return {
      ...station,
      arrivals: arr,
      departures: dep,
      totalTraffic: arr + dep
    };
  });
  {
    {
      isochrone = null;
    }
  }
  return `${$$result.head += `<!-- HEAD_svelte-w23run_START -->${$$result.title = `<title>LAB 8 MAP</title>`, ""}<meta name="description" content="Svelte demo app"><!-- HEAD_svelte-w23run_END -->`, ""} <header class="svelte-3wqi17"><h1 data-svelte-h="svelte-bdj8iz">Lab 8 -- Map</h1> <h3 data-svelte-h="svelte-600qac">Filter by time:</h3> <input type="range" min="-1" max="1440" step="1"${add_attribute("value", timeFilter, 0)}> <br> <time>${`<em data-svelte-h="svelte-1bsxq7p">Any time</em>`}</time></header> <div id="map" class="svelte-3wqi17"><svg class="svelte-3wqi17">${isochrone ? `${each(isochrone.features, (feature) => {
    return `<path${add_attribute("d", geoJSONPolygonToPath(feature), 0)}${add_attribute("fill", feature.properties.fillColor, 0)} fill-opacity="0.2" stroke="#000000" stroke-opacity="0.5" stroke-width="1"><title>${escape(feature.properties.contour)} minutes of biking</title></path>`;
  })}` : ``}  ${filteredStations.length > 0 ? ` ${each(filteredStations, (station) => {
    return `<g><circle${spread(
      [
        escape_object(getCoords(station)),
        {
          r: escape_attribute_value(radiusScale(station.totalTraffic))
        },
        { fill: "steelblue" },
        { "fill-opacity": "60%" },
        { stroke: "white" },
        {
          style: "--departure-ratio: " + escape(stationFlow(station.departures / station.totalTraffic), true)
        },
        {
          class: escape_attribute_value(station?.Number === selectedStation?.Number ? "selected" : "")
        }
      ],
      { classes: "svelte-3wqi17" }
    )}></circle></g>`;
  })}` : ``}</svg></div> <div class="legend svelte-3wqi17" data-svelte-h="svelte-srnvu9"><div style="--departure-ratio: 1" class="svelte-3wqi17">More departures</div> <div style="--departure-ratio: 0.5" class="svelte-3wqi17">Balanced</div> <div style="--departure-ratio: 0" class="svelte-3wqi17">More arrivals</div> </div>`;
});
export {
  Page as default
};
