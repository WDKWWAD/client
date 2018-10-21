<template>
    <div>
      <p>Map Viewer</p>
    </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import {
  WebGLRenderer,
  PerspectiveCamera,
  Scene,
  WebGLRendererParameters,
  AxesHelper,
  PlaneBufferGeometry,
  Matrix4,
  MeshNormalMaterial,
  Mesh, MeshDepthMaterial, MeshLambertMaterial, AmbientLight, SpotLight,
} from "three";

import { OrbitControls } from "@avatsaev/three-orbitcontrols-ts";

@Component
export default class MapViewer extends Vue {
  path: string = "../assets/example_map.png";

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

  tileXCount = 1; //this.heightmapWidth / this.widthDestination;
  tileYCount = 1; //this.heightmapWidth / this.widthDestination;

  tileXStart = 0;
  tileXFinish = this.tileXStart + this.tileXCount;
  tileX = this.tileXStart;

  tileYStart = 0;
  tileYFinish = this.tileYStart + this.tileYCount;
  tileY = this.tileYStart;

  css: any;
  renderer: any;
  scene: any;
  camera: any;
  controls: any;
  geometry: any;

  mounted() {
    this.$nextTick(function() {
      this.init();
      this.animate();
    });
  }

  private init(): void {
    var css = document.body.appendChild(document.createElement("style"));
    css.innerHTML =
      "body { font: 12pt monospace; margin: 0; overflow: hidden; }" +
      "h2 { margin: 0; }" +
      "#bars, #i { font-size: 24pt; text-decoration: none; }" +
      "#bars { color: pink; } " +
      "input[type=range] { -webkit-appearance: none; -moz-appearance: none; background-color: silver; height: 20px; width: 180px; } " +
      "input[type=range]::-moz-range-thumb { -moz-appearance: none; background-color: #888; width: 10px; } " +
      "input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; background-color: #888; opacity: 0.5; height: 28px; width: 10px; } " +
      "";

    let rendererParams: WebGLRendererParameters = {
      alpha: true,
      antialias: true,
      clearColor: 0xffffff
    };

    this.renderer = new WebGLRenderer(rendererParams);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

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
    spotLight.position.set(0, 1000, 0);
    spotLight.angle = Math.PI / 2;
    spotLight.intensity = 0.7;
    spotLight.castShadow = true;
    this.scene.add(spotLight);

    window.addEventListener("resize", this.onWindowResize, false);

    // assets
    var axisHelper = new AxesHelper(50);
    this.scene.add(axisHelper);

    this.heightmapCanvas = document.createElement("canvas");
    //		document.body.appendChild( heightmapCanvas );
    //		heightmapCanvas.style.cssText = 'border: 5px red solid; position: absolute; top: 0; z-index: -50;';
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

    this.material3D = new MeshLambertMaterial({ side: 2, color: 0x555555 });
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

    this.tile.src = require("../assets/example_map.png");
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

    this.heightMesh.geometry.dispose();
    this.scene.remove(this.heightMesh);
    this.heightMesh = new Mesh(this.geometry3D, this.material3D);

    this.heightMesh.geometry.computeFaceNormals();
    this.heightMesh.geometry.computeVertexNormals();

    this.scene.add(this.heightMesh);
  }

  private onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  private animate(): void {
    this.controls.autoRotate = false;

    requestAnimationFrame(this.animate);
    this.renderer.render(this.scene, this.camera);
  }
}
</script>