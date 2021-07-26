<template>
  <div class="app-container" style="margin-top: 50px">
    <el-tabs type="border-card" v-model="pane_name" @tab-click="computerList()">
      <el-tab-pane label="入户终端管理" name="on">
        <div>
          <el-button type="danger" @click="addShow(1)" style="margin-bottom: 20px" v-if="type == 2">新增</el-button>
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
          <el-table-column label="入户终端设备SN" width="150" align="center">
            <template slot-scope="scope">{{ scope.row.snNo }}</template>
          </el-table-column>
          <el-table-column label="设备型号" width="150" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.modelName }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="创建时间" width="200">
            <template slot-scope="scope">
              <i class="el-icon-time" />
              <span>{{ scope.row.createDate }}</span>
            </template>
          </el-table-column>
          <el-table-column class-name="status-col" label="激活状态" width="110" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.isActivation}}</span>
            </template>
          </el-table-column>
          <el-table-column class-name="status-col" label="激活时间" width="200" align="center">
            <template slot-scope="scope">
              <i class="el-icon-time" />
              <span>{{ scope.row.activationDate }}</span>
            </template>
          </el-table-column>
          <el-table-column class-name="status-col" label="使用状态" width="110" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.status}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center"  v-if="type == 2" width="100">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="handleClick(scope.row)" v-if="scope.row.isActivation !='已激活'">激活</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="分控终端设备管理" name="up">
        <div>
          <el-button type="danger" @click="subClick()" style="margin-bottom: 20px" v-if="type == 2">新增一体机</el-button>
        </div>
        <el-table
          v-loading="listLoading"
          :data="list_data_up"
          element-loading-text="Loading"
          style="border: 1px solid #EBEEF5"
          fit
          highlight-current-row
        >
          <el-table-column align="center" label="终端编号" width="200">
            <template slot-scope="scope">{{ scope.row.id }}</template>
          </el-table-column>
          <el-table-column label="设备SN" width="150" align="center">
            <template slot-scope="scope">{{ scope.row.snNo}}</template>
          </el-table-column>
          <el-table-column label="设备型号" width="150" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.modelName }}</span>
            </template>
          </el-table-column>
          <el-table-column class-name="status-col" label="房间号" width="150" align="center">
            <template slot-scope="scope">{{ scope.row.distCode }}</template>
          </el-table-column>
          <el-table-column align="center" prop="created_at" label="创建时间" width="200">
            <template slot-scope="scope">
              <i class="el-icon-time"/>
              <span>{{ scope.row.createDate }}</span>
            </template>
          </el-table-column>
          <el-table-column class-name="status-col" label="使用状态" width="110" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.status =='NORMAL'">正常使用</span>
              <span v-if="scope.row.status =='STOP'">停用使用</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center"  v-if="type == 2" width="250">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="handleClick(scope.row)" v-if="scope.row.typeCode=='OVERALL_SUB_CONTROL' && scope.row.isActivation !='YES'">激活</el-button>
              <el-button type="text" size="small" v-if='scope.row.typeCode=="SUB_CONTROL"' @click="subClick(scope.row)">分控设备信息补充</el-button>
              <el-button type="text" size="small" v-if='scope.row.typeCode=="OVERALL_SUB_CONTROL"' @click="deviceShow(scope.row)">设备部件维护</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-dialog :title='addSub?"一体机设备信息补充":"分控设备信息补充"' :visible.sync="is_from_one" @close="colseClick()" width="500px" :close-on-click-modal="false">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm">
            <el-form-item label="一体机SN" prop="subSnNo" v-if="addSub">
              <div style="display: flex;flex-direction: row;width: 300px">
                <el-select v-model="ruleForm.subSnNo" clearable placeholder="请选择一体机SN" style="width: 250px">
                  <el-option
                    v-for="item in ruleForm.suBoptions"
                    :key="item.id"
                    :label="item.snNo"
                    :value="item.snNo"
                  />
                </el-select>
              </div>
            </el-form-item>
            <el-form-item :label='addSub?"设备型号":"分控设备型号"' prop="modelId" v-if="!addSub">
              <div style="display: flex;flex-direction: row;width: 300px">
                <el-select v-model="ruleForm.modelId" clearable placeholder="请选择设备型号" style="width: 250px">
                  <el-option
                    v-for="item in ruleForm.modelId_options"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </div>
            </el-form-item>
            <el-form-item label="房间号批注" prop="roomAnnotation">
              <div style="display: flex;flex-direction: row;width: 300px">
                <el-input v-model="ruleForm.roomAnnotation" style="width: 250px"></el-input>
              </div>
            </el-form-item>
            <div style="display: flex;flex-direction: row;justify-content: center;align-items: center">
              <span style="font-size: 12px;color: #5a5e66;margin-right: 20px">该SN没有写在分控面板内，请参照设备外壳，人工维护</span>
              <el-button type="primary" @click="submitForm(2)" style="width: 100px">保存</el-button>
            </div>
          </el-form>
        </el-dialog>
      </el-tab-pane>
      <el-dialog title="新增入户终端" :visible.sync="is_from" width="400px" :close-on-click-modal="false">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
          <el-form-item label="入户终端S/N" prop="snNo">
            <el-select v-model="ruleForm.snNo" clearable placeholder="按设备S/N" style="width: 200px" @change="selectShow">
              <el-option
                v-for="item in ruleForm.options"
                :key="item.id"
                :label="item.snNo"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <div style="display: flex;flex-direction: row;justify-content: center;align-items: center">
            <el-button type="primary" @click="submitForm(1)" style="width: 100px">提交</el-button>
          </div>
        </el-form>
      </el-dialog>
      <div class="tab_main" v-if="is_from_sub">
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
              <!--              <el-table-column align="center" :label="button_name" width="150">-->
              <!--                <template slot-scope="scope">-->
              <!--                  {{scope.row.specName}}-->
              <!--                </template>-->
              <!--              </el-table-column>-->
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
  </div>

