<template>
  <div class="app-container">
    <div class="block">
      <el-input v-model="priceForm.netName" class="input_class" placeholder="按网点名称" clearable/>
      <el-select v-model="priceForm.state" clearable placeholder="按状态" style="margin-left: 30px;">
        <el-option
          v-for="item in priceForm.options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-date-picker
        v-model="priceForm.EffectiveDate"
        type="daterange"
        range-separator="至"
        start-placeholder="生效日期"
        end-placeholder="生效日期"
        style="margin-left: 30px"
      />
      <el-button style="margin-left:30px;background-color: #30B08F;color: white;" @click="searchShow()">查询</el-button>
      <el-button style="margin-left: 30px" type="danger" v-if="is_all" @click="addPriceShow()">批量设置价格</el-button>
      <el-button style="margin-left: 30px" type="danger" @click="addPrice()">新增</el-button>
      <el-button type="warning" @click="resetPriceForm()" style="margin-left: 30px;">重置</el-button>
    </div>
    <el-table
      ref="multipleTable"
      :data="priceForm.listData"
      tooltip-effect="dark"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        label="网点"
        width="120">
        <template slot-scope="scope">{{ scope.row.netName }}</template>
      </el-table-column>
      <el-table-column
        label="销售规格"
        width="120">
        <template slot-scope="scope">{{ scope.row.goodsSpec }}</template>
      </el-table-column>
      <el-table-column
        label="指导价格"
        width="120">
        <template slot-scope="scope">{{ scope.row.guidePrice }}</template>
      </el-table-column>
      <el-table-column
        label="设置价格"
        width="120">
        <template slot-scope="scope">{{ scope.row.salePrice }}</template>
      </el-table-column>
      <el-table-column
        label="生效日期"
        width="180">
        <template slot-scope="scope">{{ scope.row.effectiveDate }}</template>
      </el-table-column>
      <el-table-column
        label="生效状态"
        width="120">
        <template slot-scope="scope">
          {{ scope.row.state == 0 ? "非失效" : (scope.row.state == 1 ? "待审核" : (scope.row.state == 2 ? "审核通过" : (scope.row.state == 3 ? "已生效" : (scope.row.state == 5 ? "已失效" : " ")))) }}
        </template>
      </el-table-column>
      <el-table-column
        label="创建者"
        width="120">
        <template slot-scope="scope">{{ scope.row.createdName }}</template>
      </el-table-column>
      <el-table-column
        label="审核员"
        width="120">
        <template slot-scope="scope">{{ scope.row.auditor }}</template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200px">
        <template slot-scope="scope">
          <el-button type="text" size="small" v-if="scope.row.state == 1" @click="auditClick(scope.row)">审核</el-button>
          <el-button type="text" size="small" @click="deleteClick(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title='is_all?"批量设置价格":"设置价格"' :visible.sync="priceForm.is_price_from" @close="colseClick()"
               width="500px"
               :close-on-click-modal="false">
      <el-form :model="priceForm.priceDate" :rules="rules" ref="ruleForm" label-width="130px" class="demo-ruleForm">
        <el-form-item label="选择网点" prop="goodsId" v-if="!is_all">
          <el-select v-model="priceForm.priceDate.netId" clearable placeholder="请选择网点" style="width:250px">
            <el-option
              v-for="item in priceForm.priceDate.option_netName"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="选择商品规格" prop="goodsId">
          <el-select v-model="priceForm.priceDate.goodsId" clearable :disabled="is_all" placeholder="请选择商品规格"
                     style="width:250px">
            <el-option
              v-for="item in priceForm.priceDate.option_name"
              :key="item.id"
              :label="item.goodsName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="设置价格" prop="salePrice">
          <div style="display: flex;flex-direction: row;width: 300px">
            <el-input v-model="priceForm.priceDate.salePrice" style="width: 250px" v-input-filter:int
                      placeholder="请输入价格"></el-input>
            <span style="margin-left: 10px">元</span>
          </div>
        </el-form-item>
        <el-form-item label="生效日期" prop="effectiveDate">
          <el-date-picker
            v-model="priceForm.priceDate.effectiveDate"
            type="date"
            style="width: 250px"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <div style="display: flex;flex-direction: row;justify-content: center;align-items: center">
          <span style="font-size: 12px;color: #5a5e66;margin-right: 20px">该价格通过审核后，将会在生效日期当天正式生效；生效后，用户购买将会执行该价格</span>
          <el-button type="primary" @click="submitPriceForm()" style="width: 100px">保存</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {goodsSpec, netpriceAudit, netpriceDelete, netpriceList, saveBatch, getNetsByOpt} from '@/api/table'
import {parseTime} from "@/utils";
import inputFilter from "@/utils/input";

