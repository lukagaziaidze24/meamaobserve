<template>
<div ref="mapMarkerWrapper" class="map-marker-wrapper" @click="markerClickHandler($event)" @touchstart.stop @touchend.stop @touchmove.stop @touchcancel.stop>
    <img class="map-marker-icon" width="32px" height="32px" :src="markerIconAddress" alt="meama collect">


    <div class="map-marker-content-wrapper common-scrollbar">
        <slot name="markerDetailedInfo"/>
    </div>
</div>
</template>
<script>
export default{
    data(){
        return {
        }
    },  
    props: {
        markerIconAddress: String,
    },
    methods: {
        markerClickHandler(event){
            if(!this.$refs.mapMarkerWrapper.classList.contains("open")){
                this.$refs.mapMarkerWrapper.classList.add("open");
            }else if(this.$refs.mapMarkerWrapper.classList.contains("open") && event.target.classList.contains("map-marker-icon")){
                this.$refs.mapMarkerWrapper.classList.remove("open")
            }
        }
    }
}
</script>
<style lang="scss">
.map-marker-wrapper{
    min-width: 42px;
    min-height: 42px;
    max-height: 400px;
    max-width: 600px;
    margin: 0 auto;
    isolation: isolate;
    cursor: pointer;
    width: fit-content;
    border-radius: 45%;
    background-color: var(--third-background-color);
    padding: 0em;
    position: relative;
    display: grid;
    grid-template-columns: 0fr;
    grid-template-rows: 0fr;
    transform-origin: center;

    transition: all 0.3s ease-out;
    &.open{
        grid-template-columns: 1fr;
        grid-template-rows: 1fr;
        padding: 1em;
        border-radius: 25px;
        cursor:auto;
        .map-marker-content-wrapper{
            overflow-y: auto;
        }
        .map-marker-icon{
            margin-top: 1em;
            margin-right: 1em;            
            right: 0%;
            top: 0%;
            transform: translateX(0%) translateY(0%);
        }
    }
    .map-marker-icon{
        cursor: pointer;
        transition: all 0.3s ease-out;
        position: absolute;
        right: 50%;
        top: 50%;
        transform: translateX(50%) translateY(-50%);
        z-index: 1;
    }
    .map-marker-content-wrapper{
        display: flex;
        flex-direction: column;
        align-items: stretch;
        justify-content: flex-start;
        grid-column: 1 / 2;
        grid-row: 1 / 2;
        overflow: hidden;
        white-space: nowrap;
        table, th, td {
            border: 1px solid black;
            border-radius: 10px !important;    
            border-collapse: collapse;
        }
        th, td{
            padding: 0.1em;
        }
    }

}
</style>