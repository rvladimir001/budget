<template>
  <h2>Текущие траты</h2>
  <div style="max-width: 400px">
    <vue3-chart-js v-bind="{ ...doughnutChart }"/>
  </div>
</template>

<script>
import Vue3ChartJs from "@j-t-mcc/vue3-chartjs";
import {useStore} from "vuex";
import {computed} from "vue";

export default {
  name: "Statistics",
  components: {
    Vue3ChartJs,
  },
  setup() {
    const store = useStore();
    const outlays = computed(() => store.state.outlays.list);
    const actualData = computed(() => {
      const data = {labels: [], data: []}
      for (let category in outlays.value) {
        data.labels.push(outlays.value[category].name)
        data.data.push(outlays.value[category].outlay)
      }
      return data
    });
    const doughnutChart = {
      type: "doughnut",
      data: {
        labels: actualData.value.labels,
        datasets: [
          {
            backgroundColor: ["#41B883", "#E46651", "#00D8FF", "#DD1B16"],
            data: actualData.value.data,
          },
        ],
      },
    };

    return {
      doughnutChart,
      outlays,
      actualData
    };
  },
}
</script>

<style scoped>

</style>
