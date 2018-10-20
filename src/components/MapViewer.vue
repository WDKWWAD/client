<template>
    <p>Test</p>
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
  Vector3
} from "three";

import { OrbitControls } from 'three-orbitcontrols-ts';

@Component
export default class MapViewer extends Vue {
  path: string = "http://jaanga.github.io/";
  gazetteerFile = this.path + "moon/gazetteer/moon-iau-nomenclature.csv";
  gazetteer: any;

  dirNE = "moon-heightmaps-256p-ne/";
  dirNW = "moon-heightmaps-256p-nw/";
  dirSE = "moon-heightmaps-256p-se/";
  dirSW = "moon-heightmaps-256p-sw/";

  heightmapCanvas: any;
  heightmapContext: any;
  tile: any;
  vertices: any;

  geometry3D: any;
  material3D: any;

  selPlace: any;

  heightMesh: any;

  heightmapWidth = 1024;
  heightmapHeight = 1024;

  widthDestination = 256;
  heightDestination = 256;

  scale = 1;
  scaleAdjust = 0.065;
  scl = this.scale * this.scaleAdjust;

  placards: any;
  placardYPosition = 350;

  // Copernicus,Archetypal large complex crater,9.7N,20.1W
  selectedPlace = 1753; // Copernicus

  tileXCount = this.heightmapWidth / this.widthDestination;
  tileYCount = this.heightmapWidth / this.widthDestination;

  tileXStart = -22;
  tileXFinish = this.tileXStart + this.tileXCount;
  tileX = this.tileXStart;

  tileYStart = 8;
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

  // info
  info: any;

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

    this.hamburger = document.body.appendChild(document.createElement("div"));
    this.hamburger.style.cssText =
      " left: 320px; position: absolute; top: 20px; transition: left 1s; ";
    this.hamburger.innerHTML =
      "<a id=bars href=JavaScript:slideHamburger(); >&#9776;</a>";

    let menu = this.hamburger.appendChild(document.createElement("div"));
    menu.style.cssText =
      " background-color: #eee; border: 1px #ccc solid; left: -300px;  max-height: " +
      (window.innerHeight - 50) +
      "px; " +
      "opacity: 0.8; overflow: auto; padding: 0 10px; position: absolute; top: 0px; transition: left 1s; width: 260px; ";
    menu.innerHTML =
      '<h2 style=margin:0; ><a href="" >' +
      document.title +
      "</a> " +
      "<a id=i href=http://jaanga.github.io/moon/rover-256p/ >&#x24D8;</a></h2>" +
      "<p><select id=selPlace></select></p>" +
      "<p>" +
      "<button onclick=controls.reset(); >Zoom All</button> " +
      //				'<button id=butZoomIn onclick="camera.position.set(centerX-halfMapWidth+50,heightMeshYPosition+300,centerZ-halfMapHeight+400);" >Zoom In</button>' +
      "</p>" +
      "<p>Heights: <input type=range min=0 max=2 step=0.05 value=1 onchange=scale=this.value;scl=scale*scaleAdjust;processTiles(); /></p>" +
      "<p><input type=checkbox id=chkGradient onchange=toggleGradientBackground(); checked /> Display gradient</p>" +
      "<p><input type=checkbox id=chkRotate checked /> Auto Rotation</p>" +
      "<p><small>" +
      "Use cursor keys to rove the moon<br>" +
      "Roll = left | 1 finger<br>Zoom = scroll | 2 finger<br>Move = right | 3 finger" +
      "</small></p>" +
      "<hr>" +
      "<div id=info ></div>" +
      "<p id=places>downloading gazetteer...</p>" +
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

