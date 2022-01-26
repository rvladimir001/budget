<template>
  <div class="q-pa-md q-gutter-md q-mx-auto">
    <q-list separator padding class="rounded-borders q-mx-auto" style="max-width: 400px">
      <template
        v-for="(outlay, key) in outlays.list"
        v-bind:key="key"
      >
        <q-item
          v-if="!outlay.deleted"
        >
          <q-item-section style="display: flex">
            <q-item-label lines="1" class="text-secondary">
              <div style="display: flex; align-items:center">
                <div style="width: 20px; height: 20px; margin: 5px" :style="{ background:  outlay.color}"></div>
                {{ shortName(outlay.name) }}
              </div>
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon @click="openEditDialog({key: key, name: outlay.name, color: outlay.color})" class="edit" name="edit"
                    color="secondary"/>
          </q-item-section>
          <q-item-section side>
            <q-icon @click="openDelDialog({key: key, name: outlay.name})" class="delete" name="delete" color="red"/>
          </q-item-section>
        </q-item>
      </template>
    </q-list>
    <q-btn class="glossy plus" round color="teal" icon="add" @click="openAddCategoryDialog()"/>
  </div>
  <DelCategory/>
</template>

<script>
import {computed} from "vue";
import {useStore} from "vuex";
import DelCategory from 'components/DelCategory.vue'

export default {
  name: "Settings",
  components: {DelCategory},
  setup() {
    const store = useStore();
    const outlays = computed(() => store.state.outlays);
    const openAddCategoryDialog = () => {
      store.commit("setStatusDialogAddCategory", true);
    }
    const openDelDialog = (category) => {
      store.commit("setDelCategory", category);
    }
    const openEditDialog = (category) => {
      store.commit("setEditCategory", category);
      store.commit("setStatusDialogAddCategory", true);
    }
    const shortName = (name) => {
      if (name.length > 25) {
        return `${name.slice(0, 26)}..`;
      }
      return name
    }
    return {
      outlays,
      openAddCategoryDialog,
      openDelDialog,
      openEditDialog,
      shortName
    }
  }
}
</script>

<style scoped>
.delete, .edit {
  cursor: pointer;
}

.plus {
  margin-left: auto;
  margin-right: -15rem;
  font-size: 1rem;
}
</style>
