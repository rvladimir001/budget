<template>
  <div class="q-pa-md q-gutter-sm">
    <q-dialog v-model="status" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6 text-secondary">Категория</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-input
            v-model="category"
            :rules="rules"
            :dense="dense"
            lazy-rules
            autofocus @keyup.enter="prompt = false"/>

          <div class="q-pa-md">
            <div style="display: flex">
              <div style="width: 20px; height: 20px; margin: 5px" :style="{ background:  color}"></div>
              <div style=" align-self: center;">Цвет отображения категории</div>
            </div>

            <q-color
              no-header
              no-footer
              v-model="color"
              default-view="palette"
              :palette="actualPallets"
              class="my-picker"
            />
          </div>
        </q-card-section>
        <q-card-actions align="right" class="text-secondary">
          <q-btn flat label="Отмена" @click="setDialog(false)" v-close-popup/>
          <q-btn flat label="Сохранить" @click="add()" v-close-popup :disable="statusButtonSave"/>
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
    const actualPallets = computed(() => store.getters.actualPallets);
    const categoryList = computed(() => {
        return Object.keys(store.getters.outlays.list).map(function (outlay) {
          return store.getters.outlays.list[outlay].name.toUpperCase();
        });
    });
    let category = ref("");
    let color = ref("#019A9D")
    const setDialog = (status) => {
      store.commit("setStatusDialogAddCategory", status);
    };
    const add = () => {
      store.dispatch("addCategory", {category: category.value, color: color.value})
    }
    const statusButtonSave = computed(() => category.value <= 0 || categoryList.value.includes(category.value.trim().toUpperCase()));
    return {
      prompt: ref(false),
      color,
      actualPallets,
      categoryList,
      rules: [
        val => !!val || 'Заполните поле!',
        val => {
        if(categoryList.value.includes(val.trim().toUpperCase())) {
            return "Такая категория уже существует"
        }
        },
      ],
      dense: ref(false),
      statusButtonSave,
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


