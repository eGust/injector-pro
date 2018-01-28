<template lang="pug">
  .inject-item.view
    el-row
      el-col(:span="4")
        .view {{ viewTitle }}
      el-col(:span="4")
        .view {{ viewWait }}
      el-col(:span="4")
        .view {{ viewType }}
      el-col(:span="12")
        .view {{ viewTarget }}
</template>


<script>
export default {
  name: 'InjectItem',
  props: ['is-edit', 'item'],
  computed: {
    viewTitle() {
      return this.item.title;
    },
    viewDescription() {
      return this.item.description;
    },
    viewWait() {
      return this.item.hide ? 'Wait' : 'Async';
    },
    viewType() {
      return this.item.reference ? 'Reference' : 'URL';
    },
    viewTarget() {
      return this.item.reference || this.item.url;
    },
  },
};
</script>

<style lang="stylus" scoped>
// .edit, .view
//   display none
// .is-edit .edit, .is-view .view
//   display block
</style>
