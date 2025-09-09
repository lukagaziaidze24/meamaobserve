<template>
    <div class="left-grow-block-wrapper d-flex align-items-stretch">
        <div class="grow-part-wrapper white-text">
            <div class="grow-part-content-wrapper">
                <slot name="growingPart">
                    
                </slot>
            </div>
        </div>
        <div class="base-part-wrapper" :style="[{'--background-color': basePartBackgroundColor}]">
            <slot name="basePart">
            </slot>
        </div>
    </div>
</template>
<script>

export default{
    props: {
        basePartBackgroundColor: {
            type: String,
            default: "#161616",            
        }
    }
}
</script>
<style lang="scss">
.left-grow-block-wrapper{
    cursor: pointer;
    position: relative;
    // justify-content: flex-end;
    isolation: isolate;
    height: 100%;
    // width: 100%;
    .grow-part-wrapper{
        position: absolute;
        left: 0;
        transition: all 0.4s ease-out;
        z-index: -1;
        height: 100%;
        width: max-content;

        display: grid;
        grid-template-columns: 0fr;
        .grow-part-content-wrapper{
            grid-column: 1 / 2;
            overflow: hidden;
            white-space: nowrap;
        }
        transform: translateX(calc(-100% - 15px));
    }
    .base-part-wrapper{
        width: 100%;
        background-color: var(--background-color);
    }
    @media (hover: hover){
        &:hover .grow-part-wrapper{
            grid-template-columns: 1fr;
        }
    }
}
</style>