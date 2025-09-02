<template>
<div class="map-marker-wrapper">
    <!-- <div class="map-marker-icon">
        <img width="32px" height="32px" :src="markerIconAddress" alt="meama collect">
    </div> -->
    <img class="map-marker-icon" width="32px" height="32px" :src="markerIconAddress" alt="meama collect">


    <div class="map-marker-content-wrapper common-scrollbar pe-3">
        <slot name="markerDetailedInfo"/>
        
        <!-- <article class="d-flex align-items-start justify-content-between">
            <div class="d-flex flex-column align-items-start">
                <h5 class="large-text-size">
                    Meama Collect askjdh asdkj
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
        </article> -->
    </div>
</div>
</template>
<script>
export default{
    props: {
        markerIconAddress: String,
    },
}
</script>
<style lang="scss">
.map-marker-wrapper{
    max-height: 400px;
    margin: 0 auto;
    isolation: isolate;
    cursor: pointer;
    width: fit-content;
    max-width: 600px;
    border-radius: 45%;
    background-color: var(--third-background-color);
    padding: 0.8em;
    position: relative;
    display: grid;
    grid-template-columns: 0fr;
    grid-template-rows: 0fr;
    transform-origin: center;

    transition: all 0.3s ease-out;
    &:hover{
        grid-template-columns: 1fr;
        grid-template-rows: 1fr;
        padding: 1em;
        border-radius: 25px;
        cursor:auto;
        .map-marker-content-wrapper{
            overflow-y: auto;
        }
        .map-marker-icon{
            margin-right: 1.5em;
        }
    }
    .map-marker-icon{
        position: sticky; // sticky towards .map-marker-wrapper
        bottom: 100%;
        left: 100%;
        z-index: 1;
    }
    .map-marker-content-wrapper{
        display: flex;
        flex-direction: column;
        align-items: stretch;
        justify-content: center;
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