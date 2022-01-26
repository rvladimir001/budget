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
            autofocus @keyup.enter="prompt = false"/>

          <div class="q-pa-md">
            <div style="display: flex">
              <div style="width: 20px; height: 20px; margin: 5px" :style="{ background:  defaultColor}"></div>
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
          <q-btn flat label="Отмена" @click="close" v-close-popup/>
          <q-btn flat label="Сохранить" @click="save" v-close-popup :disable="statusButtonSave"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import {computed, ref, watch} from 'vue'
import {useStore} from "vuex";

export default {
  name: "AddCategory",
  setup() {
    const store = useStore();
    const status = computed(() => store.state.statusDialogCategory);
    const actualPallets = computed(() => store.getters.actualPallets);
    const editCategory = computed(() => store.getters.editCategory);
    const categoryList = computed(() => {
      return Object.keys(store.getters.outlays.list).map(function (outlay) {
        if(!store.getters.outlays.list[outlay].deleted){
          return store.getters.outlays.list[outlay].name.toUpperCase();
        }
      });
    });
    const defaultColor = computed(() => {
      if (color.value !== "") {
        return color.value
      }
      return actualPallets.value[0]
    });
    let category = ref("");
    let color = ref("");
    watch(() => editCategory.value, (first, second) => {
        if(first) {
          category.value = editCategory.value.name
          color.value = editCategory.value.color
        }
    });

    const close = () => {
      store.commit("setEditCategory", null);
      color.value = ""
      category.value = ""
      store.commit("setStatusDialogAddCategory", false);
    };
    const save = () => {
      if(editCategory.value){
        store.dispatch("editCategory", {category: category.value, color: color.value, key: editCategory.value.key});
      } else {
        if(color.value === ""){
          color.value = defaultColor.value
        }
        store.dispatch("addCategory", {category: category.value, color: color.value});
      }
      close();
    }
    const statusButtonSave = computed(() => category.value.length > 30 || category.value <= 0 || (!editCategory.value && categoryList.value.includes(category.value.trim().toUpperCase())));
    return {
      prompt: ref(false),
      color,
      defaultColor,
      actualPallets,
      categoryList,
      rules: [
        val => !!val || 'Заполните поле!',
        val => {
          if (!editCategory.value && categoryList.value.includes(val.trim().toUpperCase())) {
            return "Такая категория уже существует!"
          }
        },
        val => {
          if (val.length > 30) {
            return "Наименование категории не должно превышать 30 символов!"
          }
        },
      ],
      dense: ref(false),
      statusButtonSave,
      category,
      editCategory,
      save,
      status,
      close
    }
  }
}
</script>

<style scoped>
</style>

