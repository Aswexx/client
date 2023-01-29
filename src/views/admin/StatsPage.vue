<template>
  <div class="stats">
    <PageInfoBar/>
    

    <div class="chart">
      <div class="selector">
        <div class="single-selector">
          <label class="typo__label">選擇比較基準</label>
          <multiselect 
            v-model="singleSelectValue" 
            :options="singleSelectOptions" 
            :searchable="false" 
            :close-on-select="true" 
            :show-labels="false" 
            placeholder="請選擇比較基準">
          </multiselect>
        </div>

        <div class="multi-selector">
          <label class="typo__label">選擇使用者</label>
          <multiselect 
            class="user-selector"
            v-model="multiSelectValues" 
            :options="multiSelectOptions"
            :multiple="true"
            :close-on-select="false" 
            :clear-on-select="false" 
            :preserve-search="true"
            :max="10"
            placeholder="選擇或輸入使用者別名查詢" label="userName" 
            track-by="userName" 
          >
            <template slot="selection" slot-scope="{ values, isOpen }">
              <span class="multiselect__single"
                v-if="values.length && !isOpen"
              >
                已選擇{{ multiSelectValues.length }}位
              </span>
            </template>
          </multiselect>
        </div>
        <button @click="downloadUserStats">導出.csv檔</button>
        
      </div>
      <HorizontalBar :chartData="barData" :options="barOptions"/>

    </div>

    <div class="chart">
      <div class="date-picker">
        <label>選擇觀察期間</label>
        <date-picker v-model="dateRange" range></date-picker>
        <button @click="downloadPeriodStats">導出.csv檔</button>
      </div>
      <LineChart :chartData="chartData" :options="options"/>
    </div>


  </div>
</template>

<script>
import PageInfoBar from '../../components/PageInfoBar.vue'
import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css'
import LineChart from '../../components/LineChart.vue'
import HorizontalBar from '../../components/HorizontalBar.vue'
import Multiselect from 'vue-multiselect'
import axios from 'axios'

export default {
  name: 'StatsPage',
  data() {
    return {
      dateRange: null,
      periodStats: [],

      // * horizontal bar
      barData: {
        labels: [],
        datasets: [{
          label: '發文總數',
          data: [],
          // backgroundColor: this.gradient
          backgroundColor: "#FC766A"
        }]
      },
      
      barOptions: {
        responsive: true,
        maintainAspectRatio: true,
        title: {
          display: true,
          text: "使用者數據比較",
        },
        scales: {
          yAxes: [{
            gridLines: {
              color: 'gray'
            }
          }],
          xAxes: [{
            gridLines: {
              color: 'gray'
            }
          }]
        }
      },

      // * line chart
      chartData: {
        labels: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],
        datasets: [
          {
            label: "時段發文次數",
            data: [],
            backgroundColor: "#FED2CE",
            borderColor: "#FC766A",
            pointBackgroundColor: "#FC766A"
          }
        ]
      },

      options: {
        responsive: true,
        maintainAspectRatio: false,
        title: {
          display: true,
          text: "發文時段分佈(小時)",
        },
        scales: {
          yAxes: [{
            gridLines: {
              color: 'gray'
            }
          }],
          xAxes: [{
            gridLines: {
              color: 'gray'
            }
          }]
        }
      },

      // * single selector
      singleSelectValue: '發文總數',
      singleSelectOptions: ['發文總數','評論總數','被追蹤數'],

      // * multiselector
      multiSelectValues: [],

      csvURL: '',
    }
  },
  components: { PageInfoBar, DatePicker, LineChart, HorizontalBar, Multiselect },
  computed: {
    multiSelectOptions(){
      const users = this.$store.getters.users
      return users.map((user) => {
        return {
          userName: user.name, 
          ...user._count
        }
      })
    }
  },
  watch:{
    async dateRange(newVal){
      if (!newVal[0]) return
      const { data } = await axios.post(
        `${this.$store.state.API_URL}/posts/createdTime`, {
            startDate: newVal[0],
            endDate: newVal[1]
          }
        )

      const mappedData = data.map((e) => {
        return new Date(e.createdAt)
      })

      this.periodStats = mappedData

      // * index of chartData represents hours
      const dataSet = Array.from({ length: 24 }, () => 0)
      mappedData.forEach((date) => {
        dataSet[date.getHours()]++
      })

      this.chartData.datasets[0].data = dataSet

      this.chartData = { ...this.chartData } // * make chart reactive
    } ,
    multiSelectValues(newVal) {
      this.barData.labels = newVal.map(e => e.userName)
      this.barData = { ...this.barData }

      const criteria = this.singleSelectValue
      const prop = 
        criteria === '發文總數'
        ? 'posts'
        : criteria === '評論總數'
        ? 'comments'
        : 'followed'


      this.barData.datasets[0].data = newVal.map(e => e[prop])
    },
    singleSelectValue(newVal) {
      const prop = 
        newVal === '發文總數'
        ? 'posts'
        : newVal === '評論總數'
        ? 'comments'
        : 'followed'
      
      this.barData.datasets[0].data = this.multiSelectOptions.map(e => e[prop])
      this.barData.datasets[0].label = newVal
      this.barData = { ...this.barData }
    }
  },
  methods: {
    downloadUserStats() {
      const users = this.$store.getters.users
      const columnTitles = '名字,追蹤人數,被追蹤數,發文數,評論數\n'
      let csvContents = columnTitles
      users.forEach(user => {
        csvContents += user.name + ',' + Object.values(user._count).toString() + '\n'
      })

      this.triggerDownload(csvContents, '使用者操作次數.csv')
    },
    downloadPeriodStats() {
      const daily = new Map()
      const columnTitles = Array.from({ length: 24 }, (value, key) => {
        return `${key}時至${key+1}時`
      })
      let csvContents = '日期,' + columnTitles + '\n'

      this.periodStats.forEach(date => {
        daily.set(
          `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
          Array.from({ length: 24 }, () => 0))
      })

      this.periodStats.forEach(date => {
        const dateString = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
        const recordArr = daily.get(dateString)

        recordArr[date.getHours()]++
      })

      daily.forEach((value, key) => {
        csvContents = csvContents + `${key},${value.toString()}\n`
      })

      this.triggerDownload(csvContents, '發文頻率資料.csv')
    },
    triggerDownload(csvContents, fileName) {
      const anchorTag = document.createElement('a')
      const blob = new Blob(['\uFEFF' + csvContents], { type: 'text/csv;charset=utf-8,' })
      const csvUrl = URL.createObjectURL(blob)

      anchorTag.href = csvUrl
      anchorTag.download = fileName
      anchorTag.click()
    }
  },
  beforeCreate(){
    this.$store.dispatch('userAbout/getUsers')
  },
}
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<style lang="scss" scoped>
  @import '~vue2-datepicker/scss/index.scss';

  .stats {
    grid-column: 2 / 4;
    width: 90%;
  }

  .chart {
    display: flex;
    justify-content: space-between;
    padding-top: 1rem;
  }

  .date-picker {
    width: 20rem;
  }

  button {
    margin-top: 2rem;
  }

</style>