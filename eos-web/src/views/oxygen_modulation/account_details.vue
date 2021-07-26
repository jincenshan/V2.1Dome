<template>
  <div class="app-container">
    <div class="block">
      <el-input v-model="name" class="input_class" placeholder="按账户名称" clearable/>
      <el-input v-model="orderNo" class="input_class" placeholder="按订单号" clearable/>
      <el-select v-model="type" clearable placeholder="账户类型">
        <el-option
          v-for="item in status_options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-date-picker
        v-model="value1"
        type="daterange"
        range-separator="至"
        start-placeholder="按创建日期"
        end-placeholder="创建日期"
        style="margin-left: 10px"
      />
      <el-button style="margin-left:30px;background-color: #30B08F;color: white;" @click="fetchData()">查询</el-button>
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
      <el-table-column align="center" label="账户记录" width="200">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>
      <el-table-column label="财务类型" width="150" align="center">
        <template slot-scope="scope">{{ scope.row.type}}</template>
      </el-table-column>
      <el-table-column label="发生账户" width="150" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.accountName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="金额" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.amount }}</template>
      </el-table-column>
      <el-table-column class-name="status-col" label="当前累计分润金额" width="150" align="center">
        <template slot-scope="scope">{{ scope.row.balance }}</template>
      </el-table-column>
      <el-table-column class-name="status-col" label="订单号" width="150" align="center">
        <template slot-scope="scope">{{ scope.row.orderNo }}</template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="发生时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time"/>
          <span>{{ scope.row.createDate}}</span>
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
  import {accountListDetail, houseList} from "@/api/table";
  import {getBaseUrl, getToken} from "@/utils/auth";
  import {parseTime} from "@/utils";

  export default {
    name: "account_details",
    data() {
      return {
        accountId: '',
        list: [],
        user:JSON.parse(sessionStorage.getItem("user")),
        buttonArray:JSON.parse(sessionStorage.getItem("buttonArray")),
        value1:[],
        name:"",
        orderNo:"",
        listLoading: true,
        type: "",
        total:0,
        pageNo:1,
        pageSize:10,
        status_options: [
          {
            value: 'ORDER_BUY',
            label: '订单购买'
          },
          {
            value: 'FLOW_BUY',
            label: '流量购买'
          },
          {
            value: 'INSTALL_PAY',
            label: '安装费付款'
          },
          {
            value: 'FLOW',
            label: '流量费付款'
          },
          {
            value: 'ENTER_HOUSE_PAY',
            label: '入户费付款'
          },
          {
            value: 'FLOW_ORDER_PROFIT',
            label: '流量订单分润'
          },
          {
            value: 'INSTALL_FEE_PROFIT',
            label: '安装费分润'
          },
          {
            value: 'ENTER_HOUSE_PROFIT',
            label: '入户费分润'
          }
        ],
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
      this.accountId = this.$router.currentRoute.query.id
      this.fetchData();
    },
    methods:{
      fetchData(){
        let params ={
          accountId:this.accountId,
          name:this.name,
          orderNo: this.orderNo,
          type:this.type,
          endTime: this.value1[1] ? parseTime(this.value1[1]).substring(0, 10) + ' 23:59:59' : '',
          startTime: this.value1[0] ? parseTime(this.value1[0]).substring(0, 10) + ' 00:00:00' : '',
          pageSize:this.pageSize,
          pageNo:this.pageNo,
          productLine:"OXY",
          token:getToken(),
        }
        accountListDetail(params).then(res => {
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
      //重置
      resetForm(){
        this.name = ""
        this.orderNo= ""
        this.type = ""
        this.value1= []
        this.fetchData()
      },
      // 导出表格
      exportExcel() {
        var params = {
          accountId:this.accountId,
          name:this.name,
          orderNo: this.orderNo,
          type:this.type,
          pageNo: this.form.pageNo,
          pageSize: this.form.pageSize,
          endTime: this.value1[1] ? parseTime(this.value1[1]).substring(0, 10) + ' 23:59:59' : '',
          startTime: this.value1[0] ? parseTime(this.value1[0]).substring(0, 10) + ' 00:00:00' : '',
          fileName: this.form.fileName,
          sheetName: this.form.sheetName,
          allExport: this.form.allExport,
          excelColumn: ['id', 'type', 'accountName', 'amount', 'balance', 'orderNo', 'createDate'],
          excelHead: ["账户id", "财务类型", "发生账户", "金额", "当前余额", "订单号", "发生时间"],
          export: true,
          productLine:"OXY",
          token:getToken(),
        }
        if(this.form.fileName == "" || this.form.sheetName == "" || this.form.allExport == ""){
          this.$message.error("请填写完整")
          return
        }
        accountListDetail(params).then(res => {
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
    }
  }
</script>

<style scoped>
  .block {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    flex-flow: wrap;
    margin-bottom: 20px;
  }
  .input_class {
    width: 130px;
    display: flex;
    margin-right: 10px;
    height: 30px;
  }
</style>
