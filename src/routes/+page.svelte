<script>
	import mapboxgl from "mapbox-gl";
	import "../../node_modules/mapbox-gl/dist/mapbox-gl.css";
	mapboxgl.accessToken = "pk.eyJ1IjoiZXNtaXRjaDIiLCJhIjoiY205Ym82bTBlMGk1dDJ3cHZ0Y2plbDBjMSJ9.w15FrONlbQzksaDlmfLL1g";

	import { onMount } from "svelte";
	import * as d3 from "d3";

	let stations = [];
	let map;
	let mapViewChanged = 0;
	let trips = [];



	function getCoords (station) {
		let point = new mapboxgl.LngLat(+station.Long, +station.Lat);
		let {x, y} = map.project(point);
		return {cx: x, cy: y};
	}

	async function initialize() {
		map = new mapboxgl.Map({
			container: "map",
			style: "mapbox://styles/mapbox/streets-v12",
			zoom: 12,
			center: [-71.09415, 42.36027]

		}
		);


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
		stations = await d3.csv("https://vis-society.github.io/labs/8/data/bluebikes-stations.csv");
		console.log(stations);

		$: map?.on("move", evt => mapViewChanged++);

		await fetchTripsData();
	}

	$: radiusScale = d3.scaleSqrt()
		.domain([0, d3.max(stations, d => d.totalTraffic) || 0])
		.range(timeFilter === -1 ? [0, 25] : [3, 30]);
		

	// Fetch trips data asynchronously and use it to calculate rollups
	async function fetchTripsData() {
		console.log("Loading trips...")
		// Fetch trips data
		trips = await d3.csv("bluebikes-traffic-2024-03.csv").then(trips => {
			for (let trip of trips){
				trip.started_at = new Date(trip.started_at);
				trip.ended_at = new Date(trip.ended_at);
			}
			return trips;
		});

		console.log(trips);

		// Once trips are fetched, calculate rollups
		if (trips) {
			departures = d3.rollup(trips, v => v.length, d => d.start_station_id);
			arrivals = d3.rollup(trips, v => v.length, e => e.end_station_id);

			console.log("Departures:", departures);
			console.log("Arrivals:", arrivals);

			stations = stations.map(station => {
				let id = station.Number; // The ID of the station, assuming `Number` is the ID column
				station.arrivals = arrivals.get(id) ?? 0; // Get arrivals count (default to 0 if not found)
				station.departures = departures.get(id) ?? 0; // Get departures count (default to 0 if not found)
				station.totalTraffic = station.arrivals + station.departures; // Total traffic is the sum of arrivals and departures
				return station;
			});

			console.log("Updated Stations with Traffic:", stations);
		}
	}

	function minutesSinceMidnight (date) {
		return date.getHours() * 60 + date.getMinutes();
	}


	let departures;
	let arrivals;
	let totalTraffic;
	let radiusScale;
	let timeFilter = -1;

	$: timeFilterLabel = new Date(0, 0, 0, 0, timeFilter)
                     .toLocaleString("en", {timeStyle: "short"});



	$: filteredTrips = timeFilter === -1? trips : trips.filter(trip => {
		let startedMinutes = minutesSinceMidnight(trip.started_at);
		let endedMinutes = minutesSinceMidnight(trip.ended_at);
		return Math.abs(startedMinutes - timeFilter) <= 60
			|| Math.abs(endedMinutes - timeFilter) <= 60;
	});

	$: filteredDepartures = d3.rollup(filteredTrips, v => v.length, d => d.start_station_id);
	$: filteredArrivals = d3.rollup(filteredTrips, v => v.length, d => d.end_station_id);

	$: filteredStations = stations.map(station => {
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


	let stationFlow = d3.scaleQuantize()
		.domain([0, 1])
		.range([0, 0.5, 1]);




	const urlBase = 'https://api.mapbox.com/isochrone/v1/mapbox/';
	const profile = 'cycling';
	const minutes = [5, 10, 15, 20];
	const contourColors = [
		"03045e",
		"0077b6",
		"00b4d8",
		"90e0ef"
	]
	let isochrone = null;

	async function getIso(lon, lat) {
		const base = `${urlBase}${profile}/${lon},${lat}`;
		const params = new URLSearchParams({
			contours_minutes: minutes.join(','),
			contours_colors: contourColors.join(','),
			polygons: 'true',
			access_token: mapboxgl.accessToken
		});
		const url = `${base}?${params.toString()}`;

		const query = await fetch(url, { method: 'GET' });
		isochrone = await query.json();
	}

	let selectedStation = null;


	function geoJSONPolygonToPath(feature) {
		const path = d3.path();
		const rings = feature.geometry.coordinates;

		for (const ring of rings) {
			for (let i = 0; i < ring.length; i++) {
				const [lng, lat] = ring[i];
				const { x, y } = map.project([lng, lat]);
				if (i === 0) path.moveTo(x, y);
				else path.lineTo(x, y);
			}
			path.closePath();
		}
		return path.toString();
	}

	$: if (selectedStation) {
		getIso(+selectedStation.Long, +selectedStation.Lat);
	} else {
		isochrone = null;
	}








	onMount(() => {
		initialize();
	})


	




</script>

<svelte:head>
	<title>LAB 8 MAP</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<header>
	<h1>Lab 8 -- Map </h1>

	<h3>Filter by time:</h3>
	<input type=range min=-1 max=1440 bind:value={timeFilter} step="1" />
	<br>
	<time>
		{#if timeFilter === -1}
			<em>Any time</em>
		{:else}
			{timeFilterLabel}
		{/if}
	</time>

</header>

<div id="map">

	<svg>
		{#key mapViewChanged} 
			{#if isochrone}
				{#each isochrone.features as feature}
					<path
						d={geoJSONPolygonToPath(feature)}
						fill={feature.properties.fillColor}
						fill-opacity="0.2"
						stroke="#000000"
						stroke-opacity="0.5"
						stroke-width="1"
					>
						<title>{feature.properties.contour} minutes of biking</title>
					</path>
				{/each}
			{/if}
		
		
			<!-- Re-renders when mapViewChanged changes -->
			{#if filteredStations.length > 0} <!-- Only render when stations have data -->
				{#each filteredStations as station}

				<g on:click={() => console.log("Circle clicked")}>
				
					<circle {...getCoords(station)}
						r={radiusScale(station.totalTraffic)}
						fill="steelblue"
						fill-opacity="60%"
						stroke="white"
						style="--departure-ratio: { stationFlow(station.departures / station.totalTraffic) }"
						class={station?.Number === selectedStation?.Number ? "selected" : ""}
						on:click={() => {
							console.log("Circle clicked", station); // Check if event is being fired
						}}
				/>
				</g>


				{/each}
			{/if}
		{/key}
	</svg>
</div>
<div class="legend">
	<div style="--departure-ratio: 1">More departures</div>
	<div style="--departure-ratio: 0.5">Balanced</div>
	<div style="--departure-ratio: 0">More arrivals</div>
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

		/* Dims other circles when one is selected */
		&:has(circle.selected) circle:not(.selected) {
			opacity: 0.3;
		}

	}

	header{
		display: flex;
		gap: 1em;
		align-items: baseline;
		margin-bottom: 20px;
		display: block;
	}
	circle{
		--color-departures: steelblue;
		--color-arrivals: darkorange;
		--color: color-mix(
			in oklch,
			var(--color-departures) calc(100% * var(--departure-ratio)),
			var(--color-arrivals)
		);
		fill: var(--color);
	}

	.legend {
		display: flex;
		gap: 1px; /* Gap between blocks */
		margin-top: 20px; /* Space from the map */
		width: 100%;
	}

	.legend > div {
		flex: 1; /* Makes each block take up equal space */
		padding: 10px 20px; /* Horizontal padding for better balance */
		text-align: center; /* Centers the text inside each block */
		font-weight: bold; /* Make the text bold */
		color: white; /* Text color */
		background-color: var(--color-departures); /* Default color */
	}

	.legend > div:nth-child(1) {
		--color-departures: steelblue;
	}

	.legend > div:nth-child(2) {
		--color-departures: darkmagenta;
	}

	.legend > div:nth-child(3) {
		--color-departures: darkorange;
	}


</style>
