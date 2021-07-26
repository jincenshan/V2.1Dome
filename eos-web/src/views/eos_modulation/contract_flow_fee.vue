<template>
  <div class="app-container">
    <div class="block">
      <el-input v-model="netName" class="input_class" placeholder="按网点名称" clearable/>
      <el-select v-model="feeMode" clearable placeholder="收费方式">
        <el-option
          v-for="item in feeMode_options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-select v-model="hasPay" clearable placeholder="付款状态" style="margin-left: 10px">
        <el-option
          v-for="item in hasPay_options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-date-picker
        v-model="value1"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        style="margin-left: 10px"
      />
      <el-button style="margin-left:30px;background-color: #30B08F;color: white;" @click="fetchData()">查询</el-button>
      <el-button type="warning" @click="resetForm()">重置</el-button>
      <button type="button" v-if="list.length !=0 && buttonArray.includes('canExport')" class="el-button el-button--primary el-button--medium" @click="dialogFormVisible = true"><i
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
      <el-table-column align="center" label="流量计划ID" width="170">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>
      <el-table-column class-name="status-col" label="网点名称" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.netName }}</template>
      </el-table-column>
      <el-table-column class-name="status-col" label="开始有效期" width="180" align="center">
        <template slot-scope="scope">{{ scope.row.startDate.substring(0, 10)}}</template>
      </el-table-column>
      <el-table-column class-name="status-col" label="计划结束日期" width="180" align="center">
        <template slot-scope="scope">{{ scope.row.endDate.substring(0, 10)}}</template>
      </el-table-column>
      <el-table-column class-name="status-col" label="收费方式" width="110" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.feeMode == 'FLOORS_FREE'">保底免收</span>
          <span v-if="scope.row.feeMode == 'ADVANCE_DEDUCTION'">预收款减扣</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="已使用流量" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.hasUseAmount }}</template>
      </el-table-column>
      <el-table-column class-name="status-col" label="单价" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.unitPrice }}</template>
      </el-table-column>
      <el-table-column class-name="status-col" label="费用（元）" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.payAmount}}</template>
      </el-table-column>
      <el-table-column class-name="status-col" label="是否付款" width="110" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.hasPay=='YES'">已付款</span>
          <span v-if="scope.row.hasPay=='NO'">待付款</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="创建时间" width="180" align="center">
        <template slot-scope="scope">
          <i class="el-icon-time"/>
          <span>{{ scope.row.createDate}}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="付款时间" width="180" align="center">
        <template slot-scope="scope">
          <i class="el-icon-time"/>
          <span>{{ scope.row.payDate}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right" width="150">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="handleClick(scope.row)" v-if="scope.row.hasPay=='YES'">查看付款记录
          </el-button>
          <el-button type="text" size="small" @click="handleClick(scope.row)" v-if="scope.row.hasPay=='NO'">记录付款记录
          </el-button>
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
    <el-dialog title="预收款维护" :visible.sync="is_distribution" width="400px" :close-on-click-modal="false">
      <el-form style="display: flex;flex-direction: column;align-items: flex-start">
        <el-form-item label="付款时间" :label-width="formLabelWidth" v-if="is_pay">
          <span>{{payDate}}</span>
        </el-form-item>
        <el-form-item label="付款金额" :label-width="formLabelWidth" v-if="is_pay">
          <span>{{payAmount}}元</span>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth" v-if="is_pay">
          <span>{{remark}}</span>
        </el-form-item>
        <el-form-item label="是否已付款" :label-width="formLabelWidth" v-if="!is_pay">
          <el-radio v-model="radio" label="1">已付款</el-radio>
        </el-form-item>
        <el-form-item label="实际付款金额" :label-width="formLabelWidth" v-if="!is_pay">
          <el-input v-model="payAmount" class="input_class" style="width: 250px" placeholder="请输入金额" clearable/>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth" v-if="!is_pay">
          <el-input type="textarea" v-model="remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" v-if="!is_pay">
        <el-button @click="closeShow()">取 消</el-button>
        <el-button type="primary" @click="submitShow()">确 定</el-button>
      </div>
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
  import {contractEdit, contractFlow, networkList} from '@/api/table'
  import {parseTime} from "@/utils";
  import {getBaseUrl, getToken} from "@/utils/auth";

  export default {
    name: 'contract_flow_fee',
    data() {
      return {
        list: [],
        listLoading: true,
        is_distribution: false,
        user: JSON.parse(sessionStorage.getItem("user")),
        buttonArray:JSON.parse(sessionStorage.getItem("buttonArray")),
        pageSize: 10,
        pageNo: 1,
        total:0,
        value1: [],
        netId: "",
        netName: "",
        is_pay: '',
        hasPay: "",
        payDate: "",
        payAmount: "",
        remark: "",
        radio: "",
        hasPay_options: [
          {
            value: 'YES',
            label: '已付款'
          },
          {
            value: 'NO',
            label: '待付款'
          }
        ],
        feeMode: "",
        feeMode_options: [
          {
            value: 'FLOORS_FREE',
            label: '保底免收'
          },
          {
            value: 'ADVANCE_DEDUCTION',
            label: '预收款减扣'
          }],
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
      this.fetchData()
    },
    methods: {
      fetchData() {
        let params = {
          endTime: this.value1[1] ? parseTime(this.value1[1]).substring(0, 10) + ' 23:59:59' : '',
          startTime: this.value1[0] ? parseTime(this.value1[0]).substring(0, 10) + ' 00:00:00' : '',
          netName: this.netName,
          hasPay: this.hasPay,
          feeMode: this.feeMode,
          pageSize:this.pageSize,
          pageNo: this.pageNo,
          export: false,
          productLine:"EOS",
          token:getToken(),
        }
        contractFlow(params).then(res => {
          if(res.code !=0) {
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
      handleClick(row) {
        if (row.hasPay == 'YES') {
          this.is_distribution = true
          this.is_pay = true
          this.payDate = row.payDate
          this.payAmount = row.payAmount
          this.remark = row.remark
        } else {
          this.is_distribution = true
          this.is_pay = false
          this.netId = row.id
        }
      },
      closeShow() {
        this.is_distribution = false
      },
      submitShow() {
        let params = {
          id: this.netId,
          payAmount: this.payAmount,
          remark: this.remark,
          productLine:"EOS",
          token:getToken(),
        }
        contractEdit(params).then(res => {
          if(res.code !=0) {
            this.$router.go(0)
          }
        })
      },
      //重置
      resetForm() {
        this.netName = ""
        this.feeMode = ""
        this.hasPay = ""
        this.value1 = []
        this.pageNo = 1
        this.fetchData()
      },
      // 导出表格
      exportExcel() {
        var params = {
          endTime: this.value1[1] ? parseTime(this.value1[1]).substring(0, 10) + ' 23:59:59' : '',
          startTime: this.value1[0] ? parseTime(this.value1[0]).substring(0, 10) + ' 00:00:00' : '',
          netName: this.netName,
          hasPay: this.hasPay,
          feeMode: this.feeMode,
          pageSize:this.pageSize,
          pageNo: this.pageNo,
          fileName: this.form.fileName,
          sheetName: this.form.sheetName,
          allExport: this.form.allExport,
          excelColumn: ['id', 'netName', 'startDate', 'endDate', 'feeMode', 'hasUseAmount', 'unitPrice', 'payAmount', 'hasPay', 'createDate', 'payDate'],
          excelHead: ["流量计划ID", "网点名称", "开始有效期", "计划结束日期", "收费方式", "已使用流量", "单价", "费用（元）", "是否付款", "创建时间", "付款时间"],
          export: true,
          productLine:"EOS",
          token:getToken(),
        }
        if(this.form.fileName == "" || this.form.sheetName == "" || this.form.allExport == ""){
          this.$message.error("请填写完整")
          return
        }
        contractFlow(params).then(res => {
          if(res.code !=0) {
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
  .input_class {
    width: 130px;
    display: flex;
    margin-right: 10px;
    height: 30px;
  }

</style>
<style>
  .block {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    flex-flow: wrap;
    margin-bottom: 20px;
  }
  .el-date-editor .el-range-separator {
    height: auto;
  }

  .el-input__icon {
    height: auto;
  }

  .el-input__inner {
    height: 30px !important;
    padding: 0px 10px !important;
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

  .el-table--scrollable-x .el-table__body-wrapper {
    overflow-x: auto;
  }

  .el-table__fixed-right {
    height: 100% !important;
  }
</style>

