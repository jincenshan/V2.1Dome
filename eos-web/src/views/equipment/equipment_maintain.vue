<template>
  <div class="app-container">
    <div class="block">
      <el-input v-model="roomName" class="input_class" placeholder="请输入所在机房" clearable />
      <el-input v-model="equipNo" class="input_class" placeholder="输入控制器S/N" clearable />
      <el-input v-model="partSn" class="input_class" placeholder="输入部件S/N" clearable />
      <el-input v-model="partName" class="input_class" placeholder="输入部件名称" clearable/>
      <el-input v-model="specName" class="input_class" placeholder="输入部件规格" clearable />
      <el-select v-model="typeCode" clearable placeholder="按设备类型">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-select v-model="maintainStatus" clearable placeholder="按保养状态" style="margin-left: 10px">
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
        start-placeholder="保养日期"
        end-placeholder="保养日期"
        style="margin-left:20px"
      />
    </div>
    <div class="block" style="display: flex;flex-direction: row;justify-content: flex-end">
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
      <el-table-column align="center" label="保养计划ID" width="200">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>
      <el-table-column label="所在机房" width="150" align="center">
        <template slot-scope="scope">
          <span style="color: #20a0ff" @click="listDetail(scope.row.roomId)">{{ scope.row.roomName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属产品线" width="150" align="center">
        <template slot-scope="scope">{{ scope.row.productLine }}</template>
      </el-table-column>
      <el-table-column label="设备类型" width="150" align="center">
        <template slot-scope="scope">{{ scope.row.equipType }}</template>
      </el-table-column>
      <el-table-column label="设备SN" width="150" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.equipSn }}</span>
        </template>
      </el-table-column>
      <el-table-column label="部件名称" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.partName }}</template>
      </el-table-column>
      <el-table-column class-name="status-col" label="部件SN" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.partSn }}</template>
      </el-table-column>
      <el-table-column class-name="status-col" label="部件规格" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.partSpec }}</template>
      </el-table-column>
      <el-table-column class-name="status-col" label="已工作时长(h)" width="110" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.workTime">{{Math.floor(scope.row.workTime/60).toFixed(1)}}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="部件设计保养时限(h)" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.maintainTime }}</template>
      </el-table-column>
      <el-table-column class-name="status-col" label="距离下次保养时长" width="110" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.nextMaintainTime}}</span>
          </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="保养状态" width="110" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.status == 'HAS_MAINTAIN'">已保养</span>
          <span v-if="scope.row.status == 'WAIT_MAINTAIN'">待保养</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="time" label="实际保养操作时间" sortable width="200">
        <template slot-scope="scope">
          <i class="el-icon-time"/>
          <span>{{ scope.row.operateDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right" width="250">
        <template slot-scope="scope">
          <el-button type="text" size="small" v-if="scope.row.status == 'HAS_MAINTAIN'" @click="handleClick(scope.row)">查看保养记录</el-button>
          <el-button type="text" size="small" v-if="scope.row.status == 'WAIT_MAINTAIN' && user.type =='OPT'" @click="clickOk(scope.row)">记录保养结果</el-button>
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
    <el-dialog :title='is_maintain?"记录保养结果":"记录保养"' :visible.sync="is_from" width="400px" :close-on-click-modal="false" @click="colseClick">
        <el-form :model="ruleForm" ref="ruleForm" label-width="50px" class="demo-ruleForm" v-if="!is_maintain">
          <label style="margin-bottom: 20px">确认已保养？</label>
          <el-form-item label="备注">
            <el-input
              type="textarea"
              :rows="2"
              placeholder="请输入备注已保养"
              v-model="ruleForm.remarks">
            </el-input>
          </el-form-item>
          <div style="display: flex;flex-direction: row;justify-content: flex-end;align-items: center">
            <span>停用后，设备将无法正常工作</span>
            <el-button type="primary" @click="submitForm()" style="width: 100px;margin-left: 20px">确认已保养</el-button>
          </div>
        </el-form>
      <el-form v-if="is_maintain">
         <div style="display: flex;flex-direction: column;justify-content: space-between;align-items: flex-start;height: 50px;margin-bottom: 20px">
          <span>保养时间：{{operateDate}}</span>
          <span>备注：{{remarks}}</span>
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
        <el-form-item label="导出" :label-width="formLabelWidth">
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
  import {controlExceptionList, maintainSure, planReplaceList} from '@/api/table'
  import {getBaseUrl} from '@/utils/auth'
  import {parseTime} from "@/utils";

  export default {
    name: 'equipment_maintain',
    data() {
      return {
        list: [],
        user:JSON.parse(sessionStorage.getItem("user")),
        buttonArray:JSON.parse(sessionStorage.getItem("buttonArray")),
        listLoading: true,
        maintainStatus: "",
        typeCode: "",
        pageNo: 1,
        total:0,
        timeDate: [],
        equipNo: "",
        roomName: "",
        pageSize: 10,
        partName: "",
        partSn: "",
        specName: "",
        is_maintain:false,
        operateDate:"",
        remarks:"",
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
          value: 'HAS_MAINTAIN',
          label: '已保养'
        }, {
          value: 'WAIT_MAINTAIN',
          label: '待保养'
        }],
        is_from:false,
        ruleForm:{
          remarks:""
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
      this.fetchData()
    },
    methods: {
      fetchData() {
        let params = {
          endTime: this.timeDate[1] ? parseTime(this.timeDate[1]).substring(0, 10) + ' 23:59:59' : '',
          equipNo: this.equipNo,
          maintainStatus: this.maintainStatus,
          roomName: this.roomName,
          partName: this.partName,
          partSn: this.partSn,
          specName: this.specName,
          startTime: this.timeDate[0] ? parseTime(this.timeDate[0]).substring(0, 10) + ' 00:00:00' : '',
          typeCode: this.typeCode,
          pageSize: this.pageSize,
          pageNo: this.pageNo,
          export:false,
        }
        planReplaceList(getBaseUrl(params)).then(res => {
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
        this.equipNo = ""
        this.roomName = ""
        this.partName = ""
        this.partSn = ""
        this.specName = ""
        this.timeDate = []
        this.typeCode = ""
        this.maintainStatus = ""
        this.pageNo = 1
        this.fetchData()
      },
      //激活
      clickOk(row){
        this.resolve_id = row.id
        this.is_from = true
        this.is_maintain = false
      },
      submitForm(){
        let add_data = {
          id:this.resolve_id,
          remarks: this.ruleForm.remarks,
        }
        maintainSure(getBaseUrl(add_data)).then(res=>{
          if(res.code != 0) {
            this.is_from = false
            this.$router.go(0)
          }
        })
      },
      colseClick() {
        this.is_from = false
        this.ruleForm.remarks = ""
        this.operateDate = ""
        this.remarks = ""
        this.is_maintain = false
      },
      handleClick(row) {
        this.is_from = true
        this.is_maintain = true
        this.operateDate = row.operateDate
        this.remarks = row.remarks
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
      listDetail(e){
        this.$router.push({name: 'computer_room', query: {roomId: e}})
      },
      // 导出表格
      exportExcel() {
        var params ={
          endTime: this.timeDate[1] ? parseTime(this.timeDate[1]).substring(0, 10) + ' 23:59:59' : '',
          equipNo: this.equipNo,
          maintainStatus: this.maintainStatus,
          roomName: this.roomName,
          partName: this.partName,
          partSn: this.partSn,
          specName: this.specName,
          startTime: this.timeDate[0] ? parseTime(this.timeDate[0]).substring(0, 10) + ' 00:00:00' : '',
          typeCode: this.typeCode,
          pageNo: this.form.pageNo,
          pageSize: this.form.pageSize,
          fileName:this.form.fileName,
          sheetName:this.form.sheetName,
          allExport:this.form.allExport,
          excelColumn: ['id','roomName','productLine','equipType','equipSn','partName','partSn','partSpec','workTime','maintainTime','nextMaintainTime','status','operateDate'],
          excelHead:["保养计划ID","所在机房","所属产品线","设备类型","设备SN","部件名称","部件SN","部件规格","已工作时长（min）","部件设计保养时限","距离下次保养时长","保养状态","实际保养操作时间"],
          export:true,
        }
        if(this.form.fileName == "" || this.form.sheetName == "" || this.form.allExport == ""){
          this.$message.error("请填写完整")
          return
        }
        planReplaceList(getBaseUrl(params)).then(res =>{
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
    width: 165px;
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
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 350px;
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

  .el-table--scrollable-x .el-table__body-wrapper {
    overflow-x: auto;
  }

  .el-table__fixed-right {
    height: 100% !important;
  }
</style>
