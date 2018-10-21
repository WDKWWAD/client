<template>
  <div id="mapNavigator">
    <canvas id="navigatorCanvas" ref="navigatorCanvas" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class MapNavigator extends Vue {
  private canvasSize = {
    width: 750,
    height: 750
  };
  private canvasBoundingRect: any;
  private canvasCtx: any;

  private points: { x: number; y: number }[] = [];
  private isPressed = false;

  private navCanvas: any;

  constructor() {
    super();
  }

  public mounted() {
    this.$nextTick(function() {
      console.log(this.$refs);
      this.navCanvas = this.$refs.navigatorCanvas as HTMLCanvasElement;
      this.navCanvas.width = this.canvasSize.width;
      this.navCanvas.height = this.canvasSize.height;
      this.canvasBoundingRect = this.navCanvas.getBoundingClientRect();
      this.canvasCtx = this.navCanvas.getContext(
        "2d"
      ) as CanvasRenderingContext2D;

      let image = new Image();
      image.src = require("../assets/example_map.png");
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
      };

      console.log("MapNavigator mounted: ", this.$refs);
      this.navCanvas.onmousedown = (mouseEvent: MouseEvent) => {
        this.isPressed = true;
      };

      this.navCanvas.onmouseup = (mouseEvent: MouseEvent) => {
        if (this.isPressed) {
          const mouseX = mouseEvent.clientX;
          const mouseY = mouseEvent.clientY;

          console.log(mouseX, mouseY);

          this.points.push({ x: mouseX, y: mouseY });
          this.drawPoints();
          this.isPressed = false;
        }
      };

      this.navCanvas.onmousemove = (mouseEvent: MouseEvent) => {};
    });
  }

  public drawPoints(): void {
    this.points.forEach((element: { x: number; y: number }) => {
      this.canvasCtx.beginPath();
      this.canvasCtx.arc(element.x, element.y, 10, 0, 2 * Math.PI);
      this.canvasCtx.fillStyle = "#fcee5b";
      this.canvasCtx.fillRect(element.x, element.y, 10, 10);

      const fontSize = 14;
      this.canvasCtx.font = `${fontSize}px Arial`;
      this.canvasCtx.textAlign = "center";
      this.canvasCtx.fillText(
        (this.points.indexOf(element) + 1).toString(),
        element.x + 5,
        element.y - 5
      );
      this.canvasCtx.closePath();
    });
  }
}
</script>

<style scoped lang="scss">
</style>
