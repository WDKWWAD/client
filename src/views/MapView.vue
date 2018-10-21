<template>
  <div class="map-view__box">
    <router-view @addPoint="addPoint" :points="pointManager.currentPoints"></router-view>
    <PlanJourney :canStart="canStart" @startMission="startMission" @reset="resetPoints"/>
    <SwitchButton/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import PlanJourney from '@/components/PlanJourney.vue';
import LoadingScreen from '@/components/LoadingScreen.vue';
import MapNavigator from '@/components/MapNavigator.vue';
import SwitchButton from '@/components/SwitchButton.vue';
import PointManager from '@/service/point-manager.service';
import Point from '@/model/Point.model';

@Component({
  components: {
    PlanJourney,
    SwitchButton,
    LoadingScreen,
    MapNavigator
  },
})
export default class MapView extends Vue {
  public pointManager: PointManager = new PointManager();

  public addPoint(point: Point): void {
    this.pointManager.addNewPoint(point);
  }

  public resetPoints(): void {
    this.pointManager.resetPoints();
  }

  public startMission(): void {
    this.$router.push({name: 'loading'});
    this.$http.post('http://localhost:5000/api/path', {'points': this.pointManager.currentPoints}).then((response : any) => {
      window.console.log('this.pointManager.currentPoints:', this.pointManager.currentPoints);
      const responseBody = {
        totalDistance: response.body['total_distance'],
        hypsometricProfile: response.body['hypsometric_profile'],
        path: response.body['path'],
        points: this.pointManager.currentPoints as any
      };
      this.$router.push({name: 'statistics', params: responseBody});
      this.pointManager.resetPoints();
    }, (response: any) => {
        console.log('There was an error posting points. Response:');
        console.log(response);
    });
  }

  get canStart(): boolean {
    return this.pointManager.currentPoints.length >= 2;
  }
}
</script>

<style scoped lang="scss">
@import '../styles/mixins';

.map-view {
  &__box {
    @include size(100vw, 100vh);
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    background: url('../assets/landing-blurred.jpg') center / cover no-repeat;
    overflow: hidden;
  }
}
</style>