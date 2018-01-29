<template lang="pug">
  #app
    h1
      | {{ msgExtensionName }}
      .subtitle v{{ msgVersion }}
      a.config(href="./options.html" target="_blank")
        el-button(type="primary" plain icon="el-icon-setting")
    el-menu#main
      el-menu-item(v-for="g in items" :key="g.id" :index="g.id" @click="injectGroup(g)")
        .name {{ g.title }}
        .description {{ g.description }}
    #footer
      el-input(:title="msgHintUrlInput" placeholder="https://" v-model="url" spellcheck="false")
        .url(slot="prepend" :title="msgHintUrlLabel") {{ msgLabelUrl }}
        el-button#injection(slot="append" :title="msgButtonInject" :disabled="invalidUrl")
          img(src="../assets/injection.png" width="16" @click="injectUrl")
</template>

<script>
import inject from './injector';
import isValidUrl from '../urlValidation';
import { getExtname, getGroupList } from './settings';
import { generateComputedMessages } from '../i18n';
import getManifest from '../manifest';

const VERSION = getManifest().version;

const App = {
  name: 'App',
  data: () => ({
    url: '',
    items: getGroupList(),
  }),
  computed: {
    invalidUrl() {
      return !isValidUrl(this.url);
    },
    msgVersion: () => VERSION,
    ...generateComputedMessages([
      'extension_name',
      'button_inject',
      'label_url',
      'hint_url_label',
      'hint_url_input',
    ]),
  },
  methods: {
    injectUrl() {
      if (this.invalidUrl) return;
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
    padding-left 20px
    .subtitle
      display inline
      padding-left 8px
      font-size 10px
      color #888
    .config
      float right
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
