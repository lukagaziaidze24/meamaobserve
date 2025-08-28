<template>
    <div class="observer-page-wrapper">
        <main class="map-wrapper">

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
<script>
import LeftGrowingAccordion from '@/components/LeftGrowingAccordion.vue';
import mapNavigations from '@/assets/jsons/mapNavigations.json'
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
        }
    },
    components: {
        LeftGrowingAccordion,
    },
    mounted() {
        this.routeMountMovenment(this.$route);
    },
    beforeRouteUpdate(to, from, next){
        let isQueryValid = this.getInfoFromRoute(to);
        if(isQueryValid){
            this.mountMapNavigationFilters(); // first before second
            this.getMapNavigationData(); // second after first
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
            console.table(this.mapNavigationData);
            
        },
        mapNavigationClickHandler(mapNavigationObj){
            mapNavigationObj.isChoosen = !mapNavigationObj.isChoosen;

            let choosenNavigationBtnTempArray = [];
            let otherFilters = {};
            this.mapNavigationData.forEach((mapNavObj) => {
                if(mapNavObj.isChoosen){
                    choosenNavigationBtnTempArray.push(mapNavObj.mapNavigationID);
                }
            });



            this.$router.push({
                path: this.$route.path,
                query: {
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
</style>