<template>
  <div class="app-container">
    <div class="block">
      <el-input v-model="netName" class="input_class" placeholder="按网点名称" clearable/>
      <el-input v-model="phone" class="input_class" placeholder="按付款人账号" clearable/>
      <el-input v-model="orderNo" class="input_class" placeholder="按订单号" clearable/>
      <div>
        <v-distpicker :province="select.province" :city="select.city" :area="select.area" @selected="selectShow"
                      @province="onChangeProvince" @city="onChangeCity"></v-distpicker>
      </div>
      <el-select v-model="status" clearable placeholder="付费状态" style="margin-left: 10px;width: 130px">
        <el-option
          v-for="item in status_options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-select v-model="settlement" clearable placeholder="分账状态" style="margin-left: 10px;width: 130px">
        <el-option
          v-for="item in settlement_option"
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
    </div>
    <div class="block" style="justify-content: flex-end">
      <el-button style="margin-left:30px;background-color: #30B08F;color: white;" @click="fetchData()">查询</el-button>
      <el-button type="warning" @click="resetForm()">重置</el-button>
      <button type="button" class="el-button el-button--primary el-button--medium" v-if="list.length !=0" @click="dialogFormVisible = true"><i
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
      <el-table-column align="center" label="订单ID" width="200">
        <template slot-scope="scope">{{ scope.row.inOrderNo }}</template>
      </el-table-column>
      <el-table-column label="网点名称" width="150" align="center">
        <template slot-scope="scope">{{ scope.row.netName }}</template>
      </el-table-column>
      <el-table-column label="所在地区" width="150" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.area }}</span>
        </template>
      </el-table-column>
      <el-table-column label="入户终端SN" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.terminalSn }}</template>
      </el-table-column>
      <el-table-column class-name="status-col" label="开始日期" width="180" align="center">
        <template slot-scope="scope">{{ scope.row.startTime }}</template>
      </el-table-column>
      <el-table-column class-name="status-col" label="结束日期" width="180" align="center">
        <template slot-scope="scope">{{ scope.row.endTime }}</template>
      </el-table-column>
      <el-table-column class-name="status-col" label="收费方式" width="110" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.chargeWay == 'FIRST_RECHARGE'">先付款</span>
          <span v-if="scope.row.chargeWay == 'POSTPAID'">后付款</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="已使用流量" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.useFlow }}</template>
      </el-table-column>
      <el-table-column class-name="status-col" label="单价" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.unitPrice }}</template>
      </el-table-column>
      <el-table-column class-name="status-col" label="费用（元）" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.amount }}</template>
      </el-table-column>
      <el-table-column class-name="status-col" label="付款人" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.consumerName }}</template>
      </el-table-column>
      <el-table-column class-name="status-col" label="付款账号" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.phone }}</template>
      </el-table-column>
      <el-table-column class-name="status-col" label="微信支付订单号" width="120" align="center">
        <template slot-scope="scope">{{ scope.row.outOrderNo }}</template>
      </el-table-column>
      <el-table-column class-name="status-col" label="订单状态" width="110" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.status =='HAS_PAY'">已付款</span>
          <span v-if="scope.row.status =='NO_PAY'">未付款</span>
          <span v-if="scope.row.status =='SUP_OXY'">供氧中</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="支付渠道" width="110" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.channel =='WX'">微信</span>
          <span v-if="scope.row.channel =='ZFB'">支付宝</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="分账状态" width="110" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.settlement =='YES'">已分账</span>
          <span v-if="scope.row.settlement =='NO'">未分账</span>
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
  import {payList} from '@/api/table'
  import {parseTime} from "@/utils";
  import {getBaseUrl, getToken} from "@/utils/auth";

  export default {
    name: 'traffic_payment',
    data() {
      return {
        list: [],
        listLoading: true,
        user: JSON.parse(sessionStorage.getItem("user")),
        value1: [],
        netName: "",
        phone: "",
        orderNo: "",
        pageSize: 10,
        pageNo: 1,
        total:0,
        select: {province: '', city: '', area: ''},
        cityCode: "",
        cityName: "",
        properties: "",
        provinceCode: "",
        provinceName: "",
        regionCode: "",
        regionName: "",
        status: "",
        status_options: [
          {
            value: 'HAS_PAY',
            label: '已付款'
          },
          {
            value: 'NO_PAY',
            label: '未付款'
          },
          {
            value: 'SUP_OXY',
            label: '供氧中'
          }
        ],
        settlement:"",
        settlement_option:[
          {
            value: 'YES',
            label: '已分账'
          },
          {
            value: 'NO',
            label: '未分账'
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
      this.fetchData()
    },
    methods: {
      fetchData() {
        var params = {
          netName: this.netName,
          phone: this.phone,
          orderNo: this.orderNo,
          status: this.status,
          settlement:this.settlement,
          cityCode: this.cityCode,
          cityName: this.cityName,
          provinceCode: this.provinceCode,
          provinceName: this.provinceName,
          regionCode: this.regionCode,
          regionName: this.regionName,
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          endTime: this.value1[1] ? parseTime(this.value1[1]).substring(0, 10) + ' 23:59:59' : '',
          startTime: this.value1[0] ? parseTime(this.value1[0]).substring(0, 10) + ' 00:00:00' : '',
          export: false,
          productLine:"OXY",
          token:getToken(),
        }
        payList(params).then(res => {
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
      handleClick(row) {
        if (this.user.type == "PLATFORM") {
          this.$router.push({name: 'operators_dot_detils', query: {id: row.id, type: 1}})
        } else if (this.user.type == "OPT") {
          this.$router.push({name: 'operators_dot_detils', query: {id: row.id, type: 2}})
        } else {
          this.$router.push({name: 'operators_dot_detils', query: {id: row.id, type: 3}})
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
      //重置
      resetForm() {
        this.netName = ""
        this.phone = ""
        this.orderNo = ""
        this.status = ""
        this.settlement = ""
        this.select = {province: '', city: '', area: ''}
        this.provinceCode = ""
        this.provinceName = ""
        this.cityName = ""
        this.cityCode = ""
        this.regionName = ""
        this.regionCode = ""
        this.value1 = []
        this.pageNo = 1
        this.fetchData()
      },
      // 导出表格
      exportExcel() {
        var params = {
          pageNo: this.form.pageNo,
          netName: this.netName,
          phone: this.phone,
          orderNo: this.orderNo,
          status: this.status,
          settlement:this.settlement,
          pageSize: this.form.pageSize,
          cityCode: this.cityCode,
          cityName: this.cityName,
          provinceCode: this.provinceCode,
          provinceName: this.provinceName,
          regionCode: this.regionCode,
          regionName: this.regionName,
          endTime: this.value1[1] ? parseTime(this.value1[1]).substring(0, 10) + ' 23:59:59' : '',
          startTime: this.value1[0] ? parseTime(this.value1[0]).substring(0, 10) + ' 00:00:00' : '',
          fileName: this.form.fileName,
          sheetName: this.form.sheetName,
          allExport: this.form.allExport,
          excelColumn: ['inOrderNo', 'netName', 'area', 'terminalSn', 'startTime', 'endTime', 'chargeWay', 'useFlow', 'unitPrice', 'amount', 'consumerName', 'phone', 'status', 'channel', 'createDate', 'payDate'],
          excelHead: ["订单ID", "网点名称", "所在地区", "入户终端SN", "开始日期", "结束日期", "收费方式", "已使用流量", "单价", "费用", "付款人", "付款账号", "订单状态", "支付渠道", "创建时间", "付款时间"],
          export: true,
          productLine:"OXY",
          token:getToken(),
        }
        if(this.form.fileName == "" || this.form.sheetName == "" || this.form.allExport == ""){
          this.$message.error("请填写完整")
          return
        }
        payList(params).then(res => {
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
      selectShow(data) {
        this.select = {province: data.province.value, city: data.city.value, area: data.area.value}
        this.provinceCode = data.province.code
        this.provinceName = data.province.value
        this.cityName = data.city.value
        this.cityCode = data.city.code
        this.regionName = data.area.value
        this.regionCode = data.area.code
      },
      onChangeProvince(data) {
        this.select.province = data.value
        this.provinceCode = data.code
        this.provinceName = data.value
      },
      onChangeCity(data) {
        this.select.city = data.value
        this.cityName = data.value
        this.cityCode = data.code
      },
      // selectShow(data) {
      //   this.select = {province: data.province.value, city: data.city.value, area: data.area.value}
      // },
      // onChangeProvince(data) {
      //   this.select.province = data.value
      // },
      // onChangeCity(data) {
      //   this.select.city = data.value
      // },
      //取氧口管理
      goOxygen(e) {
        if (this.user.type == "PLATFORM") {
          this.$router.push({name: 'oxygen_uptake', query: {id: e.id, type: 1}})
        } else if (this.user.type == "OPT") {
          this.$router.push({name: 'oxygen_uptake', query: {id: e.id, type: 2}})
        } else {
          this.$router.push({name: 'oxygen_uptake', query: {id: e.id, type: 3}})
        }
      },
      //增加入驻网点
      AddOperators(e) {
        this.$router.push({name: 'operators_dot_detils', query: {type: 1}})
      }
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
  .el-table--scrollable-x .el-table__body-wrapper{
    overflow-x: auto;
  }
  .el-table__fixed-right{
    height: 100% !important;
  }
</style>

