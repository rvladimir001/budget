<template>
  <div class="q-pa-md q-gutter-sm">
    <q-dialog v-model="status" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Категория</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-input dense v-model="category" autofocus @keyup.enter="prompt = false"/>
        </q-card-section>
        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Отмена" @click="setDialog(false)" v-close-popup/>
          <q-btn flat label="Сохранить" @click="add()" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import {computed, ref} from 'vue'
import {useStore} from "vuex";

export default {
  name: "AddCategory",
  setup() {
    const store = useStore();
    const status = computed(() => store.state.statusDialogCategory);
    let category = ref("");
    const setDialog = (status) => {
      store.commit("setStatusDialogAddCategory", status);
    };
    const add = () => {
      store.dispatch("addCategory", category.value)
    }
    return {
      prompt: ref(false),
      category,
      add,
      status,
      setDialog
    }
  }
}
</script>

<style scoped>

</style>


