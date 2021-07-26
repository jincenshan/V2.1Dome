<template>
  <el-tabs type="border-card" v-model="pane_name" style="margin-top: 50px">
    <el-tab-pane label="抱抱氧设备维护" name="on">
      <div>
        <el-button type="danger" @click="addShow(1)" style="margin-bottom: 20px" v-if="buttonArray.includes('room_add_oxy')">添加制氧机</el-button>
      </div>
      <el-table
        v-loading="listLoading"
        :data="list_table_data"
        element-loading-text="Loading"
        style="border: 1px solid #EBEEF5"
        fit
        highlight-current-row
      >
        <el-table-column align="center" label="制氧主机编号" width="200">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="制氧主机设备SN" width="150" align="center">
          <template slot-scope="scope">{{ scope.row.snNo }}</template>
        </el-table-column>
        <el-table-column label="识别编码" width="150" align="center">
          <template slot-scope="scope">{{ scope.row.distCode}}</template>
        </el-table-column>
        <el-table-column label="设备型号" width="150" align="center">
          <template slot-scope="scope">
            <!--            <span>{{ scope.row.modelName }}</span>-->
            <span v-if="scope.row.modelName">{{ scope.row.modelName }}</span>
            <span v-if="!scope.row.modelName" style="color: #20a0ff" @click="model_show(scope.row.id)">维护设备型号</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="created_at" label="创建时间" width="180">
          <template slot-scope="scope">
            <i class="el-icon-time" v-if="scope.row.createDate"/>
            <span>{{ scope.row.createDate }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="created_at" label="激活时间" width="180">
          <template slot-scope="scope">
            <i class="el-icon-time"/>
            <span>{{ scope.row.activationDate }}</span>
          </template>
        </el-table-column>
        <el-table-column class-name="status-col" label="激活状态" width="110" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.isActivation == 'YES'">是</span>
            <span v-else>否</span>
          </template>
        </el-table-column>
        <el-table-column class-name="status-col" label="使用状态" width="110" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.status =='NORMAL'">正常使用</span>
            <span v-if="scope.row.status =='STOP'">停用使用</span>
          </template>
        </el-table-column>
<!--        <el-table-column label="操作" align="center" width="250">-->
<!--          <template slot-scope="scope">-->
<!--            <el-button type="text" size="small" @click="handleClick(scope.row.id)"-->
<!--                       v-if="scope.row.isActivation =='NO' && buttonArray.includes('room_oxy_isActivation')">激活-->
<!--            </el-button>-->
<!--            <el-button type="text" size="small" @click="deviceShow(scope.row)">设备部件详情</el-button>-->
<!--          </template>-->
<!--        </el-table-column>-->
      </el-table>
      <el-dialog title="新增制氧机" :visible.sync="is_from_one" width="500px" :close-on-click-modal="false">
        <el-form v-model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
          <el-form-item label="制氧机设备S/N">
            <el-select v-model="ruleForm.value" clearable placeholder="请选择端口S/N"
                       style="width: 200px;margin-left: 20px">
              <el-option
                v-for="item in ruleForm.options"
                :key="item.id"
                :label="item.snNo"
                :value="item.id"
              />
            </el-select>
            <el-tooltip class="item" effect="dark" content="制氧机机器或系统分配的ID" placement="right-end">
              <i class="el-icon-question" style="width: 20px;height: 20px;margin-left: 15px"></i>
            </el-tooltip>
          </el-form-item>
          <div style="display: flex;flex-direction: row;justify-content: center;align-items: center">
            <el-button type="primary" @click="submitForm()" style="width: 100px">提交</el-button>
          </div>
        </el-form>
      </el-dialog>
      <div class="tab_main" v-if="is_from">
        <div class="tab_main_div" style="margin-top: 50px">
          <div class="tab_main_hread">
            <a style="color: #20a0ff" @click="recordShow()">更换记录</a>
            <a>制氧机SN：{{snNOOne}}</a>
            <a @click="colseClickShow()" style="color: #20a0ff">取消</a>
          </div>
          <div class="tab_mian_content">
            <div style="display: flex;flex-direction: column;">
              <el-button class="tab_button" v-if="!list">请先关联部件</el-button>
              <el-button class="tab_button" v-if="list" v-for="item in list" :style='partId == item.partId?"background-color:#97a8be":"background-color:aliceblue"' :key="item.relId"
                         @click="getRelShow({partId:item.partId,relId:item.relId,partName:item.partName})">{{item.partName}}
              </el-button>
            </div>
            <el-table
              v-loading="listLoading"
              :data="list_data"
              element-loading-text="Loading"
              style="border: 1px solid #EBEEF5"
              fit
              highlight-current-row
            >
              <el-table-column align="center" width="150">
                <template slot="header" slot-scope="scope">
                  <a>{{button_name}}</a>
                  <i v-if="list_data.length == 0" class="el-icon-circle-plus" style="color: red;font-size: 25px;margin-left: 20px" @click="editShow()"></i>
                </template>
                <template slot-scope="scope">
                  <a>{{scope.row.specName}}</a>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="created_at" label="请输入S/N" width="450">
                <template slot-scope="scope">
                  <div style="width:450px;display:flex;flex-direction:row;justify-content: center;align-items: center">
                    <el-input v-model="scope.row.snNo" :disabled="is_input" class="input_class" placeholder="请输入S/N" clearable
                              style="width: 220px;border: none" v-input-filter:china/>
                    <el-button type="primary"  v-if='!is_input && user.type == "OPT"' @click="addShow({id:scope.row.id,snNo:scope.row.snNo})"
                               style="width: 70px;height: 30px;padding:0px;margin-left: 20px">提交
                    </el-button>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <el-button type="text" size="small" v-if='is_input && user.type == "OPT"'
                             @click="editShow({id:scope.row.id,specId:scope.row.specId})">更换
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </el-tab-pane>
    <el-dialog title="维护设备型号" :visible.sync="is_model" width="400px" :close-on-click-modal="false" z-index="1000" @close="colseModelClick()">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
        <el-form-item label="型号">
          <el-select v-model="ruleForm.modelName" clearable placeholder="请选择设备型号"
                     style="width: 200px;" @change="controlShow">
            <el-option
              v-for="item in ruleForm.model_list"
              :key="item.id"
              :label="item.name"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <div style="display: flex;flex-direction: row;justify-content: center;align-items: center">
          <el-button type="primary" @click="submitFormModel()" style="width: 100px">提交</el-button>
        </div>
      </el-form>
    </el-dialog>
    <el-dialog :title="'SN:'+snNOOne+'选择部件规格'" :visible.sync="is_from_two" width="500px" :close-on-click-modal="false">
      <div class="tab_mian_content" style="background-color: white;position: relative;">
        <div>
          <el-radio-group v-model="specId" style="display: flex;
flex-direction: column;width:280px;margin-top: 20px;margin-left: 20px">
            <el-radio style="height: 30px" v-for="item in list_button_spec" :key="item.specId"
                      :label="item.specId" v-if="partId != item.specId">{{item.name}}
            </el-radio>
          </el-radio-group>
        </div>
      </div>
      <div style="display: flex;flex-direction: row;justify-content: flex-end;align-items: center;margin-top: 20px">
        <span v-if="list_button_spec.length == 0" style="margin-right: 20px;font-size: 10px;color: #97a8be">暂无更多可替换规格，请到设备部件管理配置</span>
        <el-button type="primary" @click="updateShow()" style="width: 70px;height: 30px;padding:0px">确定
        </el-button>
      </div>
    </el-dialog>
  </el-tabs>
</template>

<script>
import VDistpicker from "v-distpicker";
import {
  computerControlList, equipmentPartDetail,
  computerContorlAdd,
  equipmentSpecPartYes,
  activationOk,
  equipSetting,
  computerGeneralSelect, equipmentSpecPartYesSpec,
  equipmentSpecPartYesSpecSN, equipmentSpecPartYesUpdate,
  activationIs, equipmentPartSpecList, equipmentSpecPartNo, equipmentSpecPartRel, equipmentList, updateEquipModel
} from "@/api/table";
import {getBaseUrl} from "@/utils/auth";
import inputFilter from "@/utils/input";

export default {
  name: 'computer_distributed',
  components: {VDistpicker},
  directives: {
    inputFilter
  },
  data() {
    return {
      id: '',
      type: '',
      controlId:'',
      user: JSON.parse(sessionStorage.getItem("user")),
      buttonArray:JSON.parse(sessionStorage.getItem("buttonArray")),
      value: '',
      pane_name: 'on',
      list_table_data: [],
      listLoading: true,
      is_update:false,
      pageNo: 1,
      pageSize: 10,
      list: [],
      list_data: [],
      typeCode: '',
      is_from: false,
      is_from_one: false,
      is_from_two: false,
      is_model:false, //设备型号弹窗
      part_id:'', //设备id
      list_button: [],
      list_table: [],
      button_name: '',
      list_button_spec: [],
      group_list_data: [],
      relId: '',
      specId: '',
      equipId:"",
      groupSN:"",
      partId: '',
      relSpecId: '',
      groupId: '',
      snNO: '',
      snNOOne:"",
      notInId: '',
      ruleForm: {
        value: '',
        options: [],
        model_list:[],
        modelId: "",
      },
      rules: {
        value: [
          {required: true, message: '请选择S/N', trigger: 'blur'},
        ],
        modelName: [{required: true, message: '请选择', trigger: 'blur'}],
      },
      is_edit: false,
      is_input:false,
      timer:'',
      time_number:0,
    }
  },
  created() {
    this.id = this.$router.currentRoute.query.id
    this.controlId = this.$router.currentRoute.query.controlId
    // computerControlList(getBaseUrl({
    //   roomId: this.id,
    //   pageSize: this.pageSize,
    //   pageNo: this.pageNo,
    //   typeCode: "OXY"
    // })).then(res => {
    //   if(res.code !=0) {
    //     this.list_table_data = res.data.list
    //     this.list_table = res.data.list
    //     this.groupId = res.data.list.length !=0 ?res.data.list[0].id:""
    //     this.groupSN = res.data.list.length !=0 ?res.data.list[0].snNo:""
    //     this.listLoading = false
    //     this.list_table.map(item => {
    //       if(item.params){
    //         item.params = JSON.parse(item.params);
    //       }
    //     })
    //   }
    // })
    this.computerControlListShow()
  },
  methods: {
    computerControlListShow(){
      computerControlList(getBaseUrl({
        roomId: this.id,
        pageSize: this.pageSize,
        pageNo: this.pageNo,
        typeCode: "OXY"
      })).then(res => {
        if(res.code !=0) {
          this.list_table_data = res.data.list
          this.list_table = res.data.list
          this.groupId = res.data.list.length !=0 ?res.data.list[0].id:""
          this.groupSN = res.data.list.length !=0 ?res.data.list[0].snNo:""
          this.listLoading = false
          this.list_table.map(item => {
            if(item.params){
              item.params = JSON.parse(item.params);
            }
          })
        }
      })
    },

    addShow(e) {
      //添加制氧机
      if (e == 1) {
        this.is_from_one = true
        computerGeneralSelect({typeCode: "OXY",controlId:this.controlId}).then(res => {
          if(res.code !=0) {
            this.ruleForm.options = res.data
          }
        })
      } else {
        //修改
        if(e.snNo == ""){
          this.$message.error("请填写SN")
          return
        }
        equipmentSpecPartYesSpecSN(getBaseUrl({relSpecId: e.id, snNo: e.snNo})).then(res => {
          if(res.code !=0) {
            this.is_input = true
          }
        })
      }
    },
    //更换部件规格
    editShow(e) {
      this.is_from_two = true
      if(e){
        this.notInId = e.specId
        this.relSpecId = e.relSpecId
      }
      equipmentPartDetail(getBaseUrl({equipId: this.equipId,partId: this.partId, notInId: this.notInId})).then(res => {
        if (res.code != 0) {
          this.list_button_spec = res.data
        }
      })
    },
    //维护设备型号
    model_show(e){
      this.part_id = e
      this.is_model = true
      equipmentList(getBaseUrl({
        pageNo: 1,
        name: "",
        pageSize: 100,
        typeCode: 'OXY'
      })).then(res => {
        if (res.code != 0) {
          let arr = []
          for (let key in res.data.list) {
            arr.push({id: res.data.list[key].id, name: res.data.list[key].name})
          }
          this.ruleForm.model_list = arr
        }
      })
    },
    // 提交设备型号
    submitFormModel(){
      updateEquipModel({
        id:this.part_id,
        modelId:this.ruleForm.modelId,
      }).then(res =>{
        this.is_model = false
        this.ruleForm.modelName = ''
        this.computerControlListShow()
      })
    },
    // 关闭设备型号选择弹窗
    colseModelClick(){
      this.ruleForm.modelName = ''
      this.is_model = false
    },
    //设备选择
    controlShow(row) {
      this.ruleForm.modelId = row.id
      this.ruleForm.modelName = row.name
    },
    //获取未绑定部件规格详情
    getSpecShow() {
      equipmentPartDetail(getBaseUrl({equipId: this.groupId,partId: this.button_id})).then(res => {
        if(res.code !=0) {
          this.list_button_spec = res.data
        }
      })
    },
    colseClickOn() {
      this.is_part = false
      this.getGroupListOxy()
    },
    //点击已绑定的规格列表
    buttonShow(e) {
      this.button_id = e
      this.specId = ""
      this.getSpecShow()
    },
    //获取已绑定部件规格列表
    getRelShow(e) {
      this.notInId = ''
      this.ruleForm.modelId = ''
      this.ruleForm.modelName = ''
      if (e) {
        this.relId = e.relId
        this.partId = e.partId
        this.button_name = e.partName
      }
      equipmentSpecPartYesSpec(getBaseUrl({relId: this.relId})).then(res => {
        if(res.code !=0) {
          this.list_data = res.data
          if(res.data.length != 0 && res.data[0].snNo){
            this.is_input = true
          }else {
            this.is_input = false
          }
        }
      })
    },
    //更新
    updateShow() {
      var up_data = {
        equipId: this.groupId, //设备id
        newSpecId: this.specId, //新的规格id
        partId: this.partId,  //部件id
        relPartId: this.relId, //部件关联id
        relSpecId: this.notInId, //关联规格id
      }
      equipmentSpecPartYesUpdate(getBaseUrl(up_data)).then(res => {
        if(res.code !=0) {
          this.is_from_two = false
          this.specId = ''
          // this.$router.go(0);
          this.getRelShow()
        }
      })
    },
    colseClick() {
      this.is_from_two = false
      this.is_from_one = false
    },
    closeShow() {
      this.is_distribution = false
    },
    colseClickShow() {
      this.is_from = false
      this.list_data = []
      this.$router.go(0);
    },
    //添加控制器
    submitForm() {
      computerContorlAdd(getBaseUrl({equipId: this.ruleForm.value, roomId: this.id})).then(res => {
        if(res.code !=0) {
          this.$router.go(0);
        }
      })
    },
    deviceShow(e) {
      //查询设备已关联部件
      this.snNOOne = e.snNo
      this.equipId = e.id
      equipmentSpecPartYes(getBaseUrl({equipId:this.equipId, typeCode: "OXY"})).then(res => {
        if(res.code !=0) {
          this.is_from = true
          if(e.isActivation =='YES' && this.user.type =='OPT'){
            this.is_update = true
          }else {
            this.is_update = false
          }
          if (res.data) {
            this.list = res.data
            this.button_name = res.data[0].partName
            this.partId = res.data[0].partId
            this.relId = res.data[0].relId
            this.getRelShow()
          }
        }
      })
    },

    handleClick(e) {
      this.$confirm('激活后,设备将会自动上报设备运行状态', '安装Ok后,确定激活?', {
        confirmButtonText: '确定激活',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.equipId = e
        activationOk(getBaseUrl({equipId: e})).then(res => {
          if(res.code !=0) {
            this.time_number = 0
            this.$router.go(0)

          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });
    },
    recordShow() {
      this.$router.push({name: 'record', query: {equipId: this.equipId, partId: this.partId,snNo:this.snNOOne}})
    },

  }
}
</script>

<style scoped>
.details_from {
  width: 70%;
  height: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 50px;
  background-color: #97a8be;
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
  width: 120px;
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

.tab_main {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  position: fixed;
  z-index: 20;
  background: rgba(0, 0, 0, 0.5);
  top: 0;
  left: 0;
}

.tab_main_div {
  /*width: 70%;*/
  height: 50%;
  display: flex;
  flex-direction: column;
  border: 1px solid #d3dce6;
  border-radius: 10px;
  background-color: white;
}

.tab_main_hread {
  width: 100%;
  height: 60px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  border-bottom: 1px solid #d3dce6;
  align-items: center;
}

.tab_mian_content {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.tab_button {
  width: 100px;
  height: 50px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background: aliceblue;
  border-radius: 0px;
  border: none;
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

.el-button + .el-button {
  margin-left: 0px;
}

.tab_button:hover {
  background-color: #97a8be;
  color: #2b2f3a;
}
.tab_button:focus{
  background-color: #97a8be;
  color: white;
}
</style>
<style>
.el-input__inner {
  height: 30px;
  padding: 0 10px;
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
