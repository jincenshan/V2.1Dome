<template>
  <div class="app-container">
    <div class="block">
      <el-input v-model="bagSn" class="input_class" placeholder="氧疗袋S/N" clearable/>
      <el-input v-model="optName" class="input_class" placeholder="按所属运营商" v-if='user.type !="OPT"' clearable/>
      <el-select v-model="goodsId" clearable placeholder="按氧疗袋型号">
        <el-option
          v-for="item in options_ids"
          :key="item.id"
          :label="item.specification"
          :value="item.id"
        />
      </el-select>
      <el-select v-model="activeState" clearable placeholder="按激活状态" style="margin-left: 10px">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-select v-model="outState" clearable placeholder="按出库状态" style="margin-left: 10px">
        <el-option
          v-for="item in options_type"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-date-picker
        v-model="value1"
        type="daterange"
        range-separator="至"
        start-placeholder="入库时间"
        end-placeholder="入库时间"
        style="margin-left:10px"
      />
      <el-date-picker
        v-model="value2"
        type="daterange"
        range-separator="至"
        start-placeholder="激活时间"
        end-placeholder="激活时间"
        style="margin-left:10px"
      />
    </div>
    <div class="block" style="justify-content: flex-end">
      <el-button style="margin-left:20px;background-color: #30B08F;color: white" @click="fetchData()">查询</el-button>
      <el-button type="warning" @click="resetForm()">重置</el-button>
      <el-button type="danger" @click="addShow()" v-if="buttonArray.includes('add_oxy')">新增入库</el-button>
      <button type="button" class="el-button el-button--primary el-button--medium" @click="handleClick"><i class="el-icon-document"/><span>
        批量导入
      </span></button>
      <button type="button" class="el-button el-button--primary el-button--medium" @click="changeSelect"><i class="el-icon-document"/><span>
        批量出库
      </span></button>
      <button type="button" class="el-button el-button--primary el-button--medium" @click="dialogFormVisible = true"
              v-if="list.length !=0 && buttonArray.includes('canExport')"><i class="el-icon-document"/><span>
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
      tooltip-effect="dark"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column align="center" label="二维码编号" width="150">
        <template slot-scope="scope">
          {{ scope.row.showSn }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="氧疗袋设备S/N" width="150">
        <template slot-scope="scope">
          {{ scope.row.bagSn }}
        </template>
      </el-table-column>
      <el-table-column label="规格型号" width="150" align="center">
        <template slot-scope="scope">{{ scope.row.goodsSpec }}</template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="入库时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time"/>
          <span>{{ scope.row.storageTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="入库人" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.operator }}</template>
      </el-table-column>
      <el-table-column class-name="status-col" label="激活状态" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.activeState }}</template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="激活时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time"/>
          <span>{{ scope.row.userBindTime }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="出库状态" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.outState}}</template>
      </el-table-column>
      <el-table-column class-name="status-col" label="当前所属运营商" v-if='user.type !="OPT"' width="150" align="center">
        <template slot-scope="scope">{{ scope.row.optName }}</template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="250">
        <template slot-scope="scope">
          <el-button type="text" size="small" v-if='scope.row.outState == "未出库"'
                     @click="addShow(scope.row)">销售出库
          </el-button>
          <!--          <el-button type="text" size="small" v-if=" !scope.row.optName && buttonArray.includes('oxy_type')" @click="handleClick(scope.row)">关联设备规格</el-button>-->
