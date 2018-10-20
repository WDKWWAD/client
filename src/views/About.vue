<template>
  <div class="about">
    <MapViewer />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import MapViewer from '@/components/MapViewer.vue'; // @ is an alias to /src

@Component({
  components: {
    MapViewer,
  },
})
export default class About extends Vue {}
</script>
