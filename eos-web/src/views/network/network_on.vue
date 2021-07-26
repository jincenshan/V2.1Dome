<template>
  <div class="app-container">
    <div class="block">
      <el-input v-model="snNo" class="input_class" placeholder="请输入终端S/N" clearable/>
      <el-input v-model="netName" class="input_class" placeholder="请输入所属网点" clearable/>
      <el-date-picker
        v-model="value1"
        type="daterange"
        range-separator="至"
        start-placeholder="激活时间"
        end-placeholder="激活时间"
      />
      <el-date-picker
        v-model="value2"
        type="daterange"
        range-separator="至"
        start-placeholder="最近一次更新时间"
        end-placeholder="最近一次更新时间"
        style="margin-left: 10px;margin-right: 20px"
      />
      <el-button type="danger" v-if="buttonArray.includes('maintain_formwork')" @click="formworkShow()">维护供氧模板</el-button>
      <el-button style="margin-left:20px;background-color: #30B08F;color: white" @click="searchShow()">查询</el-button>
      <el-button type="warning" @click="resetForm()">重置</el-button>
      <button type="button" class="el-button el-button--primary el-button--medium" @click="dialogFormVisible = true"
              v-if="list.length !=0 && buttonArray.includes('canExport')"><i class="el-icon-document"/><span>
        导出 Excel
      </span></button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      style="border: 1px solid #EBEEF5"
      fit
      highlight-current-row
      tooltip-effect="dark"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column align="center" label="终端ID" width="150">
        <template slot-scope="scope">
          {{scope.row.id}}
        </template>
      </el-table-column>
      <el-table-column label="终端SN" width="150" align="center">
        <template slot-scope="scope">{{ scope.row.snNo }}</template>
      </el-table-column>
      <el-table-column class-name="status-col" label="网点名称" width="150" align="center">
        <template slot-scope="scope">
          <span style="color: #20a0ff" @click="listDetail(scope.row.netId)">{{ scope.row.netName }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="设备名称" width="150" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.typeCode == 'GENERAL_CONTROL'">总控终端</span>
          <span v-if="scope.row.typeCode == 'TRANSFER'">中转终端</span>
          <span v-if="scope.row.typeCode == 'ENTER_HOUSE'">入户终端</span>
          <span v-if="scope.row.typeCode == 'OXY_UPTAKE'">取氧终端</span>
          <span v-if="scope.row.typeCode == 'SUB_CONTROL'">分体终端</span>
          <span v-if="scope.row.typeCode == 'OVERALL_SUB_CONTROL'">一体终端</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="终端设备型号" width="150" align="center">
        <template slot-scope="scope">{{ scope.row.modelName }}</template>
      </el-table-column>
      <el-table-column class-name="status-col" label="产品线" width="150" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.productLine">{{ scope.row.productLine.replace("OXY","氧调") }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="累计出氧量" width="120" align="center" prop="totalOxyOutput" sortable>
        <template slot-scope="scope">
          <span>{{scope.row.totalOxyOutput}}L</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="总运行时长（h）" width="150" align="center">
        <template slot-scope="scope"><span>{{scope.row.useTotalDuration}}</span></template>
      </el-table-column>
      <el-table-column class-name="status-col" label="连续运行时长（min）" width="180" align="center">
        <template slot-scope="scope">{{ scope.row.continuousUseDuration }}</template>
      </el-table-column>
      <el-table-column class-name="status-col" label="瞬时流量" width="150" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.instantFlow }}L/min</span></template>
      </el-table-column>
      <el-table-column class-name="status-col" label="供氧管理模板名称" width="150" align="center">
        <template slot-scope="scope">
          <span style="color: #20a0ff" @click="TemplateNameDetail(scope.row.netId)">{{ scope.row.oxyTemplateName }}</span></template>
      </el-table-column>
      <el-table-column class-name="status-col" label="设备使用状态" width="150" align="center">
        <template slot-scope="scope" >
          <span v-if=" scope.row.status == 'NORMAL'">正常使用</span>
          <span v-if=" scope.row.status == 'STOP'">停止使用</span>
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
          <i class="el-icon-time" v-if="scope.row.activationDate"/>
          <span>{{ scope.row.activationDate }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="最近一次更新时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" v-if="scope.row.modifyDate"/>
          <span>{{ scope.row.modifyDate}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right" width="200">
        <template slot-scope="scope">
          <el-button style="padding: 0px;" type="text" size="small" @click="historyShow(scope.row)" v-if="buttonArray.includes('network_up_hs_n')">历史记录</el-button>
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
    <el-dialog title="供氧取氧终端使用状态维护" :visible.sync="is_from" :close-on-click-modal="false" width="400px">
      <el-form :model="ruleForm" ref="ruleForm" label-width="150px" class="demo-ruleForm">
        <div
          style="display: flex;flex-direction: row;justify-content: center;align-items: center;margin-bottom: 20px">
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
            <span>入户终端停用，隶属的取氧终端将会停用</span>
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
  import {homeShutdown, equipmentList, netoxytemplateTerminals} from '@/api/table'
  import {getBaseUrl} from '@/utils/auth'
  import {parseTime} from "@/utils";

  export default {
    name: "network_on",
    data() {
      return {
        options: [{
          value: 'OXY',
          label: '氧调'
        }, {
          value: 'EOS',
          label: '标准化安全氧疗'
        }, {
          value: 'BBY',
          label: '抱抱氧'
        }],
        options_type: [{
          label: '正常使用',
          value: 'NORMAL'
        }, {
          label: '停止使用',
          value: 'STOP'
        }],
        user: JSON.parse(sessionStorage.getItem("user")),
        buttonArray:JSON.parse(sessionStorage.getItem("buttonArray")),
        list: [],
        id: "",
        pageNo: 1,
        pageSize: 10,
        total: 0,
        snNo: "",
        netName: "",
        modelId: "",
        productLine: "",
        optName: "",
        listLoading: true,
        value2: [],
        value1: [],
        resolve_id: '',
        is_from: false,
        ruleForm: {
          status: '',
        },
        options_ids: [],
        dialogFormVisible: false,
        form: {
          fileName: "",
          sheetName: "",
          allExport: "",
          excelColumn: [],
          excelHead: [],
          export: '',
          pageNo: '',
          pageSize: '',
        },
        rules: {
          fileName: [{required: true, message: "请输入", trigger: 'blur'}],
          sheetName: [{required: true, message: "请输入", trigger: 'blur'}],
          allExport:[{required: true, message: "请选择", trigger: 'blur'}],
        },
        formLabelWidth: '120px',
        netIds:[],
      }
    },
    created() {
      this.id = this.$router.currentRoute.query.id
      equipmentList(getBaseUrl({
        pageNo: 1,
        name: "",
        pageSize: 100,
        typeCode: 'ENTER_HOUSE'
      })).then(res => {
        if (res.code != 0) {
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
        var params = {
          actEndTime: this.value1[1] ? parseTime(this.value1[1]).substring(0, 10) + ' 23:59:59' : '',
          actStartTime: this.value1[0] ? parseTime(this.value1[0]).substring(0, 10) + ' 00:00:00' : '',
          pageNo: this.pageNo,
          modEndTime: this.value2[1] ? parseTime(this.value2[1]).substring(0, 10) + ' 23:59:59' : '',
          modStartTime: this.value2[0] ? parseTime(this.value2[0]).substring(0, 10) + ' 00:00:00' : '',
          modelId: this.modelId,
          netName: this.netName,
          optName: this.optName,
          id: this.id,
          pageSize: this.pageSize,
          productLine: this.productLine,
          typeCode: 'ENTER_HOUSE',
          snNo: this.snNo,
          token: sessionStorage.getItem("token"),
        }
        netoxytemplateTerminals(params).then(res => {
          if (res.code != 0) {
            this.list = res.data.list
            this.total = parseInt(res.data.total)
            this.listLoading = false
          }
        })
      },
      historyShow(row){
        this.$router.push({name: 'out_up_history', query: {equipId: row.id, typeCode: "CONTROL",snNo:row.snNo}})
      },
      handleSelectionChange(val){
        const netIds = []
        val.map(item =>{
          return netIds.push(item.netId)
        })
        this.netIds = netIds
      },
      formworkShow(){
        if(!this.netIds || this.netIds.length < 1){
          this.$message({
            message: '请先选择维护网点',
            type: 'warning'
          })
        }else {
          this.$router.push({name: 'network_index', query: {netIds: this.netIds, type: true}})
        }
      },
      searchShow() {
        this.id = ""
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
      handleCurrentChange(val) {
        this.pageNo = val
        this.fetchData()
      },
      handNextClick() {
        this.pageNo = this.pageNo + 1
        this.fetchData()
      },
      handPrevClick() {
        if (this.pageNo == 1) {
          return
        } else {
          this.pageNo = this.pageNo - 1
        }
        this.fetchData()
      },
      listDetail(e) {
        this.$router.push({name: 'operators_dot_detils', query: {id: e, type: 1}})
      },
      TemplateNameDetail(e) {
        this.$router.push({name: 'network_details', query: {id: e}})
      },
      resetForm() {
        this.netName = ""
        this.snNo = ""
        this.optName = ""
        this.value1 = []
        this.value2 = []
        this.modelId = ''
        this.productLine = ''
        this.pageNo = 1
        this.fetchData()
      },
      //激活
      clickOk(row) {
        this.resolve_id = row.id
        this.type_name = row.type_name
        this.ruleForm.status = row.status
        this.is_from = true
      },
      submitForm() {
        let add_data = {
          id: this.resolve_id,
          status: this.ruleForm.status,
        }
        homeShutdown(getBaseUrl(add_data)).then(res => {
          if (res.code != 0) {
            this.is_from = false
            this.$router.go(0)
          }
        })
      },
      // 导出表格
      exportExcel() {
        var params = {
          actEndTime: this.value1[1] ? parseTime(this.value1[1]).substring(0, 10) + ' 23:59:59' : '',
          actStartTime: this.value1[0] ? parseTime(this.value1[0]).substring(0, 10) + ' 00:00:00' : '',
          modEndTime: this.value2[1] ? parseTime(this.value2[1]).substring(0, 10) + ' 23:59:59' : '',
          modStartTime: this.value2[0] ? parseTime(this.value2[0]).substring(0, 10) + ' 00:00:00' : '',
          modelId: this.modelId,
          netName: this.netName,
          optName: this.optName,
          productLine: this.productLine,
          typeCode: 'ENTER_HOUSE',
          snNo: this.snNo,
          token: sessionStorage.getItem("token"),
          pageNo: this.form.pageNo,
          pageSize: this.form.pageSize,
          fileName: this.form.fileName,
          sheetName: this.form.sheetName,
          allExport: this.form.allExport,
          excelColumn: ['id', 'controlSn', 'netName', 'typeCode', 'modelName', 'productLine', 'totalOxyOutput','useTotalDuration','continuousUseDuration', 'instantFlow', 'oxyTemplateName','status','runningState','activationDate', 'modifyDate'],
          excelHead: ["终端ID", "终端SN", "所驻网点", "设备名称", "终端设备型号", "产品线", "累计出氧量(L)", "总运行时长（h）","连续运行时长（min）","瞬时流量(L/min)", "供氧管理模板名称", "设备使用状态","设备运行状态", "激活时间", "最近一次更新时间"],
          export: true,
        }
        if(this.form.fileName == "" || this.form.sheetName == "" || this.form.allExport == ""){
          this.$message.error("请填写完整")
          return
        }
        netoxytemplateTerminals(params).then(res => {
          if (res.code != 0) {
            this.dialogFormVisible = false
            const blob = new Blob([res])
            if ('download' in document.createElement('a')) { // 非IE下载
              const elink = document.createElement('a')
              elink.download = this.form.fileName + ".xlsx"
              elink.style.display = 'none'
              elink.href = URL.createObjectURL(blob)
              document.body.appendChild(elink)
              elink.click()
              URL.revokeObjectURL(elink.href) // 释放URL 对象
              document.body.removeChild(elink)
            } else { // IE10+下载
              navigator.msSaveBlob(blob, this.form.fileName + ".xlsx")
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

<style>
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

  .el-table--scrollable-x .el-table__body-wrapper {
    overflow-x: auto;
  }

  .el-table__fixed-right {
    height: 100% !important;
  }
</style>
