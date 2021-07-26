<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      style="border: 1px solid #EBEEF5;"
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="流量计划ID" width="200">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>
      <el-table-column class-name="status-col" label="开始有效期" width="170" align="center">
        <template slot-scope="scope">{{ scope.row.startDate.substring(0, 10)}}</template>
      </el-table-column>
      <el-table-column class-name="status-col" label="计划结束日期" width="170" align="center">
        <template slot-scope="scope">{{ scope.row.endDate.substring(0, 10) }}</template>
      </el-table-column>
      <el-table-column class-name="status-col" label="收费方式" width="110" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.feeMode == 'FLOORS_FREE'">保底免收</span>
          <span v-if="scope.row.feeMode == 'ADVANCE_DEDUCTION'">预收款减扣</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="已使用流量" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.hasUseAmount }}L</template>
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
      <el-table-column class-name="status-col" label="创建时间" width="200" align="center">
        <template slot-scope="scope">
          <i class="el-icon-time"/>
          <span>{{ scope.row.createDate}}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="付款时间" width="200" align="center">
        <template slot-scope="scope">
          <i class="el-icon-time"/>
          <span>{{ scope.row.payDate}}</span>
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
  </div>
</template>

<script>
  import {contractFlow} from '@/api/table'
  import {parseTime} from "@/utils";
  import {getBaseUrl, getToken} from "@/utils/auth";

  export default {
    name: 'contract_flow',
    data() {
      return {
        list: [],
        listLoading: true,
        user: JSON.parse(sessionStorage.getItem("user")),
        pageSize: 10,
        pageNo: 1,
        netId:"",
        total:0,
      }
    },
    created() {
      this.netId = this.$router.currentRoute.query.id
      this.fetchData()
    },
    methods: {
      fetchData() {
        contractFlow({pageNo:this.pageNo,pageSize:this.pageSize,netId:this.netId, productLine:"EOS",token:getToken(),}).then(res => {
          if(res.code !=0) {
            this.list = res.data.list
            this.total = parseInt(res.data.total)
            this.listLoading = false
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
  .el-table__fixed-right{
    height: 100% !important;
  }
</style>

