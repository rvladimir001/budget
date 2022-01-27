<template>
  <div class="q-pa-md q-gutter-sm">
    <q-dialog v-model="status" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6 text-secondary">{{ currentOutlay.outlay.name }}</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-input
            type="number"
            v-model="waste"
            autofocus
            @keyup.enter="prompt = false"
            :rules="rules"
            :dense="dense"
          />
        </q-card-section>
        <q-card-actions align="right" class="text-secondary">
          <q-btn flat label="Отмена" @click="close" v-close-popup/>
          <q-btn flat label="Внести" @click="add" v-close-popup :disable="statusButtonSave"/>
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
    const balance = computed(() => store.state.outlays.balance);
    const statusButtonSave = computed(() => waste.value > balance.value || waste.value <= 0);
    let waste = ref('');
    const close = (status) => {
      waste.value = "";
      store.commit("setStatusDialogWaste", status);
    };
    const add = () => {
      store.dispatch("addOutlay", {currentOutlay: currentOutlay, value: waste});
      close();
    }
    return {
      balance,
      statusButtonSave,
      currentOutlay,
      waste,
      status,
      dense: ref(false),
      prompt: ref(false),
      rules: [
        val => !!val || 'Заполните поле!',
        val => (val < balance.value) || 'В кошельке столько нет!',
        val => (val > 0) || 'Значение должно быть больше 0!',
        val => {
          if (String(val).trim().indexOf(".") < 0) {
            return true
          } else if (String(val).trim().split(".")[1].length <= 2) {
            return true
          } else {
            return 'Некорректное значение!'
          }
        }
      ],
      add,
      close
    }
  }
}
</script>

<style scoped>

</style>
