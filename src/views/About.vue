<template>
  <div class="about">
    <!-- <MapViewer /> -->
    <MapNavigator />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import MapViewer from '@/components/MapViewer.vue'; // @ is an alias to /src
import MapNavigator from '@/components/MapNavigator.vue';

@Component({
  components: {
    MapViewer,
    MapNavigator
  },
})
export default class About extends Vue {}
</script>