    this.toggleGradientBackground();
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
      this.info.innerHTML =
        "lat: " +
        this.tileYStart +
        " to " +
        this.tileYFinish +
        " lon: " +
        this.tileXStart +
        " to " +
        this.tileXFinish;
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
        (x - this.tileXStart) * this.widthDestination,
        (4 - y + this.tileYStart) * this.heightDestination,
        this.widthDestination,
        this.heightDestination
      );
      this.processTiles();
    };

    this.tile.src = this.path;
  }

  private updateTerrain(): void {
    let map = this.heightmapContext.getImageData(0, 0, 1024, 1024).data;

    for (let i = 1, j = 0; i < this.vertices.length; i += 3, j += 4) {
      this.vertices[i] = this.scl * (map[j] + 255 * map[j + 1]) - 300;
    }

    this.heightMesh.geometry.dispose();
    this.scene.remove(this.heightMesh);
    this.heightMesh = new Mesh(this.geometry3D, this.material3D);
    this.heightMesh.position.y = -300; //heightMeshYPosition;

    this.heightMesh.geometry.computeFaceNormals();
    this.heightMesh.geometry.computeVertexNormals();

    this.scene.add(this.heightMesh);

    if (this.gazetteer === undefined) {
      this.getGazetteerMoon();
    } else {
      this.checkoutPlace();
    }
  }

  private getGazetteerMoon(): void {
    let requestGazetteer = (fileName: string) => {
      xmlHttp = new XMLHttpRequest();
      xmlHttp.open("GET", fileName, true);
      xmlHttp.onreadystatechange = callbackGazetteer;
      xmlHttp.send(null);
    };

    var data = requestGazetteer(this.gazetteerFile);
    var xmlHttp: any;

    let callbackGazetteer = () => {
      if (xmlHttp.readyState != 4) {
        return;
      }

      var response = xmlHttp.responseText;

      var lines = response.split(/\r\n|\n/);

      this.gazetteer = [["select destination"]];

      for (let i = 0; i < lines.length; i++) {
        var place = lines[i].split(",");
        this.gazetteer.push([
          place[0],
          parseFloat(place[1]),
          parseFloat(place[2]),
          parseFloat(place[3])
        ]);
      }

      for (let i = 0; i < lines.length; i++) {
        this.selPlace.appendChild(document.createElement("option"));
        this.selPlace.children[i].text = this.gazetteer[i][0];
      }

      this.selPlace.selectedIndex = this.selectedPlace;
      this.selPlace.onchange = () => {
        var place = this.gazetteer[this.selPlace.selectedIndex];
        this.tileXStart = Math.floor(parseFloat(place[3])) - 1;
        this.tileYStart = Math.floor(parseFloat(place[2])) - 1;

        this.tileXFinish = this.tileXStart + this.tileXCount;
        this.tileX = this.tileXStart;

        this.tileYFinish = this.tileYStart + this.tileYCount;
        this.tileY = this.tileYStart;
        this.processTiles();
      };

      this.checkoutPlace();
    };
  }

  private checkoutPlace(): void {
    var txt = "";
    this.scene.remove(this.placards);
    this.placards = new Object3D();
    for (let i = 0; i < this.gazetteer.length; i++) {
      let place = this.gazetteer[i];
      if (
        place[2] > this.tileYStart + 1 &&
        place[2] < this.tileYFinish + 1 &&
        place[3] > this.tileXStart &&
        place[3] < this.tileXFinish
      ) {
        txt +=
          place[0] + "<br>&bull; lat:" + place[2] + " lon:" + place[3] + "<br>";
        this.drawSprite(
          place[0],
          0.25,
          120,
          256 * (place[3] - this.tileX + 2),
          this.placardYPosition,
          -256 * (place[2] - this.tileY - 3)
        );
      }
    }
    this.scene.add(this.placards);
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

  private slideHamburger() {
    this.hamburger.style.left =
      this.hamburger.style.left === "320px" ? 0 : "320px";
  }

  private toggleGradientBackground() {
    if (this.chkGradient && this.chkGradient.checked) {
      document.body.style.cssText += " height: " + window.innerHeight + "px; ";
      var col1 = Math.random()
        .toString(16)
        .slice(2, 8);
      var col2 = Math.random()
        .toString(16)
        .slice(2, 8);
      var col3 = Math.random()
        .toString(16)
        .slice(2, 8);
      var x = (Math.random() * window.innerWidth).toFixed(0);
      var y = (Math.random() * window.innerHeight).toFixed(0);
      document.body.style.backgroundImage =
        "radial-gradient( circle farthest-corner at " +
        x +
        "px " +
        y +
        "px, #" +
        col1 +
        " 0%, #" +
        col2 +
        " 50%, #" +
        col3 +
        " 100%)";
    } else {
      document.body.style.backgroundImage = "";
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
    //this.controls.update();
    //this.stats.update();
    this.renderer.render(this.scene, this.camera);
  }
}
</script>