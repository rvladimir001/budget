<template>
  <div class="q-pa-md q-gutter-md q-mx-auto">
    <q-list bordered separator padding class="rounded-borders q-mx-auto" style="max-width: 350px">
      <template
        v-for="(outlay, key) in outlays.list"
        v-bind:key="key"
      >
        <q-item
          v-if="!outlay.deleted"
        >
          <q-item-section>
            <q-item-label lines="1">{{ outlay.name }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon @click="openDelDialog({key: key, name: outlay.name})" class="delete" name="delete" color="red"/>
          </q-item-section>
        </q-item>
      </template>
    </q-list>
    <q-btn class="glossy" color="teal" icon="add" @click="openAddCategoryDialog()"/>
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
    return {
      outlays,
      openAddCategoryDialog,
      openDelDialog
    }
  }
}
</script>

<style scoped>
.delete {
  cursor: pointer;
}

.plus {
  font-size: 36px;
}
</style>
