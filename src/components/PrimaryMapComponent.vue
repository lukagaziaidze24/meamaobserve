<template>
<div id="map" :style="[{'--height': mapHeight}]">
</div>
</template>
<script lang="jsx">
import { Loader } from "@googlemaps/js-api-loader";
import { toRaw, isProxy } from "vue";
import MapMarkerComponent from "./MapMarkerComponent.vue";
import { createApp } from "vue";
import collectIcon from "@/assets/images/mapNavigation/collect.png";


export default {
    data(){
        return {
            map: null,
            center: { lat: 42.01674161706719, lng: 44.070112500000015 },
            advancedMarker: null,

            loadedMarkersLocalArray: [],
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
                    this.loadMarkers();
                }
            },
            deep: true,
        },
    },
    mounted() {
        this.loadMapsJavascriptApi();
    },
    methods: {
        loadMarkers(){
            this.markersArray.forEach((markerObj) => {
                const marker = new this.advancedMarker({
                    map: toRaw(this.map),
                    position: markerObj.latLng, 
                    content: this.buildMarkerContent(markerObj),
                    title: markerObj.type.typeName,
                    zIndex: 1,
                });
                marker.addEventListener('mouseenter', (event) => {
                    marker.zIndex = 3;
                    toRaw(this.map).setOptions({
                        gestureHandling: "none",
                    });
                });
                marker.addEventListener('mouseleave', (event) => {
                    marker.zIndex = 1;
                    toRaw(this.map).setOptions({
                        gestureHandling: null,
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
            var allowedBounds = new google.maps.LatLngBounds(
                new google.maps.LatLng(40.478072, 38.492964),
                new google.maps.LatLng(44.254719, 48.130206) 
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
            });
            google.maps.event.addListenerOnce(toRaw(this.map), 'idle', () => {
            });
            this.loadMarkers();
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