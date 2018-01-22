<template lang="pug">
  #app
    h1 Injector Pro
    el-menu#main
      el-menu-item-group
    #footer
      el-input(title="Custom Inject" placeholder="https://" v-model="url")
        .url(slot="prepend" title="HTTP(S) Link of JS/CSS") URL
        el-button#injection(slot="append" title="Inject!" :disabled="urlIsEmpty")
          img(src="../assets/injection.png" width="16" @click="inject")
</template>

<script>
const App = {
  name: 'App',
  data: () => ({
    url: '',
  }),
  computed: {
    urlIsEmpty() {
      return !(this.url && this.url.trim().length);
    },
  },
  methods: {
    inject() {
      if (this.urlIsEmpty) return;
      console.log(this.url);
    },
  },
};

export default App;

</script>

<style lang="stylus">
body
  margin 0
  padding 0
#app
  position relative
  display block
  width 320px
  height 400px
  overflow hidden

  h1
    font-size 15px
    margin 0
    line-height 26px
    height 29px
    text-align center
#main
  height 342px
  background-color #EEE
  overflow-x hidden
  overflow-y auto

#injection
  margin-top -24px
  padding 1px 12px
  vertical-align middle
  height 24px
  &:disabled img
    opacity 0.3

#footer
  position absolute
  height 29px
  width 100%
  display block
  bottom 0
  .el-input-group__append
    position relative
</style>
