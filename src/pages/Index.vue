<template>
  <q-page class="">
    <div
      @dragleave="onDragLeave"
      @dragover="onDragOver"
      @drop="onDrop"
    >
      <div class="many-block">
        <img
          src="~assets/purse.png" alt="" style="height: 80px">
        <img
          @click="addBalance()"
          draggable="true"
          @dragstart="onDragStart"
          class="banknotes"
          :style="{opacity: showMany}"
          src="~assets/banknotes.png" alt="" style="height: 80px">
      </div>
      <div class="text-secondary" style="font-size: 24px">{{ outlays.balance }}</div>
    </div>
    <div class="q-pa-md row items-start q-gutter-md justify-center">
      <template
        v-for="(outlay, key) in outlays.list"
        v-bind:key="outlay"
        style="display: flex;"
      >
        <q-card
          v-if="!outlay.deleted"
          @click="setDialog(outlay, key)"
          class="my-card">
          <q-card-section
            @dragover="onDragOver"
            @drop="onDrop(outlay.name)"
            :id="outlay.name"
          >
            <div class="box-color" :style="{background: outlay.color}"></div>
            <div class="text-h6">{{ outlay.name }}</div>
            <div class="text-subtitle2">{{ outlay.outlay }}</div>
          </q-card-section>
        </q-card>
      </template>
      <q-card
        @click="openAddCategoryDialog()"
        class="my-card">
        <q-card-section
          @dragover="onDragOver"
          @drop="onDrop()"
        >
          <div class="text-h3">
            <span class="material-icons text-secondary">add_circle_outline</span>
          </div>
        </q-card-section>
      </q-card>
    </div>
    <AddOutlay/>
    <AddBalance/>
  </q-page>
</template>

<script>
import {defineComponent, computed, onMounted} from 'vue';
import {useStore} from "vuex";
import AddOutlay from 'components/AddOutlay.vue'
import AddBalance from "components/AddBalance";


export default defineComponent({
  name: 'PageIndex',
  components: {AddBalance, AddOutlay},
  setup() {
    const store = useStore();
    let showMany = "none"
    const setDialog = (outlay, key) => {
      store.commit("setCurrentOutlay", {outlay: outlay, key: key});
      store.commit("setStatusDialogWaste", true);
    };
    const openAddCategoryDialog = () => {
      store.commit("setStatusDialogAddCategory", true);
    }
    const addBalance = () => {
      store.commit("setStatusDialogBalance", true);
    }
    const outlays = computed(() => store.state.outlays);
    onMounted(() => {
      // store.dispatch("getOutlays")
    })
    return {
      outlays,
      setDialog,
      openAddCategoryDialog,
      addBalance,
      showMany,
      // store the id of the draggable element
      onDragStart(e) {
        showMany = "1"
        e.dataTransfer.setData('text', e.target.id)
        e.dataTransfer.dropEffect = 'move'
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
        Object.keys(outlays.value.list).forEach((key, element) => {
          if (category === outlays.value.list[key].name) {
            setDialog(outlays.value.list[key], key);
          }
        })
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
  cursor: pointer;
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

.box-color {
  width: 10px;
  height: 10px;
  margin-left: -5px;
  margin-top: -5px;
}

.many-block {
  position: relative;
}

.banknotes {
  cursor: pointer;
  position: absolute;
  margin-left: -90px;
  opacity: 0;
}

</style>
