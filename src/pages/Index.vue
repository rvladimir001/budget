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
        v-for="spending in startingSpendings"
        v-bind:key="spending"
        class="my-card">
        <q-card-section
          @dragover="onDragOver"
          @drop="onDrop(spending.name)"
          :id="spending.name"
        >
          {{ spending.name }}
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import {defineComponent, ref, onMounted} from 'vue';

export default defineComponent({
  name: 'PageIndex',
  setup() {
    const startingSpendings = ref([
      {name: "Продукты"},
      {name: "Бытовая химия"},
      {name: "Еда вне дома"},
      {name: "Транспорт"},
      {name: "Одежда/Обувь"},
      {name: "Развлечения"},
      {name: "Услуги"}
    ]);

    onMounted(() => {
    })

    return {
      startingSpendings,

      // store the id of the draggable element
      onDragStart(e) {
        console.log("e.target.id", e)
        e.dataTransfer.setData('text', e.target.id)
        // e.dataTransfer.dropEffect = 'move'
      },

      // onDragEnter(e) {
      //   // don't drop on other draggables
      //   if (e.target.draggable !== true) {
      //     e.target.classList.add('drag-enter')
      //   }
      // },

      onDragLeave(e) {
        e.target.classList.remove('drag-enter')
      },

      onDragOver(e) {
        e.preventDefault()
      },

      onDrop(category) {
        console.log("category", category)

      }
    }
  }
})
</script>
<style scoped>
.my-card {
  width: 100%;
  max-width: 200px;
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
