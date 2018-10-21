<template>
  <div class="map-view__box">
    <!-- <LoadingScreen/> -->
    <router-view></router-view>
    <PlanJourney canStart="true"/>
    <SwitchButton/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import PlanJourney from '@/components/PlanJourney.vue';
import LoadingScreen from '@/components/LoadingScreen.vue';
import MapNavigator from '@/components/MapNavigator.vue';
import SwitchButton from '@/components/SwitchButton.vue';

@Component({
  components: {
    PlanJourney,
    SwitchButton,
    LoadingScreen,
    MapNavigator
  },
})
export default class MapView extends Vue {}
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