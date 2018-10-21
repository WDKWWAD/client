<template>
  <div class="map-view__box">
    <!-- <LoadingScreen/> -->
    <router-view @addPoint="addPoint" :points="pointManager.currentPoints"></router-view>
    <PlanJourney :canStart="canStart"/>
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

  get canStart(): boolean {
    console.log(this.pointManager.currentPoints.length >= 2);
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
    overflow: hidden;
  }
}
</style>