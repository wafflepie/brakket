<template>
  <ul>
    <li>
      <router-link :to="{ name: 'named-participants' }">
        I want to enter the names of participants
      </router-link>
    </li>
    <li>
      <router-link :to="{ name: 'numbered-participants' }">
        I don't need to enter the names, just keep them numbered
      </router-link>
    </li>
    <li>
      <router-link :to="{ name: 'stored-brackets' }">
        Show me the brackets that I've created previously
      </router-link>
    </li>
  </ul>
</template>
