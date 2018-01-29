<template lang="pug">
  #app
    el-container
      el-header
        el-row
          el-col(:span="12")
            h1#title {{ msgExtensionName }} v{{ msgVersion }}
          el-col.button-groups(:span="12" v-if="!isEditing")
            el-button-group(v-if="isChanged")
              el-button(type="success" plain @click="save") {{ msgButtonSave }}
              el-button(type="warning" plain @click="reload") {{ msgButtonDiscard }}
      el-main
        el-collapse(v-model="openPanels")
          el-collapse-item(
            v-for="group in groups"
            :key="group.id"
            :name="group.id"
            :title="group.title"
          )
            .group-wrap(v-if="editingGroup.id === group.id")
              el-row.group.text-center
                el-col.text-right(:span="24")
                  el-button-group
                    el-button(
                      type="success"
                      icon="el-icon-check"
                      :disabled="!editingChanged"
                      :title="msgButtonOk"
                      @click="finishEditGroup(true)"
                    )
                    el-button(
                      type="warning"
                      icon="el-icon-close"
                      :title="msgButtonCancel"
                      @click="finishEditGroup(false)"
                    )
                el-col.text-center(:xs="5" :sm="6" :lg="4" :title="group.title")
                  h5 {{ msgLabelTitle }}
                  el-input(v-model="editingGroup.title")
                el-col.text-center(:xs="12" :sm="13" :lg="17" :title="group.description")
                  h5 {{ msgLabelDescription }}
                  el-input(v-model="editingGroup.description")
                el-col.text-center(:xs="7" :sm="5" :lg="3")
                  h5 {{ msgLabelHide }}
                  el-switch(v-model="editingGroup.hide")
              el-row.text-center.group-item(v-for="(item, i) in editingGroup.items" :key="i")
                el-col(:xs="12" :sm="7" :lg="7" :title="item.title")
                  h5
                    i.drag-handle.el-icon-rank
                    | {{ msgLabelTitle }}
                  el-input(
                    v-if="item.type === 'url'"
                    v-model="item.title"
                  )
                  el-input(
                    v-else
                    disabled
                    :value="item.reference ? dict[item.reference].title : ''"
                  )
                el-col(:xs="8" :sm="4" :lg="3" :title="item.type")
                  h5 Type
                  el-select(v-model="item.type")
                    el-option(
                      v-for="opt in typeOptions"
                      :key="opt.value"
                      :value="opt.value"
                      :label="opt.label"
                    )
                el-col(:xs="4" :sm="3" :lg="2")
                  h5 {{ msgLabelWait }}
                  el-switch(v-model="item.wait")
                el-col(:xs="20" :sm="7" :lg="10")
                  h5 {{ msgLabelTarget }}
                  el-input(
                    v-if="item.type === 'url'"
                    v-model="item.url"
                    placeholder="https://"
                  )
                  el-select(v-model="item.reference" v-else)
                    el-option(
                      v-for="opt in availableReferences"
                      :key="opt.id"
                      :value="opt.id"
                      :label="opt.title"
                    )
                el-col(:xs="4" :sm="3" :lg="2")
                  el-button.remove(
                    type="danger"
                    icon="el-icon-error"
                    :title="msgButtonRemove"
                    @click="removeItem(item)"
                    plain
                  )
              br
              el-row
                el-col
                  el-button(type="primary" plain icon="el-icon-plus" @click="addItem")
                    | {{ msgButtonAddItem }}
            .group-wrap(v-else)
              el-row.group
                el-col.text-center(:xs="5" :sm="6" :lg="4" :title="group.title")
                  | {{ group.title || '-' }}
                el-col.text-center(:xs="12" :sm="13" :lg="17" :title="group.description")
                  | {{ group.description || '-' }}
                el-col(:xs="3" :sm="2" :lg="1")
                  | {{ group.status }}
                el-col(:xs="4" :sm="2" :lg="2")
                  el-button-group(v-if="!isEditing")
                    el-button(
                      type="primary"
                      @click="startEditGroup(group.id)"
                      :title="msgButtonEdit"
                      icon="el-icon-edit-outline"
                    )
                    el-button(
                      type="danger"
                      @click="removeGroup(group.id)"
                      icon="el-icon-delete"
                      :title="msgButtonRemove"
                      :disabled="!group.removable"
                    )
              el-row.item(v-for="item in group.items" :key="item.id")
                el-col.used(:xs="16" :sm="8" :lg="8" :title="item.title")
                  | {{ item.title || '-' }}
                el-col(:xs="4" :sm="2" :lg="1" :title="item.type")
                  | {{ item.type || '-' }}
                el-col(:xs="4" :sm="2" :lg="1" :title="item.sync")
                  | {{ item.sync || '-' }}
                el-col(:xs="24" :sm="12" :lg="14" :title="item.target")
                  | {{ item.target || '-' }}
              .used-by(v-if="group.used")
                h5 {{ msgLabelUsedBy }}
                .used(v-for="g in group.used") {{ g }}
        br
        el-row(v-if="!editingGroup.id")
          el-col
            el-button(type="primary" icon="el-icon-plus" @click="addGroup") {{ msgButtonAddGroup }}