</template>

<script>
  import {
    subControlList,
    controlSubAdd,
    overAllAdd,
    equipmentList,
    subControlSelect,
    networkHouseAdd,
    networkEnterSelect,
    networkEnterList,
    uptakeOk,
    activationIs,
    equipmentSpecPartYes,
    equipmentSpecPartYesSpec,
    equipmentSpecPartYesUpdate,
    equipmentPartDetail
  } from '@/api/table'
  import {getBaseUrl} from "@/utils/auth";
  export default {
    name: "oxygen_uptake",
    data() {
      return {
        user: JSON.parse(sessionStorage.getItem("user")),
        buttonArray:JSON.parse(sessionStorage.getItem("buttonArray")),
        id: '',
        list:[],
        list_data_up:[],
        list_data:[],
        listLoading: true,
        is_from: false,
        is_from_one:false,
        is_from_sub:false,
        is_select: false,
        pane_name:'on',
        timer:'',
        time_number:0,
        equipId:'',
        control_id:"",//控制器id
        addSub:false,//是否添加一体机
        snNOOne:"",

        is_update:false,
        distribution_form: {},
        pageNo: 1,
        pageSize: 10,
        typeCode: '',
        is_from_two: false,
        is_model:false, //设备型号弹窗
        part_id:'', //设备id
        list_table: [],
        button_name: '',
        list_button_spec: [],
        group_list_data: [],
        relId: '',
        specId: '',
        groupSN:"",
        partId: '',
        relSpecId: '',
        groupId: '',
        notInId: '',
        is_part: false,
        is_edit: false,
        is_part_from: false,
        is_input:false,

        ruleForm: {
          options: [],
          snNo:"",
          subSnNo:"",
          netId:"",
          modelId:"",
          roomAnnotation:"",
          modelId_options:[],
          suBoptions:[],
        },
        rules:{
          snNo: [{required: true,message:"请输入", trigger: 'blur'}],
          subSnNo:[{required: true,message:"请输入", trigger: 'blur'}],
          roomAnnotation: [{required: true,message:"请输入", trigger: 'blur'}],
          modelId: [{required: true,message:"请输入", trigger: 'blur'}],
        }
      }
    },
    created() {
      this.id = this.$router.currentRoute.query.id
      this.type = this.$router.currentRoute.query.type
      networkEnterSelect(getBaseUrl({})).then(res =>{
        if(res.code != 0) {
          let arr = []
          res.data.map(item => {
            arr.push({id: item.id, snNo: item.snNo})
          })
          this.ruleForm.options = arr
        }
      })
      equipmentList(getBaseUrl({typeCode:'SUB_CONTROL'})).then(res =>{
        if(res.code != 0) {
          this.ruleForm.modelId_options = res.data.list
        }
      })
      this.fetchData();
    },
    methods: {
      fetchData() {
        networkEnterList(getBaseUrl({netId:this.id})).then(res =>{
          if(res.code != 0 && res.data) {
            let list = []
            list.push(res.data)
            this.list = list
          }
          this.listLoading = false
        })
      },
      colseClick() {
        this.is_from = false
        this.is_from_one =false
        this.addSub = false
        this.ruleForm.number = ""
      },
      //添加弹窗
      addShow(e) {
        this.is_from = true
      },
      //提交
      submitForm(e) {
        if(e == 1) {
          networkHouseAdd(getBaseUrl({netId: this.id, snNo: this.ruleForm.snNo})).then(res => {
            if (res.code != 0) {
              this.is_from = false
              this.$router.go(0);
            }
          })
        }else {
          if(this.addSub){
            if(this.ruleForm.subSnNo == "" ||this.ruleForm.roomAnnotation ==""){
              this.$message.error('请完整填写信息')
              return
            }
            overAllAdd(getBaseUrl({netId: this.id,snNo:this.ruleForm.subSnNo,roomAnnotation:this.ruleForm.roomAnnotation})).then(res =>{
              if (res.code != 0) {
                this.is_from_one = false
                this.ruleForm.subSnNo = ""
                this.ruleForm.roomAnnotation = ""
                this.computerList()
              }
            })
          }else {
            if(this.ruleForm.modelId == "" ||this.ruleForm.roomAnnotation ==""){
              this.$message.error('请完整填写信息')
              return
            }
            controlSubAdd(getBaseUrl({
              id: this.control_id,
              modelId: this.ruleForm.modelId,
              roomAnnotation: this.ruleForm.roomAnnotation
            })).then(res => {
              if (res.code != 0) {
                this.is_from_one = false
                this.ruleForm.modelId = ""
                this.ruleForm.roomAnnotation = ""
                this.computerList()
              }
            })
          }
        }
      },
      //获取时间
      getTime(){
        this.time_number ++;
        activationIs(getBaseUrl({id:this.equipId})).then(res =>{
          if(res.data.isActivation == 'YES'){
            clearInterval(this.timer);
            this.listLoading = false
            this.computerList()
          }
        })
        if(this.time_number == 60){
          clearInterval(this.timer);
        }
      },
      //激活
      handleClick(row) {
        this.$confirm('激活后,设备将会自动上报设备运行状态及设备部件，关联制氧机的数据', '安装Ok后,确定激活?', {
          confirmButtonText: '确定激活',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.equipId = row.id
          uptakeOk(getBaseUrl({equipId: row.id})).then(res => {
            if(res.code !=0) {
              // this.listLoading = true
              this.time_number = 0
              this.computerList()
              // this.timer = setInterval(this.getTime,1000)
            }
          })
        }).catch(() => {

        });
      },
      //切换
      computerList() {
        if (this.pane_name == "up") {
          subControlList(getBaseUrl({netId:this.id,export:false})).then(res =>{
            if(res.code !=0) {
              this.list_data_up = res.data.list
            }
          })
        } else {
          this.fetchData()
        }
      },
      selectShow(e){
        this.ruleForm.netId = e.id
        this.ruleForm.snNo = e.snNo
      },
      //添加一体机或者信息补录
      subClick(row){
        this.is_from_one = true
        if(row){
          this.control_id = row.id
        }else {
          this.addSub = true
          subControlSelect(getBaseUrl({})).then(res =>{
            if(res.code != 0) {
              let arr = []
              res.data.map(item => {
                arr.push({id: item.id, snNo: item.snNo})
              })
              this.ruleForm.suBoptions = arr
            }
          })
        }
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
      //查询已关联设备部件
      deviceShow(e) {
        //查询设备已关联部件
        this.snNOOne = e.snNo
        this.equipId = e.id
        equipmentSpecPartYes(getBaseUrl({equipId:this.equipId, typeCode: "OXY"})).then(res => {
          if(res.code !=0) {
            this.is_from_sub = true
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
      //关闭设备维护窗口
      colseClickShow() {
        this.is_from_sub = false
        // this.$router.go(0);
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
      //更换记录
      recordShow() {
        this.$router.push({name: 'record', query: {equipId: this.equipId, partId: this.partId,snNo:this.snNOOne}})
      },
    },
  }
</script>

<style scoped>
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
  .el-button + .el-button {
    margin-left: 0px;
  }

  .tab_button:hover {
    background-color: #97a8be;
    color: #2b2f3a;
  }
  .tab_button:focus {
    background-color: #97a8be;
    color: white;
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

