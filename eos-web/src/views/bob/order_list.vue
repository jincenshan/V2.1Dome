<template>
  <div class="app-container">
    <div class="block">
      <el-input v-model="netName" class="input_class" placeholder="按网点名称" clearable/>
      <el-input v-model="userAccount" class="input_class" placeholder="按用户账号" clearable/>
      <el-input v-model="equipSn" class="input_class" placeholder="按制氧机SN" clearable/>
      <el-input v-model="orderNo" class="input_class" placeholder="按订单号" clearable/>
      <el-cascader
        ref="cascaderAddr"
        v-model="area"
        :options="addressArea"
        placeholder="请选择省市区"
        :props="areaProps"
        style="width: 350px;margin-left: 10px"
      >
      </el-cascader>
      <el-select v-model="productLine" clearable placeholder="产品线" style="margin-left: 10px;width: 150px">
        <el-option
          v-for="item in option1"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-select v-model="status" clearable placeholder="订单状态" style="margin-left: 10px;width: 150px">
        <el-option
          v-for="item in option_status"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-select v-model="goodsId" clearable placeholder="购买规格" style="margin-left: 10px;width: 150px">
        <el-option
          v-for="item in option_goods"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
    </div>
    <div class="block">
      <el-select v-model="channel" clearable placeholder="支付渠道" style="width: 150px">
        <el-option
          v-for="item in option_channel"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-date-picker
        v-model="value1"
        type="daterange"
        range-separator="至"
        start-placeholder="按下单时间"
        end-placeholder="按下单时间"
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
      <el-table-column align="center" label="订单编号" width="200">
        <template slot-scope="scope">{{ scope.row.orderNo }}</template>
      </el-table-column>
      <el-table-column label="用户账号" width="150" align="center">
        <template slot-scope="scope">{{ scope.row.userAccount }}</template>
      </el-table-column>
      <el-table-column label="制氧机SN" width="150" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.equipSn }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所驻网点" width="150" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.netName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所在地区" width="150" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.area }}</span>
        </template>
      </el-table-column>
      <el-table-column label="服务规格" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.goodsSpec }}</template>
      </el-table-column>
      <el-table-column class-name="status-col" label="关联氧气袋" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.oxygenBagSn }}</template>
      </el-table-column>
      <el-table-column class-name="status-col" label="实付金额" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.actualAmount }}</template>
      </el-table-column>
      <el-table-column class-name="status-col" label="支付渠道" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.channel }}</template>
      </el-table-column>
      <el-table-column class-name="status-col" label="订单状态" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.status }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="订单下单时间" width="180" align="center">
        <template slot-scope="scope">
          <i class="el-icon-time"/>
          <span>{{ scope.row.createDate }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="是否已分账" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.isSplit }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="分账时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time"/>
          <span>{{ scope.row.splitDate }}</span>
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
import {bbyOrderList, goodsSpec, princeCityQuery} from '@/api/table'
import {parseTime} from "@/utils";

export default {
  name: 'order_list',
  data() {
    return {
      list: [],
      listLoading: true,
      user: JSON.parse(sessionStorage.getItem("user")),
      buttonArray: JSON.parse(sessionStorage.getItem("buttonArray")),
      value1: [],
      netName: "",
      userAccount: "",
      equipSn:"",
      orderNo:"",
      status:"",
      pageSize: 10,
      productLine: "",
      goodsId:"",
      channel:"",
      area:'',
      option_goods:[],
      pageNo: 1,
      total: 0,
      addressArea: [],
      areaProps: {
        value: 'id',
        label: 'name',
      },
      option1: [
        {
          value: 'EOS',
          label: '标准化安全氧疗'
        },
        {
          value: 'OXY',
          label: '氧调'
        },
        {
          value: 'BBY',
          label: '抱抱氧'
        }
      ],
      option_status:[
        {
          value: '1',
          label: '待付款'
        },
        {
          value: '2',
          label: '预付款'
        },
        {
          value: '3',
          label: '已付款'
        },
        {
          value: '4',
          label: '待取氧'
        },
        {
          value: '5',
          label: '已取氧'
        },
        {
          value: '8',
          label: '订单取消'
        },
        {
          value: '10',
          label: '交易成功'
        },
        {
          value: '12',
          label: '已退款'
        }
      ],
      option_channel:[{
        value: '1',
        label: '微信'
      },
        {
          value: '2',
          label: '支付宝'
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
        allExport: [{required: true, message: "请选择", trigger: 'blur'}],
      },
      formLabelWidth: '120px',
    }
  },
  created() {
    this.roomId = this.$router.currentRoute.query.roomId
    this.fetchData()
    princeCityQuery().then(res => {
      if (res.code != 0) {
        this.addressArea = res.data
      }
    })
    goodsSpec({goodsType:1}).then(res=>{
      this.option_goods = res.data
    })
  },
  methods: {
    searchShow() {
      this.roomId = ""
      this.fetchData()
    },
    fetchData() {
      var params = {
        pageNo: this.pageNo,
        beginOrderTime: this.value1[0] ? parseTime(this.value1[0]).substring(0, 10) + ' 00:00:00' : '',
        endOrderTime: this.value1[1] ? parseTime(this.value1[1]).substring(0, 10) + ' 23:59:59' : '',
        netName: this.netName,
        userAccount: this.userAccount,
        equipSn: this.equipSn,
        orderNo:this.orderNo,
        status:this.status,
        goodsId:this.goodsId,
        channel:this.channel,
        area:this.area,
        orderType:1,
        pageSize: this.pageSize,
        productLine: this.productLine,
        token: 'bby',
        export: false,
      }
      bbyOrderList(params).then(res => {
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
      this.netName = ""
      this.equipSn = ""
      this.orderNo = ""
      this.userAccount = ""
      this.status = ''
      this.goodsId=''
      this.channel=""
      this.area = ''
      this.value1 = []
      this.fetchData()
    },
    // 导出表格
    exportExcel() {
      var params = {
        beginOrderTime: this.value1[0] ? parseTime(this.value1[0]).substring(0, 10) + ' 00:00:00' : '',
        endOrderTime: this.value1[1] ? parseTime(this.value1[1]).substring(0, 10) + ' 23:59:59' : '',
        userAccount: this.userAccount,
        netName: this.netName,
        equipSn: this.equipSn,
        orderNo:this.orderNo,
        status:this.status,
        goodsId:this.goodsId,
        channel:this.channel,
        area:this.area,
        orderType:1,
        pageNo: this.form.pageNo,
        pageSize: this.form.pageSize,
        productLine: this.productLine,
        token: 'bby',
        fileName: this.form.fileName,
        sheetName: this.form.sheetName,
        allExport: this.form.allExport,
        excelColumn: ['orderNo', 'userAccount', 'equipSn', 'netName', 'area', 'goodsSpec', 'oxygenBagSn', 'actualAmount', 'channel', 'status', 'createDate','isSplit','splitDate'],
        excelHead: ["订单编号", "用户账号", "制氧机SN", "所驻网点", "所在地区", "服务规格", "关联氧气袋", "实付金额", "支付渠道", "订单状态", "订单下单时间","是否已分账","分账时间"],
        export: true,
      }
      if (this.form.fileName == "" || this.form.sheetName == "" || this.form.allExport == "") {
        this.$message.error("请填写完整")
        return
      }
      bbyOrderList(params).then(res => {
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

