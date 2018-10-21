<template>
  <div id="heightPlot"></div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';
import * as Plotly from 'plotly.js';


@Component
export default class HeightPlot extends Vue {
  @Prop() hypsometricProfile ?: Array<number>;

  x: Array<number> = [];
  y: Array<number> = [];

  width: number = 400;
  height: number = 100;

  public mounted(): void {
    this.init();
    this.draw();
  }

  private init(): void {
    window.console.log(this.hypsometricProfile);
    if (this.hypsometricProfile) {
      this.x = Array.from(this.hypsometricProfile.keys());
      this.y = this.hypsometricProfile;
    }
  }

  public draw(): void {
    var heightPoints = {
      x: this.x,
      y: this.y,
      type: 'scatter',
    };

    var data = [heightPoints];

    // More about styling:
    // https://plot.ly/javascript/setting-graph-size/#adjusting-height-width-and-margins
    var layout = {
      xaxis: {
        title: 'Time [s]',
      titlefont: {
        family: 'Comfortaa',
        size: 10,
        color: '#fff', //TODO: Margin problem
      }},
      yaxis: {
        title: 'Elevation [m]',
      titlefont: {
        family: 'Comfortaa',
        size: 10,
        color: '#fff'
      }},
      width: this.width,
      height: this.height,
      margin: {
        l: 65,
        r: 0,
        b: 30,
        t: 0,
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
