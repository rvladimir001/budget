<template>
  <q-page class="">
    <div
      @dragleave="onDragLeave"
      @dragover="onDragOver"
      @drop="onDrop"
    >
      <img
        draggable="true"
        @dragstart="onDragStart"
        class="banknotes"
        src="~assets/banknotes.png" alt="" style="height: 80px">
    </div>
    <div class="q-pa-md row items-start q-gutter-md">
      <q-card
        v-for="(outlay, key) in outlays.list"
        v-bind:key="outlay"
        @click="setDialog(outlay, key)"
        class="my-card">
        <q-card-section
          @dragover="onDragOver"
          @drop="onDrop(outlay.name)"
          :id="outlay.name"
        >
          <div class="text-h6">{{ outlay.name }}</div>
          <div class="text-subtitle2">{{ outlay.outlay }}</div>
        </q-card-section>
      </q-card>
      <q-card
        @click="openAddCategoryDialog(true)"
        class="my-card">
        <q-card-section
          @dragover="onDragOver"
          @drop="onDrop()"
        >
          <div class="text-h3">
            <span class="material-icons">add_circle_outline</span>
          </div>
        </q-card-section>
      </q-card>
    </div>
    <AddOutlay/>
    <AddCategory/>
  </q-page>
</template>

<script>
import {defineComponent, computed, onMounted} from 'vue';
import {useStore} from "vuex";
import AddOutlay from 'components/AddOutlay.vue'
import AddCategory from '../components/AddCategory.vue'

export default defineComponent({
  name: 'PageIndex',
  components: {AddOutlay, AddCategory},
  setup() {
    const store = useStore();
    const setDialog = (outlay, key) => {
      store.commit("setCurrentOutlay", {outlay: outlay, key: key});
      store.commit("setStatusDialogWaste", true);
    };
    const openAddCategoryDialog = () => {
      store.commit("setStatusDialogAddCategory", true);
    }
    const outlays = computed(() => store.state.outlays);
    onMounted(() => {
      // store.dispatch("getOutlays")
    })
    return {
      outlays,
      setDialog,
      openAddCategoryDialog,
      // store the id of the draggable element
      onDragStart(e) {
        console.log("e.target.id", e)
        e.dataTransfer.setData('text', e.target.id)
        // e.dataTransfer.dropEffect = 'move'
      },

      onDragEnter(e) {
        // don't drop on other draggables
        if (e.target.draggable !== true) {
          e.target.classList.add('drag-enter')
        }
      },

      onDragLeave(e) {
        e.target.classList.remove('drag-enter')
      },

      onDragOver(e) {
        e.preventDefault()
      },

      onDrop(category) {
        console.log("category", category);
        setDialog();
      }
    }
  }
})
</script>
<style scoped>
.my-card {
  width: 100%;
  max-width: 150px;
  height: 100px;
}

.drop-target {
  height: 400px;
  width: 200px;
  min-width: 200px;
  background-color: silver;
}

.drag-enter {
  outline-style: dashed;
}

.box {
  width: 100px;
  height: 100px;
  float: left;
  cursor: pointer;
}

@media only screen and (max-width: 500px) {
  .drop-target {
    height: 50px;
    width: 50px;
    min-width: 100px;
    background-color: silver;
  }

  .box {
    width: 50px;
    height: 50px;
  }
}

.box:nth-child(3) {
  clear: both;
}

.banknotes {
  cursor: pointer;
}

</style>
