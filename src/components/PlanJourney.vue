<template>
  <div class="popup__box">
    <div class="popup__background"></div>
    <div class="popup__content">
      <button class="popup__close"></button>
      <h1 class="popup__title">Plan your<br>rover journey</h1>
      <img class="popup__img" src="../assets/planning-icon.svg" />
      <h4 class="popup__tooltip">To plan your rover road try clicking on the Moon 2D map. You can add multiple points on the map.</h4>
      <button class="popup__action" :class="{'active': canStart == 'true'}">Start mission</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class PlanJourney extends Vue {
  @Prop() private canStart!: boolean;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import '../styles/popup';
</style>
