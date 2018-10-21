<template>
  <div class="navigator__box" id="mapNavigator">
    <canvas class="card-2" id="navigatorCanvas" ref="navigatorCanvas" />
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
      this.canvasCtx.arc(element.x - 5, element.y - 5, 10, 0, 2 * Math.PI);
      this.canvasCtx.fillStyle = "#fcee5b";
      this.canvasCtx.fillRect(element.x - 5, element.y - 5, 10, 10);

      const fontSize = 14;
      this.canvasCtx.font = `${fontSize}px Comfortaa`;
      this.canvasCtx.textAlign = "center";
      this.canvasCtx.fillText(
        (this.points.indexOf(element) + 1).toString(),
        element.x,
        element.y - 10
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
        const pointToAdd = new Point(mouseEvent.offsetX, mouseEvent.offsetY);
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
canvas {
  border-radius: 5px;
}
</style>
