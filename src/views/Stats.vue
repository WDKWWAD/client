<template>
  <div class="stats__box">
    <MapViewer :points="responseBody.points" :roverPath="responseBody.path" />
    <div class="stats__content">
      <div class="stats__card">
        <h1>Estimates</h1>
        <h2>Total Distance: {{ (responseBody.totalDistance / 1000).toFixed(2) + ' km' || 'Loading...' }}</h2>
      </div>
      <div class="stats__card">
        <h1>Hypsometric Profile</h1>
        <HeightPlot :hypsometricProfile="responseBody.hypsometricProfile" />
      </div>
    </div>
    <div class="stats__action">
      <button class="stats__action-button">Start another mission</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import MapViewer from '@/components/MapViewer.vue';
import HeightPlot from '@/components/HeightPlot.vue';

@Component({
  components: {
    MapViewer,
    HeightPlot
  },
})
export default class Stats extends Vue {
  public responseBody!: Object;

  public created(): void {
    this.responseBody = this.$route.params;
  }
}
</script>

<style scoped lang="scss">
@import '../styles/mixins';

.stats {
  &__box {
    @include size(100vw, 100vh);
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    background: url('../assets/landing-blurred.jpg') center / cover no-repeat;
    overflow: hidden;
  }

  &__content {
    position: absolute;
    top: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  &__card {
    background-color: rgba(#000, 0.8);
    border-radius: 10px;
    color: $color-on-dark;
    width: 27em;
    padding: 1em 2em;
    margin: 1em;
    h1 {
      font-size: 1.2em;
    }

    h2 {
      font-size: 0.8em;
    }
  }

  &__action {
    position: absolute;
    right: 0;
    bottom: 1em;
    left: 0;
    text-align: center;

    &-button {
      @include font-bold;
      padding: 1em 2em;
      background-color: $color-secondary;
      border: 0;
      border-radius: 10px;
      outline: 0;
      cursor: pointer;
    }
  }
}
</style>