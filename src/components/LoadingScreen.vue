<template>
  <div class="loading__box">
    <img class="loading__img" src="../assets/loading-image.svg"/>
    <h1 class="loading__main-text">Calculating...</h1>
    <h2 class="loading__tooltip">{{currentTooltip}}</h2>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({})
export default class LoadingScreen extends Vue {
  private tooltips: string[] = [];
  public currentTooltip: string = '';

  public mounted() : void {
    this.tooltips.push('Rover 707: What a great place!');
    this.tooltips.push('Rover 707: I think I am alone there...');
    this.tooltips.push('Rover 707: Moon again? I wish I was exploring Bennu.');
    this.changeTooltip();
  }

  private changeTooltip() : void {
   // API TEST, TODO: REMOVE THIS LATER
    this.$http.get('http://localhost:5000/api/path').then(response => {

        // get body data
        console.log(response.data);

    }, response => {
        // error callback
    });


    let nextTooltipIndex = this.tooltips.indexOf(this.currentTooltip) + 1;
    if ( nextTooltipIndex == 0) {
      this.currentTooltip = this.tooltips[0];
    } else {
      this.currentTooltip = this.tooltips[nextTooltipIndex < this.tooltips.length ? nextTooltipIndex : 0];
    }
    setTimeout(this.changeTooltip, 5000);
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