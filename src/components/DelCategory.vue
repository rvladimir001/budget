<template>
  <div class="q-pa-md q-gutter-sm">
    <q-dialog v-model="status" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Удалить категорию "{{ category.name }}"?</div>
        </q-card-section>
        <q-card-actions align="right" class="text-secondary">
          <q-btn flat label="Отмена" @click="setDialog(null)" v-close-popup/>
          <q-btn flat label="Удалить" @click="deleteCategory" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import {computed, ref} from 'vue';
import {useStore} from "vuex";

export default {
  name: "DelCategory",
  setup() {
    const store = useStore();
    const status = computed(() => Boolean(store.state.delCategory));
    const category = computed(() => store.state.delCategory);
    const currentOutlay = computed(() => store.state.currentOutlay);
    let waste = ref('');
    const setDialog = (status) => {
      store.commit("setDelCategory", status);
    };
    const deleteCategory = () => {
      store.dispatch("delCategory", category.value.key)
    }
    return {
      currentOutlay,
      waste,
      deleteCategory,
      prompt: ref(false),
      category,
      status,
      setDialog
    }
  }
}
</script>

<style scoped>

</style>
