<template lang="pug">
  #app(v-once)
    h1 Dev Exetions
    h2
      li
        a(href='/popup.html') Popup
      li
        a(href='/options.html') Options
</template>

<script>

export default {
  name: 'App',
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  display: block;
  width: 600px;
  margin: 0 auto;
  margin-top: 60px;
}
</style>
