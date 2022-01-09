<template>
  <div class="q-pa-md q-gutter-sm">
    <q-dialog v-model="status" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Пополнить кошелек</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-input
            type="number"
            v-model="refill"
            :rules="rules"
            :dense="dense"
            autofocus
            @keyup.enter="prompt = false"/>
        </q-card-section>
        <q-card-actions align="right" class="text-secondary">
          <q-btn flat label="Отмена" @click="setDialog(false)" v-close-popup/>
          <q-btn flat label="Внести" @click="add" :disable="statusButtonSave" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import {computed, ref} from 'vue';
import {useStore} from "vuex";

export default {
  name: "AddBalance",
  setup() {
    const store = useStore();
    const status = computed(() => store.state.statusDialogBalance);
    const currentOutlay = computed(() => store.state.currentOutlay);
    const statusButtonSave = computed(() => refill.value<=0);
    let refill = ref('')
    const setDialog = (status) => {
      store.commit("setStatusDialogBalance", status);
    };
    const add = () => {
      store.dispatch("addBalance", refill.value)
      setDialog(false)
    }
    return {
      statusButtonSave,
      dense: ref(false),
      rules: [
        val => !!val || 'Заполните поле!',
        val => (val > 0) || 'Значение должно быть больше 0!'
      ],
      currentOutlay,
      refill,
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
