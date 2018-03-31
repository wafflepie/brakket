<template>
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
</template>
