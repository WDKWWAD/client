<template>
    <div id="mapViewer"></div>
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
  Mesh,
  MeshLambertMaterial,
  AmbientLight,
  SpotLight,
  LineBasicMaterial,
  Geometry,
  Vector3,
  Line, SphereGeometry, MeshBasicMaterial
} from "three";

import { OrbitControls } from "@avatsaev/three-orbitcontrols-ts";

@Component
export default class MapViewer extends Vue {
  PATH_SPACE = 5;
  path: string = "../assets/example_map.png";

  heightmapCanvas: any;
  heightmapContext: any;
  tile: any;
  vertices: any;

  geometry3D: any;
  material3D: any;

  heightMesh: any;

  heightmapWidth = 1024;
  heightmapHeight = 1024;

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

  total_distance: any;
  hypsometric_profile: any;

  pathPoints: { points: Array<{x: number, y: number}> } = {points: []};
  roverPath: Array<any> = [];

  public mounted() {
    // this.pathPoints = { "points": [ { "x": 500,  "y": 500 }, { "x": 1600,  "y": 1950 }, { "x": 500,  "y": 1000 }]};
    // this.$http.post('http://localhost:5000/api/path', this.pathPoints).then((response : any) => {
    //   this.total_distance = response.body['total_distance'];
    //   this.hypsometric_profile = response.body['hypsometric_profile'];
    //   this.roverPath = response.body['path'];
    //   this.updateTerrain();
    // }, response => {
    //     // error callback
    // });

    this.$nextTick(function() {
      this.init();
      this.animate();
    });
  }

  private init(): void {
    let rendererParams: WebGLRendererParameters = {
      alpha: true,
      antialias: true,
      clearColor: 0xffffff
    };

    this.renderer = new WebGLRenderer(rendererParams);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    const divRenderer: any = document.getElementById('mapViewer');
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

    window.addEventListener("resize", this.onWindowResize, false);

    // assets
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

    // Draw rover path
    var material = new LineBasicMaterial({color: 0x0000ff});
    var geometry = new Geometry();
    this.roverPath.forEach((point: any) => {
      geometry.vertices.push(
        new Vector3(
          this.vertices[(point.x * 2048 + point.y) * 3],
          this.vertices[(point.x * 2048 + point.y) * 3 + 1] + this.PATH_SPACE,
          this.vertices[(point.x * 2048 + point.y) * 3 + 2]
        )
      );
    });
    var line = new Line(geometry, material);
    this.scene.add(line);

    // Draw all points
    this.pathPoints.points.forEach((point: {x: number, y: number}) => {
      var geometry = new SphereGeometry(5, 32, 32 );
      var material = new MeshBasicMaterial({color: 0x0000ff});
      var sphere = new Mesh(geometry, material);
      sphere.position.set(
        this.vertices[(point.x * 2048 + point.y) * 3],
        this.vertices[(point.x * 2048 + point.y) * 3 + 1] + this.PATH_SPACE,
        this.vertices[(point.x * 2048 + point.y) * 3 + 2]);
      this.scene.add(sphere);
    });
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
