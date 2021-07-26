<template>
  <div class="app-container">
    <div class="block">
      <el-input v-model="name" class="input_class" placeholder="按运营商名称" clearable />
      <el-input v-model="phone" class="input_class" placeholder="按联系人电话" clearable/>
      <div>
        <v-distpicker :province="select.province" :city="select.city" :area="select.area" @selected="selectShow" @province="onChangeProvince" @city="onChangeCity"></v-distpicker>
      </div>
      <el-date-picker
        v-model="value1"
        type="daterange"
        format="yyyy-MM-dd"
        range-separator="至"
        start-placeholder="按创建日期"
        end-placeholder="创建日期"
        style="margin-right:20px;margin-left:10px"
      />
      <el-button style="margin-left:100px;background-color: #30B08F;color: white" @click="serachShow()">查询</el-button>
      <el-button type="danger" @click="AddOperators()" v-if="buttonArray.includes('add_operators_n')">新增</el-button>
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
      <el-table-column align="center" label="运营商编号" width="200">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>
      <el-table-column label="运营商名称" width="150" align="center">
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
      <el-table-column class-name="status-col" label="已入驻网点数" width="150" align="center">
        <template slot-scope="scope">
            <span style="color: #20a0ff" @click="go_dot_show(scope.row.id)" v-if="scope.row.netCount != 0 && scope.row.netCount">
            {{ scope.row.netCount }}
          </span>
          <span v-if="!scope.row.netCount || scope.row.netCount == 0">0</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="运营商类型" width="150" align="center">
        <template slot-scope="scope">{{scope.row.type}}</template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="创建时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time"/>
          <span>{{ scope.row.createDate}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right" width="150" v-if="buttonArray.includes('detail_eos_n')">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="handleClick(scope.row)" v-if="buttonArray.includes('detail_eos_n')">运营商详情</el-button>
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
  import {networkList, operatorList} from '@/api/table'
  import {parseTime} from '@/utils/index'
  import {getBaseUrl, getToken} from "@/utils/auth";
  import VDistpicker from "v-distpicker";

  export default {
    name: 'operator',
    components: {VDistpicker},
    data() {
      return {
        list: [],
        user:JSON.parse(sessionStorage.getItem("user")),
        buttonArray:JSON.parse(sessionStorage.getItem("buttonArray")),
        listLoading: true,
        value1: [],
        name: '',
        phone: '',
        total:0,
        pageNo: 1,
        pageSize: 10,
        select: {province: '', city: '', area: ''},
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
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      fetchData() {
        let list_params = {
          pageNo: this.pageNo,
          endTime: this.value1[1]?parseTime(this.value1[1]).substring(0,10)+' 23:59:59':'',
          name: this.name,
          pageSize: this.pageSize,
          phone: this.phone,
          cityName: this.select.city == "市"?"":this.select.city,
          provinceName: this.select.province == "省"?"":this.select.province,
          regionName: this.select.area == "区"?"":this.select.area,
          startTime: this.value1[0]?parseTime(this.value1[0]).substring(0,10)+' 00:00:00':'',
          productLine:"EOS",
          token:getToken(),
        }
        operatorList(list_params).then(res => {
          if(res.code !=0) {
            this.list = res.data.list
            this.total = parseInt(res.data.total)
            for (let i in this.list) {
              let arr = this.list[i].types;
              let tps = [];
              for (let j in arr) {
                tps.push(arr[j].name);
              }
              this.list[i].tps = tps;
            }
            this.listLoading = false
          }
        })
      },
      serachShow(){
        this.optId = ""
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
        this.$router.push({name: 'operators_details', query: {id: row.id, type: 2}})
      },
      go_dot_show(e){
        this.$router.push({name: 'eos_operator_on_dot',query:{optId:e}})
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
          phone: this.phone,
          cityName: this.select.city == "市"?"":this.select.city,
          provinceName: this.select.province == "省"?"":this.select.province,
          regionName: this.select.area == "区"?"":this.select.area,
          startTime: this.value1[0]?parseTime(this.value1[0]).substring(0,10)+' 00:00:00':'',
          pageNo: this.form.pageNo,
          pageSize: this.form.pageSize,
          fileName:this.form.fileName,
          sheetName:this.form.sheetName,
          allExport:this.form.allExport,
          excelColumn: ['id','name','area','contacts','phone','netCount','type','createDate'],
          excelHead:["运营商编号","运营商名称","所在地区","联系人","联系人电话","已入驻网点数","运营商类型","创建时间"],
          export:true,
          productLine:"EOS",
          token:getToken(),
        }
        if(this.form.fileName == "" || this.form.sheetName == "" || this.form.allExport == ""){
          this.$message.error("请填写完整")
          return
        }
        operatorList(params).then(res =>{
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
      //增加运营商
      AddOperators() {
        this.$router.push({name: 'operators_details', query: {type: 1}})
      },
      //重置
      resetForm(){
        this.name = ''
        this.select = {}
        this.phone = ''
        this.value1= []
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
    margin-right: 10px;
  }
</style>
<style>
  .el-date-editor .el-range-separator {
    height: auto;
  }

  .el-input__icon {
    height: auto;
  }

  .el-input__inner {
    height: 30px;
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


