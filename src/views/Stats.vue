<template>
  <div class="stats__box">
    <MapViewer :roverPath="responseBody.roverPath" />
    <div class="stats__content">
      <div class="stats__card">
        <h1>Estimates</h1>
        <h2>Super extra estimate</h2>
      </div>
      <div class="stats__card">
        <h1>Height Chart</h1>
        <HeightPlot />
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
    width: 25em;
    padding: 1em 0.5em;
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
      border: 0;
      
    }
  }
}
</style>