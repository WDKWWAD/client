<template>
  <div class="landing__box">
    <div class="landing__content">
      <h1 class="landing__main-text">Welcome to our<br>moon travel planner!</h1>
      <img class="landing__img" src="../assets/travel-icon.svg"/>
      <router-link :to="{name: 'map'}" class="landing__action">Let's go!</router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Point from '@/model/Point.model';

@Component({})
export default class LandingPage extends Vue {
}
</script>

<style scoped lang="scss">
@import '../styles/mixins';

.landing {
  &__box {
    @include size(100vw, 100vh);
    position: relative;
    background: url('../assets/landing-background.jpg') center / cover no-repeat;

    overflow: hidden;
  }

  &__content {
    @include size(40em, 100%);
    background-color: rgba($color-primary, 0.7);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    > * {
      margin: 2em;
    }
  }

  &__main-text {
    color: $color-on-dark;
    font-size: 1.7em;
    text-align: center;
  }

  &__img {
    @include size(20em, auto);
  }

  &__action {
    @include font-bold;
    border: 0;
    border-radius: 10px;
    cursor: pointer;
    padding: 0.5em 1em;
    text-transform: uppercase;
    transition: all 0.3s;
    font-size: 1.5em;
    background-color: $color-secondary;
    text-decoration: none;
    color: $color-on-light;
  }
}
</style>