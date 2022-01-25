<template>
  <div style="margin-top: 10px">
    <div class="text-red" style="font-size: 22px;">Расходы: {{ sumOutlays }}</div>
  </div>
  <div class="wrapper">
    <div v-if="sumOutlays">
      <vue3-chart-js v-bind="{ ...doughnutChart }" style="width: 100%;"/>
      <div class="q-pa-md">
        <q-checkbox v-model="showTable" label="Отобразить ввиде таблицы" color="teal" class="text-secondary"/>
        <q-table
          v-show="showTable"
          :rows="rows"
          :columns="columns"
          :rows-per-page-options="[0]"
          hide-bottom
          row-key="name"
          class="text-secondary"
        />
      </div>
      <div v-if="archiveData">
        <div class="block-date">
          <q-select
            color="secondary"
            class="block-date-select first"
            v-model="currentYear"
            :options="optionsBars"
            label="Год"
            @update:model-value="updateChart()"
          >
            <template v-slot:prepend>
              <q-icon name="event"/>
            </template>
          </q-select>
        </div>
        <vue3-chart-js v-bind="{ ...barChart }" ref="chartRef"/>
      </div>
    </div>
  </div>
</template>

<script>
import Vue3ChartJs from "@j-t-mcc/vue3-chartjs";
import {useStore} from "vuex";
import {computed, onMounted, onBeforeMount, ref} from "vue";

export default {
  name: "Statistics",
  components: {
    Vue3ChartJs,
  },
  setup() {
    const store = useStore();
    const chartRef = ref(null);
    const currentDate = ref(null);
    const currentYear = ref(new Date().getFullYear());
    onBeforeMount(() => {
      store.dispatch("getArchive")
    });
    onMounted(() => {
      if(sumOutlays.value){
        updateChart()
      }
    });
    const defaultYear = computed(() => {
      if (currentYear.value) {
        return currentYear.value;
      }
      return new Date().getFullYear();
    })
    const outlays = computed(() => store.state.outlays.list);
    const balance = computed(() => store.state.outlays.balance);
    const sumOutlays = computed(() => {
      const sum = Object.keys(outlays.value).reduce(function (accumulator, currentValue) {
        return accumulator + outlays.value[currentValue].outlay;
      }, 0)
      if (sum) {
        return sum
      }
      return 0
    })
    const actualData = computed(() => {
      const data = {labels: [], data: [], color: []}
      for (let category in outlays.value) {
        data.labels.push(outlays.value[category].name);
        data.data.push(outlays.value[category].outlay);
        data.color.push(outlays.value[category].color);
      }
      return data
    });
    const archiveData = computed(() => store.state.archiveData);
    const maxValue = computed(() => {
      if (archiveData.value) {
        const max = Math.max(...Array.from(archiveData.value[String(defaultYear.value)]["data"]));
        return max + max * 15 / 100;
      }
      return 100;
    });
    const optionsBars = computed(() => {
      if (archiveData.value) {
        return Object.keys(archiveData.value);
      }
      return []
    })
    const doughnutChart = {
      type: "pie",
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
    const rows = computed(() => {
      return Object.values(outlays.value);
    })
    const columns = ref([
      {
        name: 'name',
        required: true,
        label: 'Наименование',
        align: 'left',
        field: row => row.name,
        format: val => `${val}`,
        sortable: true,
      },
      {name: 'outlay', align: 'center', label: 'Траты, руб.', field: 'outlay', sortable: true},
    ])
    const barChart = {
      type: "bar",
      options: {
        plugins: {
          legend: {
            position: false,
          },
        },
        scales: {
          y: {
            min: 0,
            max: maxValue.value,
          },
        },
      },
      data: {
        labels: ["Январь"],
        datasets: [
          {
            backgroundColor: "#1abc9c",
            data: ["300"],
          },
        ],
      },
    };
    const updateChart = () => {
      barChart.options.plugins.title = {
        text: 'Updated Chart',
        display: true
      }
      barChart.options.scales.y.max = maxValue.value;
      barChart.data.labels = Array.from(archiveData.value[String(defaultYear.value)]["label"]);
      barChart.data.datasets = [
        {
          backgroundColor: "#1abc9c",
          data: Array.from(archiveData.value[String(defaultYear.value)]["data"])
        }
      ]
      chartRef.value.update(250);
    }
    return {
      showTable: ref(true),
      currentDate,
      doughnutChart,
      barChart,
      outlays,
      rows,
      columns,
      actualData,
      sumOutlays,
      balance,
      archiveData,
      optionsBars,
      currentYear,
      defaultYear,
      chartRef,
      updateChart
    };
  },
}
</script>

<style scoped>
.wrapper {
  display: flex;
  justify-content: center;
}

.block-date {
  margin-left: 15%;
}

.block-date-select {
  width: 90%;
}

.first {
  margin-right: 20px;
}
</style>
