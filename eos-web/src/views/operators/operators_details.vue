<template>
  <el-tabs type="border-card" v-model="pane_name" @tab-click="computerList()" style="margin-top: 50px">
    <el-tab-pane label="运营商详情" name="on">
      <div class="dashboard-container">
        <div class="details_from">
          <el-form :model="ruleForm" :label-position="from_l" :rules="rules" ref="ruleForm" :show-message="false"
                   label-width="120px"
                   class="demo-ruleForm" :disabled="is_from">
            <el-form-item v-if="ruleForm.id" label="运营商编号" prop="id">
              <span>{{ ruleForm.id }}</span>
            </el-form-item>
            <el-form-item label="运营商名称" prop="name">
              <el-input v-input-filter:special v-model="ruleForm.name" style="width: 350px" placeholder="请输入运营商名称"
                        maxlength="30" :disabled="ruleForm.id?true:false"></el-input>
            </el-form-item>
            <el-form-item label="建行商户号">
              <el-input v-input-filter:special v-model="ruleForm.mktMrchId" style="width: 350px" placeholder="请输入建行商户号"
                        maxlength="30" :disabled="ruleForm.id?true:false" v-input-filter:int></el-input>
            </el-form-item>
            <el-form-item label="所在地区" prop="area">
              <el-cascader
                ref="cascaderAddr"
                v-model="ruleForm.area"
                :options="addressArea"
                placeholder="请选择省市区"
                :props="areaProps"
                @change="selectShow"
                style="width: 350px"
                :disabled="ruleForm.id?true:false"
              >
              </el-cascader>
            </el-form-item>
            <el-form-item label="详细地址" prop="address">
              <el-input v-model="ruleForm.address" :disabled="ruleForm.id?true:false" placeholder="请输入详细地址"
                        style="width: 350px" maxlength="30" v-input-filter:special></el-input>
            </el-form-item>
            <el-form-item label="联系人姓名" prop="contacts">
              <el-col :span="11">
                <el-form-item prop="contacts">
                  <el-input v-model="ruleForm.contacts" style="width: 150px" placeholder="请输入联系人姓名" maxlength="20"
                            v-input-filter:special></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="电话号码" prop="phone">
                  <el-input v-model="ruleForm.phone" style="width: 150px" placeholder="请输入电话号码"
                            v-input-filter:phone></el-input>
                </el-form-item>
              </el-col>
            </el-form-item>
            <el-form-item label="我方联系人姓名" prop="weContacts">
              <el-col :span="11">
                <el-form-item prop="weContacts">
                  <el-input v-model="ruleForm.weContacts" style="width: 150px" placeholder="请输入我方联系人" maxlength="20"
                            v-input-filter:special></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="电话号码" prop="wePhone">
                  <el-input v-model="ruleForm.wePhone" style="width: 150px" placeholder="请输入电话号码"
                            v-input-filter:phone></el-input>
                </el-form-item>
              </el-col>
            </el-form-item>
            <el-form-item label="代理产品线" prop="type">
              <el-checkbox-group v-model="ruleForm.type">
                <el-checkbox-button v-for="item in ruleForm.types" :label="item.id" :key="item.id"
                                    :indeterminate="true">{{ item.name }}
                </el-checkbox-button>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="运营商类型" prop="value">
              <el-select v-model="ruleForm.value" clearable multiple placeholder="请选择运营商类型,可多选" style="width: 350px">
                <el-option
                  v-for="item in ruleForm.options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="合作状态">
              <el-select v-model="ruleForm.isOutage" clearable placeholder="请选择合作状态" style="width: 350px">
                <el-option
                  v-for="item in ruleForm.option1"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="创建时间" v-if="ruleForm.createDate">
              <span>{{ ruleForm.createDate }}</span>
            </el-form-item>
            <el-form-item prop="date2" label="创建人" v-if="ruleForm.createName">
              <span>{{ ruleForm.createName }}</span>
            </el-form-item>
            <el-form-item prop="date2" label="最近一次更新时间" v-if="ruleForm.modifyDate">
              <span>{{ ruleForm.modifyDate }}</span>
            </el-form-item>
            <el-form-item prop="date2" label="最近一次创建人" v-if="ruleForm.modifyName">
              <span>{{ ruleForm.modifyName }}</span>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('ruleForm')"
                         v-if="(buttonArray.includes('submit_add_operator_n') || buttonArray.includes('submit_add_operator_n_eos'))&& !id">
                立即创建
              </el-button>
              <el-button type="primary" @click="submitForm('ruleForm')"
                         v-if="(buttonArray.includes('submit_operator_n') || buttonArray.includes('submit_operator_n_eos')) && id">
                保存
              </el-button>
              <el-button @click="resetForm('ruleForm')" v-if="type != 'OPT' && !id">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-tab-pane>
    <el-tab-pane label="分润信息管理" name="up" v-if='bby == "抱抱氧"'>
      <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
        <el-menu-item index="1">抱抱氧</el-menu-item>
      </el-menu>
      <div class="dashboard-container">
        <div class="details_from" style="width: 48%;">
          <el-form label-position="left" label-width="250px" :model="ruleForm">
            <div
              style="display: flex;flex-direction: row;justify-content: space-between;height: 70px;align-items: flex-start">
              <label>订单分润及运营商地区设置</label>
              <el-button type="danger" @click="bobSubmit('ruleForm')" style="margin-right: 30px;">保存</el-button>
            </div>
            <el-form-item label="氧疗订单的分润比例：" >
              <el-col :span="11">
              <el-input v-model="ruleForm.oxyProfit" style="width: 100%" placeholder="请输入分润比例"></el-input>
              </el-col>
              <el-col :span="11">
              <span style="margin-left: 15px">%</span>
              </el-col>
            </el-form-item>
            <el-form-item label="氧疗袋订单的分润比例：" >
              <el-col :span="11">
              <el-input v-model="ruleForm.bagProfit" style="width: 100%" placeholder="请输入分润比例"></el-input>
              </el-col>
              <el-col :span="11">
              <span style="margin-left: 15px">%</span>
              </el-col>
            </el-form-item>
            <el-form-item label="运营商运营区域设置">
              <el-cascader
                ref="addressCascader"
                v-model="address"
                :options="addressOptions"
                placeholder="请选择省市区"
                :props="addressProps"
                @change="addressChange"
                collapse-tags
                style="width: 100%"
              >
              </el-cascader>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import {
  operatorAdd,
  operatorDetail,
  operatorUpdate,
  queryByParentId,
  queryByType,
  operatorprofitSetting,
  areapriceSearch, princeCity, princeCityQuery
} from '@/api/table'
import {getBaseUrl} from '@/utils/auth'
import inputFilter from '@/utils/input.js'

