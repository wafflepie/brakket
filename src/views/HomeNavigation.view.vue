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
        <router-link :to="{ name: 'numbered-participants-form' }">
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
  margin: 2.5rem auto;
}

ul {
  text-align: left;
}

li {
  margin: 1.25rem;

  a {
    text-decoration: none;
    transition: padding 0.3s;

    &:hover {
      padding-left: 0.5rem;
    }

    &::before {
      content: "↪";
    }
  }
}
</style>
