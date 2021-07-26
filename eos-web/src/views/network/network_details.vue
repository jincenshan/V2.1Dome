<template>
  <div class="app-container" style="width: 60%;">
    <div class="details_from">
      <el-form :model="ruleForm" :label-position="from_l" :rules="rules" ref="ruleForm" :show-message="false"
               label-width="120px"
               class="demo-ruleForm" :disabled="is_from">
        <el-form-item label="模板名称">
          <el-input v-input-filter:special v-model="ruleForm.name" style="width: 350px" placeholder="请输入模板名称"
                    maxlength="10" :disabled="ruleForm.id?true:false"></el-input>
        </el-form-item>
        <el-form-item label="使用状态">
          <el-select v-model="ruleForm.status" clearable placeholder="请选择使用状态" style="width: 350px">
            <el-option
              v-for="item in option1"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="供氧时段">
          <el-time-select
            placeholder="起始时间"
            v-model="ruleForm.oxySupplyPeriodE"
            :picker-options="{
              start: '00:00',
              step: '00:30',
              end: '23:59'
            }"
            style="width: 165px"
            :disabled="ruleForm.id?true:false"
          >
          </el-time-select>
          <el-time-select
            placeholder="结束时间"
            v-model="ruleForm.oxySupplyPeriodS"
            :picker-options="{
              start: '00:00',
              step: '00:30',
              end: '23:59',
              minTime: ruleForm.oxySupplyPeriodE
            }"
            style="margin-left: 20px;width: 165px"
            :disabled="ruleForm.id?true:false"
          >
          </el-time-select>
          <el-tooltip class="item" effect="dark" content="应用此供氧时段，系统将只会在该时段供氧。其他时段不供氧" placement="right-end">
            <i class="el-icon-question" style="width: 20px;height: 20px;margin-left: 15px"></i>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="供氧配额">
          <el-input v-model="ruleForm.oxySupplyQuota" placeholder="" maxlength="20" style="width: 165px" :disabled="ruleForm.id?true:false" v-input-filter:int></el-input>
          <span style="margin-left: 20px">m³/月</span>
          <el-tooltip class="item" effect="dark" content="每月该网点的供氧总额，如设置100立方米，将该户已供氧到达此上限，终端将会不供氧" placement="right-end">
            <i class="el-icon-question" style="width: 20px;height: 20px;margin-left: 15px"></i>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="价格管理">
          <div v-for="(item,index) in ruleForm.templatePrices" :key="index">
            <div class="block" style="align-items: center">
              <el-input v-model="item.quotaS" placeholder="" maxlength="20" style="width: 70px" :disabled="ruleForm.id?true:false" v-input-filter:price></el-input>
              <span style="margin-left: 25px;margin-right: 25px">-</span>
              <el-input v-model="item.quotaE" placeholder="" maxlength="20" style="width: 70px" :disabled="ruleForm.id?true:false" v-input-filter:price></el-input>
              <span style="margin-left: 25px;margin-right: 25px">m³/月</span>
              <el-input v-model="item.price" placeholder="" maxlength="20" style="width: 70px" :disabled="ruleForm.id?true:false" v-input-filter:price></el-input>
              <span style="margin-left: 20px;margin-right: 20px">元</span>
              <i class="el-icon-circle-plus" style="color: red;font-size: 25px" v-if="index==0 && !ruleForm.id" @click="addShow()"></i>
            </div>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">
            保存
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import VDistpicker from "v-distpicker";
  import {netoxytemplateAdd, netoxytemplateDetail, netoxytemplateUpdate} from '@/api/table'
  import {getBaseUrl} from '@/utils/auth'
  import inputFilter from '@/utils/input.js'

  export default {
    name: 'network_details',
    directives: {
      inputFilter
    },
    components: {VDistpicker},
    data() {
      return {
        type: '',
        user: JSON.parse(sessionStorage.getItem("user")),
        buttonArray: JSON.parse(sessionStorage.getItem("buttonArray")),
        from_l: 'left',
        is_from: false,
        option1: [
          {
            value: '0',
            label: '停止运行'
          },
          {
            value: '1',
            label: '正常运行'
          }
        ],
        ruleForm: {
          id: '',
          name: '',
          oxySupplyPeriodE: "",
          oxySupplyPeriodS: "",
          oxySupplyQuota:'',
          templatePrices: [{
            price:'',
            quotaE:'',
            quotaS:'',
          }],
          status: '1',
        },
        rules: {
          name: [{required: true, message: "请输入", trigger: 'blur'}],
        },
      }
    },
    created() {
      this.id = this.$router.currentRoute.query.id
      if (this.id) {
        netoxytemplateDetail(this.id).then(res => {
          if (res.code != 0) {
            this.ruleForm= {
              id: res.data.id,
              name:res.data.name,
              oxySupplyPeriodE:res.data.oxySupplyPeriodE,
              oxySupplyPeriodS:res.data.oxySupplyPeriodS,
              oxySupplyQuota:res.data.oxySupplyQuota,
              templatePrices:res.data.templatePrices,
              status:res.data.status,
            }
          }
        })
      }
    },
    methods: {
      submitForm(formName) {
        if (!this.ruleForm.id) {
          if(this.ruleForm.name == ""){
            this.$message.error("请输入模板名称")
            return
          }
          var prices_arr = this.ruleForm.templatePrices
          for (var i in prices_arr){
            if(i == 0 && parseIntprices_arr[i].quotaS != 0){
              this.$message.error("初始阶梯价格由零开始")
              return
            }
            if(parseInt(prices_arr[i].quotaS) > parseInt(prices_arr[i].quotaE)){
              this.$message.error("阶梯价格错误")
              return
            }
            if(i != 0 && (parseInt(prices_arr[i].quotaS) != parseInt(prices_arr[i-1].quotaE))){
              this.$message.error("阶梯价格错误")
              return
            }
          }
          let add_data = {
            id: this.ruleForm.id,
            name:this.ruleForm.name,
            oxySupplyPeriodE:this.ruleForm.oxySupplyPeriodE,
            oxySupplyPeriodS:this.ruleForm.oxySupplyPeriodS,
            oxySupplyQuota:this.ruleForm.oxySupplyQuota,
            templatePrices:this.ruleForm.templatePrices,
            status:this.ruleForm.status,
          }
          netoxytemplateAdd(add_data).then(res => {
            if (res.code != 0) {
              this.$router.go(-1);
            }
          })
        } else {
          let update_data = {
            templateId: this.ruleForm.id,
            status:this.ruleForm.status,
          }
          netoxytemplateUpdate(update_data).then(res => {
            if (res.code != 0) {
              this.$router.go(-1);
            }
          })
        }
      },
      addShow(){
        if(this.ruleForm.templatePrices.length== 4 ){
          this.$message("最多只能添加四个阶梯价格")
        }else {
          this.ruleForm.templatePrices.push({
            price:'',
            quotaE:'',
            quotaS:'',
          })
        }
      }
    },
  }
</script>

<style scoped>

  .details_from {
    width: 70%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 50px;
    border: 1px solid #CECECE;
    border-radius: 10px;
    margin-left: 100px;
    margin-top: 100px;
  }
</style>
<style>
  .block {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    flex-flow: wrap;
    margin-bottom: 20px;
  }

  .el-input__inner {
    height: 30px;
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

  .el-checkbox-button.is-checked .el-checkbox-button__inner {
    background-color: #20a0ff;
  }
</style>
