<template>
  <div>
    <h2>Simple tournament brackets for everyone!</h2>
    <ul>
      <li>
        <router-link :to="{ name: 'named-participants-form' }">
          I want to enter the names of participants
        </router-link>
      </li>
      <li>
        <router-link
          :to="{ name: 'numbered-participants-form' }"
          class="shifting with-arrow">
          I don't need to enter the names, just keep them numbered
        </router-link>
      </li>
      <li>
        <router-link :to="{ name: 'local-brackets' }">
          Show me the brackets that I've created previously
        </router-link>
      </li>
    </ul>
  </div>
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
  margin: $list-item-margin 0;

  a {
    display: inline-block;
    text-decoration: none;
    transition: transform $transition-duration;

    &:hover {
      transform: translateX(0.5rem);
    }

    &::before {
      content: "↪ ";
    }
  }
}
</style>
