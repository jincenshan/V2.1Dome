<template>
  <div class="app-container">
    <div class="block">
      <el-input v-model="snNo" class="input_class" placeholder="输入设备S/N" clearable />
      <el-input v-model="partName" class="input_class" placeholder="输入部件名称" clearable />
      <el-select v-model="typeCode" clearable placeholder="按设备类型">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-select v-model="status" clearable placeholder="按使用状态" style="margin-left: 10px">
        <el-option
          v-for="item in option1"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-date-picker
        v-model="timeDate"
        type="daterange"
        range-separator="至"
        start-placeholder="发生日期"
        end-placeholder="发生日期"
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
      style="border: 1px solid #EBEEF5"
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="更换记录ID" width="200">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>
      <el-table-column label="所在机房" width="150" align="center">
        <template slot-scope="scope">
          <span style="color: #20a0ff" @click="listDetail(scope.row.roomId)">{{ scope.row.roomName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="设备类型" width="150" align="center">
        <template slot-scope="scope">{{ scope.row.equipType }}</template>
      </el-table-column>
      <el-table-column label="设备SN" width="150" align="center">
        <template slot-scope="scope">{{ scope.row.equipSnNo }}</template>
      </el-table-column>
      <el-table-column label="部件名称" width="150" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.partName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="原规格" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.oldSpecName }}</template>
      </el-table-column>
      <el-table-column class-name="status-col" label="原SN" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.oldSnNo }}</template>
      </el-table-column>
      <el-table-column class-name="status-col" label="更新后规格" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.newSpecName }}</template>
      </el-table-column>
      <el-table-column class-name="status-col" label="更新后SN" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.newSnNo }}</template>
      </el-table-column>
      <el-table-column align="center" prop="createDate"  label="更换时间" sortable width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.createDate }}</span>
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
  import {recordRemember} from '@/api/table'
  import {getBaseUrl} from '@/utils/auth'
  import {parseTime} from "@/utils";
  export default {
    name: 'equipment_replace',
    data() {
      return {
        list: [],
        buttonArray:JSON.parse(sessionStorage.getItem("buttonArray")),
        listLoading: true,
        status:"",
        typeCode:"",
        pageNo: 1,
        total:0,
        timeDate:[],
        equipNo: "",
        netName: "",
        pageSize:10,
        partName: "",
        snNo: "",
        specName: "",
        options: [
          {
            value: 'OXY',
            label: '制氧机'
          },
          {
            value: 'CONTROL',
            label: '控制器'
          },
          {
            value: 'GENERAL_CONTROL',
            label: '总控终端'
          },
          {
            value: 'TRANSFER',
            label: '中转终端'
          },
          {
            value: 'ENTER_HOUSE',
            label: '入户终端'
          },
          {
            value: 'OXY_UPTAKE',
            label: '取氧终端'
          }
        ],
        option1: [{
          label: '正常使用',
          value: 'NORMAL'
        }, {
          label: '停止使用',
          value: 'STOP'
        }],
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
      this.fetchData()
    },
    methods: {
      fetchData() {
        let params = {
          endTime: this.timeDate[1] ? parseTime(this.timeDate[1]).substring(0, 10) + ' 23:59:59' : '',
          status: this.status,
          partName:this.partName,
          snNo: this.snNo,
          startTime: this.timeDate[0] ? parseTime(this.timeDate[0]).substring(0, 10) + ' 00:00:00' : '',
          typeCode: this.typeCode,
          pageSize: this.pageSize,
          pageNo: this.pageNo,
          export:false,
        }
        recordRemember(getBaseUrl(params)).then(res => {
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
        this.partName = ''
        this.status = ''
        this.timeDate = []
        this.typeCode = ''
        this.pageNo = 1
        this.fetchData()
      },
      listDetail(e){
        this.$router.push({name: 'computer_room', query: {roomId: e}})
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
          status: this.status,
          partName:this.partName,
          snNo: this.snNo,
          typeCode: this.typeCode,
          endTime: this.timeDate[1] ? parseTime(this.timeDate[1]).substring(0, 10) + ' 23:59:59' : '',
          startTime: this.timeDate[0] ? parseTime(this.timeDate[0]).substring(0, 10) + ' 00:00:00' : '',
          pageNo: this.form.pageNo,
          pageSize: this.form.pageSize,
          fileName:this.form.fileName,
          sheetName:this.form.sheetName,
          allExport:this.form.allExport,
          excelColumn: ['id','roomName','equipType','equipSnNo','partName','oldSpecName','oldSnNo','newSpecName','newSnNo','createDate'],
          excelHead:["更换记录ID","所在机房","设备类型","设备SN","部件名称","原规格","原SN","更新后规格","更新后SN","更换时间"],
          export:true,
        }
        if(this.form.fileName == "" || this.form.sheetName == "" || this.form.allExport == ""){
          this.$message.error("请填写完整")
          return
        }
        recordRemember(getBaseUrl(params)).then(res =>{
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
