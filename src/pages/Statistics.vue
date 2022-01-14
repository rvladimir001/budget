<template>
  <div>
    <div class="text-secondary" style="font-size: 22px;">Баланс: {{ balance }}</div>
    <div class="text-red" style="font-size: 22px;">Расходы: <span>{{ sumOutlays }}</span></div>
  </div>
  <div style="display: flex; justify-content: center">
    <div>
      <vue3-chart-js v-bind="{ ...doughnutChart }" style="width: 140%;"/>
<!--      <pre>{{rows}}</pre>-->
<!--      <q-table-->
<!--        title="Treats"-->
<!--        dense-->
<!--        :rows="rows"-->
<!--        :columns="columns"-->
<!--        row-key="name"-->
<!--      />-->
    </div>
  </div>
</template>

<script>
import Vue3ChartJs from "@j-t-mcc/vue3-chartjs";
import {useStore} from "vuex";
import {computed, ref} from "vue";

export default {
  name: "Statistics",
  components: {
    Vue3ChartJs,
  },
  setup() {
    const store = useStore();
    const outlays = computed(() => store.state.outlays.list);
    const balance = computed(() => store.state.outlays.balance);
    const sumOutlays = computed(() => {
      return Object.keys(outlays.value).reduce(function (accumulator, currentValue) {
        return accumulator + outlays.value[currentValue].outlay;
      }, 0)
    })
    const actualData = computed(() => {
      const data = {labels: [], data: [], color: []}
      for (let category in outlays.value) {
        data.labels.push(outlays.value[category].name)
        data.data.push(outlays.value[category].outlay)
        data.color.push(outlays.value[category].color)
      }
      return data
    });
    const doughnutChart = {
      type: "doughnut",
      data: {
        labels: actualData.value.labels,
        datasets: [
          {
            backgroundColor: actualData.value.color,
            data: actualData.value.data,
          },
        ],
      },
    };
//     const rows = ref(Object.values(outlays))
//     const columns = ref([
//   {
//     name: 'name',
//     required: true,
//     label: 'Наименование',
//     align: 'left',
//     field: name,
//     format: val => `${val}`,
//     sortable: true
//   },
//   { name: 'outlay', align: 'center', label: 'Траты', field: 'outlay', sortable: true },
// ])

    return {
      doughnutChart,
      outlays,
      // rows,
      // columns,
      actualData,
      sumOutlays,
      balance
    };
  },
}
</script>

<style scoped>

</style>
