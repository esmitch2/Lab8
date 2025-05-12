<script>
	import mapboxgl from "mapbox-gl";
	import "../../node_modules/mapbox-gl/dist/mapbox-gl.css";
	mapboxgl.accessToken = "pk.eyJ1IjoiZXNtaXRjaDIiLCJhIjoiY205Ym82bTBlMGk1dDJ3cHZ0Y2plbDBjMSJ9.w15FrONlbQzksaDlmfLL1g";

	import { onMount } from "svelte";
	import * as d3 from "d3";

	async function initialize() {
		let map = new mapboxgl.Map({
			container: "map",
			style: "mapbox://styles/mapbox/streets-v12",
			zoom: 12,
			center: [-71.09415, 42.36027]

		});

		await new Promise(resolve => map.on("load", resolve));
		map.addSource("boston_route", {
			type: "geojson",
			data: "https://bostonopendata-boston.opendata.arcgis.com/datasets/boston::existing-bike-network-2022.geojson?outSR=%7B%22latestWkid%22%3A3857%2C%22wkid%22%3A102100%7D",
		});

		map.addLayer({
			id: "SOME_ID", // A name for our layer (up to you)
			type: "line", // one of the supported layer types, e.g. line, circle, etc.
			source: "boston_route", // The id we specified in `addSource()`
			paint: {
				"line-color": "green",
				"line-width": 3,
				"line-opacity": 0.4
			},
		});

		map.addSource("cambridge_route", {
			type: "geojson",
			data: "https://raw.githubusercontent.com/cambridgegis/cambridgegis_data/main/Recreation/Bike_Facilities/RECREATION_BikeFacilities.geojson",
		});

		map.addLayer({
			id: "SOME_ID2", // A name for our layer (up to you)
			type: "line", // one of the supported layer types, e.g. line, circle, etc.
			source: "cambridge_route", // The id we specified in `addSource()`
			paint: {
				"line-color": "green",
				"line-width": 3,
				"line-opacity": 0.4
			},
		});

		console.log("hello world");
		let stations = d3.csv("https://vis-society.github.io/labs/8/data/bluebikes-stations.csv");
		console.log(stations);


	}

	onMount(() => {
		initialize();
	})

	




</script>

<svelte:head>
	<title>LAB 8 MAP</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<h1>Lab 8 -- Map </h1>

<div id="map">
	<svg></svg>
</div>


<style>
	@import url("$lib/global.css");

	#map {
		flex: 1;
	}

	#map svg {
		/* background: yellow; */
		/* opacity: 50%; */
		position: absolute;
		z-index: 1;
		width: 100%;
		height: 100%;
		pointer-events: none;
	}

</style>
