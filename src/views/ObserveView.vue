<template>
    <div class="observer-page-wrapper">
        <main class="map-wrapper">
            <PrimaryMapComponent :markersArray="meamaLocationsArray">

            </PrimaryMapComponent>
        </main>
        <aside class="map-side-navigation-wrapper py-4">
            <ul class="d-flex flex-column align-items-center w-100 gap-3">
                <li class="w-100" v-for="(data, i) of mapNavigationData" v-on:click="mapNavigationClickHandler(data)">
                    <LeftGrowingAccordion>
                        <template v-slot:growingPart>
                            <div class="d-flex align-items-center h-100 br-25 p-2" style="background-color: var(--primary-background-color);">
                                <p class="standard-text-size white-text" style="text-align: center;">
                                    {{ data.name }}
                                </p>
                            </div>
                        </template>
                        <template v-slot:basePart>
                            <div :class="['map-side-navigation-button', {'choosen': data.isChoosen}, 'd-flex', 'align-item-center', 'justify-content-center', 'p-2', 'br-20']">
                                <img width="36px" height="36px" :src="require(`@/assets/images/mapNavigation/${data.icon}`)" :alt="data.name">
                            </div>
                        </template>
                    </LeftGrowingAccordion>
                </li>
            </ul>
        </aside>



    </div>


    <Accordion>
        <template v-slot:accordionHeader>
            <div class="d-flex align-items-center px-3 py-1">
                <h5 class="before-large-text-size">
                    აპარატები
                </h5>
            </div>
        </template>
        <template v-slot:additionalInfo>
            <div class="d-flex align-items-start justify-content-between px-3 py-2">
                <article class="d-flex flex-column column-gap-2">
                    <h6 class="after-standard-text-size">
                        გაყიდული
                    </h6>
                    <ol class="d-flex flex-column align-items-stretch" style="list-style-type: decimal; padding-left: 1em !important;">
                        <li>
                            <p class="standard-text-size">
                                ვერსეტაილი - 22
                            </p>
                        </li>
                    </ol>
                </article>
                <article class="d-flex flex-column column-gap-2">
                    <h6 class="after-standard-text-size">
                        მარაგში
                    </h6>
                    <ol class="d-flex flex-column align-items-stretch" style="list-style-type: decimal; padding-left: 1em !important;">
                        <li>
                            <p class="standard-text-size">
                                ვერსეტაილი - 22
                            </p>
                        </li>
                    </ol>
                </article>
            </div>


        </template>
    </Accordion>



    <!-- <div class="map-marker-wrapper">
        <img class="map-marker-icon" width="32px" height="32px" src="@/assets/images/mapNavigation/collect.png" alt="meama collect">
        <div class="map-marker-content-wrapper">
            <article class="d-flex align-items-start justify-content-between">
                <div class="d-flex flex-column align-items-start">
                    <h5 class="large-text-size">
                        Meama Collect
                    </h5>
                    <p class="standard-text-size">
                        ბახტრიონის 17 ნომერი.
                    </p>
                </div>
            </article>
            <hr>
            <article class="d-flex flex-column align-items-start row-gap-2">
                <h5 class="before-large-text-size">
                    ობიექტის ზოგადი სტატისტიკა
                </h5>
                <table style="width: 100%">
                    <thead class="after-standard-text-size">
                        <tr>
                            <th>
                                პარამეტრი
                            </th>
                            <th>
                                რაოდენობა
                            </th>
                            <th>
                                მთლიანი რაოდენობის
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="standard-text-size">
                            <td>
                                სულ გაყიდული
                            </td>
                            <td>
                                30
                            </td>
                            <td>
                                20%
                            </td>
                        </tr>
                        <tr class="standard-text-size">
                            <td>
                                სულ ღირებულება
                            </td>
                            <td>
                                300ლ
                            </td>
                            <td>
                                34%
                            </td>
                        </tr>
                    </tbody>
                </table>
            </article>
        </div>
    </div> -->







