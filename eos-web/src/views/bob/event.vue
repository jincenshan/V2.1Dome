<template>
  <div class="app-container">
    <div class="block">
      <el-input v-model="userName" class="input_class" placeholder="操作用户" clearable />
      <el-input v-model="eventName" class="input_class" placeholder="事件名称" clearable />
      <el-input v-model="netName" class="input_class" placeholder="输入网点名称" clearable />
      <el-input v-model="operLocation" class="input_class" placeholder="IP解析地址" clearable />
      <el-date-picker
        v-model="timeDate"
        type="datetimerange"
        range-separator="至"
        start-placeholder="发生时间"
        end-placeholder="发生时间"
        style="margin-left:10px"
      />
      <el-button style="margin-left:100px;background-color: #30B08F;color: white" @click="searchShowData()">查询</el-button>
      <el-button type="warning" @click="resetForm()">重置</el-button>
<!--      <button type="button" class="el-button el-button&#45;&#45;primary el-button&#45;&#45;medium" @click="dialogFormVisible = true" v-if="list.length !=0 && buttonArray.includes('canExport')"><i-->
<!--        class="el-icon-document"/><span>-->
<!--        导出 Excel-->
<!--      </span></button>-->
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      style="border: 1px solid #EBEEF5"
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="事件明细ID" width="200">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>
      <el-table-column label="事件名称" width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.eventName }}
        </template>
      </el-table-column>
      <el-table-column label="备注" width="150" align="center">
        <template slot-scope="scope">{{ scope.row.remark }}</template>
      </el-table-column>
      <el-table-column label="操作用户" width="150" align="center">
        <template slot-scope="scope">
          <span style="color: #20a0ff" @click="listDetail(scope.row.roomId)">{{ scope.row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="昵称" width="150" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.nickname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户操作端口" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.operTerminal }}</template>
      </el-table-column>
      <el-table-column label="IP解析地址" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.operLocation }}</template>
      </el-table-column>
      <el-table-column label="操作网点" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.netName }}</template>
      </el-table-column>
      <el-table-column label="操作设备" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.equipSn }}</template>
      </el-table-column>
      <el-table-column label="关联订单" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.orderNo }}</template>
      </el-table-column>
      <el-table-column align="center" prop="createDate"  label="发生时间" sortable width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.operTime }}</span>
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
import {eventList} from '@/api/table'
import {getBaseUrl} from '@/utils/auth'
import {parseTime} from "@/utils";
export default {
  name: 'event',
  data() {
    return {
      list: [],
      buttonArray:JSON.parse(sessionStorage.getItem("buttonArray")),
      listLoading: true,
      pageNo: 1,
      total:0,
      timeDate:[],
      equipNo: "",
      netName: "",
      pageSize:10,
      operLocation: "",
      userName:"",
      eventName: "",
      specName: "",
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
    const end = new Date();
    const start = new Date();
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
    this.timeDate = [parseTime(start).substring(0, 10) + ' 00:00:00',parseTime(end).substring(0, 10) + ' 23:59:59']
    this.fetchData()
  },
  methods: {
    fetchData() {
      let params = {
        endTime: this.timeDate[1] ? parseTime(this.timeDate[1]).substring(0, 10) + ' 23:59:59' : '',
        netName:this.netName,
        operLocation:this.operLocation,
        eventName: this.eventName,
        userName:this.userName,
        startTime: this.timeDate[0] ? parseTime(this.timeDate[0]).substring(0, 10) + ' 00:00:00' : '',
        pageSize: this.pageSize,
        pageNo: this.pageNo,
        export:false,
      }
      eventList(getBaseUrl(params)).then(res => {
        if(res.code != 0) {
          this.list = res.data.list
          this.total = parseInt(res.data.total)
          this.listLoading = false
        }
      })
    },
    searchShowData(){
      this.pageNo = 1
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
      this.eventName = ''
      this.userName = ''
      this.netName = ''
      this.operLocation = ''
      this.timeDate = []
      this.pageNo = 1
      this.fetchData()
    },
    listDetail(e){
      // this.$router.push({name: 'computer_room', query: {roomId: e}})
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
        netName:this.netName,
        eventName: this.eventName,
        userName:this.userName,
        operLocation:this.operLocation,
        endTime: this.timeDate[1] ? parseTime(this.timeDate[1]).substring(0, 10) + ' 23:59:59' : '',
        startTime: this.timeDate[0] ? parseTime(this.timeDate[0]).substring(0, 10) + ' 00:00:00' : '',
        pageNo: this.form.pageNo,
        pageSize: this.form.pageSize,
        fileName:this.form.fileName,
        sheetName:this.form.sheetName,
        allExport:this.form.allExport,
        excelColumn: ['id','eventName','remark','userName','nickname','operTerminal','operLocation','netName','equipSn','orderNo','operTime'],
        excelHead:["事件明细ID","事件名称","备注","操作用户","昵称","用户操作端口","IP解析地址","操作网点","操作设备","关联订单","发生时间"],
        export:true,
      }
      if(this.form.fileName == "" || this.form.sheetName == "" || this.form.allExport == ""){
        this.$message.error("请填写完整")
        return
      }
      eventList(getBaseUrl(params)).then(res =>{
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
