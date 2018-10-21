<template>
  <div id="mapViewer" class="map-view__box"></div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import {
  WebGLRenderer,
  PerspectiveCamera,
  Scene,
  WebGLRendererParameters,
  AxesHelper,
  PlaneBufferGeometry,
  Matrix4,
  Mesh,
  MeshLambertMaterial,
  AmbientLight,
  SpotLight,
  LineBasicMaterial,
  Geometry,
  Vector3,
  Line,
  SphereGeometry,
  MeshBasicMaterial
} from "three";

import { OrbitControls } from "@avatsaev/three-orbitcontrols-ts";
import Point from "@/model/Point.model";

@Component
export default class MapViewer extends Vue {
  @Prop() public points!: Point[];
  @Prop() private roverPath?: Point[];
  @Prop() private totalDistance?: number;

  PATH_SPACE = 5;
  path: string = "../assets/map.png";

  heightmapCanvas: any;
  heightmapContext: any;
  tile: any;
  vertices: any;

  geometry3D: any;
  material3D: any;

  heightMesh: any;

  heightmapWidth = 2048;
  heightmapHeight = 2048;

  widthDestination = this.heightmapWidth;
  heightDestination = this.heightmapHeight;

  scale = 0.07;
  scaleAdjust = 0.065;
  scl = this.scale * this.scaleAdjust;

  color: string = "#d3d3d3";

  tileXCount = 1;
  tileYCount = 1;

  tileXStart = 0;
  tileXFinish = this.tileXStart + this.tileXCount;
  tileX = this.tileXStart;

  tileYStart = 0;
  tileYFinish = this.tileYStart + this.tileYCount;
  tileY = this.tileYStart;

  animationFrameHandle: number = -1;

  css: any;
  renderer: any;
  scene: any;
  camera: any;
  controls: any;
  geometry: any;

  public mounted() {
    this.$nextTick(function() {
      this.init();
      this.animate();
    });
  }

  public beforeDestroy() {
    window.console.log("Before destroy");
    this.cleanup();
  }

  private init(): void {
    let rendererParams: WebGLRendererParameters = {
      alpha: true,
      antialias: true,
      clearColor: 0xffffff
    };

    this.renderer = new WebGLRenderer(rendererParams);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    const divRenderer: any = document.getElementById("mapViewer");
    divRenderer.appendChild(this.renderer.domElement);

    this.camera = new PerspectiveCamera(
      40,
      window.innerWidth / window.innerHeight,
      1,
      15000
    );
    this.camera.position.set(200, 900, 1200);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.maxDistance = 8000;
    this.controls.enableKeys = false;
    this.controls.enableZoom = true;

    this.scene = new Scene();

    var ambientLight = new AmbientLight(0xffffff);
    this.scene.add(ambientLight);

    var spotLight = new SpotLight(0xaaaaaa);
    spotLight.position.set(0, 700, 0);
    spotLight.angle = Math.PI / 2;
    spotLight.intensity = 0.6;
    spotLight.castShadow = true;
    this.scene.add(spotLight);

    var axisHelper = new AxesHelper(50);
    this.scene.add(axisHelper);

    this.heightmapCanvas = document.createElement("canvas");
    this.heightmapCanvas.width = this.heightmapWidth;
    this.heightmapCanvas.height = this.heightmapHeight;
    this.heightmapContext = this.heightmapCanvas.getContext("2d");

    this.geometry3D = new PlaneBufferGeometry(
      this.heightmapWidth,
      this.heightmapHeight,
      this.heightmapWidth - 1,
      this.heightmapHeight - 1
    );
    this.geometry3D.applyMatrix(new Matrix4().makeRotationX(-0.5 * Math.PI));
    this.vertices = this.geometry3D.attributes.position.array;

    this.material3D = new MeshLambertMaterial({ side: 2, color: 0x777777 });
    this.heightMesh = new Mesh(this.geometry3D.clone(), this.material3D);

    this.tile = document.createElement("img");
    this.tile.crossOrigin = "Anonymous";

    this.processTiles();
  }

  private processTiles() {
    if (this.tileY <= this.tileYFinish && this.tileX < this.tileXFinish) {
      this.addImage(this.tileX, this.tileY++);
    } else if (this.tileX < this.tileXFinish) {
      this.tileX++;
      this.tileY = this.tileYStart;
      this.processTiles();
    } else {
      this.updateTerrain();
    }
  }

  private addImage(x: number, y: number): void {
    this.tile.onload = () => {
      this.heightmapContext.drawImage(
        this.tile,
        0,
        0,
        this.widthDestination,
        this.heightDestination,
        0,
        0,
        this.widthDestination,
        this.heightDestination
      );
      this.processTiles();
    };

    this.tile.src = require("../assets/map.png");
  }

  private updateTerrain(): void {
    let map = this.heightmapContext.getImageData(
      0,
      0,
      this.heightmapWidth,
      this.heightmapHeight
    ).data;

    for (let i = 1, j = 0; i < this.vertices.length; i += 3, j += 4) {
      this.vertices[i] = this.scl * (map[j] + 255 * map[j + 1]) - 150;
    }

    this.drawMesh();
    this.drawPath();
    this.drawPoints();
  }

  private drawMesh(): void {
    this.heightMesh.geometry.dispose();
    this.scene.remove(this.heightMesh);
    this.heightMesh = new Mesh(this.geometry3D, this.material3D);

    this.heightMesh.geometry.computeFaceNormals();
    this.heightMesh.geometry.computeVertexNormals();

    this.scene.add(this.heightMesh);
  }

  private drawPath(): void {
    const material = new LineBasicMaterial({ color: 0x0000ff });
    const geometry = new Geometry();
    if (this.roverPath) {
      this.roverPath.forEach((point: any) => {
        geometry.vertices.push(
          new Vector3(
            this.vertices[(point.y * 2048 + point.x) * 3],
            this.vertices[(point.y * 2048 + point.x) * 3 + 1] + this.PATH_SPACE,
            this.vertices[(point.y * 2048 + point.x) * 3 + 2]
          )
        );
      });
    }

    const line = new Line(geometry, material);
    this.scene.add(line);
  }

  private drawPoints(): void {
    console.log('this.points:', this.points);
    if (this.points) {
      this.points.forEach((point: Point) => {
        console.log('point:', point);
        const geometry = new SphereGeometry(50, 32, 32);
        const material = new MeshBasicMaterial({ color: 0x0000ff });
        const sphere = new Mesh(geometry, material);
        sphere.position.set(
          this.vertices[(point.y * 2048 + point.x) * 3],
          this.vertices[(point.y * 2048 + point.x) * 3 + 1] + this.PATH_SPACE,
          this.vertices[(point.y * 2048 + point.x) * 3 + 2]
        );
        this.scene.add(sphere);
      });
    }
  }

  private animate(): void {
    this.animationFrameHandle = requestAnimationFrame(this.animate);
    this.renderer.render(this.scene, this.camera);
  }

  private cleanup(): void {
    this.renderer.dispose();
    this.geometry3D.dispose();
    this.material3D.dispose();
    delete this.renderer;
    delete this.scene;
    delete this.camera;
    delete this.controls;
    delete this.geometry;
    delete this.geometry3D;
    delete this.material3D;

    if (this.animationFrameHandle > 0) {
      cancelAnimationFrame(this.animationFrameHandle);
    }
  }
}
</script>

<style scoped lang="scss">
@import "../styles/mixins";

.map-view {
  &__box {
    @include size(100vw, 100vh);
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
}
</style>
