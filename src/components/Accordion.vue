<template>
<div :class="['accordion-wrapper', {'open': isAccordionOpen }, 'd-flex', 'flex-column', 'align-items-stretch', 'w-100']" :style="[{'--border-radius': borderRadius}]">
    <div class="accordion-head-wrapper w-100 d-flex align-items-center justify-content-between" @click="accordionToggleHandler()" :style="[{'--header-background-color': headerBackgroundColor}, {'--header-min-height':HeaderMinHeight}]">
        <slot name="accordionHeader">

        </slot>
        <div class="accordion-arrow-wrapper px-3"> 
            <img width="24px" height="24px" src="@\assets\images\accordion\arrow.png" alt="arrow" >
        </div>
    </div>
    <div class="accordion-additional-info-grid-wrapper w-100">
        <div class="accordion-additional-info-content-wrapper w-100" :style="[{'--additional-info-background-color': additionalInfoWrapperBackgroundColor}]">
            <slot name="additionalInfo">

            </slot>
        </div>
    </div>
</div>
</template>
<script>

export default {
    data(){
        return {
            isAccordionOpen: false,
        }
    },
    props: {
        headerBackgroundColor: {
            type: String,
            default: "#cf8934"
        },
        additionalInfoWrapperBackgroundColor: {
            type: String,
            default: "#d6a86f"
        },
        borderRadius: {
            type: String,
            default: "20px"
        },
        HeaderMinHeight: {
            type: String,
            default: "30px"
        },
    },
    methods: {
        accordionToggleHandler(){
            this.isAccordionOpen = !this.isAccordionOpen;
        }
    }
}


</script>
<style lang="scss"> 
.accordion-wrapper{
    &.open{
        .accordion-head-wrapper{
            border-radius: var(--border-radius) var(--border-radius) 0 0;
            .accordion-arrow-wrapper{
                transform: rotate(180deg);
            }
        }
        .accordion-additional-info-grid-wrapper{
            grid-template-rows: 1fr;
            grid-template-columns: 1fr;
        }
    }
    .accordion-head-wrapper{
        background-color: var(--header-background-color);
        min-height: var(--header-min-height);
        border-radius: var(--border-radius);
        transition: all 0.3s ease-out;
        cursor: pointer;
        .accordion-arrow-wrapper{
            transition: all 0.3s ease-out;
        }
    }
    .accordion-additional-info-grid-wrapper{
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: 0fr;
        transition: all 0.3s ease-out;
        .accordion-additional-info-content-wrapper{
            overflow: hidden;
            white-space: nowrap;
            grid-column: 1 / 2;
            grid-row: 1 / 2;
            background-color: var(--additional-info-background-color);
            border-radius: 0 0 var(--border-radius) var(--border-radius);

        }
    }
}
</style>