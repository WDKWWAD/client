<template>
  <div class="map-view__box">
    <PlanJourney canStart="true"/>
    <SwitchButton viewToSwitch="3D" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import PlanJourney from '@/components/PlanJourney.vue';
import SwitchButton from '@/components/SwitchButton.vue';

@Component({
  components: {
    PlanJourney,
    SwitchButton,
  },
})
export default class Home extends Vue {}
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