</template>
<script lang="jsx">
import LeftGrowingAccordion from '@/components/LeftGrowingAccordion.vue';
import mapNavigations from '@/assets/jsons/mapNavigations.json';
import PrimaryMapComponent from '@/components/PrimaryMapComponent.vue';
import meamaCollects from '@/assets/jsons/meamaCollects.json';
import MapMarkerComponent from '@/components/MapMarkerComponent.vue';
import { createApp } from 'vue';
import collectIcon from '@/assets/images/mapNavigation/collect.png'
import Accordion from '@/components/Accordion.vue';

export default {
    data(){
        return {
            filtersInfoObj: {
                mapNavigationFilters: null,
            },
            mapNavigationFiltersObj: {
                mapNavigationFilters: [], 
            },
            mapNavigationData: [],
            meamaLocationsArray: [], 
        }
    },
    components: {
        LeftGrowingAccordion,
        PrimaryMapComponent,
        MapMarkerComponent,
        Accordion,
    },
    mounted() {
        this.routeMountMovenment(this.$route);
    },
    beforeRouteUpdate(to, from, next){
        let isQueryValid = this.getInfoFromRoute(to);
        if(isQueryValid){
            this.mountMapNavigationFilters(); // first before second
            this.getMapNavigationData(); // second after first
            this.getMeamaLocations(); // third after second
            next(true);
        }else{
            this.$router.back();
        }
    },
    methods: {
        routeMountMovenment(to){
            let isQueryValid = this.getInfoFromRoute(to);
            if(isQueryValid){
                this.mountMapNavigationFilters();
                this.getMapNavigationData();
                this.getMeamaLocations();
            }else{
                this.$router.back();
            }
        },
        getInfoFromRoute(to){
            Object.keys(this.filtersInfoObj).forEach((filterPropKey) => {
                this.filtersInfoObj[filterPropKey] = to.query[filterPropKey]?decodeURIComponent(to.query[filterPropKey].replace(/%/g, '%25')):null;
                
            });
            let isQueryValid = Object.keys(this.filtersInfoObj).every((filterPropKey) => {
                if(filterPropKey == "mapNavigationFilters" && this.filtersInfoObj[filterPropKey]){
                    return this.$helper.checkOptionalNumber(this.filtersInfoObj[filterPropKey]);
                }
                return true;
            });
            return isQueryValid;
        },
        getMeamaLocations(){
            this.meamaLocationsArray = [];
            this.mapNavigationFiltersObj.mapNavigationFilters.forEach((id) => {

                switch (Number(id)) {
                    case 1:
                        // this.meamaLocationsArray.push(...meamaCollects);
                        this.meamaLocationsArray.push(...this.getMeamaCollectsWithMarkerJSXInnerHtml());
                        break;
                    default:
                        break;
                }
            });
        },
        getMeamaCollectsWithMarkerJSXInnerHtml(){
            return meamaCollects.map((meamaCollectObj) => {
                const markerAppFactory = () => createApp(() => (
                    <MapMarkerComponent markerIconAddress={collectIcon}
                        v-slots={{
                            markerDetailedInfo: () => (
                                <div class="d-flex flex-column align-items-stretch">
                                    <article class="d-flex align-items-start justify-content-between">
                                        <div class="d-flex flex-column align-items-start">
                                            <h5 class="large-text-size">
                                                {meamaCollectObj.type.typeName}
                                            </h5>
                                            <p class="standard-text-size">
                                                {meamaCollectObj.address}
                                            </p>
                                        </div>
                                    </article>
                                    <hr/>
                                    <article class="d-flex flex-column align-items-start row-gap-2">
                                        <h5 class="before-large-text-size">
                                            ობიექტის ზოგადი სტატისტიკა
                                        </h5>
                                        <table style="width: 100%">
                                            <thead class="after-standard-text-size">
                                                <tr>
                                                    <th>
                                                        პარამეტრი
                                                    </th>
                                                    <th>
                                                        რაოდენობა
                                                    </th>
                                                    <th>
                                                        მთლიანი რაოდენობის
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr class="standard-text-size">
                                                    <td>
                                                        სულ გაყიდული
                                                    </td>
                                                    <td>
                                                        {meamaCollectObj.sold.quantity}
                                                    </td>
                                                    <td>
                                                        {meamaCollectObj.sold.quantityPercentage}%
                                                    </td>
                                                </tr>
                                                <tr class="standard-text-size">
                                                    <td>
                                                        სულ ღირებულება
                                                    </td>
                                                    <td>
                                                        {meamaCollectObj.sold.price}ლარი
                                                    </td>
                                                    <td>
                                                        {meamaCollectObj.sold.pricePercentage}%
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </article>
                                    <hr/>
                                    <Accordion v-slots={{
                                        accordionHeader: () => (
                                            <div class="d-flex align-items-center px-3 py-1">
                                                <h5 class="before-large-text-size">
                                                    აპარატები
                                                </h5>
                                            </div>
                                        ),
                                        additionalInfo: () => (
                                            <div class="d-flex align-items-start justify-content-between row-gap-2 px-3 py-2">
                                                <article class="d-flex flex-column column-gap-2">
                                                    <h6 class="after-standard-text-size">
                                                        გაყიდული
                                                    </h6>
                                                    <ol class="d-flex flex-column align-items-stretch" style="list-style-type: decimal; padding-left: 1em !important;">
                                                        {
                                                            meamaCollectObj.sold.coffeeMachines.map((coffeeMachine, i) => (
                                                                <li key={i}>
                                                                    <p class="standard-text-size">
                                                                        {coffeeMachine.MachineName} - {coffeeMachine.quantity}
                                                                    </p>
                                                                </li>
                                                            ))
                                                        }
                                                    </ol>
                                                </article>
                                                <article class="d-flex flex-column column-gap-2">
                                                    <h6 class="after-standard-text-size">
                                                        მარაგში
                                                    </h6>
                                                    <ol class="d-flex flex-column align-items-stretch" style="list-style-type: decimal; padding-left: 1em !important;">
                                                        {
                                                            meamaCollectObj.stock.coffeeMachines.map((coffeeMachine, i) => (
                                                                <li>
                                                                    <p class="standard-text-size">
                                                                        {coffeeMachine.MachineName} - {coffeeMachine.quantity}
                                                                    </p>
                                                                </li>
                                                            ))
                                                        }
                                                    </ol>
                                                </article>
                                            </div>
                                        )
                                    }}>
                                    </Accordion>
                                    <hr/>
                                    <Accordion v-slots={{
                                        accordionHeader: () => (
                                            <div class="d-flex align-items-center px-3 py-1">
                                                <h5 class="before-large-text-size">
                                                    აპარატები
                                                </h5>
                                            </div>
                                        ),
                                        additionalInfo: () => (
                                            <div class="d-flex align-items-start justify-content-between row-gap-2 px-3 py-2">
                                                <article class="d-flex flex-column column-gap-2">
                                                    <h6 class="after-standard-text-size">
                                                        გაყიდული
                                                    </h6>
                                                    <ol class="d-flex flex-column align-items-stretch" style="list-style-type: decimal; padding-left: 1em !important;">
                                                        {
                                                            meamaCollectObj.sold.coffeeMachines.map((coffeeMachine, i) => (
                                                                <li key={i}>
                                                                    <p class="standard-text-size">
                                                                        {coffeeMachine.MachineName} - {coffeeMachine.quantity}
                                                                    </p>
                                                                </li>
                                                            ))
                                                        }
                                                    </ol>
                                                </article>
                                                <article class="d-flex flex-column column-gap-2">
                                                    <h6 class="after-standard-text-size">
                                                        მარაგში
                                                    </h6>
                                                    <ol class="d-flex flex-column align-items-stretch" style="list-style-type: decimal; padding-left: 1em !important;">
                                                        {
                                                            meamaCollectObj.stock.coffeeMachines.map((coffeeMachine, i) => (
                                                                <li>
                                                                    <p class="standard-text-size">
                                                                        {coffeeMachine.MachineName} - {coffeeMachine.quantity}
                                                                    </p>
                                                                </li>
                                                            ))
                                                        }
                                                    </ol>
                                                </article>
                                            </div>
                                        )
                                    }}>
                                    </Accordion>
                                </div>
                            )
                        }}
                    />
                ), 
                // {
                //     markerIconAddress: require("@/assets/images/mapNavigation/collect.png"),
                // }
                );
                return {
                    ...meamaCollectObj,
                    markerAppFactory: markerAppFactory,
                };


            });
        },
        mountMapNavigationFilters(){
            this.mapNavigationFiltersObj.mapNavigationFilters = this.filtersInfoObj.mapNavigationFilters?.split(';')??[];
        },
        getMapNavigationData(){
            this.mapNavigationData = mapNavigations.map((mapNav) => {
                return {
                    ...mapNav,
                    isChoosen: this.mapNavigationFiltersObj.mapNavigationFilters.includes(String(mapNav.mapNavigationID)),
                }
            });
        },
        mapNavigationClickHandler(mapNavigationObj){
            mapNavigationObj.isChoosen = !mapNavigationObj.isChoosen;

            let choosenNavigationBtnTempArray = [];
            // let otherFilters = {};
            this.mapNavigationData.forEach((mapNavObj) => {
                if(mapNavObj.isChoosen){
                    choosenNavigationBtnTempArray.push(mapNavObj.mapNavigationID);
                }
            });



            this.$router.push({
                path: this.$route.path,
                query: {
                    ...this.$route.query,
                    mapNavigationFilters: choosenNavigationBtnTempArray.join(';'),
                }
            });
        }
    }
}
</script>
<style lang="scss">
.observer-page-wrapper{
    display: grid;
    grid-template-columns: 1fr 7%;
    grid-template-rows: 1fr;
    height: 100dvh;
    .map-wrapper{
        background-color: var(--secondary-background-color);
        height: 100%;
    }
    .map-side-navigation-wrapper{
        background-color: var(--primary-background-color);
        height: 100%;
        .map-side-navigation-button{
            transition: all 0.1s ease-out;
            background-color: gray;
            width: 80%; 
            margin: 0 auto;
            &.choosen{
                background-color: var(--third-background-color);
            }
            img{
                transition: all 0.1s ease-out;
            }
            &:hover img{
                transform: scale(1.2);
            }
        }
    }
}
// .map-marker-wrapper{
//     margin: 0 auto;
//     isolation: isolate;
//     cursor: pointer;
//     width: fit-content;
//     max-width: 600px;
//     border-radius: 45%;
//     background-color: var(--third-background-color);
//     padding: 0.8em;
//     position: relative;
//     display: grid;
//     grid-template-columns: 0fr;
//     grid-template-rows: 0fr;
//     transform-origin: center;

//     transition: all 0.3s ease-out;
//     &:hover{
//         grid-template-columns: 1fr;
//         grid-template-rows: 1fr;
//         padding: 1em;
//         border-radius: 25px;
//     }
//     .map-marker-icon{
//         position: sticky; // sticky towards .map-marker-wrapper
//         bottom: 100%;
//         left: 100%;
//         z-index: 1;
//     }
//     .map-marker-content-wrapper{
//         display: flex;
//         flex-direction: column;
//         align-items: stretch;
//         justify-content: center;
//         grid-column: 1 / 2;
//         grid-row: 1 / 2;
//         overflow: hidden;
//         white-space: nowrap;
//         table, th, td {
//             border: 1px solid black;
//             border-radius: 10px !important;    
//             border-collapse: collapse;
//         }
//         th, td{
//             padding: 0.1em;
//         }
//     }
// }

</style>