</template>

<script>
import { cloneDeep, values, isEqual, every } from 'lodash';
import { Message, MessageBox } from 'element-ui';

import settings from './settings';
import isValidUrl from '../urlValidation';
import { tr, tf, generateComputedMessages, makeOptions } from '../i18n';
import getManifest from '../manifest';

const version = getManifest().version;
let cachedOptions = settings.load();

function solveRefs(dict, id) {
  const group = dict[id];
  if (!group.unsolved) return;

  const used = {};
  group.refs.forEach((ref) => {
    solveRefs(dict, ref);
    const tarDeps = dict[ref].deps;
    used[ref] = 1;
    tarDeps[id] = 1;
    const target = dict[ref];
    target.removable = 0;
    Object.keys(target.refs).forEach((r) => {
      used[r] = 1;
      const td = dict[r].deps;
      td[id] = 1;
    });
  });
  delete group.unsolved;
  group.refs = used;
}

function groupEqual(group1, group2) {
  const { items: items1, hide: h1, ...g1 } = group1;
  const { items: items2, hide: h2, ...g2 } = group2;
  if (items1.length !== items2.length || (!h1) !== (!h2) || !isEqual(g1, g2)) return false;

  return every(items1, ({ wait: w1 = 0, ...el1 }, index) => {
    const { wait: w2, ...el2 } = items2[index];
    // console.log(!w1, cloneDeep(el1), !w2, cloneDeep(el2), (!w1) === (!w2) && isEqual(el1, el2));
    return (!w1) === (!w2) && isEqual(el1, el2);
  });
}

