<template>
  <div class="q-pa-md q-gutter-sm">
    <q-dialog v-model="status" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Платеж</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-input dense v-model="waste" autofocus @keyup.enter="prompt = false" />
        </q-card-section>
        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Отмена" @click = "setDialog(false)" v-close-popup />
          <q-btn flat label="Внести" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import {computed, ref} from 'vue'
import {useStore} from "vuex";

export default {
  name: "AddWaste",
    setup () {
    const store = useStore();
    const status = computed(() => store.state.statusDialogWaste);
    const setDialog = (status) => {
      store.commit("setStatusDialogWaste", status);
    };
    return {
      prompt: ref(false),
      waste: ref(''),
      status,
      setDialog
    }
  }
}
</script>

<style scoped>

</style>