export default {
  name: 'operators_details',
  directives: {
    inputFilter
  },
  data() {
    return {
      type: '',
      user: JSON.parse(sessionStorage.getItem("user")),
      buttonArray: JSON.parse(sessionStorage.getItem("buttonArray")),
      pane_name: 'on',
      from_l: 'right',
      value: '',
      is_from: false,
      EOS: 'EOS',
      OXY: '氧调',
      activeIndex: '1',
      address:'',
      addressOptions:[],
      addressArea:[],
      bby:'',
      ruleForm: {
        id: '',
        name: '',
        mktMrchId: '',
        phone: '',
        contacts: '',
        area:[],
        areaName:[],
        address: '',
        weContacts: '',
        value: '',
        wePhone: '',
        productLine: '',
        desc: '',
        type: [],
        bagProfit:'',
        oxyProfit:'',
        options: [
          {
            value: 'INVEST',
            label: '供氧机房投资商'
          },
          {
            value: 'SERVICE',
            label: '售后服务提供商'
          },
          {
            value: 'SELL',
            label: '供氧销售服务商'
          },
          {
            value: 'SUP',
            label: '供氧系统运营商'
          }
        ],
        option1: [
          {
            value: 'YES',
            label: '停止运行'
          },
          {
            value: 'NO',
            label: '正常运行'
          }
        ],
        isOutage: '',
        types: [
          {
            id: 'EOS',
            name: '标准化安全氧疗'
          }, {
            id: 'OXY',
            name: '氧调'
          }, {
            id: 'BBY',
            name: '抱抱氧'
          }
        ]
      },
      rules: {
        name: [{required: true, message: "请输入", trigger: 'blur'}],
        address: [{required: true, message: "请输入", trigger: 'blur'}],
        phone: [{required: true, message: "请输入", trigger: 'blur'}],
        weContacts: [{required: true, message: "请输入", trigger: 'blur'}],
        wePhone: [{required: true, message: "请输入", trigger: 'blur'}],
        contacts: [{required: true, message: "请输入", trigger: 'blur'}],
        area: [{required: true, message: "请选择", trigger: 'blur'}],
        type: [{required: true, message: "请选择", trigger: 'blur'}],
        value: [{required: true, message: "请选择", trigger: 'blur'}],
      },
      areaProps:{
        value: 'id',
        label: 'name',
      },
      addressProps:{
        value: 'id',
        label: 'name',
        multiple: true,
      }
    }
  },
  created() {
    this.type = this.user.type
    this.id = !this.$router.currentRoute.query.id && this.user.type == 'OPT' ? this.user.optId : this.$router.currentRoute.query.id
    this.getProvince()
    if (this.id) {
      if (this.type == 'OPT') {
        this.is_from = true
      }
      this.bby = this.$router.currentRoute.query.bby
      operatorDetail(getBaseUrl({id: this.id})).then(res => {
        if (res.code != 0) {
          this.ruleForm.area[0] = res.data.provinceId.toString()
          this.ruleForm.area[1] = res.data.cityId.toString()
          this.ruleForm.area[2] = res.data.regionId.toString()
          this.ruleForm.areaName[0] = res.data.provinceName
          this.ruleForm.areaName[1] = res.data.cityName
          this.ruleForm.areaName[2] = res.data.regionName
          this.ruleForm.value = res.data.type.split(",")
          this.ruleForm.type = res.data.productLine.split(",")
          this.ruleForm.id = res.data.id
          this.ruleForm.address = res.data.address
          this.ruleForm.isOutage = res.data.isOutage
          this.ruleForm.createName = res.data.createName
          this.ruleForm.createDate = res.data.createDate
          this.ruleForm.name = res.data.name
          this.ruleForm.mktMrchId = res.data.mktMrchId
          this.ruleForm.contacts = res.data.contacts
          this.ruleForm.phone = res.data.phone
          this.ruleForm.weContacts = res.data.weContacts
          this.ruleForm.wePhone = res.data.wePhone
        }
      })
      areapriceSearch({optId: this.id}).then(res=>{
        if(res.code != 0){
          let array = []
          this.ruleForm.oxyProfit = res.data.oxyProfit
          this.ruleForm.bagProfit = res.data.bagProfit
          res.data.operatorAreas.map(item=>{
            array.push( Object.values(item))
          })
          this.address = array
        }
      })
    }
  },
  methods: {
    getProvince(){
      princeCityQuery().then(res=>{
        if(res.code != 0){
          this.addressArea = res.data
        }
      })
      princeCity().then(res=>{
        if(res.code != 0){
          this.addressOptions = res.data
        }
      })
    },
    submitForm(formName) {
      let add_data = {
        id: this.ruleForm.id,
        address: this.ruleForm.address,
        contacts: this.ruleForm.contacts,
        isOutage: this.ruleForm.isOutage,
        name: this.ruleForm.name,
        mktMrchId: this.ruleForm.mktMrchId,
        phone: this.ruleForm.phone,
        productLine: this.ruleForm.type.toString(),
        cityId:this.ruleForm.area[1],
        cityName: this.ruleForm.areaName[1],
        provinceName: this.ruleForm.areaName[0],
        provinceId:this.ruleForm.area[0],
        regionId:this.ruleForm.area[2],
        regionName: this.ruleForm.areaName[2],
        token: sessionStorage.getItem("token"),
        types: this.ruleForm.value,
        weContacts: this.ruleForm.weContacts,
        wePhone: this.ruleForm.wePhone,
      }
      if (this.ruleForm.address == "" || this.ruleForm.areaName.length== 0 || this.ruleForm.contacts == "" || this.ruleForm.name == "" || this.ruleForm.phone == "" || this.ruleForm.wePhone == "" || this.ruleForm.weContacts == "" || this.ruleForm.type == "" || this.ruleForm.value == "") {
        this.$message.error('请填写完整的运营商信息')
        return
      }
      const phoneReg = new RegExp('^(13|14|15|16|17|18|19)[0-9]{9}$')
      if (!phoneReg.test(this.ruleForm.wePhone)) {
        this.$message.error('手机号输入错误')
        this.ruleForm.wePhone = ""
        return;
      }
      if (!phoneReg.test(this.ruleForm.phone)) {
        this.$message.error('手机号输入错误')
        this.ruleForm.phone = ""
        return;
      }
      if (!this.ruleForm.id) {
        operatorAdd(add_data).then(res => {
          if (res.code != 0) {
            this.$router.go(-1);
          }
        })
      } else {
        operatorUpdate(add_data).then(res => {
          if (res.code != 0) {
            this.$router.go(-1);
          }
        })
      }
    },
    resetForm() {
      this.ruleForm.name = ""
      this.ruleForm.mktMrchId = ""
      this.ruleForm.area = []
      this.ruleForm.areaName = []
      this.ruleForm.weContacts = ""
      this.ruleForm.wePhone = ""
      this.ruleForm.value = []
      this.ruleForm.type = []
      this.ruleForm.address = ""
      this.ruleForm.contacts = ""
      this.ruleForm.phone = ""
      this.ruleForm.isOutage = ""
    },
    selectShow(data) {
      this.ruleForm.areaName = this.$refs['cascaderAddr'].getCheckedNodes()[0].pathLabels
    },
    computerList() {

    },
    handleSelect() {

    },
    bobSubmit(){
      let operatorAreas = []
      if(this.address.length == 0){
        this.$message.error("请先选择运营区域设置！")
        return
      }
      if(!this.ruleForm.bagProfit || !this.ruleForm.oxyProfit){
        this.$message.error("请填写完整信息！")
        return
      }
      this.address.map(item=>{
        operatorAreas.push({province:item[0],city:item[1]})
      })
      let params = {
        bagProfit:this.ruleForm.bagProfit,
        oxyProfit:this.ruleForm.oxyProfit,
        operatorAreas:operatorAreas,
        productLine:'BBY',
        optId:this.id
      }
      operatorprofitSetting(params).then(res=>{
        if(res.code != 0){
          this.$message.success("保存成功！")
        }
      })

    },
    addressChange(val){
      console.log(this.address)
    },
  }
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
.el-col-11{
  width: auto;
}
</style>
<style>
.el-input__inner {
  height: 30px;
}
.el-col-11{
width: auto;
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