export default {
  name: 'App',

  data: () => ({
    options: cloneDeep(cachedOptions),
    editingGroup: {},
    tempGroup: null,
    openPanels: [],
  }),

  computed: {
    ...generateComputedMessages([
      'extension_name',
      'button_save',
      'button_discard',
      'button_add_group',
      'button_edit',
      'button_remove',
      'button_ok',
      'button_cancel',
      'button_add_item',
      'label_title',
      'label_description',
      'label_hide',
      'label_type',
      'label_wait',
      'label_target',
      'label_used_by',
    ]),
    msgVersion: () => version,

    isEditing() {
      return !!this.editingGroup.id;
    },

    isChanged() {
      const { groups: grps1 } = this.options;
      const { groups: grps2 } = cachedOptions;
      if (Object.keys(grps1).length !== Object.keys(grps2).length) return true;
      // console.log(cloneDeep(grps1), grps2);
      return !every(grps1, (g1, i) => groupEqual(g1, grps2[i]));
    },

    dict() {
      const d = {};
      this.options.groups.forEach((group) => {
        const { id, title, items } = group;
        d[id] = {
          id,
          title,
          unsolved: 1,
          refs: items.map(({ reference }) => reference).filter(ref => ref),
          deps: {},
          group,
          removable: 1,
        };
      });

      Object.keys(d).forEach((id) => { solveRefs(d, id); });
      return d;
    },

    groups() {
      const r = this.options.groups.map((group) => {
        const { id, title, description, hide, items } = group;
        const list = items.map(({ title: t, reference = null, url = null, wait = 0 }) => ({
          title: t,
          type: url ? tr('label_url') : tr('label_ref'),
          target: url || this.dict[reference].title,
          sync: wait ? tr('label_await') : tr('label_async'),
          wait,
        }));
        const used = Object.keys(this.dict[id].deps).map(gid => this.dict[gid].title);

        return {
          id,
          title,
          description,
          status: hide ? this.msgLabelHide : tr('label_show'),
          items: list,
          removable: this.dict[id].removable,
          used: used.length ? used : null,
        };
      });

      if (this.tempGroup) {
        r.push(this.tempGroup);
      }
      return r;
    },

    typeOptions: () => makeOptions(['url', 'ref'], 'option'),

    availableReferences() {
      const curId = this.editingGroup.id;
      if (!curId) return [];

      return values(this.dict)
        .filter(({ id, refs }) => !(id === curId || refs[curId]))
        .map(({ id, title }) => ({ id, title }))
        .sort((a, b) => a.title.localeCompare(b.title));
    },

    editingValid() {
      if (!this.editingGroup.id) return false;
      const { title, items } = this.editingGroup;
      if (!title.trim().length || !items.length) return false;

      return every(items, ({ title: t, type, url, reference }) =>
        (type === 'url' ? (t.trim().length && isValidUrl(url)) : reference),
      );
    },

    edittedGroup() {
      if (!this.editingValid) return {};

      const { items, original, ...group } = this.editingGroup;
      return {
        ...group,
        items: items.filter(({ title, type, url, reference }) =>
          (type === 'url' ? (title.trim().length && isValidUrl(url)) : reference))
          .map(({ title, wait, type, reference, url }) => {
            if (type === 'url') {
              return {
                title,
                url,
                wait: +wait,
              };
            }
            return {
              title: this.dict[reference].title,
              reference,
              wait: +wait,
            };
          }),
      };
    },

    editingChanged() {
      return this.editingValid && !groupEqual(this.editingGroup.original, this.edittedGroup);
    },
  },

  methods: {
    editingOptionsClass(groupId) {
      const isSame = this.editingGroup.id === groupId;
      return {
        'ip-show-edit': isSame,
        'ip-show-view': !isSame,
      };
    },

    addGroup() {
      const id = Date.now().toString(36);
      this.tempGroup = {
        id,
      };

      const original = {
        id,
        title: '',
        description: '',
        items: [],
      };

      this.editingGroup = {
        id,
        title: 'New Group',
        original,
        items: [{
          title: '',
          type: 'url',
          wait: false,
          url: '',
          reference: '',
        }],
      };

      this.openPanels.push(id);
    },

    startEditGroup(id) {
      const original = this.dict[id].group;
      const { items, ...group } = original;
      const g = {
        ...group,
        items: items.map(({ title, url = null, reference = null, wait = 0 }) => ({
          title,
          type: url ? 'url' : 'ref',
          wait: !!wait,
          url: url || '',
          reference,
        })),
        original,
      };
      // console.log(cloneDeep(g));
      this.editingGroup = g;
    },

    addItem() {
      this.editingGroup.items.push({
        title: '',
        type: 'url',
        wait: false,
        url: '',
        reference: null,
      });
    },

    removeItem(item) {
      this.editingGroup.items = this.editingGroup.items.filter(target => item !== target);
    },

    finishEditGroup(accepted) {
      const group = { ...this.edittedGroup };
      this.editingGroup = {};
      this.tempGroup = null;
      if (!accepted) return;

      const isNew = every(this.options.groups, (grp) => {
        if (grp.id !== group.id) return true;
        Object.assign(grp, group);
        return false;
      });

      if (isNew) {
        this.options.groups.push(group);
      }
    },

    removeGroup(id) {
      const { title } = this.dict[id];
      MessageBox.confirm(
        tf('confirm_body', { title }),
        tr('confirm_title'),
        {
          confirmButtonText: tr('confirm_button_yes'),
          cancelButtonText: tr('confirm_button_no'),
          type: 'error',
          dangerouslyUseHTMLString: true,
        })
        .then(() => {
          this.options.groups = this.options.groups.filter(({ id: grpId }) => id !== grpId);
          Message.info({ message: tf('alert_message', { title }), dangerouslyUseHTMLString: true });
        })
        .catch(() => {});
    },

    reload() {
      cachedOptions = settings.load();
      this.options = cloneDeep(cachedOptions);
    },

    save() {
      settings.save(this.options);
      this.reload();
    },
  },
};
</script>

<style lang="stylus">
h5
  margin-top 8px
  margin-bottom 4px
#title
  margin 0
  line-height 55px
.button-groups
  text-align right
  vertical-align bottom
  line-height 50px
.group
  font-weight bold
.text-center
  text-align center
.text-right
  text-align right
.remove
  margin-top 30px
.drag-handle
  float left
  margin-top 8px
.used
  padding-left 15px
</style>
