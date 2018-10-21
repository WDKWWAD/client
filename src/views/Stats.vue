<template>
  <div class="about">
    <MapViewer :roverPath="responseBody.roverPath" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import MapNavigator from '@/components/MapNavigator.vue';

@Component({
  components: {
    MapNavigator
  },
})
export default class Stats extends Vue {
  public responseBody!: Object;

  public created(): void {
    this.responseBody = this.$route.params;
  }
}
</script>
