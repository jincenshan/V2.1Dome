<template>
  <div class="app-container">
    <div class="block">
      <el-input v-model="name" class="input_class" placeholder="按发生账户" clearable/>
      <el-input v-model="orderNo" class="input_class" placeholder="按订单号" clearable/>
      <el-select v-model="type" clearable placeholder="订单状态" style="margin-left: 10px;width: 150px">
        <el-option
          v-for="item in option_status"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-date-picker
        v-model="value1"
        type="daterange"
        range-separator="至"
        start-placeholder="按发生时间"
        end-placeholder="按发生时间"
        style="margin-left: 10px"
      />
      <el-button style="margin-left:30px;background-color: #30B08F;color: white;" @click="searchShow()">查询</el-button>
      <el-button type="warning" @click="resetForm()">重置</el-button>
      <button type="button" class="el-button el-button--primary el-button--medium" @click="dialogFormVisible = true"
              v-if="list.length !=0 && buttonArray.includes('canExport')"><i
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
      <el-table-column label="账户类型" width="150" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发生账户" width="150" align="center">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>
      <el-table-column label="金额" width="150" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.amount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="当前余额" width="150" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.balance }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单号" width="150" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.orderNo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发生渠道" width="150" align="center">
        <template slot-scope="scope">{{ scope.row.channel }}</template>
      </el-table-column>
      <el-table-column class-name="status-col" label="发生时间" width="150" align="center">
        <template slot-scope="scope">{{ scope.row.modifyDate }}</template>
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
import {accountBobListDetail} from '@/api/table'
import {parseTime} from "@/utils";

export default {
  name: 'dot_detail',
  data() {
    return {
      list: [],
      listLoading: true,
      user: JSON.parse(sessionStorage.getItem("user")),
      buttonArray: JSON.parse(sessionStorage.getItem("buttonArray")),
      value1: [],
      name: "",
      type:"",
      orderNo:"",
      pageSize: 10,
      pageNo: 1,
      total: 0,
      option_status:[
        {
          value: 'PLATFORM_PRE',
          label: '平台预收账户'
        },
        {
          value: 'PLATFORM_CASH',
          label: '平台可提现账户'
        },
        {
          value: 'OPT_CASH',
          label: '运营商可提现账户'
        },
        {
          value: 'NET_CASH',
          label: '网点可提现账户'
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
        allExport: [{required: true, message: "请选择", trigger: 'blur'}],
      },
      formLabelWidth: '120px',
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    searchShow() {
      this.fetchData()
    },
    fetchData() {
      var params = {
        pageNo: this.pageNo,
        beginModifyDate: this.value1[0] ? parseTime(this.value1[0]).substring(0, 10) + ' 00:00:00' : '',
        endModifyDate: this.value1[1] ? parseTime(this.value1[1]).substring(0, 10) + ' 23:59:59' : '',
        name: this.name,
        type:this.type,
        orderNo:this.orderNo,
        pageSize: this.pageSize,
        export: false,
      }
      accountBobListDetail(params).then(res => {
        if (res.code != 0) {
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
    handleClick(row) {
      if (this.user.type == "PLATFORM") {
        this.$router.push({name: 'operators_dot_detils', query: {id: row.id, type: 1, tabber: 1}})
      } else if (this.user.type == "OPT") {
        this.$router.push({name: 'operators_dot_detils', query: {id: row.id, type: 2, tabber: 1}})
      } else {
        this.$router.push({name: 'operators_dot_detils', query: {id: row.id, type: 3, tabber: 1}})
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
    //重置
    resetForm() {
      this.name = ""
      this.type = ''
      this.orderNo = ""
      this.value1 = []
      this.fetchData()
    },
    // 导出表格
    exportExcel() {
      var params = {
        beginModifyDate: this.value1[0] ? parseTime(this.value1[0]).substring(0, 10) + ' 00:00:00' : '',
        endModifyDate: this.value1[1] ? parseTime(this.value1[1]).substring(0, 10) + ' 23:59:59' : '',
        name: this.name,
        type:this.type,
        orderNo:this.orderNo,
        pageNo: this.form.pageNo,
        pageSize: this.form.pageSize,
        fileName: this.form.fileName,
        sheetName: this.form.sheetName,
        allExport: this.form.allExport,
        excelColumn: ['id', 'type','name', 'amount', 'balance', 'channel', 'orderNo','modifyDate'],
        excelHead: ["账户记录", "账户类型","发生账户", "金额", "当前余额", "发生渠道", "订单号","发生时间"],
        export: true,
      }
      if (this.form.fileName == "" || this.form.sheetName == "" || this.form.allExport == "") {
        this.$message.error("请填写完整")
        return
      }
      accountBobListDetail(params).then(res => {
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
    //增加入驻网点
    AddOperators(e) {
      this.$router.push({name: 'operators_dot_detils', query: {type: 2}})
    }
  }
}
</script>
<style scoped>
.input_class {
  width: 150px;
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

