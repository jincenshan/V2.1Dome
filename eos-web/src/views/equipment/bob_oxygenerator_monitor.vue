<template>
  <div class="app-container">
    <div class="block">
      <el-input v-model="snNo" class="input_class" placeholder="请输入氧疗机S/N" clearable />
      <el-input v-model="roomName" class="input_class" placeholder="请输入所在机房" clearable />
      <el-input v-model="optName" class="input_class" placeholder="请输入所属运营商" clearable />
      <el-select v-model="modelId" clearable placeholder="按氧疗机型号" style="width: 160px">
        <el-option
          v-for="item in options_ids"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <el-select v-model="status" clearable placeholder="按使用状态" style="margin-left: 10px;width: 160px">
        <el-option
          v-for="item in options_type"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-date-picker
        v-model="timedata"
        type="daterange"
        range-separator="至"
        start-placeholder="激活时间"
        end-placeholder="激活时间"
        style="margin-left:10px"
      />
      <el-date-picker
        v-model="timedata1"
        type="daterange"
        range-separator="至"
        start-placeholder="最近一次更新时间"
        end-placeholder="最近一次更新时间"
        style="margin-left:10px"
      />
    </div>
    <div class="block" style="display: flex;flex-direction: row;justify-content: flex-end">
      <el-button style="margin-left:100px;background-color: #30B08F;color: white" @click="searchShow()">查询</el-button>
      <el-button type="warning" @click="resetForm()">重置</el-button>
      <button type="button" class="el-button el-button--primary el-button--medium" @click="dialogFormVisible = true" v-if="list.length !=0 && buttonArray.includes('canExport')"><i
        class="el-icon-document"/><span>
        导出 Excel
      </span></button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      style="border: 1px solid #EBEEF5;width: 100%"
      highlight-current-row
    >
      <el-table-column align="center" label="氧疗机ID" width="200">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>
      <el-table-column label="氧疗机SN" width="150" align="center">
        <template slot-scope="scope">{{ scope.row.snNo }}</template>
      </el-table-column>
      <el-table-column label="所属机房" width="150" align="center">
        <template slot-scope="scope">
          <span style="color: #20a0ff" @click="listDetail(scope.row.roomId)">{{ scope.row.roomName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="氧疗机识别编号" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.distCode }}</template>
      </el-table-column>
      <el-table-column class-name="status-col" label="氧疗机型号" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.modelName }}</template>
      </el-table-column>
      <el-table-column class-name="status-col" label="累计出氧量（m³）" width="170" align="center" prop="totalOxyOutput" sortable>
        <template slot-scope="scope">
          <span>{{scope.row.totalOxyOutput}}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="总运行时长（h）" width="150" align="center">
        <template slot-scope="scope"><span>{{scope.row.useTotalDuration}}</span></template>
      </el-table-column>
      <el-table-column class-name="status-col" label="连续运行时长（min）" width="180" align="center">
        <template slot-scope="scope">{{ scope.row.continuousUseDuration }}</template>
      </el-table-column>
      <el-table-column class-name="status-col" label="输出压力（kg/m²）" width="110" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.outputPressure}}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="出气压力（kg/m²）" width="110" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.outputPressure}}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="氧气浓度" width="150" align="center" prop="potency" sortable>
        <template slot-scope="scope">
          <span>{{ scope.row.potency}}%</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="瞬时流量" width="150" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.instantFlow}}L/min</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="设备使用状态" width="110" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.status == 'NORMAL'">正常使用</span>
          <span v-if="scope.row.status == 'STOP'">停止使用</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="设备运行状态" width="150" align="center">
        <template slot-scope="scope" >
          <span v-if=" scope.row.runningState == 'RUNNING'">运行中</span>
          <span v-if=" scope.row.runningState == 'RESTING'">休息中</span>
          <span v-if=" scope.row.runningState == 'UNCONNECTED'">未连接</span>
          <span v-if=" scope.row.runningState == 'ARREARS'">欠费停机</span>
          <span v-if=" scope.row.runningState == 'OVERSTEP'">额外用完</span>
          <span v-if=" scope.row.runningState == 'NONWORKING'">非供氧时段</span>
          <span v-if=" scope.row.runningState == 'ALARM'">报警</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="激活时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time"/>
          <span>{{ scope.row.activationDate}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="最近一次更新时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time"/>
          <span>{{ scope.row.lastSyncTime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right" width="300" v-if="buttonArray.includes('bob_hs_n')||buttonArray.includes('bob_part_n')">
        <template slot-scope="scope">
<!--          <el-button type="text" style="padding: 0px;" size="small" @click="clickOk(scope.row)" v-if="buttonArray.includes('oxy_status_n')">设备启停</el-button>-->
          <el-button type="text" style="padding: 0px;" size="small" @click="handleClick(scope.row)" v-if="buttonArray.includes('bob_part_n')">部件运行详情</el-button>
          <el-button type="text" style="padding: 0px;" size="small" @click="addressShow(scope.row)" v-if="buttonArray.includes('bob_hs_n')">历史记录</el-button>
<!--          <el-button type="text" style="padding: 0px;" size="small" @click="addressShowN(scope.row)" v-if="buttonArray.includes('oxy_addres_n')">位置轨迹</el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <div class="block" style="margin-top: 10px;">
      <el-pagination
        background
        :current-page.sync="pageNo"
        :page-size="pageSize"
        layout="total,prev, pager, next, jumper"
        :total="total"
        @current-change="handleCurrentChange"
        @next-click="handNextClick()"
        @prev-click="handPrevClick()"
      />
    </div>
    <el-dialog title="氧疗机使用状态维护" :visible.sync="is_from" width="400px":close-on-click-modal="false">
      <el-form :model="ruleForm" ref="ruleForm" label-width="150px" class="demo-ruleForm">
        <div style="display: flex;flex-direction: row;justify-content: center;align-items: center;margin-top: 20px;margin-bottom: 20px">
          <el-select v-model="ruleForm.status" clearable placeholder="请选择使用状态">
            <el-option
              v-for="item in options_type"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <div style="display: flex;flex-direction: row;justify-content: space-around;align-items: center">
          <div style="display: flex;flex-direction: column;font-size: 8px;color: #8c939d">
            <span>停用后，设备将无法正常工作</span>
          </div>
          <el-button type="primary" @click="submitForm()" style="width: 100px">提交</el-button>
        </div>
      </el-form>
    </el-dialog>
    <el-dialog title="导出表格" :visible.sync="dialogFormVisible" :close-on-click-modal="false" @close="importClose">
      <el-form :model="form" :rules="rules">
        <div style="display: flex;flex-direction: row">
          <el-form-item label="文件名" :label-width="formLabelWidth" prop="fileName">
            <el-input v-model="form.fileName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="表名" :label-width="formLabelWidth" prop="sheetName">
            <el-input v-model="form.sheetName" autocomplete="off"></el-input>
          </el-form-item>
        </div>
        <div style="display: flex;flex-direction: row" v-if="form.allExport=='true'">
          <el-form-item label="导出几页" :label-width="formLabelWidth">
            <el-input type="number" v-model="form.pageNo" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="分页大小" :label-width="formLabelWidth">
            <el-input type="number" v-model="form.pageSize" autocomplete="off"></el-input>
          </el-form-item>
        </div>
        <el-form-item label="导出" :label-width="formLabelWidth" prop="allExport">
          <el-radio v-model="form.allExport" label="true">全部导出</el-radio>
          <el-radio v-model="form.allExport" label="false">导出当前页</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="exportExcel()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {equipmentList, oxyMonitorList, oxyShutdown} from '@/api/table'
import {getBaseUrl} from '@/utils/auth'
import {parseTime} from "@/utils";

export default {
  name: 'bob_oxygenerator_monitor',
  data() {
    return {
      list: [],
      id:"",
      controlId:'',
      user: JSON.parse(sessionStorage.getItem("user")),
      buttonArray:JSON.parse(sessionStorage.getItem("buttonArray")),
      listLoading: true,
      pageNo: 1,
      roomName: "",
      status: "",
      pageSize: 10,
      total:0,
      snNo: "",
      options_ids: [],
      modelId: "",
      type_name:'',
      options_type: [{
        label: '正常使用',
        value: 'NORMAL'
      }, {
        label: '停止使用',
        value: 'STOP'
      }],
      option1: [{
        value: 'OXY',
        label: '氧调'
      }, {
        value: 'EOS',
        label: '标准化安全氧疗'
      }, {
        value: 'BBY',
        label: '抱抱氧'
      }],
      timedata: [],
      resolve_id:'',
      timedata1:[],
      optName:"",
      is_from:false,
      ruleForm:{
        status:'',
      },
      dialogFormVisible: false,
      form: {
        fileName:"",
        sheetName:"",
        allExport:"",
        excelColumn:[],
        excelHead:[],
        export:'',
        pageNo:'',
        pageSize:'',
      },
      rules: {
        fileName: [{required: true, message: "请输入", trigger: 'blur'}],
        sheetName: [{required: true, message: "请输入", trigger: 'blur'}],
        allExport:[{required: true, message: "请选择", trigger: 'blur'}],
      },
      formLabelWidth: '120px',
    }
  },
  created() {
    this.id = this.$router.currentRoute.query.id
    this.controlId = this.$router.currentRoute.query.controlId
    equipmentList(getBaseUrl({
      pageNo: 1,
      name: "",
      pageSize: 100,
      typeCode: 'OXY'
    })).then(res => {
      if(res.code != 0) {
        let arr = []
        for (let key in res.data.list) {
          arr.push({id: res.data.list[key].id, name: res.data.list[key].name})
        }
        this.options_ids = arr
      }
    })
    this.fetchData()
  },
  methods: {
    fetchData() {
      let list_params = {
        pageNo: this.pageNo,
        actEndTime: this.timedata[1] ? parseTime(this.timedata[1]).substring(0, 10) + ' 23:59:59' : '',
        actStartTime: this.timedata[0] ? parseTime(this.timedata[0]).substring(0, 10) + ' 00:00:00' : '',
        modEndTime:this.timedata1[1] ? parseTime(this.timedata1[1]).substring(0, 10) + ' 23:59:59' : '',
        modStartTime: this.timedata1[0] ? parseTime(this.timedata1[0]).substring(0, 10) + ' 00:00:00' : '',
        status: this.status,
        modelId: this.modelId,
        pageSize: this.pageSize,
        roomName: this.roomName,
        optName:this.optName,
        snNo: this.snNo,
        id:this.id,
        controlId:this.controlId,
        productLine: 'BBY',
        token: sessionStorage.getItem("token"),
      }
      oxyMonitorList(list_params).then(res => {
        if(res.code != 0) {
          this.list = res.data.list
          this.total = parseInt(res.data.total)
          this.listLoading = false
        }
      })
    },
    searchShow(){
      this.id = ""
      this.controlId = ""
      this.fetchData()
    },
    importClose() {
      this.form = {
        fileName: "",
        sheetName: "",
        allExport: "",
        excelColumn: [],
        excelHead: [],
        export: '',
        pageNo: '',
        pageSize: '',
      }
    },
    //重置
    resetForm() {
      this.snNo = ''
      this.name = ''
      this.status = ''
      this.timedata = []
      this.timedata1 = []
      this.modelId = ''
      this.roomName = ''
      this.optName = ''
      this.pageNo = 1
      this.fetchData()
    },
    handleClick(row) {
      this.$router.push({name: 'part_sun_details', query: {equipId: row.id, typeCode: "OXY",snNo:row.snNo}})
    },
    //激活
    clickOk(row){
      this.resolve_id = row.id
      this.type_name = row.type_name
      this.ruleForm.status = row.status
      this.is_from = true
    },
    submitForm(){
      let add_data = {
        id:this.resolve_id,
        status: this.ruleForm.status,
      }
      oxyShutdown(getBaseUrl(add_data)).then(res=>{
        if(res.code != 0) {
          this.is_from = false
          this.$router.go(0)
        }
      })
    },
    colseClick() {
      this.is_from = false
    },
    listDetail(e){
      this.$router.push({name: 'computer_room_details', query: {id: e, type: 1}})
    },
    addressShow(row){
      this.$router.push({name: 'oxygenerator_history', query: {equipId: row.id, typeCode: "OXY",snNo:row.snNo}})
    },
    addressShowN(row){
      this.$router.push({name: 'part_address', query: {equipId: row.id, snNo:row.snNo}})
    },
    handleCurrentChange(val) {
      this.pageNo = val
      this.fetchData()
    },
    handNextClick(){
      this.pageNo = this.pageNo + 1
      this.fetchData()
    },
    handPrevClick(){
      if(this.pageNo == 1){
        return
      }else {
        this.pageNo = this.pageNo - 1
      }
      this.fetchData()
    },
    // 导出表格
    exportExcel() {
      var params ={
        actEndTime: this.timedata[1] ? parseTime(this.timedata[1]).substring(0, 10) + ' 23:59:59' : '',
        actStartTime: this.timedata[0] ? parseTime(this.timedata[0]).substring(0, 10) + ' 00:00:00' : '',
        modEndTime:this.timedata1[1] ? parseTime(this.timedata1[1]).substring(0, 10) + ' 23:59:59' : '',
        modStartTime: this.timedata1[0] ? parseTime(this.timedata1[0]).substring(0, 10) + ' 00:00:00' : '',
        status: this.status,
        modelId: this.modelId,
        roomName: this.roomName,
        optName:this.optName,
        snNo: this.snNo,
        id:this.id,
        controlId:this.controlId,
        productLine: 'BBY',
        token: sessionStorage.getItem("token"),
        pageNo: this.form.pageNo,
        pageSize: this.form.pageSize,
        fileName:this.form.fileName,
        sheetName:this.form.sheetName,
        allExport:this.form.allExport,
        excelColumn: ['id','snNo','roomName','controlName','productLine','distCode','modelName','totalOxyOutput','useTotalDuration','outputPressure','outputPressure','potency','instantFlow','status','runningState','activationDate','lastSyncTime'],
        excelHead:["氧疗机ID","氧疗机SN","所属机房","所属控制器","产品线","氧疗机识别编号","氧疗机型号","累计出氧量(m³)","总运行时长(h)","输出压力(kg/m²)","出气压力(kg/m²)","氧气浓度(%)","瞬时流量(L/min)","设备使用状态","设备运行状态","激活时间","最近一次更新时间"],
        export:true,
      }
      if(this.form.fileName == "" || this.form.sheetName == "" || this.form.allExport == ""){
        this.$message.error("请填写完整")
        return
      }
      oxyMonitorList(params).then(res =>{
        if(res.code != 0) {
          this.dialogFormVisible = false
          const blob = new Blob([res])
          if ('download' in document.createElement('a')) { // 非IE下载
            const elink = document.createElement('a')
            elink.download = this.form.fileName+".xlsx"
            elink.style.display = 'none'
            elink.href = URL.createObjectURL(blob)
            document.body.appendChild(elink)
            elink.click()
            URL.revokeObjectURL(elink.href) // 释放URL 对象
            document.body.removeChild(elink)
          } else { // IE10+下载
            navigator.msSaveBlob(blob, this.form.fileName+".xlsx")
          }
          this.form = {
            fileName: "",
            sheetName: "",
            allExport: "",
            excelColumn: [],
            excelHead: [],
            export: '',
            pageNo: '',
            pageSize: '',
          }
        }
      })
    },

  }
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
  margin-right: 10px;
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
  width: 400px;
}
</style>
<style>
.el-input--suffix .el-input__inner{
  padding-right: 10px !important;
}
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
.el-table--scrollable-x .el-table__body-wrapper{
  overflow-x: auto;
}
.el-table__fixed-right{
  height: 100% !important;
}
</style>
