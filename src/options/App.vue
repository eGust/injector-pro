<template lang="pug">
  #app
    el-container
      el-header
        h1#title Injector Pro
      el-main
        el-collapse(v-model="activeNames")
</template>


<script>
import settings from './settings';

export default {
  name: 'App',
  data: () => ({
    activeNames: [],
    options: settings.load(),
  }),
};
</script>

<style lang="stylus">
#title
  margin 0
  line-height 55px
</style>
