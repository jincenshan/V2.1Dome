<template>
  <el-row :gutter="40" class="panel-group">
    <el-col class="card-panel-col" v-if="buttonArray.includes('main_controller_n')">
      <div class="card-panel" @click="handleSetLineChartData({type:'newVisitis',id:1})">
        <div class="card-panel-icon-wrapper icon-people">
          <svg-icon icon-class="message" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">控制器异常报警</div>
          <div class="card-panel-t">
            <span>待解决</span>
            <span>
            <count-to :start-val="0" :end-val="list.controlExCount" :duration="2600" class="card-panel-num" />项
            </span>
          </div>
        </div>
      </div>
    </el-col>
    <el-col class="card-panel-col"  v-if="buttonArray.includes('main_oxy_n')">
      <div class="card-panel" @click="handleSetLineChartData({type:'messages',id:2})">
        <div class="card-panel-icon-wrapper icon-message">
          <svg-icon icon-class="message" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">制氧机异常报警</div>
          <div class="card-panel-t">
            <span>待解决</span>
            <span>
            <count-to :start-val="0" :end-val="list.oxyExCount" :duration="2600" class="card-panel-num" />
              项</span>
          </div>
        </div>
      </div>
    </el-col>
    <el-col class="card-panel-col"  v-if="buttonArray.includes('main_maintain_n')">
      <div class="card-panel" @click="handleSetLineChartData({type:'purchases',id:3})">
        <div class="card-panel-icon-wrapper icon-money">
          <svg-icon icon-class="message" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">保养计划</div>
          <div class="card-panel-t">
            <span>待保养</span>
            <span>
            <count-to :start-val="0" :end-val="list.planCount" :duration="2600" class="card-panel-num" />
              项</span>
          </div>
        </div>
      </div>
    </el-col>
    <el-col class="card-panel-col" v-if="buttonArray.includes('main_network_n')">
      <div class="card-panel" @click="handleSetLineChartData({type:'shoppings',id:4})">
        <div class="card-panel-icon-wrapper icon-shopping">
          <svg-icon icon-class="message" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-t">
            <span>新增入驻网点</span>
            <count-to :start-val="0" :end-val="list.netCount" :duration="2600" class="card-panel-num" />
          </div>
          <div class="card-panel-t">
            <span>累计</span>
            <count-to :start-val="0" :end-val="list.allNetCount" :duration="2600" class="card-panel-num" />
          </div>
        </div>
      </div>
    </el-col>
    <el-col class="card-panel-col" v-if="buttonArray.includes('main_oxy_operate_n')">
      <div class="card-panel" @click="handleSetLineChartData({type:'shoppings',id:5})">
        <div class="card-panel-icon-wrapper icon-shopping-one">
          <svg-icon icon-class="message" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">制氧机运营</div>
          <div class="card-panel-t">
            <span>新增入库</span>
            <count-to :start-val="0" :end-val="list.inOxyCount" :duration="2600" class="card-panel-num" style="margin-left:20px" />
          </div>
          <div class="card-panel-t">
            <span>新增激活</span>
            <count-to :start-val="0" :end-val="list.actOxyCount" :duration="2600" class="card-panel-num" style="margin-left:20px" />
          </div>
          <div class="card-panel-t" v-if="user.type == 'PLATFORM'">
            <span>累计入库</span>
            <count-to :start-val="0" :end-val="list.allInOxyCount" :duration="2600" class="card-panel-num" />
          </div>
          <div class="card-panel-t" >
            <span>累计激活</span>
            <count-to :start-val="0" :end-val="list.allActOxyCount" :duration="2600" class="card-panel-num" />
          </div>
        </div>
      </div>
    </el-col>
    <el-col class="card-panel-col" v-if="buttonArray.includes('main_c_operate_n')">
      <div class="card-panel" @click="handleSetLineChartData({type:'shoppings',id:6})">
        <div class="card-panel-icon-wrapper icon-shopping-two">
          <svg-icon icon-class="message" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">控制器运营</div>
          <div class="card-panel-t">
            <span>新增入库</span>
            <count-to :start-val="0" :end-val="list.inCtlCount" :duration="2600" class="card-panel-num" style="margin-left:20px" />
          </div>
          <div class="card-panel-t">
            <span>新增激活</span>
            <count-to :start-val="0" :end-val="list.actCtlCount" :duration="2600" class="card-panel-num" style="margin-left:20px" />
          </div>
          <div class="card-panel-t" v-if="user.type == 'PLATFORM'">
            <span>累计入库</span>
            <count-to :start-val="0" :end-val="list.allInCtlCount" :duration="2600" class="card-panel-num" />
          </div>
          <div class="card-panel-t">
            <span>累计激活</span>
            <count-to :start-val="0" :end-val="list.allActCtlCount" :duration="2600" class="card-panel-num" />
          </div>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'

export default {
  components: {
    CountTo
  },
  props:["list"],
  data(){
    return {
      user:JSON.parse(sessionStorage.getItem("user")),
      buttonArray:JSON.parse(sessionStorage.getItem("buttonArray")),
    }
  },
  created() {
    // console.log(this.user.optTypes.indexOf('INVEST'))
  },
  methods: {
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type.type)
      if(type.id == 1){
        this.$router.push({name: 'controller_abnormal'})
      }else if(type.id == 2){
        this.$router.push({name: 'oxygenerator_abnormal'})
      }else if(type.id == 3){
        this.$router.push({name: 'equipment_maintain'})
      }else if(type.id == 4){
        this.$router.push({name: 'operators_dot_list'})
      }else if(type.id == 5 && this.user.type =='PLATFORM'){
        this.$router.push({name: 'oxygenerator_go'})
      }else if(type.id == 6 && this.user.type =='PLATFORM'){
        this.$router.push({name: 'controller_go'})
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;
  width: 100%;

  .card-panel-col {
    margin-bottom: 32px;
    width: 30%;
  }

  .card-panel {
    height: 150px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding-left: 30px;
    padding-right: 30px;
    border-radius: 8px;

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #02DF82;
      }
      .icon-shopping-one {
        background:#E1E100;
      }
       .icon-shopping-two {
        background:#FF5809;
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #02DF82;
    }
    .icon-shopping-one {
      color:#E1E100;
    }
    .icon-shopping-two {
      color:#FF5809;
    }
    .card-panel-icon-wrapper {
      float: left;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
      height: 74px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }
    .card-panel-t {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      font-size: 14px;
      font-weight: 400;
      color: #666;
      white-space: nowrap;
    }
    .card-panel-description {
      font-weight: bold;
      width: 80%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      margin-left: 10px;
      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 16px;
        color: red;
      }
    }
  }
}

@media (max-width: 550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
