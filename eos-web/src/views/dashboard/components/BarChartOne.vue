<template>
  <div :class="list.className" :style="{height:list.height,width:list.width}" />
</template>

<script>
  import echarts from 'echarts'
  require('echarts/theme/macarons') // echarts theme
  import resize from './mixins/resize'

  const animationDuration = 6000

  export default {
    mixins: [resize],
    props: {
      list:'',
      // className: {
      //   type: String,
      //   default: 'chart'
      // },
      // width: {
      //   type: String,
      //   default: '100%'
      // },
      // height: {
      //   type: String,
      //   default: '300px'
      // }
    },
    data() {
      return {
        chart: null
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.initChart()
      })
    },
    beforeDestroy() {
      if (!this.chart) {
        return
      }
      this.chart.dispose()
      this.chart = null
    },
    methods: {
      initChart() {
        this.chart = echarts.init(this.$el, 'macarons')

        this.chart.setOption({
          tooltip: {
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
              type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          grid: {
            top: 10,
            left: '2%',
            right: '2%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [{
            type: 'category',
            data: ['阳光小区', '孜城小区', '昌雄小区', '曲水县', '林间小区', '拉萨政厅'],
            axisTick: {
              alignWithLabel: true
            }
          }],
          yAxis: [{
            type: 'value',
            axisTick: {
              show: false
            }
          }],
          series: [{
            name: '氧气用量',
            type: 'bar',
            stack: 'vistors',
            barWidth: '60%',
            data: [179, 52, 200, 334, 390, 330, 220],
            animationDuration
          }]
        })
      }
    }
  }
</script>