<!--          <el-button type="text" size="small" v-if=" scope.row.optName && buttonArray.includes('oxy_m')"-->
<!--                     @click="go_monitor(scope.row)">设备运行监控-->
<!--          </el-button>-->
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
    <el-dialog :title="is_out?'销售出库':'新增制氧机入库记录'" :visible.sync="is_from" @close="colseClick()" width="500px"
               :close-on-click-modal="false">

      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="130px" class="demo-ruleForm">
        <div style="margin-bottom: 20px">
          <label v-if="is_batch">您选择了 {{bagIds.length}} 个氧疗袋，请输入下方信息确认出库划拨</label>
        </div>
        <el-form-item label="设备SN:" v-if="is_out && !is_batch" prop="name">
          <span>{{ ruleForm.snNOOne }}</span>
        </el-form-item>
        <el-form-item label="氧疗袋设备S/N" prop="bagSn" style="margin-top: 20px" v-if="!is_out && !is_batch">
          <el-input v-model="ruleForm.bagSn" maxlength="50" style="width: 250px" v-input-filter:china></el-input>
        </el-form-item>
        <el-form-item label="氧疗袋型号" v-if="!is_out && !is_batch" prop="goodsId">
          <el-select v-model="ruleForm.goodsId" clearable placeholder="按氧疗袋型号" style="width: 250px">
            <el-option
              v-for="item in options_ids"
              :key="item.id"
              :label="item.specification"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="入库人" prop="operator" v-if="!is_out && !is_batch">
          <el-input v-model="ruleForm.operator" maxlength="50" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="选择运营商" v-if='(is_out||is_batch)&& user.type != "OPT"'  prop="optId">
          <el-select v-model="ruleForm.optId" clearable placeholder="请选择运营商" style="width:250px">
            <el-option
              v-for="item in ruleForm.option_name"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="选择出库网点" v-if='(is_out||is_batch)&& user.type == "OPT"'  prop="netId">
          <el-select v-model="ruleForm.netId" clearable placeholder="请选择网点" style="width:250px">
            <el-option
              v-for="item in ruleForm.option_netName"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="选择出库时间" v-if="is_out || is_batch" prop="outTime">
          <div class="block">
            <el-date-picker
              v-model="ruleForm.outTime"
              type="date"
              placeholder="选择日期"
              style="width: 250px"
            >
            </el-date-picker>
          </div>
        </el-form-item>
        <el-form-item label="出库价格" v-if="is_out || is_batch">
          <div style="display: flex;flex-direction: row;width: 300px">
            <el-input v-model="ruleForm.price" style="width: 250px" v-input-filter:int></el-input>
            <span style="margin-left: 10px">元</span>
          </div>
        </el-form-item>
        <div style="display: flex;flex-direction: row;justify-content: center;align-items: center">
          <span style="font-size: 12px;color: #5a5e66;margin-right: 20px">提交后不可修改，请谨慎选择</span>
          <el-button type="primary" @click="submitForm(1)" style="width: 100px" v-if="is_out || is_batch">保存</el-button>
          <el-button type="primary" @click="submitForm(2)" style="width: 100px" v-if="!is_out && !is_batch">提交</el-button>
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
import {
  goodsSpec,
  oxygenBagList,
  equipmentStorageIn,
  operatorRoleSelect,
  oxygenBagUp,
  equipmentSpecSelect, getNetsByOpt
} from '@/api/table'
import {getBaseUrl} from '@/utils/auth'
import {parseTime} from "@/utils";
import inputFilter from "@/utils/input";

