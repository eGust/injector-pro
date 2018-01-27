<template lang="pug">
  #app
    h1 Injector Pro
    el-menu#main
      el-menu-item(v-for="g in items" :key="g.id" :index="g.id" @click="injectGroup(g)")
        .name {{ g.title }}
        .description {{ g.description }}
    #footer
      el-input(title="Custom Inject" placeholder="https://" v-model="url")
        .url(slot="prepend" title="HTTP(S) Link of JS/CSS") URL
        el-button#injection(slot="append" title="Inject!" :disabled="urlIsEmpty")
          img(src="../assets/injection.png" width="16" @click="injectUrl")
</template>

<script>
import inject from './injector';
import { getExtname, getGroupList } from './settings';

const App = {
  name: 'App',
  data: () => ({
    url: '',
    items: getGroupList(),
  }),
  computed: {
    urlIsEmpty() {
      return !(this.url && this.url.trim().length);
    },
  },
  methods: {
    injectUrl() {
      if (this.urlIsEmpty) return;
      const item = {
        ext: getExtname(this.url) || '.js',
        url: this.url,
      };
      this.injectGroup({
        title: '[URL]',
        items: [item],
      });
    },
    injectGroup(group) {
      inject(group);
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
  overflow-x hidden
  overflow-y auto
  .name
    height 30px
    line-height 48px
  .description
    float right
    font-size 9px
    color #888
    line-height 16px

#injection
  margin-top -24px
  padding 1px 12px
  vertical-align middle
  height 24px
  img
    vertical-align middle
  &:disabled img
    opacity 0.2

#footer
  position absolute
  height 29px
  width 100%
  display block
  bottom 0
  .el-input-group__append
    position relative
</style>
