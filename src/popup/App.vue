<template lang="pug">
  #app
    h1 Injector Pro
    el-menu#main
      el-menu-item-group
    #footer
      el-input(title="Custom Inject")
        .url(slot="prepend" title="HTTP(S) Link of JS/CSS") URL
        el-button#injection(slot="append" title="Inject!")
          img(src="../assets/injection.png" width="16")
</template>

<script>
export default {
  name: 'App',
};

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
    height 28px
    text-align center
#main
  height 340px
  background-color #EEE
  overflow-x hidden
  overflow-y auto

#injection
  padding 0px 0 0px 10px
  vertical-align middle

#footer
  position absolute
  height 32px
  width 100%
  display block
  bottom 0
</style>