export default {
  name: 'oxygen_bag_go',
  directives: {
    inputFilter
  },
  data() {
    return {
      list: [],
      listLoading: true,
      user: JSON.parse(sessionStorage.getItem("user")),
      buttonArray: JSON.parse(sessionStorage.getItem("buttonArray")),
      value1: [],
      value2: [],
      bagSn: '',
      optName: '',
      pageNo: 1,
      pageSize: 10,
      total: 0,
      goodsId: '',
      options_ids: [],
      bagIds:[],
      activeState: '',
      is_out: false,
      options: [{
        label: '已激活',
        value: 'YES'
      }, {
        label: '未激活',
        value: 'NO'
      }],
      outState: '',
      options_type: [{
        label: '已出库',
        value: 'YES'
      }, {
        label: '未出库',
        value: 'NO'
      }],
      is_from: false,
      is_batch:false,
      ruleForm: {
        snNOOne: '',
        bagSn: '',
        operator: '',
        goodsId: '',
        price: '',
        outTime: new Date(),
        optId: '',
        option_name: [],
        netId:'',
        option_netName:[],
        equipId: '',
      },
      rules: {
        name: [{required: true, message: "请输入", trigger: 'blur'}],
        bagSn: [{required: true, message: "请输入", trigger: 'blur'}],
        goodsId: [{required: true, message: "请选择", trigger: 'blur'}],
        optId: [{required: true, message: "请选择", trigger: 'blur'}],
        netId:[{required: true, message: "请选择", trigger: 'blur'}],
        outTime: [{required: true, message: "请选择", trigger: 'blur'}],
        operator: [{required: true, message: "请输入", trigger: 'blur'}],
        fileName: [{required: true, message: "请输入", trigger: 'blur'}],
        sheetName: [{required: true, message: "请输入", trigger: 'blur'}],
        allExport: [{required: true, message: "请选择", trigger: 'blur'}],
      },
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
      formLabelWidth: '120px',
    }
  },
  created() {
    this.fetchData()
    goodsSpec({
      goodsType: 2,
    }).then(res => {
      if (res.code != 0) {
        this.options_ids = res.data
      }
    })
  },
  methods: {
    fetchData() {
      let params = {
        avicationTimeEnd: this.value2[1] ? parseTime(this.value2[1]).substring(0, 10) + ' 23:59:59' : '',
        avicationTimeStart: this.value2[0] ? parseTime(this.value2[0]).substring(0, 10) + ' 00:00:00' : '',
        pageNo: this.pageNo,
        inTimeEnd: this.value1[1] ? parseTime(this.value1[1]).substring(0, 10) + ' 23:59:59' : '',
        inTimeStart: this.value1[0] ? parseTime(this.value1[0]).substring(0, 10) + ' 00:00:00' : '',
        activeState: this.activeState,
        outState:this.outState,
        goodsId: this.goodsId,
        optName: this.optName,
        pageSize: this.pageSize,
        bagSn: this.bagSn,
      }
      oxygenBagList(getBaseUrl(params)).then(res => {
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
    handleSelectionChange(val){
      let array = val
      let a = []
      array.forEach(function (item){
        a.push(item.id)
      })
      this.bagIds = a
    },
    handleClick(row) {
      this.$router.push({name: 'oxygen_edit_bag'})
    },
    go_monitor(row) {
      this.$router.push({name: 'oxygenerator_monitor', query: {id: row.id, typeCode: "OXY"}})
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
    // 导出表格
    exportExcel() {
      var params = {
        avicationTimeEnd: this.value2[1] ? parseTime(this.value2[1]).substring(0, 10) + ' 23:59:59' : '',
        avicationTimeStart: this.value2[0] ? parseTime(this.value2[0]).substring(0, 10) + ' 00:00:00' : '',
        inTimeEnd: this.value1[1] ? parseTime(this.value1[1]).substring(0, 10) + ' 23:59:59' : '',
        inTimeStart: this.value1[0] ? parseTime(this.value1[0]).substring(0, 10) + ' 00:00:00' : '',
        activeState: this.activeState,
        outState:this.outState,
        goodsId: this.goodsId,
        optName: this.optName,
        bagSn: this.bagSn,
        pageSize: this.form.pageSize,
        pageNo: this.form.pageNo,
        fileName: this.form.fileName,
        sheetName: this.form.sheetName,
        allExport: this.form.allExport,
        excelColumn: ['showSn', 'bagSn', 'goodsSpec', 'storageTime', 'operator', 'activeState','userBindTime', 'outState','optName'],
        excelHead: ["二维码编号", "氧疗袋设备S/N", "规格型号", "入库时间", "入库人", "激活状态","激活时间", "出库状态","当前所属运营商"],
        export: true,
      }
      if (this.form.fileName == "" || this.form.sheetName == "" || this.form.allExport == "") {
        this.$message.error("请填写完整")
        return
      }
      oxygenBagList(getBaseUrl(params)).then(res => {
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
    colseClick() {
      this.is_from = false
      this.is_out = false
      this.is_batch = false
      this.ruleForm.bagSn = ""
      this.ruleForm.name = ""
      this.ruleForm.goodsId = ""
      this.ruleForm.operator = ""
      this.ruleForm.outTime = ''
      this.ruleForm.price = ""
      this.ruleForm.optId = ""
      this.ruleForm.netId = ""
      this.ruleForm.snNOOne = ""
    },
    //入库 出库
    addShow(e) {
      if (e) {
        this.is_out = true
        let a = []
        a.push(e.id)
        this.bagIds = a
        this.ruleForm.snNOOne = e.bagSn
        this.ruleForm.outTime = new Date()
        operatorRoleSelect(getBaseUrl({})).then(res => {
          if (res.code != 0) {
            this.ruleForm.option_name = res.data
          }
        })
        getNetsByOpt().then(res => {
          this.ruleForm.option_netName = res.data
        })
      }
      this.is_from = true
    },

    //批量出库
    changeSelect(){
      this.is_from = true
      this.is_batch = true
      operatorRoleSelect(getBaseUrl({})).then(res => {
        if (res.code != 0) {
          this.ruleForm.option_name = res.data
        }
      })
      getNetsByOpt().then(res => {
        this.ruleForm.option_netName = res.data
      })
    },
    //重置
    resetForm() {
      this.bagSn = ''
      this.optName = ''
      this.activeState = ''
      this.goodsId = ''
      this.value1 = []
      this.value2 = []
      this.fetchData()
    },
    submitForm(e) {
      if (e == 1) {
        let out_params = {
          bagIds: this.bagIds,
          optId: this.ruleForm.optId,
          netId:this.ruleForm.netId,
          outTime: parseTime(this.ruleForm.outTime).substring(0, 10),
          price: this.ruleForm.price,
        }
        oxygenBagUp(getBaseUrl(out_params)).then(res => {
          if (res.code != 0) {
            this.is_from = false
            this.$router.go(0);
          }
        })
      } else {
        if (this.ruleForm.goodsId == '' || this.ruleForm.bagSn == '' || this.ruleForm.operator == '') {
          this.$message.error("请填写完整")
          return
        }
        let add_params = {
          iccidOne: "",
          idccidTwo: "",
          goodsId: this.ruleForm.goodsId,
          modelName: 0,
          name: "",
          operator: this.ruleForm.operator,
          bagSn: this.ruleForm.bagSn,
          typeCode: "OXY"
        }
        goodsSpecSave(add_params).then(res => {
          if (res.code != 0) {
            this.is_from = false
            this.$router.go(0);
          }
        })
      }
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
  align-items: center;
  justify-content: center;
  width: 400px;
}

.el-input--suffix .el-input__inner {
  padding-left: 30px;
}
</style>
