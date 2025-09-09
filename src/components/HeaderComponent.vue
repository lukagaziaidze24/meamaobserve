<template>
    <h1 class="logo-wrapper br-25">
        <div class="hover-background br-25">

        </div>
        <img class="logo" src="@/assets/images/logo.svg" alt="MEAMA">
        <p class="extra-large-text-size white-text">OBSERVE</p>
    </h1>
</template>
<style lang="scss">
.logo-wrapper{
    z-index: 50;
    isolation: isolate;
    position: absolute;
    top: 0.2em;
    left: 0.2em;
    display: flex;
    column-gap: 0.3em;
    padding: 0.3em 0.4em;
    @include mediaPattern1(lg){
        padding: 0.2em 0.3em;
    }

    cursor: pointer;
    background-color: var(--secondary-background-color);
    .hover-background{
        top: 0;
        left: 0;
        position: absolute;
        height: 100%;
        width: 0%;
        background-color: var(--primary-background-color);
        z-index: -1;
        transition: all 0.3s ease-out;
    }
    @media (hover: hover){
        &:hover > .hover-background{
            width: 100%;
        }
    }
    .logo, p{
        mix-blend-mode: difference;
    }
    .logo{
        @include mediaPattern1(xxl){
            height: 28px;
        }
        @include mediaPattern1(lg){
            height: 26px;
        }
    }
    p{
        border-left: 5px solid var(--secondary-background-color);
        padding-left: 0.4em;
        letter-spacing: 1px;
    }
}
</style>