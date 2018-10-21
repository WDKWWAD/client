<template>
  <div id="mapNavigator">
    <canvas id="navigatorCanvas" ref="navigatorCanvas" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import Point from '@/model/Point.model';

@Component
export default class MapNavigator extends Vue {
  @Prop() private points!: Point[];

  private canvasSize = {
    width: 750,
    height: 750
  };
  private canvasBoundingRect: any;
  private canvasCtx: any;
  private isPressed = false;
  private navCanvas: any;

  public mounted() {
    this.$nextTick(function() {
      console.log(this.points);
      this.navCanvas = this.$refs.navigatorCanvas as HTMLCanvasElement;
      this.navCanvas.width = this.canvasSize.width;
      this.navCanvas.height = this.canvasSize.height;
      this.canvasBoundingRect = this.navCanvas.getBoundingClientRect();
      this.canvasCtx = this.navCanvas.getContext('2d') as CanvasRenderingContext2D;

      let image = new Image();
      image.src = require("../assets/map.png");
      image.width = this.canvasSize.width;
      image.height = this.canvasSize.height;
      image.onload = () => {
        this.canvasCtx.drawImage(
          image,
          0,
          0,
          this.canvasSize.width,
          this.canvasSize.height
        );
        this.drawPoints();
      };
      this.addMouseListeners();
      console.log("MapNavigator mounted: ", this.$refs);
      
    });
  }

  public drawPoints(): void {
    this.points.forEach((element: Point) => {
      this.canvasCtx.beginPath();
      this.canvasCtx.arc(element.x * 750 / 2048, element.y * 750 / 2048, 10, 0, 2 * Math.PI);
      this.canvasCtx.fillStyle = "#fcee5b";
      this.canvasCtx.fillRect(element.x * 750 / 2048, element.y * 750 / 2048, 10, 10);

      const fontSize = 14;
      this.canvasCtx.font = `${fontSize}px Comfortaa`;
      this.canvasCtx.textAlign = "center";
      this.canvasCtx.fillText(
        (this.points.indexOf(element) + 1).toString(),
        element.x / 2048 * 750 + 5,
        element.y / 2048 * 750 - 5
      );
      this.canvasCtx.closePath();
    });
  }

  private addMouseListeners(): void {
    this.navCanvas.onmousedown = (mouseEvent: MouseEvent) => {
      this.isPressed = true;
    };

    this.navCanvas.onmouseup = (mouseEvent: MouseEvent) => {
      if (this.isPressed) {
        const pointToAdd = new Point(mouseEvent.offsetX * 2048 / 750, mouseEvent.offsetY * 2048 / 750);
        console.log(pointToAdd);

        this.$emit('addPoint', pointToAdd);
        this.drawPoints();
        this.isPressed = false;
      }
    };
  }
}
</script>

<style scoped lang="scss">
</style>
