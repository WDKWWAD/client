<template>
  <div class="loading__box">
    <img class="loading__img" src="../assets/loading-image.svg"/>
    <h1 class="loading__main-text">Calculating...</h1>
    <h2 class="loading__tooltip">{{currentTooltip}}</h2>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

export class Point {
    x: number;
    y: number;
    z: number;

    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}


@Component({})
export default class LoadingScreen extends Vue {
  private tooltips: string[] = [];
  public currentTooltip: string = '';
  public total_distance : number = 0;
  public hypsometric_profile : number[] = [];
  public path : Point[] = [];

  public mounted() : void {
    this.tooltips.push('Rover 707: What a great place!');
    this.tooltips.push('Rover 707: I think I am alone there...');
    this.tooltips.push('Rover 707: Moon again? I wish I was exploring Bennu.');
    this.changeTooltip();
  }

  private simulateMission() : void {
    let data = { "points": [ { "x": 500,  "y": 500 }, { "x": 1800,  "y": 2000 }]};

    this.$http.post('http://localhost:5000/api/path', data).then((response : any) => {
    this.total_distance = response.body['total_distance'];
    this.hypsometric_profile = response.body['hypsometric_profile'];
    this.path = response.body['path'];


    console.log(this.total_distance );
    console.log(this.hypsometric_profile[0]);
    console.log(this.path[0].x, this.path[0].y, this.path[0].z);

    }, response => {
        // error callback
    });
  }

  private changeTooltip() : void {
    this.simulateMission();
    let nextTooltipIndex = this.tooltips.indexOf(this.currentTooltip) + 1;
    if ( nextTooltipIndex == 0) {
      this.currentTooltip = this.tooltips[0];
    } else {
      this.currentTooltip = this.tooltips[nextTooltipIndex < this.tooltips.length ? nextTooltipIndex : 0];
    }
    setTimeout(this.changeTooltip, 20000);
  }
}
</script>

<style scoped lang="scss">
@import '../styles/mixins';

.loading {
  &__box {
    @include size(100vw, 100vh);
    position: absolute;
    top: 0;
    background-color: $color-primary;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    z-index: 10;
  }

  &__main-text {
    color: $color-on-dark;
  }

  &__tooltip {
    font-family: 'Courier New', Courier, monospace;
    font-weight: 300;
    color: $color-on-dark;
    opacity: 0.8;
  }

  &__img {
    @include size(30%, auto);
  }
}
</style>