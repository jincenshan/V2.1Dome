<template>
  <div class="app-container">
    <div class="block">
      <el-input v-model="name" class="input_class" placeholder="按网点名称" clearable/>
      <el-input v-model="contacts" class="input_class" placeholder="按联系人电话" clearable/>
      <el-input v-model="roomName" class="input_class" placeholder="按所属机房" clearable/>
      <div>
        <v-distpicker :province="select.province" :city="select.city" :area="select.area" @selected="selectShow"
                      @province="onChangeProvince" @city="onChangeCity"></v-distpicker>
      </div>
<!--      <el-select v-model="terminalType" clearable placeholder="终端类型">-->
<!--        <el-option-->
<!--          v-for="item in typeCode_options"-->
<!--          :key="item.value"-->
<!--          :label="item.label"-->
<!--          :value="item.value"-->
<!--        />-->
<!--      </el-select>-->
      <el-select v-model="contractType" clearable placeholder="签约类型" style="margin-left: 10px;width: 130px">
        <el-option
          v-for="item in payType_options"
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
      <el-button style="margin-left:10px;background-color: #30B08F;color: white;" @click="searchShow()">查询</el-button>
      <el-button type="danger" @click="AddOperators()" v-if=" buttonArray.includes('add_dot_n_eos')">新增</el-button>
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
      <el-table-column align="center" label="网点编号" width="200">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>
      <el-table-column label="网点名称" width="150" align="center">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>
      <el-table-column label="所在地区" width="150" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.area }}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系人" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.contacts }}</template>
      </el-table-column>
      <el-table-column class-name="status-col" label="联系人电话" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.phone }}</template>
      </el-table-column>
      <el-table-column class-name="status-col" label="签约人" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.weContacts }}</template>
      </el-table-column>
      <el-table-column class-name="status-col" label="签约类型" width="110" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.contractType == 'WHOLE'">全款购买设备</span>
          <span v-if="scope.row.contractType == 'BOTTOM_GUARD'">低首付，保底预收</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="制氧机台数" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.oxyCount }}</template>
      </el-table-column>
      <el-table-column class-name="status-col" label="控制器台数" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.controlCount }}</template>
      </el-table-column>
      <el-table-column class-name="status-col" label="累计出氧量" width="110" align="center" prop="oxyOut" sortable>
        <template slot-scope="scope">{{ scope.row.oxyOut}}L</template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="网点创建时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time"/>
          <span>{{ scope.row.createDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right" width="300">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="handleClick(scope.row)" style="padding: 0px" v-if="buttonArray.includes('eos_detail_n')">网点详情</el-button>
          <el-button type="text" size="small" @click="openShow(scope.row,0)" style="padding: 0px" v-if="scope.row.contractType =='BOTTOM_GUARD' && buttonArray.includes('fee_eos_n')">预收款维护</el-button>
<!--          <el-button type="text" size="small" style="padding: 0px"  @click="openShow(scope.row,1)">设备管理</el-button>-->
          <el-button type="text" size="small" style="padding: 0px"  @click="openShow(scope.row,2)" v-if="scope.row.hasContract =='YES' && buttonArray.includes('contract_flow_eos_n')">合同计划</el-button>
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
    <el-dialog title="预收款维护" :visible.sync="is_distribution" :close-on-click-modal="false" width="400px" @close="colseShow">
      <el-form :model="advance" :rules="rules" ref="advance" style="display: flex;flex-direction: column" label-width="100px" :label-position="labelPosition">
        <span style="margin-bottom: 20px">该网点合同中约定的设备预收款 金额；初次保存后，只允许修改 扣费周期 和 价格；</span>
        <el-form-item label="金额" prop="amount">
          <el-input v-model="advance.amount" class="input_class" maxlength="20" :disabled="isEdit" style="width: 200px" placeholder="请输入金额" v-input-filter:price/>
        </el-form-item>
        <el-form-item label="保证期限" prop="floorsLimitDate">
          <el-date-picker
            v-model="advance.floorsLimitDate"
            type="date"
            placeholder="选择日期"
            style="width: 200px"
            :disabled="isEdit"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="付费周期" prop="chargingCycle">
          <el-select v-model="advance.chargingCycle" placeholder="请选择付费周期"
                     style="width: 200px">
            <el-option
              v-for="items in chargingCycle_options"
              :key="items.value"
              :label="items.label"
              :value="items.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="价格/L/min" prop="unitPrice">
          <el-input v-model="advance.unitPrice" class="input_class" style="width: 200px" placeholder="请输入价格" v-input-filter:price/>
        </el-form-item>
        <el-form-item label="LLFDBS" prop="llfdbs">
          <el-input v-model="advance.llfdbs" class="input_class" :disabled="isEdit" style="width: 200px" placeholder="请输入LLFDBS" v-input-filter:int/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="colseShow()">取 消</el-button>
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
  import { networkList, advanceEdit,advanceQuery} from '@/api/table'
  import {parseTime} from "@/utils";
  import {getBaseUrl, getToken} from "@/utils/auth";
  import inputFilter from "@/utils/input";

  export default {
    name: 'eos_operator_on_dot',
    directives: {
      inputFilter
    },
    data() {
      return {
        list: [],
        isEdit:false,
        labelPosition:'right',
        optId: JSON.parse(sessionStorage.getItem("user")).type == 'OPT' ?JSON.parse(sessionStorage.getItem("user")).optId: "",
        listLoading: true,
        is_distribution: false,
        user: JSON.parse(sessionStorage.getItem("user")),
        buttonArray:JSON.parse(sessionStorage.getItem("buttonArray")),
        value1: [],
        name: "",
        roomName: "",
        contacts: "",
        optName: "",
        total:0,
        roomId:"",
        pageSize: 10,
        pageNo: 1,
        dateTime:'',
        select: {province: '', city: '', area: ''},
        typeCode_options: [
          {
            value: 'TRANSFER',
            label: '中转终端'
          },
          {
            value: 'ENTER_HOUSE',
            label: '入户终端'
          }
        ],
        typeCode:"",
        terminalType: "",
        contractType: "",
        advance:{
          floorsLimitDate:'',
          id:"",
          netId:"",
          llfdbs:'',
          unitPrice:'',
          chargingCycle:'',
          amount:'',
        },
        rules: {
          fileName: [{required: true, message: "请输入", trigger: 'blur'}],
          sheetName: [{required: true, message: "请输入", trigger: 'blur'}],
          allExport:[{required: true, message: "请选择", trigger: 'blur'}],
          amount:[{required: true, message: "请输入", trigger: 'blur'}],
          llfdbs:[{required: true, message: "请输入", trigger: 'blur'}],
          unitPrice:[{required: true, message: "请输入", trigger: 'blur'}],
          chargingCycle:[{required: true, message: "请选择", trigger: 'blur'}],
          floorsLimitDate:[{required: true, message: "请选择", trigger: 'blur'}],
        },
        chargingCycle_options:[  {
          value: 'MONTH',
          label: '按月'
        },
          {
            value: 'QUARTER',
            label: '按季'
          }],
        payType_options: [
          {
            value: 'WHOLE',
            label: '全款购买设备'
          },
          {
            value: 'BOTTOM_GUARD',
            label: '低首付，保底预收'
          }
        ],
        distribution_form: {},
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
        netId:"",
      }
    },
    created() {
      this.optId = this.$router.currentRoute.query.optId
      this.fetchData()
    },
    methods: {
      searchShow(){
        this.optId = ""
        this.fetchData()
      },
      fetchData() {
        var params = {
          pageNo: this.pageNo,
          name: this.name,
          contacts:this.contacts,
          terminalType: this.terminalType,
          contractType: this.contractType,
          roomId:this.roomId,
          optId:this.optId,
          pageSize: this.pageSize,
          cityName: this.select.city == "市"?"":this.select.city,
          provinceName: this.select.province == "省"?"":this.select.province,
          regionName: this.select.area == "区"?"":this.select.area,
          roomName: this.roomName,
          endTime: this.value1[1] ? parseTime(this.value1[1]).substring(0, 10) + ' 23:59:59' : '',
          startTime: this.value1[0] ? parseTime(this.value1[0]).substring(0, 10) + ' 00:00:00' : '',
          export: false,
          productLine:"EOS",
          token:getToken(),
        }
        networkList(params).then(res => {
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
          this.$router.push({name: 'operators_dot_detils', query: {id: row.id, type: 1}})
      },
      handleCurrentChange(val) {
        this.pageNo = val
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
        this.name = ""
        this.roomName = ""
        this.contacts = ""
        this.optName = ""
        this.select = {province: '', city: '', area: ''}
        this.value1 = []
        this.pageNo = 1
        this.contractType = ""
        this.fetchData()
      },
      colseShow(){
        this.netId = ""
        this.advance = {}
        this.is_distribution = false
        this.isEdit = false
      },
      // 导出表格
      exportExcel() {
        var params = {
          pageNo: this.form.pageNo,
          endTime: this.value1[1] ? parseTime(this.value1[1]).substring(0, 10) + ' 23:59:59' : '',
          name: this.name,
          terminalType: this.terminalType,
          contractType: this.contractType,
          contacts:this.contacts,
          optId:this.optId,
          pageSize: this.form.pageSize,
          cityName: this.select.city == "市"?"":this.select.city,
          provinceName: this.select.province == "省"?"":this.select.province,
          regionName: this.select.area == "区"?"":this.select.area,
          roomName: this.roomName,
          startTime: this.value1[0] ? parseTime(this.value1[0]).substring(0, 10) + ' 00:00:00' : '',
          token: sessionStorage.getItem("token"),
          fileName: this.form.fileName,
          sheetName: this.form.sheetName,
          allExport: this.form.allExport,
          excelColumn: ['id', 'name', 'area', 'contacts', 'phone', 'weContacts', 'contractType', 'oxyCount', 'controlCount', 'oxyOut', 'startTime'],
          excelHead: ["网点编号", "网点名称", "所在地区", "联系人", "联系人电话",  "签约人", "签约类型", "制氧机台数", "控制器台数", "累计出氧量(L)","网点创建时间"],
          export: true,
          productLine:"EOS",
          token:getToken(),
        }
        if(this.form.fileName == "" || this.form.sheetName == "" || this.form.allExport == ""){
          this.$message.error("请填写完整")
          return
        }
        networkList(params).then(res => {
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
      },
      onChangeProvince(data) {
        this.select.province = data.value
      },
      onChangeCity(data) {
        this.select.city = data.value
      },
      openShow(row,type_id){
        this.netId = row.id
        // this.advance.id = row.id
        this.advance.netId = row.id
        if(type_id == 0){
          if(row.hasContract =='YES') {
            advanceQuery({netId: this.netId, productLine: "EOS", token: getToken(),}).then(res => {
              if (res.code != 0) {
                if (res.data) {
                  this.isEdit = true
                  this.advance = res.data
                }
                this.is_distribution = true
              }
            })
          }else {
            this.is_distribution = true
          }
        }else if(type_id == 1){
          if (this.user.type == "PLATFORM") {
            this.$router.push({name: 'computer_room_device', query: {id: row.id, type: 1}})
          } else if(this.user.type == "OPT") {
            this.$router.push({name: 'computer_room_device', query: {id: row.id, type: 2}})
          }else {
            this.$router.push({name: 'computer_room_device', query: {id: row.id, type: 3}})
          }
        }else{
          this.$router.push({name: 'contract_flow', query: {id: row.id}})
        }
      },
      submitShow() {
        this.advance.floorsLimitDate = parseTime(this.advance.floorsLimitDate).substring(0, 10)
        this.advance.productLine="EOS"
        this.advance.token = getToken()
        if(this.advance.chargingCycle == '' || this.advance.unitPrice == '' || this.advance.llfdbs == '' || this.advance.floorsLimitDate == '' || this.advance.amount == ''){
          this.$message.error("请填写完整")
          return
        }
        let params = this.advance
        advanceEdit(params).then(res =>{
          if(res.code !=0){
            this.$router.go(0)
          }
        })
      },
      AddOperators(){
        this.$router.push({name: 'operators_dot_detils', query: {type: 2}})
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
  .el-dialog{
    width: 40%;
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
  .el-input--prefix .el-input__inner{
    padding-left: 30px !important;
  }
</style>
