<template>
  <div class="app-container">
    <div class="block">
      <el-input v-model="snNo" class="input_class" placeholder="请输入控制器S/N" clearable />
      <el-input v-model="roomName" class="input_class" placeholder="请输入所属机房" clearable />
      <el-select v-model="modelId" clearable placeholder="按控制器型号" style="width: 160px">
        <el-option
          v-for="item in options_ids"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <el-select v-model="equipStatus" clearable placeholder="按设备使用状态" style="margin-left: 10px;width: 160px">
        <el-option
          v-for="item in options_type"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-select v-model="problemStatus" clearable placeholder="问题解决状态" style="margin-left: 10px;width: 160px">
        <el-option
          v-for="item in options_state"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-select v-model="productLine" clearable placeholder="请选择产品线" style="margin-left: 10px;width: 160px">
        <el-option
          v-for="item in option1"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-date-picker
        v-model="timedata"
        type="daterange"
        range-separator="至"
        start-placeholder="发生时间"
        end-placeholder="发生时间"
        style="margin-left:10px"
      />
      <el-button style="margin-left:100px;background-color: #30B08F;color: white" @click="fetchData()">查询</el-button>
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
      <el-table-column align="center" label="异常报警ID" width="200">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>
      <el-table-column label="控制器SN" width="150" align="center">
        <template slot-scope="scope">{{ scope.row.controlSn }}</template>
      </el-table-column>
      <el-table-column label="所驻机房" width="150" align="center">
        <template slot-scope="scope">
          <span style="color: #20a0ff" @click="listDetail(scope.row.roomId)">{{ scope.row.roomName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="控制器型号" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.modelName }}</template>
      </el-table-column>
      <el-table-column class-name="status-col" label="所属产品线" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.productLine }}</template>
      </el-table-column>
      <el-table-column class-name="status-col" label="网点识别编号" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.distCode }}</template>
      </el-table-column>
      <el-table-column class-name="status-col" label="管理制氧机台数" width="110" align="center">
        <template slot-scope="scope">
          <span style="color: #20a0ff" @click="oxyDetail()" v-if="scope.row.oxyCount">{{ scope.row.oxyCount }}</span>
          <span v-if="!scope.row.oxyCount">0</span>台
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="报警问题类型" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.type }}</template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="发生时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time"/>
          <span>{{ scope.row.createDate}}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="原因" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.reason }}</template>
      </el-table-column>
      <el-table-column class-name="status-col" label="解决方案" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.solvePlan }}</template>
      </el-table-column>
      <el-table-column class-name="status-col" label="设备使用状态" width="110" align="center">
        <template  slot-scope="scope">
        <span v-if="scope.row.equipStatus == 'NORMAL'">正常使用</span>
        <span  v-if="scope.row.equipStatus == 'STOP'">停止使用</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="是否解决" width="110" align="center">
        <template slot-scope="scope">{{scope.row.problemStatus}}</template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right" width="250">
        <template slot-scope="scope">
          <el-button type="text" size="small"  v-if="buttonArray.includes('controller_ok') && scope.row.problemStatus !='已解决'" @click="clickOk(scope.row)">解决</el-button>
          <el-button type="text" size="small" v-if="buttonArray.includes('controller_ab_detail')" @click="handleClick(scope.row)">部件运行详情</el-button>
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
    <el-dialog title="问题解决确认" :visible.sync="is_from" width="450px" @close="colseClick" :close-on-click-modal="false">
        <el-form :model="ruleForm" ref="ruleForm" label-width="70px" class="demo-ruleForm">
          <label>{{type_name}}</label>
          <div style="font-size: 12px;width: 80%;margin-bottom: 10px">如涉及到更换部件，请在 网点-设备管理 中，更换部件，输入SN；更换部件信息否则后续设备将无法正常工作</div>
          <el-form-item label="原因">
            <el-input
              type="textarea"
              :rows="2"
              placeholder="请输入原因"
              v-model="ruleForm.reason"
              style="width: 290px"
            >
            </el-input>
          </el-form-item>
          <el-form-item label="解决方案">
            <el-input
              type="textarea"
              :rows="2"
              placeholder="请输入解决方案"
              v-model="ruleForm.solvePlan"
              style="width: 290px">
            </el-input>
          </el-form-item>
          <div style="display: flex;flex-direction: row;justify-content: center;align-items: center">
            <el-button type="primary" style="width: 150px" @click="recordShow()">更换部件信息</el-button>
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
  import {equipmentList, controlExceptionList, oxyExceptionSolve, networkList} from '@/api/table'
  import {getBaseUrl} from '@/utils/auth'
  import {parseTime} from "@/utils";

  export default {
    name: 'controller_abnormal',
    data() {
      return {
        list: [],
        user:JSON.parse(sessionStorage.getItem("user")),
        buttonArray:JSON.parse(sessionStorage.getItem("buttonArray")),
        listLoading: true,
        pageNo: 1,
        total:0,
        name: "",
        roomName: "",
        equipStatus: "",
        pageSize: 10,
        snNo: "",
        snNOOne:"",
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
        problemStatus: "",
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
        options_state: [{
          value: 'RESOLVED',
          label: '已解决'
        }, {
          value: 'WAIT_SOLVE ',
          label: '待解决'
        }, {
          value: 'UNSOLVED ',
          label: '未解决'
        }],
        productLine: '',
        timedata: [],
        resolve_id:'',
        is_from:false,
        ruleForm:{
          reason:"",
          solvePlan:""
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
      equipmentList(getBaseUrl({
        pageNo: 1,
        name: "",
        pageSize: 100,
        typeCode: 'CONTROL'
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
          endTime: this.timedata[1] ? parseTime(this.timedata[1]).substring(0, 10) + ' 23:59:59' : '',
          startTime: this.timedata[0] ? parseTime(this.timedata[0]).substring(0, 10) + ' 23:59:59' : '',
          equipStatus: this.equipStatus,
          problemStatus: this.problemStatus,
          modelId: this.modelId,
          name: this.name,
          pageSize: this.pageSize,
          roomName: this.roomName,
          snNo: this.snNo,
          productLine: this.productLine,
          token: sessionStorage.getItem("token"),
        }
        controlExceptionList(list_params).then(res => {
          if(res.code != 0) {
            this.list = res.data.list
            this.total = parseInt(res.data.total)
            this.listLoading = false
          }
        })
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
        this.equipStatus = ''
        this.problemStatus = ''
        this.productLine = ''
        this.timedata = []
        this.modelId = ''
        this.roomName = ''
        this.pageNo = 1
        this.fetchData()
      },
      handleClick(row) {
        this.$router.push({name: 'part_sun_details', query: {equipId: row.id, typeCode: "CONTROL",snNo:row.controlSn}})
      },
      listDetail(e){
        this.$router.push({name: 'computer_room_details', query: {id: e, type: 1}})
      },
      oxyDetail(){
        this.$router.push({name: 'oxygenerator_monitor'})
      },
      //激活
      clickOk(row){
        this.resolve_id = row.id
        this.snNOOne = row.snNo
        this.type_name = row.type_name
        this.is_from = true
      },
      submitForm(){
        let add_data = {
          id:this.resolve_id,
          reason: this.ruleForm.reason,
          solvePlan: this.ruleForm.solvePlan,
        }
        oxyExceptionSolve(getBaseUrl(add_data)).then(res=>{
          if(res.code != 0) {
            this.is_from = false
            this.$router.go(0)
          }
        })
      },
      colseClick() {
        this.is_from = false
        this.ruleForm.reason = ""
        this.ruleForm.solvePlan = ""
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
      recordShow() {
        this.$router.push({name: 'record', query: {equipId: this.resolve_id, partId: this.partId,snNo:this.snNOOne}})
      },
      // 导出表格
      exportExcel() {
        var params ={
          endTime: this.timedata[1] ? parseTime(this.timedata[1]).substring(0, 10) + ' 23:59:59' : '',
          startTime: this.timedata[0] ? parseTime(this.timedata[0]).substring(0, 10) + ' 23:59:59' : '',
          equipStatus: this.equipStatus,
          problemStatus: this.problemStatus,
          modelId: this.modelId,
          name: this.name,
          roomName: this.roomName,
          snNo: this.snNo,
          productLine: this.productLine,
          token: sessionStorage.getItem("token"),
          pageNo: this.form.pageNo,
          pageSize: this.form.pageSize,
          fileName:this.form.fileName,
          sheetName:this.form.sheetName,
          allExport:this.form.allExport,
          excelColumn: ['id','controlSn','roomName','modelName','productLine','distCode','oxyCount','type','createDate','reason','solvePlan','equipStatus','exStatus'],
          excelHead:["异常报警ID","控制器SN","所驻机房","控制器型号","所属产品线","网点识别编号","管理制氧机台数","报警问题类型","发生时间","原因","解决方案","设备使用状态","是否解决"],
          export:true,
        }
        if(this.form.fileName == "" || this.form.sheetName == "" || this.form.allExport == ""){
          this.$message.error("请填写完整")
          return
        }
        controlExceptionList(params).then(res =>{
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
    display: flex;
    flex-direction: column;
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
  .el-table--scrollable-x .el-table__body-wrapper{
    overflow-x: auto;
  }
  .el-table__fixed-right{
    height: 100% !important;
  }
</style>
