<template>
  <div :class="{collapsed: isCollapsed}" class="popup__box">
    <div class="popup__background"></div>
    <div class="popup__expand"></div>
    <div :class="{'active': canStart == 'true'}" class="popup__action--collapsed">
      <button class="start-icon"></button>
    </div>
    <div class="popup__content">
      <button
        @click="togglePanel"
        class="popup__close">
      </button>
      <h1 class="popup__title">Plan your<br>rover journey</h1>
      <img class="popup__img" src="../assets/planning-icon.svg" />
      <h4 class="popup__tooltip">To plan your rover road try clicking on the Moon 2D map. You can add multiple points on the map.</h4>
      <button
        :class="{'active': canStart == 'true'}"
        class="popup__action">
        Start mission
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class PlanJourney extends Vue {
  @Prop() public canStart!: boolean;
  public isCollapsed: boolean = false;

  public togglePanel() : void {
    this.isCollapsed = !this.isCollapsed;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import '../styles/popup';
</style>
