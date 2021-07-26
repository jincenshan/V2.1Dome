<template>
  <div class="dashboard-container">
    <div class="block" >
      <div>
        <v-distpicker :province="select.province" :city="select.city" :area="select.area" @selected="selectShow" @province="onChangeProvince" @city="onChangeCity"></v-distpicker>
      </div>
      <el-select v-model="productLine" clearable multiple placeholder="请选择产品线" style="margin-left: 10px;width: 300px">
        <el-option
          v-for="item in option_productLine"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-select v-model="dateType" clearable placeholder="请选择时间" style="margin-right: 10px;margin-left: 10px">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-radio-group v-model="day" v-if="dateType == 'DAY'">
        <el-radio-button label="TODAY">今天</el-radio-button>
        <el-radio-button label="YESTERDAY">昨天</el-radio-button>
      </el-radio-group>
      <el-radio-group v-model="week" v-if="dateType == 'WEEK'">
        <el-radio-button label="THIS_WEEK">本周</el-radio-button>
        <el-radio-button label="LAST_WEEK">上周</el-radio-button>
      </el-radio-group>
      <el-radio-group v-model="month" v-if="dateType == 'MONTH'">
        <el-radio-button label="THIS_MONTH">本月</el-radio-button>
        <el-radio-button label="LAST_MONTH">上月</el-radio-button>
      </el-radio-group>
      <el-date-picker
        v-model="value1"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        v-if="dateType == 'DURATION'"
      />
      <el-button type="primary" style="margin-left:50px" @click="searchShow()" v-if="buttonArray.includes('main_search_n')">查询</el-button>
      <el-button type="warning" @click="resetForm()">重置</el-button>
    </div>
    <panel-group
      style="display: flex;flex-direction: row;justify-content: flex-start;flex-flow: wrap;"
      @handleSetLineChartData="handleSetLineChartData"
      :list="list"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PanelGroup from './components/PanelGroup'
import VDistpicker from "v-distpicker";
import {parseTime} from "@/utils";
import {mainTable} from "@/api/user";
import {getBaseUrl, getToken} from "@/utils/auth";
const lineChartData = {
  newVisitis: {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145]
  },
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130]
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130]
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130]
  }
}

export default {
  name: 'dashboard',
  components: {
    PanelGroup,
    VDistpicker
  },
  data() {
    return {
      lineChartData: lineChartData.newVisitis,
      user:JSON.parse(sessionStorage.getItem("user")),
      buttonArray:JSON.parse(sessionStorage.getItem("buttonArray")),
      value1: [],
      userInfo:{},
      select: {province: '', city: '', area: ''},
      provinceCode:"",
      provinceName:"",
      cityName:"",
      cityCode:"",
      regionName:"",
      regionCode:"",
      day:"",
      month:"",
      week:"",
      options: [
        {
          value: 'DAY',
          label: '天'
        },
        {
          value: 'WEEK',
          label: '周'
        },
        {
          value: 'MONTH',
          label: '月'
        },
        {
          value: 'DURATION',
          label: '时间段'
        }
      ],
      dateType:'',
      list:[],
      option_productLine:[{
        value: 'EOS',
        label: '标准化安全氧疗'
      },{
        value: 'OXY',
        label: '氧调'
      },{
        value: 'BBY',
        label: '抱抱氧'
      }],
      productLine:sessionStorage.getItem('productLine').split(','),
    }
  },
  computed: {
    ...mapGetters(['name'])
  },
  created() {
    this.searchShow()
  },
  methods: {
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
    },
    selectShow(data){
      this.provinceCode = data.province.code
      this.provinceName = data.province.value
      this.cityName = data.city.value
      this.cityCode = data.city.code
      this.regionName = data.area.value
      this.regionCode = data.area.code
    },
    onChangeProvince(data){
      this.provinceCode = data.code
      this.provinceName = data.value
    },
    onChangeCity(data){
      this.cityName = data.value
      this.cityCode = data.code
    },
    resetForm(){
      this.dateType =''
      this.cityName = ''
      this.cityCode =''
      this.provinceCode = ''
      this.provinceName = ''
      this.regionName = ''
      this.regionCode = ''
      this.value1 =[]
      this.select = {}
      this.productLine = []
      this.searchShow()
    },
    searchShow(){
      if(this.dateType == 'DURATION' && this.value1.length == 0){
        this.$message.error("请先选具体时间段")
        return
      }
      var params = {
        cityCode: this.cityCode,
        dateType: this.dateType?this.dateType:'DAY',
        day: this.dateType == 'DAY'?this.day:'TODAY',
        endTime: this.value1[1] ? parseTime(this.value1[1]).substring(0, 10) + ' 23:59:59' : '',
        month: this.dateType == 'MONTH'?this.month:"",
        provinceCode:this.provinceCode,
        regionCode:this.regionCode,
        startTime: this.value1[0]?parseTime(this.value1[0]).substring(0,10)+' 00:00:00':'',
        week: this.dateType == 'WEEK'?this.week:"",
        productLine:this.productLine.toString(),
        token:getToken(),
      }
      mainTable(params).then(res=>{
        this.list = res.data
      })
    },
  },
  mounted() {
    this.$store.commit("user/GET_USERINFO");
    this.userInfo = this.$store.getters.userInfo;
    // alert(JSON.stringify(this.$store.getters.userInfo));
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin-top: 50px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.block {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  flex-flow: nowrap;
  margin-bottom: 20px;
  height: 30px;
}

.input_class {
  width: 150px;
  display: flex;
  margin-right: 10px;
}
.dashboard-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }
  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
<style>
  .el-date-editor .el-range-separator {
    height: auto;
  }

  .el-input__icon {
    height: auto;
  }

  .el-input__inner {
    height: 30px;
  }

  .el-tabs__content {
    position: static;
  }

  .el-form-item {
    margin-bottom: 10px;
  }

  .distpicker-address-wrapper select {
    height: 30px;
    padding: 0 15px;
    font-size: 14px;
    background-color: #FFF;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #DCDFE6
  }
  .el-radio-button__inner{
    padding: 7px 9px;
    font-size: 13px;
  }
  .el-button{
    padding: 6px 9px;
  }
  .el-input__icon{
    line-height: 30px !important;
    height: 30px !important;
  }
</style>
