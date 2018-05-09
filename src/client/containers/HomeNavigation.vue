<template>
  <section>
    <h2>Simple tournament brackets for everyone!</h2>
    <nav>
      <ul>
        <li>
          <router-link
            :to="{ name: 'named-participants-form' }"
          >I want to enter the names of participants</router-link>
        </li>
        <li>
          <router-link
            :to="{ name: 'numbered-participants-form' }"
            class="shifting with-arrow"
          >I don't need to enter the names, just keep them numbered</router-link>
        </li>
        <li>
          <router-link
            :to="{ name: 'local-tournaments' }"
          >Show me the brackets that I've visited previously</router-link>
        </li>
      </ul>
    </nav>
  </section>
</template>

<style lang="scss" scoped>
h2 {
  text-align: center;
  margin: $section-margin auto;
}

ul {
  text-align: left;
}

li {
  font-size: $navigation-item-font-size;
  margin: $list-item-margin 0;
  padding-left: $home-navigation-list-margin;

  a {
    display: inline-block;
    text-decoration: none;
    transition: transform $transition-duration;

    &:hover {
      transform: translateX(0.5rem);
    }

    &::before {
      content: "> ";
      display: inline-block;
      margin-left: -1 * $home-navigation-list-margin;
      width: $home-navigation-list-margin;
    }
  }
}
</style>
