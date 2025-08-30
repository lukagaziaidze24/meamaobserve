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
    column-gap: 0.4em;
    padding: 0.3em 0.4em;
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
    &:hover > .hover-background{
        width: 100%;
    }
    .logo, p{
        mix-blend-mode: difference;
    }
    p{
        border-left: 5px solid var(--secondary-background-color);
        padding-left: 0.4em;
        letter-spacing: 1px;
    }
}
</style>