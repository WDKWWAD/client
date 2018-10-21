<template>
  <div id="heightPlot"></div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import * as Plotly from 'plotly.js';


@Component
export default class HeightPlot extends Vue {
  x: Array<number> = [];
  y: Array<number> = [];

  width: number = 400;
  height: number = 200;

  public mounted(): void {
    this.init();
    this.draw();
  }

  private init(): void {
    this.x = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
    this.y = [10, 15, 13, 17, 10, 15, 13, 17, 10, 15, 13, 17, 10, 15, 13, 17];
  }

  public draw(): void {
    var heightPoints = {
      x: this.x,
      y: this.y,
      type: 'scatter'
    };

    var data = [heightPoints];

    // More about styling:
    // https://plot.ly/javascript/setting-graph-size/#adjusting-height-width-and-margins
    var layout = {
      width: this.width,
      height: this.height,
      margin: {
        l: 30,
        r: 0,
        b: 40,
        t: 20,
        pad: 2
      },
      font: {
        family: 'Comfortaa',
        size: 14,
        color: '#fff'
      },
      showlegend: false
    };
    Plotly.newPlot('heightPlot', data, layout, {displayModeBar: false, staticPlot: true});
  }
};
</script>

<style lang="scss">
@import '../styles/mixins';

.main-svg {
  background: transparent !important;
}
</style>
