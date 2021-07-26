<template>
  <el-tabs type="border-card" v-model="pane_name" @tab-click="computerList()" style="margin-top: 50px">
    <el-tab-pane label="机房详情" name="on">
      <div class="dashboard-container">
        <div class="details_from">
          <el-form :model="ruleForm" :label-position="from_l" :rules="rules" :show-message="false" label-width="150px"
                   class="demo-ruleForm" :disabled="is_edit">
            <el-form-item v-if="ruleForm.id" label="机房编号" prop="id">
              <span style="width: 250px">{{ruleForm.id}}</span>
            </el-form-item>
            <el-form-item label="机房名称" prop="name">
              <el-input v-model="ruleForm.name" style="width: 350px" placeholder="请输入机房名称"
                        v-input-filter:special></el-input>
            </el-form-item>
            <el-form-item label="所在地区" prop="name">
              <v-distpicker :province="ruleForm.select.province" :city="ruleForm.select.city"
                            :area="ruleForm.select.area" @selected="selectShow" @province="onChangeProvince"
                            @city="onChangeCity" :disabled="is_edit"></v-distpicker>
            </el-form-item>
            <el-form-item label="详细地址" prop="name">
              <el-input v-model="ruleForm.address" style="width: 350px" placeholder="请输入详细地址"
                        v-input-filter:special></el-input>
            </el-form-item>
            <el-form-item label="产品线" prop="name">
              <el-select v-model="ruleForm.productLine" clearable placeholder="请选择产品线" style="width: 350px" @change="productLineClick">
                <el-option
                  v-for="item in ruleForm.option1"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="机房类型" prop="name">
              <el-select v-model="ruleForm.type" clearable placeholder="机房类型" style="width: 350px">
                <el-option
                  v-for="item in (ruleForm.productLine=='BBY'?ruleForm.roomType_options:ruleForm.type_options)"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="供氧系统运营商" prop="name">
              <el-select v-model="ruleForm.support_id" clearable placeholder="请选择供氧系统运营商" style="width: 350px">
                <el-option
                  v-for="item in ruleForm.support"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="供氧机房投资商" prop="name">
              <el-select v-model="ruleForm.investOptIds" clearable multiple placeholder="请选择销售服务运营商"
                         style="width: 350px">
                <el-option
                  v-for="item in ruleForm.option_select"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="售后服务商" prop="serviceOptId">
              <el-select v-model="ruleForm.serviceOptId" clearable placeholder="请选择售后服务商" style="width: 350px" @change="serviceShow">
                <el-option
                  v-for="item in ruleForm.service_options"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="机房运维员" prop="serviceUser">
              <el-select v-model="ruleForm.serviceUser" clearable placeholder="请选择维护员" style="width: 350px">
                <el-option
                  v-for="item in ruleForm.defendList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="甲方客户联系人" required prop="manageContacts">
              <el-col :span="11">
                <el-form-item>
                  <el-input v-model="ruleForm.manageContacts" placeholder="请输入姓名" style="width: 150px"
                            v-input-filter:special></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="电话号码" prop="managePhone">
                  <el-input v-model="ruleForm.managePhone" style="width: 150px" placeholder="请输入电话号码" v-input-filter:phone></el-input>
                </el-form-item>
              </el-col>
            </el-form-item>
            <el-form-item label="创建人:" v-if="ruleForm.createrName">
              <span>{{ruleForm.createrName}}</span>
            </el-form-item>
            <el-form-item v-if="!is_edit" style="display: flex;flex-direction: row;justify-content: center">
              <el-button type="primary" @click="submitForm('ruleForm')" v-if="buttonArray.includes('room_add_detail_n') && !ruleForm.id">立即创建</el-button>
              <el-button type="primary" @click="submitForm('ruleForm')" v-if="buttonArray.includes('room_submit_n') && ruleForm.id">保存</el-button>
              <el-button @click="resetForm('ruleForm')" v-if="!ruleForm.id">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-tab-pane>
    <el-tab-pane label="机房总控终端" name="up" v-if="this.ruleForm.type == 'CENTRE'">
      <div>
        <el-button type="danger" v-if="buttonArray.includes('room_add_c_n')" @click="addShow(1)" style="margin-bottom: 20px">新增总控终端</el-button>
      </div>
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="Loading"
        style="border: 1px solid #EBEEF5"
        fit
        highlight-current-row
      >
        <el-table-column align="center" label="终端编号" width="200">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="机房总控终端SN" width="150" align="center">
          <template slot-scope="scope">{{ scope.row.snNo }}</template>
        </el-table-column>
        <el-table-column label="设备型号" width="150" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.modelName }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="created_at" label="创建时间" width="200">
          <template slot-scope="scope">
            <i class="el-icon-time"/>
            <span>{{ scope.row.createDate }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="created_at" label="激活时间" width="200">
          <template slot-scope="scope">
            <i class="el-icon-time"/>
            <span>{{ scope.row.activationDate }}</span>
          </template>
        </el-table-column>
        <el-table-column class-name="status-col" label="激活状态" width="110" align="center">
          <template slot-scope="scope">{{ scope.row.isActivation == "NO"?"未激活":"已激活"}}</template>
        </el-table-column>
        <el-table-column class-name="status-col" label="使用状态" width="110" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.status =='NORMAL'">正常使用</span>
            <span v-if="scope.row.status =='STOP'">停用使用</span>
          </template>
        </el-table-column>
        <el-table-column class-name="status-col" label="运行模式" width="110" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.runMode == 1">单机</span>
            <span v-if="scope.row.runMode == 0">多机</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="150" v-if="user.type == 'OPT'">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="handleClick(scope.row)" v-if="scope.row.isActivation == 'NO' && buttonArray.includes('room_c_isActivation_n')">激活</el-button>
<!--            <el-button type="text" size="small" @click="handleClick(scope.row)" v-if="user.type != 'OPT'">设备部件详情</el-button>-->
            <el-button type="text" size="small" @click="runModeShow(scope.row)" v-if="buttonArray.includes('room_c_isActivation_n')">运行模式设置</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="新增供氧机房总控终端设备" :visible.sync="is_from" @close="colseClick" width="400px"
                 :close-on-click-modal="false">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm">
          <el-form-item label="总控终端设备S/N" prop="value">
            <el-select v-model="ruleForm.value" clearable placeholder="按端口S/N" style="width: 200px;">
              <el-option
                v-for="item in ruleForm.options"
                :key="item.id"
                :label="item.snNo"
                :value="item.snNo"
              />
            </el-select>
            <el-tooltip class="item" effect="dark" content="制氧机机器或系统分配的ID" placement="right-end">
              <i class="el-icon-question" style="width: 20px;height: 20px;margin-left: 15px"></i>
            </el-tooltip>
          </el-form-item>
          <div style="display: flex;flex-direction: row;justify-content: center;align-items: center">
            <el-button type="primary" @click="addSNshow()" style="width: 100px">提交</el-button>
          </div>
        </el-form>
      </el-dialog>
      <el-dialog title="机房主控终端运营模式设置" :visible.sync="is_run" @close="colseClick()" width="305px" :close-on-click-modal="false">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm">
          <div>
            <el-radio v-model="ruleForm.mode" label="0" border>多机模式</el-radio>
            <el-radio v-model="ruleForm.mode" label="1" border>单机模式</el-radio>
          </div>
          <div style="display: flex;flex-direction: row;justify-content: flex-end;align-items: flex-end;height: 70px">
            <el-button type="primary" @click="runModeShowRun()" style="width: 100px">确认</el-button>
          </div>
        </el-form>
      </el-dialog>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
  import VDistpicker from "v-distpicker";
  import {
    computerGeneralAdd,
    computerDetail,
    computerUpdate,
    computerGeneralList,
    computerGeneraSelect,
    operatorSup,
    operatorSelect,
    computerAdd, activationOk, activationIs, manageList, serviceList, controlRunmode
  } from "@/api/table";
  import {getBaseUrl} from "@/utils/auth";
  import inputFilter from '@/utils/input.js'

  export default {
    name: 'computer_room_details',
    components: {VDistpicker},
    directives: {
      inputFilter
    },
    data() {
      return {
        type: '',
        user:JSON.parse(sessionStorage.getItem("user")),
        buttonArray:JSON.parse(sessionStorage.getItem("buttonArray")),
        from_l: 'right',
        value: '',
        pane_name: 'on',
        list: [],
        listLoading: true,
        is_from: false,
        is_edit: false,
        is_select: false,
        is_run:false,
        ruleForm: {
          id: "",
          name: '',
          serviceUser:"",//机房管理员
          serviceOptId:"",//售后服务商id
          manageContacts:"",//甲方联系人
          managePhone:"",//甲方电话号码
          mode:'',//运行模式
          value: '',
          select: {province: '', city: '', area: ''},
          cityCode: "",
          cityName: "",
          regionCode: "",
          regionName: "",
          provinceCode: "",
          provinceName: "",
          address: '',
          productLine: '',
          support: [],
          support_id: '',
          option_select: [],
          investOptIds: [],
          option1: [],
          options: [],
          defendList:[], //维护人员列表
          timer:'',
          time_number:0,
          equipId:'',
          type: "",
          roomType_options:[{
            value: 'DISTRIBUTED',
            label: '分布式'
          }],
          type_options: [
            {
              value: 'FISSION',
              label: '分体式'
            },
            {
              value: 'DIRECT_CONNECT',
              label: '直连式'
            },
            {
              value: 'CENTRE',
              label: '中央制氧'
            },
            {
              value: 'OLD',
              label: '老机房'
            },
            {
              value: 'DISTRIBUTED',
              label: '分布式'
            }
          ],
        },
        rules: {
          name: [{required: true, message: "请输入", trigger: 'blur'}],
          value: [{required: true, message: "请选择", trigger: 'blur'}],
          serviceUser:[{required: true, message: "请选择", trigger: 'blur'}],
          serviceOptId:[{required: true, message: "请选择", trigger: 'blur'}],
          manageContacts: [{required: true, message: "请输入", trigger: 'blur'}],
          managePhone: [{required: true, message: "请输入", trigger: 'blur'}],
        },
      }
    },
    created() {
      this.type = this.$router.currentRoute.query.type
      this.ruleForm.id = this.$router.currentRoute.query.id
      let arr = []
      this.user.productLine.split(",").map(item => {
        if (item == "EOS") {
          arr.push({
            value: 'EOS',
            label: '标准化安全氧疗'
          })
        } else if (item == "OXY") {
          arr.push(
            {
              value: 'OXY',
              label: '氧调'
            })
        } else if (item == "BBY") {
          arr.push(
            {
              value: 'BBY',
              label: '抱抱氧'
            })
        }
      })
      this.ruleForm.option1 = arr
      serviceList({productLine:this.user.productLine}).then(res => {
        if (res.code != 0) {
          this.ruleForm.service_options = res.data
        }
      })
      if (this.ruleForm.id) {
        if (this.type == 1) {
          this.is_edit = true
        }
        computerDetail(getBaseUrl({id: this.ruleForm.id})).then(res => {
          if (res.code != 0) {
            this.ruleForm.select = {
              province: res.data.provinceName || '',
              city: res.data.cityName || '',
              area: res.data.regionName || ''
            }
            this.ruleForm.investOptIds = res.data.investOptsIds?res.data.investOptsIds.split(","):''
            this.ruleForm.support_id = res.data.supOxyOptId
            this.ruleForm.address = res.data.address
            this.ruleForm.name = res.data.name
            this.ruleForm.serviceUser = res.data.serviceUser
            this.ruleForm.type = res.data.type
            this.ruleForm.productLine = res.data.productLine
            this.ruleForm.createrName = res.data.createrName
            this.ruleForm.serviceOptId = res.data.serviceOptId
            this.ruleForm.manageContacts = res.data.manageContacts
            this.ruleForm.managePhone = res.data.managePhone
            this.productLineClick()
            if(this.ruleForm.serviceOptId){
              this.serviceShow(res.data.serviceOptId,1)
            }
          }
        })
      }
    },
    methods: {
      submitForm() {
        let add_param = {
          id: this.ruleForm.id,
          address: this.ruleForm.address,
          cityCode: this.ruleForm.cityCode,
          cityName: this.ruleForm.cityName,
          provinceCode: this.ruleForm.provinceCode,
          provinceName: this.ruleForm.provinceName,
          regionCode: this.ruleForm.regionCode,
          regionName: this.ruleForm.regionName,
          investOptIds: this.ruleForm.investOptIds,
          serviceUser: this.ruleForm.serviceUser,
          name: this.ruleForm.name,
          productLine: this.ruleForm.productLine,
          supOptId: this.ruleForm.support_id,
          serviceOptId:this.ruleForm.serviceOptId,
          manageContacts:this.ruleForm.manageContacts,
          managePhone:this.ruleForm.managePhone,
          type: this.ruleForm.type,
          token: sessionStorage.getItem("token"),
        }
        if (this.ruleForm.name == "" || this.ruleForm.select.province == '' || this.ruleForm.select.city == '' || this.ruleForm.address == "" || this.ruleForm.investOptIds == [] || this.ruleForm.serviceUser == "" || this.ruleForm.productLine == "" || this.ruleForm.support_id == ""|| this.ruleForm.serviceOptId == "" || this.ruleForm.type == "") {
          this.$message.error('请填写完整的机房信息')
          return
        }
        if (this.ruleForm.managePhone) {
          const phoneReg = new RegExp('^(13|14|15|16|17|18|19)[0-9]{9}$')
          if (!phoneReg.test(this.ruleForm.managePhone)) {
            this.$message.error('手机号输入错误')
            this.ruleForm.managePhone = ""
            return;
          }
        }
        if (this.type == 4 && !this.ruleForm.id) {
          computerAdd(add_param).then(res => {
            if (res.code != 0) {
              this.$router.go(-1);
            }
          })
        } else if (this.type == 2) {
          computerUpdate(add_param).then(res => {
            if (res.code != 0) {
              this.$router.go(-1);
            }
          })
        }
      },
      //产品线选择运营商
      productLineClick(){
        operatorSup({productLine: this.ruleForm.productLine}).then(res => {
          if (res.code != 0) {
            this.ruleForm.support = res.data
          }
        })
        operatorSelect({productLine: this.ruleForm.productLine}).then(res => {
          if (res.code != 0) {
            this.ruleForm.option_select = res.data
          }
        })
      },
      //售后运营商选择维护员列表
      serviceShow(id,type){
        if(!type){
          this.ruleForm.serviceUser = ''
        }
        manageList(id).then(res =>{
          if(res.code !=0 ){
            this.ruleForm.defendList = res.data
          }
        })
      },
      //添加SN
      addSNshow(){
        let params = {
          roomId:this.ruleForm.id,
          snNo:this.ruleForm.value,
        }
        computerGeneralAdd(getBaseUrl(params)).then(res =>{
          if (res.code != 0) {
            this.is_from = false
            this.computerList()
          }
        })
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
        this.ruleForm.provinceCode = data.code
        this.ruleForm.provinceName = data.value
      },
      onChangeCity(data) {
        this.ruleForm.cityName = data.value
        this.ruleForm.cityCode = data.code
      },
      resetForm(formName) {
        this.ruleForm.select = {}
        this.ruleForm.support_id = ''
        this.ruleForm.serviceOptId = ''
        this.ruleForm.investOptIds = []
        this.ruleForm.productLine = ''
        this.ruleForm.name = ''
        this.ruleForm.address = ''
        this.ruleForm.serviceUser = ''
        this.ruleForm.type = []
        this.ruleForm.manageContacts = ''
        this.ruleForm.managePhone = ''
      },
      colseClick() {
        this.is_from = false
        this.ruleForm.value = ""
        this.is_run = false
      },
      addShow(e) {
        if (e == 2) {
          this.is_select = true
        }
        this.is_from = true
        this.is_tree = false
        computerGeneraSelect(getBaseUrl({roomId: this.ruleForm.id})).then(res => {
          if (res.code != 0) {
            this.ruleForm.options = res.data
          }
        })
      },
      computerList() {
        if (this.pane_name == "up") {
          computerGeneralList(getBaseUrl({roomId: this.ruleForm.id})).then(res => {
            if (res.code != 0) {
              let arr = []
              arr[0] = res.data
              this.list = arr[0]?arr:[]
              this.listLoading = false
            }
          })
        }
      },
      getTime(){
        this.time_number ++;
        activationIs(getBaseUrl({id:this.equipId})).then(res =>{
          if(res.data.isActivation == 'YES'){
            clearInterval(this.timer);
            this.listLoading = false
            this.$router.go(0)
          }
        })
        if(this.time_number == 60){
          clearInterval(this.timer);
        }
      },
      //激活
      handleClick(row) {
        this.$confirm('激活后,设备将会自动上报设备运行状态', '安装Ok后,确定激活?', {
          confirmButtonText: '确定激活',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.equipId = row.id
          activationOk(getBaseUrl({equipId: row.id})).then(res => {
            if(res.code !=0) {
              // this.listLoading = true
              this.time_number = 0
              this.$router.go(0)
              // this.timer = setInterval(this.getTime,1000)
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      },
      //运行模式设计
      runModeShow(row){
        this.is_run = true
        this.ruleForm.mode = row.runMode
        this.equipId = row.id
      },
      //运行模式状态改变
      runModeShowRun(){
        controlRunmode({equipId:this.equipId,mode:this.ruleForm.mode,}).then(res =>{
          this.is_run = false
          this.$router.go(0)
        })
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
    margin-top: 30px;
    margin-bottom: 20px;
  }

  .block {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    flex-flow: nowrap;
    margin-bottom: 20px;
  }

  .input_class {
    width: 150px;
    display: flex;
    margin-right: 20px;
  }

  .block_div {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.5);
    position: absolute;
    z-index: 20;
    top: 0;
    left: 0;
  }

  .block_div_content {
    width: 400px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: white;
    border-radius: 10px;
  }

  .block_hread {
    width: 400px;
    height: 50px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    background-color: #50a3bc;
    color: white;
    font-size: 18px;
    font-weight: 500;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    padding-left: 20px;
    padding-right: 20px;
  }

  .demo-ruleForm {
    margin-top: 20px;
    margin-bottom: 20px;
    align-items: center;
    justify-content: center;
  }
</style>
<style>
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
</style>
<style>
  ::-webkit-scrollbar {
    width: 5px;
  }

  ::-webkit-scrollbar-track {
    background: white;
  }

  ::-webkit-scrollbar-thumb {
    background: white;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #DCDFE6;
  }

  ::-webkit-scrollbar-thumb:active {
    background: #99a9bf;
  }
  .el-table__fixed-right{
    height: 100% !important;
  }
</style>
