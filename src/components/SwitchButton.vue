<template>
  <div class="switch__box">
    <router-link :to="{ name: this.$route.name === '2d' ? '3d' : '2d'}" class="switch__button card-3">Switch to {{this.nextView()}} preview</router-link>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit } from 'vue-property-decorator';

@Component
export default class SwitchButton extends Vue {
  public nextView() : string {
    return this.$route.name === '2d' ? '3d' : '2d';
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import '../styles/mixins';
.switch {
  &__box {
    position: absolute;
    right: 0;
    bottom: 2em;
    left: 0;
    text-align: center;
  }

  &__button {
    @include font-bold;
    padding: 0.5em 1em;
    background-color: $color-secondary;
    color: $color-on-light;
    border: 0;
    border-radius: 10px;
    text-decoration: none;
    text-transform: uppercase;
    cursor: pointer;
  }
}
</style>
