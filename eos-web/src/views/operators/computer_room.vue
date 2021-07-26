<template>
  <div class="app-container">
    <div class="block">
      <el-input v-model="name" class="input_class" placeholder="按机房名称" clearable width="120"/>
      <el-input v-model="managePhone" class="input_class" placeholder="按管理员账号" clearable width="120"/>
      <el-input v-model="optName" class="input_class" v-if="user.type != 'OPT'" placeholder="按所属运营商" clearable width="120"/>
      <div>
        <v-distpicker :province="select.province" :city="select.city" :area="select.area" @selected="selectShow" @province="onChangeProvince" @city="onChangeCity"></v-distpicker>
      </div>
      <el-select v-model="productLine" clearable placeholder="产品线" style="margin-left: 20px">
        <el-option
          v-for="item in option1"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-select v-model="type" clearable placeholder="机房类型" style="margin-left: 20px">
        <el-option
          v-for="item in type_options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>
    <div class="block" >
      <el-date-picker
        v-model="value1"
        type="daterange"
        range-separator="至"
        start-placeholder="按创建日期"
        end-placeholder="创建日期"
        style="margin-right:20px;"
      />
      <el-button style="margin-left:100px;background-color: #30B08F;color: white" @click="searchShow()">查询</el-button>
      <el-button type="warning" @click="resetForm()">重置</el-button>
      <el-button type="danger" @click="AddOperators(1)" v-if="buttonArray.includes('room_add_n')">新增</el-button>
      <button type="button" class="el-button el-button--primary el-button--medium" v-if="list.length !=0 && buttonArray.includes('canExport')" @click="dialogFormVisible = true"><i
        class="el-icon-document"/><span>
        导出 Excel
      </span></button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      style="border: 1px solid #EBEEF5;width: 100%"
      highlight-current-row
    >
      <el-table-column align="center" label="机房编号" width="200">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>
      <el-table-column label="机房位置名称" width="150" align="center">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>
      <el-table-column label="机房总控设备SN" width="150" align="center">
        <template slot-scope="scope">{{ scope.row.snNo }}
        </template>
      </el-table-column>
      <el-table-column label="所在地区" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.area }}</template>
      </el-table-column>
      <el-table-column class-name="status-col" label="机房管理员" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.manageContacts }}</template>
      </el-table-column>
      <el-table-column class-name="status-col" label="联系电话" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.managePhone }}</template>
      </el-table-column>
      <el-table-column class-name="status-col" label="运营产品线" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.productLine }}</template>
      </el-table-column>
      <el-table-column class-name="status-col" label="当前所属运营商" width="120" align="center" v-if="user.type != 'OPT'">
        <template slot-scope="scope">{{ scope.row.optName}}</template>
      </el-table-column>
      <el-table-column class-name="status-col" label="机房类型" width="110" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.type=='OLD'">老机房</span>
          <span v-if="scope.row.type=='FISSION'">分体式</span>
          <span v-if="scope.row.type=='DIRECT_CONNECT'">直连式</span>
          <span v-if="scope.row.type=='CENTRE'">中央制氧</span>
          <span v-if="scope.row.type=='DISTRIBUTED'">分布式</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="按所关联网点数" width="110" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.netCount == 0">0</span>
          <span v-if="scope.row.netCount != 0" @click="go_detail(scope.row.id)" style="color: #20a0ff">{{ scope.row.netCount }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="设备数" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.equipCount}}</template>
      </el-table-column>
      <el-table-column class-name="status-col" label="机房累计出氧量" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.totalOxyOutput }}L</template>
      </el-table-column>
      <el-table-column class-name="status-col" label="输出压力" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.outputPressure }}Mpa</template>
      </el-table-column>
      <el-table-column class-name="status-col" label="瞬时流量" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.instantFlow }}L/min</template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="创建时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time"/>
          <span>{{ scope.row.createDate}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right" width="250" v-if="buttonArray.includes('room_detail_n') || buttonArray.includes('room_service_n')">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="goOxygen(scope.row)" v-if="buttonArray.includes('room_detail_n')">机房详情</el-button>
          <el-button type="text" size="small" @click="handleClick(scope.row)" v-if="buttonArray.includes('room_service_n')">设备管理</el-button>
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
  import VDistpicker from "v-distpicker";
  import {computerList, operatorList} from '@/api/table'
  import {getBaseUrl} from '@/utils/auth'
  import {parseTime} from "@/utils";

  export default {
    name: 'computer_room',
    data() {
      return {
        list: [],
        user: JSON.parse(sessionStorage.getItem("user")),
        buttonArray:JSON.parse(sessionStorage.getItem("buttonArray")),
        listLoading: true,
        value1: [],
        value2: '',
        name: '',
        managePhone: '',
        optName: '',
        total:0,
        pageNo: 1,
        pageSize:10,
        productLine: "",
        select: {province: '', city: '', area: ''},
        options: [
          {
            value: '1',
            label: '供氧系统运营商,供氧机房投资商'
          },
          {
            value: '2',
            label: '供氧机房投资商'
          },
          {
            value: '3',
            label: '供氧销售服务商'
          },
          {
            value: '4',
            label: '售后服务提供商'
          }
        ],
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
        type:"",
        type_options:[
          {
            value: 'FISSION',
            label: '分体式'
          },
          {
            value: 'DIRECT_CONNECT',
            label: '直连式'
          },
          {
            value: 'CENTRE',
            label: '中央制氧'
          },
          {
            value: 'OLD',
            label: '老机房'
          },
          {
            value: 'DISTRIBUTED',
            label: '分布式'
          }
        ],
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
        roomId:"",
      }
    },
    created() {
      this.roomId = this.$router.currentRoute.query.roomId
      this.fetchData()
    },
    methods: {
      fetchData() {
        let list_params = {
          pageNo: this.pageNo,
          endTime: this.value1[1]?parseTime(this.value1[1]).substring(0, 10) + ' 23:59:59':'',
          type:this.type,
          name: this.name,
          optName:this.optName,
          roomId:this.roomId,
          pageSize: this.pageSize,
          managePhone: this.managePhone,
          cityName: this.select.city == "市"?"":this.select.city,
          provinceName: this.select.province == "省"?"":this.select.province,
          regionName: this.select.area == "区"?"":this.select.area,
          startTime: this.value1[0]?parseTime(this.value1[0]).substring(0, 10) + ' 00:00:00':'',
          productLine: this.productLine,
          token: sessionStorage.getItem("token"),
        }
        computerList(list_params).then(res => {
          if(res.code !=0) {
            this.list = res.data.list
            this.total = parseInt(res.data.total)
            this.listLoading = false
          }
        })
      },
      searchShow(){
        this.roomId = ""
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
        if (row.type == 'FISSION' || row.type == 'OLD') {
          this.$router.push({name: 'computer_room_device', query: {id: row.id, is_type: row.type}})
        }else if(row.type == 'DISTRIBUTED' ){
          this.$router.push({name: 'computer_distributed', query: {id: row.id,is_type:row.type,controlId:row.controlId}})
        }else{
          this.$router.push({name: 'central_oxygen', query: {id: row.id,is_type:row.type,controlId:row.controlId}})
        }
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`)
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
      // 导出表格
      exportExcel() {
        var params ={
          endTime: this.value1[1]?parseTime(this.value1[1]).substring(0,10)+' 23:59:59':'',
          name: this.name,
          optName:this.optName,
          phone: this.phone,
          type:this.type,
          cityName: this.select.city == "市"?"":this.select.city,
          provinceName: this.select.province == "省"?"":this.select.province,
          regionName: this.select.area == "区"?"":this.select.area,
          startTime: this.value1[0]?parseTime(this.value1[0]).substring(0,10)+' 00:00:00':'',
          pageNo: this.form.pageNo,
          pageSize: this.form.pageSize,
          roomId:this.roomId,
          fileName:this.form.fileName,
          sheetName:this.form.sheetName,
          allExport:this.form.allExport,
          excelColumn:  ['id','name','snNo','area','manageContacts','managePhone','productLine','optName','roomType','netCount','equipCount','totalOxyOutput','instantFlow','outputPressure','createDate'],
          excelHead:["机房编号","机房位置名称","机房总控设备SN","所在地区","机房管理员","联系电话","运营产品线","当前所属运营商","机房类型","按所关联网点数","设备数","机房累计出氧量(L)","瞬时流量(L/min)","输出压力(Mpa)","创建时间"],
          export:true,
        }
        if(this.form.fileName == "" || this.form.sheetName == "" || this.form.allExport == ""){
          this.$message.error("请填写完整")
          return
        }
        computerList(getBaseUrl(params)).then(res =>{
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
      //机房详情
      goOxygen(e) {
        if (this.user.type == "PLATFORM") {
          this.$router.push({name: 'computer_room_details', query: {id: e.id, type: 1}})
        } else {
          this.$router.push({name: 'computer_room_details', query: {id: e.id, type: 2}})
        }
      },
      //增加机房
      AddOperators(e) {
        this.$router.push({name: 'computer_room_details', query: {type: 4}})
      },
      go_detail(e){
        this.$router.push({name: 'operators_dot_list', query: {roomId: e}})
      },
      //重置
      resetForm(){
        this.name = ''
        this.select = {}
        this.productLine = ""
        this.type = ""
        this.managePhone = ''
        this.optName = ""
        this.value1= []
        this.value = ''
        this.fetchData()
      },
      selectShow(data){
        this.select = {province: data.province.value, city: data.city.value, area: data.area.value}
      },
      onChangeProvince(data){
        this.select.province = data.value
      },
      onChangeCity(data){
        this.select.city = data.value
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
    margin-right: 20px;
  }

</style>
<style>
  .distpicker-address-wrapper select {
    height: 30px;
    padding: 0 15px;
    font-size: 14px;
    background-color: #FFF;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #DCDFE6
  }
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
