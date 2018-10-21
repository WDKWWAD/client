<template>
    <div>
      <p>Map Viewer</p>
    </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import {
  WebGLRenderer,
  PerspectiveCamera,
  Scene,
  WebGLRendererParameters,
  AxesHelper,
  PlaneBufferGeometry,
  Matrix4,
  MeshNormalMaterial,
  Mesh,
  Object3D,
  SpriteMaterial,
  Sprite,
  NearestFilter,
  LineBasicMaterial,
  Geometry,
  Line,
  Texture,
  Vector3,
  Color
} from "three";

import { OrbitControls } from "@avatsaev/three-orbitcontrols-ts";

@Component
export default class MapViewer extends Vue {
  path: string = "../assets/example_map.png";
  gazetteerFile = this.path + "moon/gazetteer/moon-iau-nomenclature.csv";
  gazetteer: any;

  heightmapCanvas: any;
  heightmapContext: any;
  tile: any;
  vertices: any;

  geometry3D: any;
  material3D: any;

  selPlace: any;

  heightMesh: any;

  heightmapWidth = 2048;
  heightmapHeight = 2048;

  widthDestination = this.heightmapWidth;
  heightDestination = this.heightmapHeight;

  scale = 0.1;
  scaleAdjust = 0.065;
  scl = this.scale * this.scaleAdjust;

  placards: any;
  placardYPosition = 0;

  color: string = "#d3d3d3";

  // Copernicus,Archetypal large complex crater,9.7N,20.1W
  selectedPlace = 1753; // Copernicus

  tileXCount = 1; //this.heightmapWidth / this.widthDestination;
  tileYCount = 1; //this.heightmapWidth / this.widthDestination;

  tileXStart = 0;
  tileXFinish = this.tileXStart + this.tileXCount;
  tileX = this.tileXStart;

  tileYStart = 0;
  tileYFinish = this.tileYStart + this.tileYCount;
  tileY = this.tileYStart;

  startTime = performance.now();
  delayTime = 2000;
  autoRotateSpeed = 0.2;

  css: any;
  menu: any;
  stats: any;
  renderer: any;
  scene: any;
  camera: any;
  controls: any;
  geometry: any;
  material: any;
  mesh: any;
  hamburger: any;
  chkGradient: any;

  // checkbox on UI
  chkRotate: any;

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

    this.material3D = new MeshNormalMaterial({ side: 2 });
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
      this.vertices[i] = this.scl * (map[j] + 255 * map[j + 1]) - 300;
    }

    this.heightMesh.geometry.dispose();
    this.scene.remove(this.heightMesh);
    this.heightMesh = new Mesh(this.geometry3D, this.material3D);

    this.heightMesh.geometry.computeFaceNormals();
    this.heightMesh.geometry.computeVertexNormals();

    this.scene.add(this.heightMesh);
  }

  // draw placards
  private drawSprite(
    text: string,
    scale: number,
    color: any,
    x: number,
    y: number,
    z: number
  ) {
    var texture = this.canvasMultilineText(text, { backgroundColor: color });
    if (texture) {
      texture.minFilter = texture.magFilter = NearestFilter;
    } else {
      return;
    }

    var spriteMaterial = new SpriteMaterial({
      map: texture,
      opacity: 0.9,
      transparent: true
    });
    var sprite = new Sprite(spriteMaterial);
    sprite.position.set(x, y, z);
    sprite.scale.set(
      scale * texture.image.width,
      scale * texture.image.height,
      1
    );
    this.placards.add(sprite);

    var geometry = new Geometry();
    geometry.vertices = [this.v(x, 0, z), this.v(x, y, z)];
    var material = new LineBasicMaterial({ color: 0xaaaaaa });
    var line = new Line(geometry, material);
    this.placards.add(line);
  }

  private canvasMultilineText(
    textArray: string | string[],
    parameters: any
  ): Texture | undefined {
    parameters = parameters || {};
    let width = 0;
    let canvas = document.createElement("canvas");
    let context = canvas.getContext("2d");

    if (typeof textArray === "string") textArray = [textArray];

    if (context != null) {
      context.font = parameters.font ? parameters.font : "48px sans-serif";

      for (let i = 0, len = textArray.length; i < len; i++) {
        width =
          context.measureText(textArray[i]).width > width
            ? context.measureText(textArray[i]).width
            : width;
      }

      canvas.width = width + 20; // 480
      canvas.height = textArray.length * 60;

      var col = parameters.backgroundColor ? parameters.backgroundColor : 120;

      context.fillStyle = "hsl( " + col + ", 80%, 50% )";
      context.fillRect(0, 0, canvas.width, canvas.height);

      context.lineWidth = 1;
      context.strokeStyle = "#000";
      context.strokeRect(0, 0, canvas.width, canvas.height);

      context.fillStyle = "#000";
      context.font = parameters.font ? parameters.font : "48px sans-serif";

      for (let i = 0, len = textArray.length; i < len; i++) {
        context.fillText(textArray[i], 10, 48 + i * 60);
      }

      var texture = new Texture(canvas);
      texture.minFilter = texture.magFilter = NearestFilter;
      texture.needsUpdate = true;

      return texture;
    }
  }

  private onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  private onMouseMove() {
    this.startTime = this.chkRotate.checked ? performance.now() : 1000000;
    this.controls.autoRotate = false;
  }

  private v(x: number, y: number, z: number) {
    return new Vector3(x, y, z);
  }

  private animate(): void {
    this.controls.autoRotate = false;

    requestAnimationFrame(this.animate);
    this.renderer.render(this.scene, this.camera);
  }
}
</script>