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
</template>
<script lang="jsx">
import LeftGrowingAccordion from '@/components/LeftGrowingAccordion.vue';
import mapNavigations from '@/assets/jsons/mapNavigations.json';
import PrimaryMapComponent from '@/components/PrimaryMapComponent.vue';
import meamaCollects from '@/assets/jsons/meamaCollects.json';
import meamaSpaces from '@/assets/jsons/meamaSpaces.json';
import meamaDroppers from '@/assets/jsons/meamaDroppers.json';
import MapMarkerComponent from '@/components/MapMarkerComponent.vue';
import { createApp } from 'vue';
import collectIcon from '@/assets/images/mapNavigation/collect.png'
import spaceIcon from '@/assets/images/mapNavigation/space.png'
import vendingMachine from '@/assets/images/mapNavigation/vending-machine.png'


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
                        this.meamaLocationsArray.push(...this.getMeamaCollectsWithMarkerJSXInnerHtml(meamaCollects, collectIcon));
                        break;
                    case 2:
                        this.meamaLocationsArray.push(...this.getMeamaCollectsWithMarkerJSXInnerHtml(meamaDroppers, vendingMachine));
                        break;
                    case 3:
                        this.meamaLocationsArray.push(...this.getMeamaCollectsWithMarkerJSXInnerHtml(meamaSpaces, spaceIcon));
                        break;
                    default:
                        break;
                }
            });
        },
        getMeamaCollectsWithMarkerJSXInnerHtml(meamaLocations, icon){
            return meamaLocations.map((meamaCollectObj) => {
                const markerAppFactory = () => createApp(() => (
                    <MapMarkerComponent markerIconAddress={icon}
                        v-slots={{
                            markerDetailedInfo: () => (
                                <div class="d-flex flex-column align-items-stretch">
                                    <article class="d-flex align-items-start justify-content-between">
                                        <div class="d-flex flex-column align-items-start">
                                            <div class="d-flex align-items-center gap-3">
                                                <h5 class="large-text-size">
                                                    {meamaCollectObj.type.typeName}
                                                </h5>
                                                {
                                                    (meamaCollectObj.type.isFranchise && meamaCollectObj.type.typeID == 1) &&
                                                    (
                                                        <h6 class="large-text-size coffee-text-color">
                                                            Franchise
                                                        </h6>
                                                    )
                                                }
                                            </div>
                                            <p class="standard-text-size">
                                                {meamaCollectObj.address}
                                            </p>
                                            <div class="d-flex align-items-center column-gap-3">
                                                <article class="d-flex align-items-center gap-1">
                                                    <h6 class="standard-text-size">ტელ:</h6>
                                                    <p class="extra-small-text-size">
                                                        {meamaCollectObj.phone}
                                                    </p>
                                                </article>
                                                <article class="d-flex align-items-center gap-1">
                                                    <h6 class="standard-text-size">email:</h6>
                                                    <p class="extra-small-text-size">
                                                        {meamaCollectObj.email}
                                                    </p>
                                                </article>
                                            </div>
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
                                    {
                                        (meamaCollectObj.type.typeID == 3) &&
                                        (
                                            <div>
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
                                                                {
                                                                    (meamaCollectObj.sold.coffeeMachines?.length > 0) ?
                                                                    (
                                                                        <ol class="d-flex flex-column align-items-stretch common-primary-decimal-ol-style">
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
                                                                    ) : 
                                                                    (
                                                                        <ul class="d-flex flex-column align-items-stretch">
                                                                            <li>
                                                                                <p class="standard-text-size">
                                                                                    ინფორმაცია ვერ მოიძებნა
                                                                                </p>
                                                                            </li>
                                                                        </ul>
                                                                    )
                                                                }

                                                            </article>
                                                            <article class="d-flex flex-column column-gap-2">
                                                                <h6 class="after-standard-text-size">
                                                                    მარაგში
                                                                </h6>
                                                                {
                                                                    (meamaCollectObj.stock.coffeeMachines?.length > 0) ?
                                                                    (
                                                                        <ol class="d-flex flex-column align-items-stretch common-primary-decimal-ol-style">
                                                                            {
                                                                                meamaCollectObj.stock.coffeeMachines.map((coffeeMachine, i) => (
                                                                                    <li key={i}>
                                                                                        <p class="standard-text-size">
                                                                                            {coffeeMachine.MachineName} - {coffeeMachine.quantity}
                                                                                        </p>
                                                                                    </li>
                                                                                ))
                                                                            }
                                                                        </ol>
                                                                    ) : 
                                                                    (
                                                                        <ul class="d-flex flex-column align-items-stretch">
                                                                            <li>
                                                                                <p class="standard-text-size">
                                                                                    ინფორმაცია ვერ მოიძებნა
                                                                                </p>
                                                                            </li>
                                                                        </ul>
                                                                    )
                                                                }
                                                            </article>
                                                        </div>
                                                    )
                                                }}>
                                                </Accordion>
                                            </div>
                                        )
                                    }
                                    <hr/>
                                    <Accordion v-slots={{
                                        accordionHeader: () => (
                                            <div class="d-flex align-items-center px-3 py-1">
                                                <h5 class="before-large-text-size">
                                                    კაფსულები
                                                </h5>
                                            </div>
                                        ),
                                        additionalInfo: () => (
                                            <div class="d-flex align-items-start justify-content-between row-gap-2 px-3 py-2">
                                                <article class="d-flex flex-column column-gap-2">
                                                    <h6 class="after-standard-text-size">
                                                        გაყიდული
                                                    </h6>
                                                    {
                                                        (meamaCollectObj.sold.capsules?.length > 0) ?
                                                        (
                                                            <ol class="d-flex flex-column align-items-stretch common-primary-decimal-ol-style">
                                                                {
                                                                    meamaCollectObj.sold.capsules.map((capsule, i) => (
                                                                        <li key={i}>
                                                                            <p class="standard-text-size">
                                                                                {capsule.capsuleName} - {capsule.quantity}
                                                                            </p>
                                                                        </li>
                                                                    ))
                                                                }
                                                            </ol>
                                                        ) : 
                                                        (
                                                            <ul class="d-flex flex-column align-items-stretch">
                                                                <li>
                                                                    <p class="standard-text-size">
                                                                        ინფორმაცია ვერ მოიძებნა
                                                                    </p>
                                                                </li>
                                                            </ul>
                                                        )
                                                    }

                                                </article>
                                                <article class="d-flex flex-column column-gap-2">
                                                    <h6 class="after-standard-text-size">
                                                        მარაგში
                                                    </h6>
                                                    {
                                                        (meamaCollectObj.stock.capsules?.length > 0) ?
                                                        (
                                                            <ol class="d-flex flex-column align-items-stretch common-primary-decimal-ol-style">
                                                                {
                                                                    meamaCollectObj.stock.capsules.map((capsule, i) => (
                                                                        <li key={i}>
                                                                            <p class="standard-text-size">
                                                                                {capsule.capsuleName} - {capsule.quantity}
                                                                            </p>
                                                                        </li>
                                                                    ))
                                                                }
                                                            </ol>
                                                        ) : 
                                                        (
                                                            <ul class="d-flex flex-column align-items-stretch">
                                                                <li>
                                                                    <p class="standard-text-size">
                                                                        ინფორმაცია ვერ მოიძებნა
                                                                    </p>
                                                                </li>
                                                            </ul>
                                                        )
                                                    }
                                                </article>
                                            </div>
                                        )
                                    }}>
                                    </Accordion>
                                    {
                                        ([1, 3].includes(meamaCollectObj.type.typeID)) && 
                                        (
                                            <div>
                                                <hr/>
                                                <Accordion v-slots={{
                                                    accordionHeader: () => (
                                                        <div class="d-flex align-items-center px-3 py-1">
                                                            <h5 class="before-large-text-size">
                                                                აქსესუარები
                                                            </h5>
                                                        </div>
                                                    ),
                                                    additionalInfo: () => (
                                                        <div class="d-flex align-items-start justify-content-between row-gap-2 px-3 py-2">
                                                            <article class="d-flex flex-column column-gap-2">
                                                                <h6 class="after-standard-text-size">
                                                                    გაყიდული
                                                                </h6>
                                                                {
                                                                    (meamaCollectObj.sold.accessories?.length > 0) ?
                                                                    (
                                                                        <ol class="d-flex flex-column align-items-stretch common-primary-decimal-ol-style">
                                                                            {
                                                                                meamaCollectObj.sold.accessories.map((accessory, i) => (
                                                                                    <li key={i}>
                                                                                        <p class="standard-text-size">
                                                                                            {accessory.accessoryName} - {accessory.quantity}
                                                                                        </p>
                                                                                    </li>
                                                                                ))
                                                                            }
                                                                        </ol>
                                                                    ) : 
                                                                    (
                                                                        <ul class="d-flex flex-column align-items-stretch">
                                                                            <li>
                                                                                <p class="standard-text-size">
                                                                                    ინფორმაცია ვერ მოიძებნა
                                                                                </p>
                                                                            </li>
                                                                        </ul>
                                                                    )
                                                                }

                                                            </article>
                                                            <article class="d-flex flex-column column-gap-2">
                                                                <h6 class="after-standard-text-size">
                                                                    მარაგში
                                                                </h6>
                                                                {
                                                                    (meamaCollectObj.stock.accessories?.length > 0) ?
                                                                    (
                                                                        <ol class="d-flex flex-column align-items-stretch common-primary-decimal-ol-style">
                                                                            {
                                                                                meamaCollectObj.stock.accessories.map((accessory, i) => (
                                                                                    <li key={i}>
                                                                                        <p class="standard-text-size">
                                                                                            {accessory.accessoryName} - {accessory.quantity}
                                                                                        </p>
                                                                                    </li>
                                                                                ))
                                                                            }
                                                                        </ol>
                                                                    ) : 
                                                                    (
                                                                        <ul class="d-flex flex-column align-items-stretch">
                                                                            <li>
                                                                                <p class="standard-text-size">
                                                                                    ინფორმაცია ვერ მოიძებნა
                                                                                </p>
                                                                            </li>
                                                                        </ul>
                                                                    )
                                                                }
                                                            </article>
                                                        </div>
                                                    )
                                                }}>
                                                </Accordion>
                                            </div>
                                        )
                                    }
                                    {
                                        ([1, 3].includes(meamaCollectObj.type.typeID)) && 
                                        (
                                            <div>
                                                <hr/>
                                                <Accordion v-slots={{
                                                    accordionHeader: () => (
                                                        <div class="d-flex align-items-center px-3 py-1">
                                                            <h5 class="before-large-text-size">
                                                                კლასიკური ყავა
                                                            </h5>
                                                        </div>
                                                    ),
                                                    additionalInfo: () => (
                                                        <div class="d-flex align-items-start justify-content-between row-gap-2 px-3 py-2">
                                                            <article class="d-flex flex-column column-gap-2">
                                                                <h6 class="after-standard-text-size">
                                                                    გაყიდული
                                                                </h6>
                                                                {
                                                                    (meamaCollectObj.sold.classicalCoffee?.length > 0) ?
                                                                    (
                                                                        <ol class="d-flex flex-column align-items-stretch common-primary-decimal-ol-style">
                                                                            {
                                                                                meamaCollectObj.sold.classicalCoffee.map((classicalCoffee, i) => (
                                                                                    <li key={i}>
                                                                                        <p class="standard-text-size">
                                                                                            {classicalCoffee.classicalCoffeeName} - {classicalCoffee.quantity}
                                                                                        </p>
                                                                                    </li>
                                                                                ))
                                                                            }
                                                                        </ol>
                                                                    ) : 
                                                                    (
                                                                        <ul class="d-flex flex-column align-items-stretch">
                                                                            <li>
                                                                                <p class="standard-text-size">
                                                                                    ინფორმაცია ვერ მოიძებნა
                                                                                </p>
                                                                            </li>
                                                                        </ul>
                                                                    )
                                                                }

                                                            </article>
                                                            <article class="d-flex flex-column column-gap-2">
                                                                <h6 class="after-standard-text-size">
                                                                    მარაგში
                                                                </h6>
                                                                {
                                                                    (meamaCollectObj.stock.classicalCoffee?.length > 0) ?
                                                                    (
                                                                        <ol class="d-flex flex-column align-items-stretch common-primary-decimal-ol-style">
                                                                            {
                                                                                meamaCollectObj.stock.classicalCoffee.map((classicalCoffee, i) => (
                                                                                    <li key={i}>
                                                                                        <p class="standard-text-size">
                                                                                            {classicalCoffee.classicalCoffeeName} - {classicalCoffee.quantity}
                                                                                        </p>
                                                                                    </li>
                                                                                ))
                                                                            }
                                                                        </ol>
                                                                    ) : 
                                                                    (
                                                                        <ul class="d-flex flex-column align-items-stretch">
                                                                            <li>
                                                                                <p class="standard-text-size">
                                                                                    ინფორმაცია ვერ მოიძებნა
                                                                                </p>
                                                                            </li>
                                                                        </ul>
                                                                    )
                                                                }

                                                            </article>
                                                        </div>
                                                    )
                                                }}>
                                                </Accordion>
                                            </div>
                                        )
                                    }
                                    
                                    <hr/>
                                    <Accordion v-slots={{
                                        accordionHeader: () => (
                                            <div class="d-flex align-items-center px-3 py-1">
                                                <h5 class="before-large-text-size">
                                                    საჩივრები
                                                </h5>
                                            </div>
                                        ),
                                        additionalInfo: () => (
                                            <div class="d-flex align-items-start justify-content-between row-gap-2 px-3 py-2">
                                                {
                                                    (meamaCollectObj.complaints?.length > 0) ?
                                                    (
                                                        <ol class="d-flex flex-column align-items-stretch row-gap-2 w-100 common-primary-decimal-ol-style">
                                                            {
                                                                meamaCollectObj.complaints.map((complaint, i) => (
                                                                    <li key={i} class="primary-li-style extra-small-text-size">
                                                                        <article class="d-flex flex-column row-gap-1 align-items-stretch">
                                                                            <div class="d-flex align-items-center justify-content-between">
                                                                                <p>{complaint.claimantName}</p>
                                                                                <p>{complaint.claimantPhone}</p>
                                                                            </div>
                                                                            <p>
                                                                                {complaint.complaintContent}
                                                                            </p>
                                                                        </article>
                                                                        
                                                                    </li>
                                                                ))
                                                            }
                                                        </ol>
                                                    ) : 
                                                    (
                                                        <ul class="d-flex flex-column align-items-stretch">
                                                            <li>
                                                                <p class="standard-text-size">
                                                                    ინფორმაცია ვერ მოიძებნა
                                                                </p>
                                                            </li>
                                                        </ul>
                                                    )
                                                }
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
.primary-li-style{
    width: 100%;
    padding: 0.5em 0.7em;
    background-color: var(--secondary-background-color);
    opacity: 0.8;
    border-radius: 1em;
    backdrop-filter: blur(20px);
}
</style>