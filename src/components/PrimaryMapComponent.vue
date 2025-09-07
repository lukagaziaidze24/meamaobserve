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
            loadedMarkersWorldCoordinatesArraysLocalObj: {},
            loadedVoronoiDiagramsPolygonArraysObj: {}
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
        isVoronoiEnabled: {
            type: Boolean,
            default: false,
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
        drawSinglePolygon(coordinatesArray){
            const polygon = new google.maps.Polygon({
                paths: coordinatesArray,
                strokeColor: getComputedStyle(document.documentElement).getPropertyValue('--primary-background-color'),
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: "#8ee4e6",
                fillOpacity: 0.35,
            });

            polygon.setMap(toRaw(this.map));
            return polygon;
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
            return [
                worldPoint.x,
                worldPoint.y,
            ];
            // return worldPoint;
        },
        
        removeVoronoiDiagrams(){
            this.loadedMarkersWorldCoordinatesArraysLocalObj = {};
            Object.keys(this.loadedVoronoiDiagramsPolygonArraysObj).forEach((voronoiNameKey) => {
                this.loadedVoronoiDiagramsPolygonArraysObj[voronoiNameKey].forEach((polygon) => {
                    google.maps.event.clearInstanceListeners(polygon);
                    toRaw(polygon).setMap(null);
                    // polygon = null;
                });
                delete this.loadedVoronoiDiagramsPolygonArraysObj[voronoiNameKey];
            });
            this.loadedVoronoiDiagramsPolygonArraysObj = {};
        },
        renderVoronoiDiagram(){
            // 41.625367, 44.679809    qveda marcxena
            // 41.823185, 45.025879   zeda marjvena


            // console.log(this.getWorldCoordinateFromLatLng(41.625367, 44.679809)); // 159.77230862222223, 95.38899674365818
            // console.log(this.getWorldCoordinateFromLatLng(41.823185, 45.025879)); // 160.01840284444444, 95.20052005183214


            // 41.72296197730774, 44.750499999999995   Kartozia street, Kartozia N8 (M2 block) *
            // 41.72127549007287, 44.774401484656615   Bukia garden, Bakhtrioni street N1
            // 41.70862049051592, 44.7570099     Abashidze Street, Tbilisi Abashidze st. 65-67
            // 41.70824622859811, 44.770600371164136      Paliashvili Street, Tbilisi, Paliashvili street N36
            // 41.7209257920492, 44.71470097116414      Sheni sakhli jiqiaze,  Tbilisi Politkovskaia Street 3
            // 41.7539167, 44.77801707116415     Beliashvili,   Akaki Baqradze Street 1
            //  41.81270130000001, 44.772542942328315      Meama Collect • Aghmashenebeli Alley,    123 David Aghmashenebeli Alley |
            

            // meama spaces
            // 41.81734100890977, 44.772573264834406     Meama Space - Coffee Store,  დავით აღმაშენებლის ხეივანი მე-16 კმ თბილისი, 0131
            // 41.69089941947566, 44.896579132871224     მეამა სივრცე - East Point,    2 ალექსანდრე თვალჭრელიძის ქუჩა, თბილისი 0182
            // 41.72427247248251, 44.73727573815761      Meama Space - Coffee Store,   1 პეტრე ქავთარაძე, თბილისი

            this.removeVoronoiDiagrams();
            this.loadedMarkersWorldCoordinatesArraysLocalObj = {};
            this.loadedVoronoiDiagramsPolygonArraysObj = {};
            this.markersArray.forEach((markerObj, i) => {
                if(!this.loadedMarkersWorldCoordinatesArraysLocalObj.hasOwnProperty(markerObj.voronoiName)){
                    this.loadedMarkersWorldCoordinatesArraysLocalObj[markerObj.voronoiName] = {
                        points: [],
                        limits: markerObj.worldCoordinateLimits,
                    };
                }
                this.loadedMarkersWorldCoordinatesArraysLocalObj[markerObj.voronoiName].points.push(
                    this.getWorldCoordinateFromLatLng(markerObj.latLng.lat, markerObj.latLng.lng)
                );
            });
            
            Object.keys(this.loadedMarkersWorldCoordinatesArraysLocalObj).forEach((voronoiNameKey) => {
                const delaunay = d3.Delaunay.from(this.loadedMarkersWorldCoordinatesArraysLocalObj[voronoiNameKey].points);
                const voronoi = delaunay.voronoi(this.loadedMarkersWorldCoordinatesArraysLocalObj[voronoiNameKey].limits);
    
                for(let i = 0; i < this.loadedMarkersWorldCoordinatesArraysLocalObj[voronoiNameKey].points.length; i++){
                    if(!this.loadedVoronoiDiagramsPolygonArraysObj.hasOwnProperty(voronoiNameKey)){
                        this.loadedVoronoiDiagramsPolygonArraysObj[voronoiNameKey] = [];
                    }
                    this.loadedVoronoiDiagramsPolygonArraysObj[voronoiNameKey].push(
                        this.drawSinglePolygon(
                            voronoi.cellPolygon(i)?.map((worldCoordinateFromVoronoi) => {
                                return this.getLatLngFromWorldCoordinates(worldCoordinateFromVoronoi[0], worldCoordinateFromVoronoi[1])
                            })
                        )
                    );
                }

            });









            // await new google.maps.LatLng(40.478072, 38.492964),
            //     await new google.maps.LatLng(44.254719, 48.130206) 

            // let latLng = this.getWorldCoordinateFromLatLng(40.478072, 38.492964);
            // let latLng2 = this.getWorldCoordinateFromLatLng(44.254719, 48.130206);


            // console.log(latLng);
            // console.log(latLng2);
            
            
            // console.log(voronoi.circumcenters);
            // for(let i = 0; i < voronoi.circumcenters.length; i+=2){
            //     let latLng = this.getLatLngFromWorldCoordinates(voronoi.circumcenters[i], voronoi.circumcenters[i + 1]);

            //     const marker = new this.advancedMarker({
            //         map: toRaw(this.map),
            //         position: latLng, 
            //         zIndex: 10,
            //     });
            // }

            
            // this.loadedMarkersWorldCoordinatesArraysLocalObj.forEach((worldCoords) => {
            //     let latLng = this.getLatLngFromWorldCoordinates(worldCoords[0], worldCoords[1]);

            //     const marker = new this.advancedMarker({
            //         map: toRaw(this.map),
            //         position: latLng, 
            //         zIndex: 10,
            //     });
            // });

            // for(let i = 0; i < this.loadedMarkersWorldCoordinatesArraysLocalObj.length; i++){
            //     console.log(voronoi.cellPolygon(i));
            //     voronoi.cellPolygon(i).forEach((worldBounds) => {
            //         let latLng = this.getLatLngFromWorldCoordinates(worldBounds[0], worldBounds[1]);
            //         const marker = new this.advancedMarker({
            //             map: toRaw(this.map),
            //             position: latLng, 
            //             zIndex: 10,
            //         });
            //     });
                
            // }





            // console.log(voronoi.cellPolygon(0));
            

            
        },

        loadMarkers(){
            if(this.isVoronoiEnabled){
                this.renderVoronoiDiagram();
            }else{
                this.removeVoronoiDiagrams();
            }
            this.markersArray.forEach((markerObj, i) => {

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
                await new google.maps.LatLng(40.478072, 38.492964),//[155.3727744, 96.47090904724845] in world coordinates
                await new google.maps.LatLng(44.254719, 48.130206) //[162.22592426666665, 92.83429901034376] in world coordinates
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