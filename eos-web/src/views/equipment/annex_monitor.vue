<template>
  <div class="app-container">
    <div class="block" style="margin-bottom: 20px">
      <el-input v-model="snNo" class="input_class" placeholder="请输入设备S/N" clearable
                style="width: 150px;margin-right: 10px"/>
      <el-input v-model="optName" class="input_class" v-if="user.type == 'PLATFORM'" placeholder="请输入所属运营商" clearable
                style="width: 150px;margin-right: 10px"/>
      <el-input v-model="netName" class="input_class" placeholder="请输入所属网点" clearable
                style="width: 150px;margin-right: 10px"/>
      <el-date-picker
        v-model="value2"
        type="daterange"
        range-separator="至"
        start-placeholder="最近一次更新时间"
        end-placeholder="最近一次更新时间"
      />
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
    >
      <el-table-column align="center" label="终端ID" width="150">
        <template slot-scope="scope">
          {{scope.row.id}}
        </template>
      </el-table-column>
      <el-table-column label="设备SN" width="150" align="center">
        <template slot-scope="scope">{{ scope.row.snNo }}</template>
      </el-table-column>
      <el-table-column class-name="status-col" v-if="user.type == 'PLATFORM'" label="当前所属运营商" width="150" align="center">
        <template slot-scope="scope">{{ scope.row.optName }}</template>
      </el-table-column>
      <el-table-column class-name="status-col" label="所驻网点" width="150" align="center">
        <template slot-scope="scope">
          <span style="color: #20a0ff" @click="listDetail(scope.row.netId)">{{ scope.row.netName }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="附件设备名称" width="150" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.typeCode=='HUMIDIFIER'">加湿器</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="设备型号" width="150" align="center">
        <template slot-scope="scope">{{ scope.row.modelName }}</template>
      </el-table-column>
      <el-table-column class-name="status-col" label="产品线" width="150" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.productLine">{{ scope.row.productLine.replace("OXY","氧调") }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="湿度" width="150" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.humidity}}%</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="设备使用状态" width="150" align="center">
        <template slot-scope="scope" >
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
      <el-table-column align="center" prop="created_at" label="最近一次更新时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" v-if="scope.row.lastSyncTime"/>
          <span>{{ scope.row.lastSyncTime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right" width="250" v-if="buttonArray.includes('annex_hs_n')">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="historyShow(scope.row)" v-if="buttonArray.includes('annex_hs_n')">历史记录</el-button>
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
  import {enclosureList, terminalList} from '@/api/table'
  import {parseTime} from "@/utils";

  export default {
    name: "annex_monitor",
    data() {
      return {
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
      }
    },
    created() {
      this.id = this.$router.currentRoute.query.id
      this.fetchData()
    },
    methods: {
      fetchData() {
        var params = {
          pageNo: this.pageNo,
          endTime: this.value2[1] ? parseTime(this.value2[1]).substring(0, 10) + ' 23:59:59' : '',
          startTime: this.value2[0] ? parseTime(this.value2[0]).substring(0, 10) + ' 00:00:00' : '',
          netName: this.netName,
          optName: this.optName,
          id: this.id,
          pageSize: this.pageSize,
          productLine: this.productLine,
          snNo: this.snNo,
          token: sessionStorage.getItem("token"),
        }
        enclosureList(params).then(res => {
          if (res.code != 0) {
            this.list = res.data.list
            this.total = parseInt(res.data.total)
            this.listLoading = false
          }
        })
      },
      historyShow(row){
        this.$router.push({name: 'annex_history', query: {equipId: row.id,snNo:row.snNo}})
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
          snNo: this.snNo,
          token: sessionStorage.getItem("token"),
          pageNo: this.form.pageNo,
          pageSize: this.form.pageSize,
          fileName: this.form.fileName,
          sheetName: this.form.sheetName,
          allExport: this.form.allExport,
          excelColumn: ['id', 'snNo', 'optName', 'netName', 'typeCode', 'modelName', 'productLine','humidity','status','runningState', 'lastSyncTime'],
          excelHead: ["终端ID", "设备SN", "当前所属运营商", "所驻网点", "附件设备名称", "设备型号", "产品线", "湿度","设备使用状态","设备运行状态", "最近一次更新时间"],
          export: true,
        }
        if(this.form.fileName == "" || this.form.sheetName == "" || this.form.allExport == ""){
          this.$message.error("请填写完整")
          return
        }
        terminalList(params).then(res => {
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
