<template>
  <div class="details_from">
    <el-form :model="ruleForm" :rules="rules" :label-position="from_l" ref="ruleForm" :show-message="false" label-width="120px"
             class="demo-ruleForm" :disabled="is_from">
      <el-form-item v-if="ruleForm.id" label="网点编号" prop="id">
        <span style="width: 250px">{{ruleForm.id}}</span>
      </el-form-item>
      <el-form-item label="网点名称" prop="name">
        <el-input v-model="ruleForm.name" style="width: 350px" v-input-filter:special placeholder="请输入网点名称"></el-input>
      </el-form-item>
      <el-form-item label="所在地区"  prop="name">
        <v-distpicker :province="ruleForm.select.province" :city="ruleForm.select.city" :area="ruleForm.select.area"
                      @selected="selectShow" @province="onChangeProvince" @city="onChangeCity"
                      :disabled="is_from"></v-distpicker>
      </el-form-item>
      <el-form-item label="详细地址" prop="address">
        <el-input v-model="ruleForm.address" v-input-filter:special style="width: 350px" placeholder="请输入详细地址"></el-input>
      </el-form-item>
      <el-form-item label="网点类型" prop="type">
        <el-select v-model="ruleForm.type" clearable placeholder="网点类型" style="width: 350px">
          <el-option
            v-for="item in ruleForm.type_options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="经营性质" prop="properties">
        <el-select v-model="ruleForm.properties" clearable placeholder="经营性质" style="width: 350px">
          <el-option
            v-for="item in ruleForm.properties_options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="等级" prop="rank">
        <el-select v-model="ruleForm.rank" clearable placeholder="等级" style="width: 350px">
          <el-option
            v-for="item in ruleForm.rank_options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="床位数" prop="berthCount">
        <el-select v-model="ruleForm.berthCount" clearable placeholder="床位数" style="width: 350px">
          <el-option
            v-for="item in ruleForm.berthCount_options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="签约类型" prop="contractType">
        <el-select v-model="ruleForm.contractType" clearable placeholder="签约类型" style="width: 350px">
          <el-option
            v-for="item in ruleForm.contractType_options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="网点联系人姓名" prop="contacts">
        <el-col :span="11">
          <el-form-item prop="contacts">
            <el-input v-model="ruleForm.contacts" style="width: 200px" v-input-filter:special></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="电话号码" prop="phone">
            <el-input v-model="ruleForm.phone" maxlength="11" style="width: 200px" placeholder="请输入电话号码"
                      v-input-filter:phone></el-input>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="我方销售姓名" prop="weContacts">
        <el-col :span="11">
          <el-form-item prop="weContacts">
            <el-input v-model="ruleForm.weContacts" style="width: 200px" v-input-filter:special></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="电话号码" prop="wePhone">
            <el-input v-model="ruleForm.wePhone" maxlength="11" placeholder="请输入电话号码" style="width: 200px"
                      v-input-filter:phone></el-input>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="创建时间" v-if="ruleForm.createDate">
        <span>{{ruleForm.createDate}}</span>
      </el-form-item>
      <el-form-item label="创建人" label-width="150" v-if="ruleForm.createName">
        <span style="margin-left: 50px">{{ruleForm.createName}}</span>
      </el-form-item>
      <el-form-item label="最近一次更新时间" label-width="150" v-if="ruleForm.modifyDate">
        <span>{{ruleForm.modifyDate}}</span>
      </el-form-item>
      <el-form-item label="最近一次创建人" label-width="150" v-if="ruleForm.modifyName">
        <span>{{ruleForm.modifyName}}</span>
      </el-form-item>
      <el-form-item v-if="type ==2">
        <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {parseTime} from "@/utils";
  import {computerList, networkDetail, networkList, serviceList, networkAdd} from "@/api/table";
  import {getBaseUrl, getToken} from "@/utils/auth";
  import VDistpicker from "v-distpicker";
  import inputFilter from '@/utils/input.js'
  import {Message} from "element-ui";

  export default {
    name: "eos_operator_add",
    components: {VDistpicker},
    directives: {
      inputFilter
    },
    data() {
      return {
        type: '',
        from_l: 'right',
        is_from: false,
        user: JSON.parse(sessionStorage.getItem("user")),
        buttonArray:JSON.parse(sessionStorage.getItem("buttonArray")),
        ruleForm: {
          id: '',
          name: "",
          rank: "",
          select: {province: '', city: '', area: ''},
          address: '',
          cityCode: "",
          cityName: "",
          properties: "",
          provinceCode: "",
          provinceName: "",
          berthCount: "",
          contractType: "",
          regionCode: "",
          regionName: "",
          phone: "",
          contacts: "",
          type: "",
          type_options: [{
            value: 'HOSPITAL',
            label: '医院'
          }, {
            value: 'HEALTH_CENTER',
            label: '卫生院'
          }, {
            value: 'HOTEL',
            label: '酒店'
          }, {
            value: 'PHARMACY',
            label: '药房'
          }, {
            value: 'BEADHOUSE',
            label: '养老院'
          }, {
            value: 'GYM',
            label: '健身房'
          }, {
            value: 'COMMUNITY',
            label: '社区'
          }, {
            value: 'OTHER',
            label: '其他'
          },],
          contractType_options: [
            {
              value: 'WHOLE',
              label: '全款购买设备'
            },
            {
              value: 'BOTTOM_GUARD',
              label: '低首付，保底预收'
            }
          ],
          rank_options: [{
            value: 'THREE_LEVEL',
            label: '三级'
          },
            {
              value: 'FIRST_CLASS',
              label: '甲等'
            },
            {
              value: 'UNRATED',
              label: '未定级'
            }],
          properties_options: [
            {
              value: 'PUBLIC',
              label: '公立医院'
            },
            {
              value: 'PRIVATE',
              label: '民营医院'
            }],
          berthCount_options: [
            {
              value: 'ONE',
              label: '100-200'
            },
            {
              value: 'TWO',
              label: '200-500'
            },
            {
              value: 'THREE',
              label: '500-800'
            },
            {
              value: 'FOUR',
              label: '800-1100'
            },
            {
              value: 'FIVE',
              label: '1100-2000'
            },
            {
              value: 'SIX',
              label: '2000以上'
            }
          ]
        },
        rules: {
          name: [{required: true, message:"请输入",trigger: 'blur'}],
          address: [{required: true, message:"请输入",trigger: 'blur'}],
          phone: [{required: true, message:"请输入",trigger: 'blur'}],
          weContacts: [{required: true,message:"请输入", trigger: 'blur'}],
          wePhone: [{required: true, message:"请输入",trigger: 'blur'}],
          contacts: [{required: true,message:"请输入", trigger: 'blur'}],
          select: [{required: true, message:"请输入",trigger: 'blur'}],
          type: [{required: true,message:"请输入", trigger: 'blur'}],
          properties: [{required: true,message:"请选择", trigger: 'blur'}],
          rank: [{required: true,message:"请选择", trigger: 'blur'}],
          berthCount: [{required: true,message:"请选择", trigger: 'blur'}],
          contractType: [{required: true,message:"请选择", trigger: 'blur'}],
        },
      }
    },
    created() {
      this.type = this.$router.currentRoute.query.type
      this.ruleForm.id = this.$router.currentRoute.query.id
      if (this.ruleForm.id) {
        this.is_from = this.type != 2 ? true : false
        networkDetail({netId: this.ruleForm.id,productLine:"EOS",token:getToken(),}).then(res => {
          if (res.code != 0) {
            this.ruleForm.select = {
              province: res.data.provinceName || '',
              city: res.data.cityName || '',
              area: res.data.regionName || ''
            }
            this.ruleForm.address = res.data.address
            this.ruleForm.berthCount = res.data.berthCount
            this.ruleForm.name = res.data.name
            this.ruleForm.payType = res.data.payType
            this.ruleForm.properties = res.data.properties
            this.ruleForm.cityCode = res.data.cityCode
            this.ruleForm.cityName = res.data.cityName
            this.ruleForm.provinceCode = res.data.provinceCode
            this.ruleForm.provinceName = res.data.provinceName
            this.ruleForm.regionCode = res.data.regionCode
            this.ruleForm.regionName = res.data.regionName
            this.ruleForm.rank = res.data.rank
            this.ruleForm.type = res.data.type
            this.ruleForm.weContacts = res.data.weContacts
            this.ruleForm.wePhone = res.data.wePhone
            this.ruleForm.phone = res.data.phone
            this.ruleForm.contacts = res.data.contacts
          }
        })
      }
    },
    methods: {
      submitForm(formName) {
        var params = {
          address: this.ruleForm.address,
          berthCount: this.ruleForm.berthCount,
          name: this.ruleForm.name,
          contractType: this.ruleForm.contractType,
          properties: this.ruleForm.properties,
          cityCode: this.ruleForm.cityCode,
          cityName: this.ruleForm.cityName,
          provinceCode: this.ruleForm.provinceCode,
          provinceName: this.ruleForm.provinceName,
          regionCode: this.ruleForm.regionCode,
          regionName: this.ruleForm.regionName,
          rank: this.ruleForm.rank,
          type: this.ruleForm.type,
          weContacts: this.ruleForm.weContacts,
          wePhone: this.ruleForm.wePhone,
          phone: this.ruleForm.phone,
          contacts: this.ruleForm.contacts,
          productLine:"EOS",
          token:getToken(),
        }
        const phoneReg = new RegExp('^(13|14|15|16|17|18|19)[0-9]{9}$')
        if (!phoneReg.test(this.ruleForm.wePhone)) {
          this.$message.error('手机号输入错误')
          this.ruleForm.wePhone = ""
          return;
        }

        if (this.ruleForm.id) {
          networkUpdate(params).then(res => {
            if (res.code != 0) {
              this.$router.go(-1)
            }
          })
        } else {
          networkAdd(params).then(res => {
            if (res.code != 0) {
              this.$router.go(-1)
            }
          })
        }

      },
      resetForm(formName) {
        this.ruleForm.select = {}
        this.ruleForm.address = ""
        this.ruleForm.berthCount = ""
        this.ruleForm.name = ""
        this.ruleForm.payType = ""
        this.ruleForm.productLine = ""
        this.ruleForm.properties = ""
        this.ruleForm.cityCode = ""
        this.ruleForm.cityName = ""
        this.ruleForm.provinceCode = ""
        this.ruleForm.provinceName = ""
        this.ruleForm.regionCode = ""
        this.ruleForm.regionName = ""
        this.ruleForm.rank = ""
        this.ruleForm.serviceOptId = ""
        this.ruleForm.serviceOptName = ""
        this.ruleForm.superTransferNetId = ""
        this.ruleForm.superTransferNetName = ""
        this.ruleForm.terminalType = ""
        this.ruleForm.type = ""
        this.ruleForm.weContacts = ""
        this.ruleForm.wePhone = ""
        this.ruleForm.phone = ""
        this.ruleForm.contacts = ""
      },
      selectShow(data) {
        this.ruleForm.select = {province: data.province.value, city: data.city.value, area: data.area.value}
        this.ruleForm.provinceCode = data.province.code
        this.ruleForm.provinceName = data.province.value
        this.ruleForm.cityName = data.city.value
        this.ruleForm.cityCode = data.city.code
        this.ruleForm.regionName = data.area.value
        this.ruleForm.regionCode = data.area.code
      },
      onChangeProvince(data) {
        this.ruleForm.select.province = data.value
        this.ruleForm.provinceCode = data.code
        this.ruleForm.provinceName = data.value
      },
      onChangeCity(data) {
        this.ruleForm.select.city = data.value
        this.ruleForm.cityName = data.value
        this.ruleForm.cityCode = data.code
      },
    },
  }
</script>

<style scoped>
  .details_from {
    width: 60%;
    height: 50%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 50px;
    border: 1px solid #d3dce6;
    border-radius: 10px;
    margin-left: 100px;
    margin-top: 100px;
  }
</style>
<style>
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
</style>
