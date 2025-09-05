<template>
<div id="map" :style="[{'--height': mapHeight}]">
</div>
<!-- <canvas id="voronoi" width="500" height="960" style="border: 2px solid black;">

</canvas> -->
</template>
<script lang="jsx">
import { Loader } from "@googlemaps/js-api-loader";
import { toRaw, isProxy } from "vue";
import MapMarkerComponent from "./MapMarkerComponent.vue";
import * as d3 from "d3";


export default {
    data(){
        return {
            map: null,
            center: { lat: 42.01674161706719, lng: 44.070112500000015 },
            advancedMarker: null,

            loadedMarkersLocalArray: [],
            loadedMarkersWorldCoordinatesLocalArray: [],
        }
    },
    components: {
        MapMarkerComponent,
    },
    props: {
        mapHeight: {
            type: String,
            default: '100%',
        },
        markersArray: {
            type: Array,
            default: [],
        },
    },
    watch: {
        markersArray: {
            handler(newArray){
                if(this.map !== null){
                    this.loadedMarkersLocalArray.forEach((marker) => {
                        marker.setMap(null);
                    });
                    this.loadedMarkersLocalArray = [];
                    this.loadedMarkersWorldCoordinatesLocalArray = [];
                    this.loadMarkers();
                }
            },
            deep: true,
        },
    },
    mounted() {
        this.loadMapsJavascriptApi();
        // this.testVoronoiDiagram();
    },
    methods: {
        testVoronoiDiagram(){
            // const delaunay = d3.Delaunay.from([[0, 0], [0, 100], [100, 0], [65.67111111111112, 95.17492654697409], [150, 150], [200, 200], [180, 200], [75, 135]]);
            // const voronoi = delaunay.voronoi([0, 0, 640, 480]);

            // console.log(voronoi.cellPolygons(3));
            
            
            // let canvas = document.getElementById("voronoi");
            // var context = canvas.getContext("2d");
            
            // // Clear
            // context.clearRect(0, 0, canvas.width, canvas.height);
            
            // // Set stroke style so you can see lines
            // context.strokeStyle = "black";  
            // context.lineWidth = 1;

            // // Draw voronoi edges
            // voronoi.render(context);
              




            // context.stroke();
            // context.fillStyle = "red";
            // // for(let i = 0; i < delaunay.points.length; i+=2){
            // //     let x = delaunay.points[i];
            // //     let y = delaunay.points[i + 1];
            // //     context.beginPath();
            // //     context.arc(x, y, 4, 0, 2 * Math.PI);
            // //     context.fill();
            // // };

            // console.log(voronoi.cellPolygon(2));
            // voronoi.cellPolygon(2).forEach((location) => {

            //     context.beginPath();
            //     context.arc(location[0], location[1], 4, 0, 2 * Math.PI);
            //     context.fill();
            // });

        },

        worldToLatLng(worldPoint){
            let projection = toRaw(this.map).getProjection();

            return projection.fromPointToLatLng(worldPoint);
        },

        getLatLngFromWorldCoordinates(x, y){
            let worldPoint = new google.maps.Point(x, y);
            let latLng = this.worldToLatLng(worldPoint);

            return {
                lat: latLng.lat(),
                lng: latLng.lng(),
            };
        },
        
        latLngToWorld(latLng) {
            let projection = toRaw(this.map).getProjection();
            // projection.fromLatLngToPoint returns a world coordinate as Point(x, y)
            return projection.fromLatLngToPoint(latLng);
        },
        getWorldCoordinateFromLatLng(lat, lng){
            let latLng = new google.maps.LatLng(lat, lng);
            let worldPoint = this.latLngToWorld(latLng);
            // return [
            //     worldPoint.x,
            //     worldPoint.y,
            // ];
            return worldPoint;
        },
        
        loadMarkers(){
            this.markersArray.forEach((markerObj, i) => {
                this.loadedMarkersWorldCoordinatesLocalArray.push(this.getWorldCoordinateFromLatLng(markerObj.latLng.lat, markerObj.latLng.lng));
                // temp.push(this.getLatLngFromWorldCoordinates(this.loadedMarkersWorldCoordinatesLocalArray[i].x, this.loadedMarkersWorldCoordinatesLocalArray[i].y));
                
                // console.log(this.loadedMarkersWorldCoordinatesLocalArray);
                

                const marker = new this.advancedMarker({
                    map: toRaw(this.map),
                    position: markerObj.latLng, 
                    content: this.buildMarkerContent(markerObj),
                    title: markerObj.type.typeName,
                    zIndex: 1,
                });

                marker.addEventListener('mouseenter', (event) => {
                    if(marker.zIndex == 1){
                        marker.zIndex = 2;
                    }
                    toRaw(this.map).setOptions({ // makes map untouchable
                        gestureHandling: "none",
                        clickableIcons: false,
                    });
                    
                });
                marker.addEventListener('mouseleave', (event) => {
                    if(marker.zIndex == 2){
                        marker.zIndex = 1;
                    }
                    toRaw(this.map).setOptions({ // makes map touchable
                        gestureHandling: null,
                        clickableIcons: true,
                    });
                });
                let index = this.loadedMarkersLocalArray.length;
                
                marker.addListener("gmp-click", (event) => { // first click event happens from component than comes this event listener
                    if(marker.zIndex == 3 && !marker.content.querySelector(".map-marker-wrapper").classList.contains("open")){
                        marker.zIndex = 1;
                    }else{
                        marker.zIndex = 3;
                    }
                    let currentMarkerIndex = index;
                    this.loadedMarkersLocalArray.toSpliced(currentMarkerIndex, 1).forEach((markerObj) => {
                        markerObj.content.querySelector(".map-marker-wrapper").classList.remove("open");
                        markerObj.zIndex = 1;


                        // if(!(marker.content).isSameNode(markerObj.content)){
                        // }
                    });
                });

                this.loadedMarkersLocalArray.push(marker);
            });
            
        },
        buildMarkerContent(markerObj){
            let mapMarkerWrapper = document.createElement("div");
            let markerApp = markerObj.markerAppFactory();
            
            markerApp.mount(mapMarkerWrapper);
            return mapMarkerWrapper;
        },
        async initMap(){
            const { Map, InfoWindow } = await google.maps.importLibrary("maps");
            const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker");
            this.advancedMarker = AdvancedMarkerElement;
            // this.pinElement = PinElement;
            // this.infoWindow = InfoWindow;
            // this.infoWindowElement = new this.infoWindow({
            //     maxWidth: 250,
            // });
            var allowedBounds = await new google.maps.LatLngBounds(
                await new google.maps.LatLng(40.478072, 38.492964),
                await new google.maps.LatLng(44.254719, 48.130206) 
            );
            this.map = await new google.maps.Map(document.getElementById("map"), {
                center: this.center,
                zoom: 2,
                mapId: "DEMO_MAP_ID",
                zoomControl: true, // was true
                mapTypeControl: false,
                scaleControl: true, // was true
                streetViewControl: false,
                rotateControl: true, // was true
                fullscreenControl: true, // was true
                // minZoom: 8,
                mapTypeId: "roadmap",
                restriction: {
                    latLngBounds: allowedBounds,
                    strictBounds: true,
                },



                // disableDefaultUI: true,       // Removes zoom buttons, street view etc.
                // gestureHandling: "none",      // Disables scroll, drag, and touch gestures
                // draggable: false,             // Prevents dragging
                // scrollwheel: false,           // Prevents zooming with mouse wheel
                // disableDoubleClickZoom: true, // Prevents zoom on double click
                // clickableIcons: false,  // prevents clicks on POIs (like businesses, parks)

            });
            await google.maps.event.addListenerOnce(toRaw(this.map), 'idle', () => {
            });
            await google.maps.event.addListenerOnce(toRaw(this.map), 'projection_changed', () => {
                this.loadMarkers();
            });
            
        },
        async loadMapsJavascriptApi(){
            const loader = new Loader({
                apiKey: process.env.VUE_APP_GOOGLE_MAPS_API_KEY,
                version: "beta",
                language: "GE",
                region: "GE",
                authReferrerPolicy: "origin",
            });
            await loader.importLibrary('maps').then(({Map}) => {
                this.initMap();
            })
            .catch((e) => {
                document.getElementById("map").textContent = "რუკა ვერ ჩაიტვირთა, დაფიქსირდა შეცდომა";
            });
            
        },
    }
}
</script>
<style lang="scss">
#map{
    height: var(--height);
    width: 100%;
}
</style>