<template>
  <div class="q-pa-md q-gutter-sm">
    <q-dialog v-model="status" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">{{ currentOutlay.outlay.name }}</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-input type="number" dense v-model="waste" autofocus @keyup.enter="prompt = false"/>
        </q-card-section>
        <q-card-actions align="right" class="text-secondary">
          <q-btn flat label="Отмена" @click="setDialog(false)" v-close-popup/>
          <q-btn flat label="Внести" @click="add" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import {computed, ref} from 'vue';
import {useStore} from "vuex";

export default {
  name: "AddOutlay",
  setup() {
    const store = useStore();
    const status = computed(() => store.state.statusDialogWaste);
    const currentOutlay = computed(() => store.state.currentOutlay);
    let waste = ref('');
    const setDialog = (status) => {
      store.commit("setStatusDialogWaste", status);
    };
    const add = () => {
      store.dispatch("addOutlay", {currentOutlay: currentOutlay, value: waste})
    }
    return {
      currentOutlay,
      waste,
      add,
      prompt: ref(false),
      status,
      setDialog
    }
  }
}
</script>

<style scoped>

</style>
