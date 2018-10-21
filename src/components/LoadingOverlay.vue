<template>
  <div class="loading__box">
    <h1 class="loading__main-text">Rendering...</h1>
    <img class="loading__img" src="../assets/moon-icon.svg"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({})
export default class LoadingOverlay extends Vue {}
</script>

<style scoped lang="scss">
@import '../styles/mixins';

.loading {
  &__box {
    @include size(100vw, 100vh);
    position: absolute;
    top: 0;
    background-color: rgba(#000, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    z-index: 100;
  }

  &__main-text {
    @include font-bold;
    color: $color-on-dark;
  }

  @keyframes rotate {
    from {
      transform: rotate3d(0);
    }
    to {
      transform: rotate3d(1, 1, 1, 360deg);
    }
  }

  &__img {
    @include size(20em, auto);
    margin-left: 2em;
    animation: rotate infinite;
  }
}
</style>