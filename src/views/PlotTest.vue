<template>
  <div>
    <HeightPlot />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import HeightPlot from '@/components/HeightPlot.vue';

@Component({
  components: {
    HeightPlot,
  },
})
export default class PlotTest extends Vue {}
</script>
