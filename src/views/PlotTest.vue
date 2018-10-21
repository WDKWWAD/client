<template>
  <div>
    <div>
      <HeightPlot />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import HeightPlot from '@/components/HeightPlot.vue'; // @ is an alias to /src

@Component({
  components: {
    HeightPlot,
  },
})
export default class PlotTest extends Vue {}
</script>
