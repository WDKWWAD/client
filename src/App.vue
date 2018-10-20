<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="scss">
@import 'styles/mixins';

body {
  @include font-regular;
  box-sizing: border-box;
  margin: 0;
}
</style>
