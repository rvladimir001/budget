<template>
  <h2>Pie Chart</h2>
  <div style="max-width: 400px">
    <vue3-chart-js v-bind="{ ...doughnutChart }" />
  </div>
</template>

<script>
import Vue3ChartJs from "@j-t-mcc/vue3-chartjs";

export default {
  name: "Statistics",
  components: {
    Vue3ChartJs,
  },
  setup() {
    const doughnutChart = {
      type: "doughnut",
      data: {
        labels: ["VueJs", "EmberJs", "ReactJs", "AngularJs"],
        datasets: [
          {
            backgroundColor: ["#41B883", "#E46651", "#00D8FF", "#DD1B16"],
            data: [40, 20, 80, 10],
          },
        ],
      },
    };

    return {
      doughnutChart,
    };
  },
}
</script>

<style scoped>

</style>