export default {
  name: 'service_user_list',
  directives: {
    inputFilter
  },
  data() {
    return {
      user: JSON.parse(sessionStorage.getItem("user")),
      buttonArray: JSON.parse(sessionStorage.getItem("buttonArray")),
      pageSize: 10,
      pageNo: 1,
      total: 0,
      selectIds: [],
      is_all: false,
      priceForm: {
        options: [{
          label: '非失效',
          value: '0'
        }, {
          label: '待审核',
          value: '1'
        }, {
          label: '审核通过',
          value: '2'
        }, {
          label: '已生效',
          value: '3'
        }, {
          label: '已失效',
          value: '5'
        }],
        EffectiveDate: [],//生效日期
        state: '',
        listData: [],
        is_price_from: false,
        netName: "",
        priceDate: {
          goodsId: "",
          option_name: [],
          netId: "",
          option_netName: [],
          effectiveDate: '',
        },
      },
      rules: {
        fileName: [{required: true, message: "请输入", trigger: 'blur'}],
        sheetName: [{required: true, message: "请输入", trigger: 'blur'}],
        allExport: [{required: true, message: "请选择", trigger: 'blur'}],
      },
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    searchShow() {
      this.optId = ""
      this.roomId = ""
      this.fetchData()
    },
    fetchData() {
      let params = {
        endEffectiveDate: this.priceForm.EffectiveDate[1] ? parseTime(this.priceForm.EffectiveDate[1]).substring(0, 10) + ' 23:59:59' : '',
        beginEffectiveDate: this.priceForm.EffectiveDate[0] ? parseTime(this.priceForm.EffectiveDate[0]).substring(0, 10) + ' 00:00:00' : '',
        netName: this.priceForm.netName,
        state: this.priceForm.state,
        pageNo: this.pageNo,
        pageSize: this.pageSize,
      }
      netpriceList(params).then(res => {
        if (res.code != 0) {
          this.priceForm.listData = res.data.list
        }
      })
    },
    //  重置
    resetPriceForm() {
      this.priceForm.netName = ''
      this.priceForm.state = ''
      this.priceForm.EffectiveDate = []
      this.priceForm.listData = []
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
      this.optId = ""
      this.contacts = ""
      this.select = {province: '', city: '', area: ''}
      this.value1 = []
      this.fetchData()
    },

    //添加价格
    addPrice() {
      this.priceForm.is_price_from = true
      goodsSpec({goodsType: 0}).then(res => {
        this.priceForm.priceDate.option_name = res.data
      })
      getNetsByOpt().then(res => {
        this.priceForm.priceDate.option_netName = res.data
      })
    },

    //批量设置价格
    addPriceShow() {
      this.priceForm.is_price_from = true
      goodsSpec({goodsType: 0}).then(res => {
        this.priceForm.priceDate.option_name = res.data
      })
    },
    //关闭
    colseClick() {
      this.is_all = false
      this.selectIds = []
      this.priceForm.is_price_from = false
      this.priceForm.priceDate.goodsId = ""
      this.priceForm.priceDate.salePrice = ""
      this.priceForm.priceDate.effectiveDate = ''
    },
    //保存
    submitPriceForm() {
      let netId = []
      if(this.is_all){
        netId = this.selectIds
      }else {
        netId.push(this.priceForm.priceDate.netId)
      }
      let params = {
        netIds: netId,
        salePrice: this.priceForm.priceDate.salePrice,
        goodsId: this.priceForm.priceDate.goodsId,
        effectiveDate: parseTime(this.priceForm.priceDate.effectiveDate).substring(0, 10)
      }
      saveBatch(params).then(res => {
        if (res.code != 0) {
          this.$message.success("添加成功")
          this.colseClick()
          this.fetchData()
        }
      })
    },
    isAllEqual(val) {
      if (val.length > 0) {
        return !val.some(function (value, index) {
          return value.goodsId !== val[0].goodsId
        })
      } else {
        return true
      }
    },
    handleSelectionChange(val) {
      this.is_all = this.isAllEqual(val)
      let ids = []
      val.map(item => {
        this.priceForm.priceDate.goodsId = item.goodsId
        return ids.push(item.netId)
      })
      this.selectIds = ids
    },
    //审核
    auditClick(row) {
      this.$confirm("确定审核通过", row.goodsSpec + '，￥' + row.salePrice, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let ids = []
        ids.push(row.id)
        netpriceAudit({ids: ids, state: 1}).then(res => {
          if (res.code != 0) {
            this.$message({
              type: 'success',
              message: '通过成功!'
            });
            this.fetchData()
          }
        })
      }).catch(() => {

      });

    },
    //删除
    deleteClick(row) {
      this.$confirm('此操作将会删除此条数据?', '确认删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let ids = []
        ids.push(row.id)
        netpriceDelete(ids).then(res => {
          if (res.code != 0) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.fetchData()
          }
        })
      }).catch(() => {
      });
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

