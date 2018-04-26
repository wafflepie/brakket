<template>
  <h1 id="title">
    <router-link :to="{ name: 'home' }">
      bra<span class="letter-k">k</span><span class="letter-k">k</span>et
    </router-link>
  </h1>
</template>


<style lang="scss" scoped>
#title {
  font-size: $title-font-size;
  line-height: $title-font-size;
  margin-bottom: $section-margin;
  margin-top: $section-margin;
  transition: all $transition-duration ease-in-out;

  &.small {
    font-size: $title-font-size / 1.5;
    line-height: $title-font-size / 1.5;
    margin-bottom: $section-margin / 2;
    margin-top: $section-margin / 2 + $status-bar-height;
  }

  a {
    text-decoration: none;

    &:hover {
      color: inherit;
    }
  }
}

.letter-k {
  display: inline-block;
  color: $primary-color;
  transform: rotate(8deg);

  &:last-of-type {
    margin-right: -0.25rem;
  }
}
</style>
