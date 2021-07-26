<template>
  <div class="app-container">
    <div class="block">
      <el-input v-model="name" class="input_class" placeholder="按网点名称" clearable/>
      <el-input v-model="contacts" class="input_class" placeholder="按联系人电话" clearable/>
      <el-input v-model="optName" class="input_class" placeholder="按所属运营商" clearable/>
      <el-input v-model="roomName" class="input_class" placeholder="按所属机房" clearable/>
      <div>
        <v-distpicker :province="select.province" :city="select.city" :area="select.area" @selected="selectShow"
                      @province="onChangeProvince" @city="onChangeCity"></v-distpicker>
      </div>
      <el-select v-model="productLine" clearable placeholder="产品线" style="margin-left: 20px;width: 150px">
        <el-option
          v-for="item in option1"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>
    <div class="block">
      <el-date-picker
        v-model="value1"
        type="daterange"
        range-separator="至"
        start-placeholder="按创建日期"
        end-placeholder="创建日期"
      />
      <el-button style="margin-left:30px;background-color: #30B08F;color: white;" @click="searchShow()">查询</el-button>
      <el-button type="warning" @click="resetForm()">重置</el-button>
      <el-button type="danger" @click="AddOperators(1)" v-if="buttonArray.includes('add_dot_n')">新增</el-button>
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
      <el-table-column class-name="status-col" label="当前所属运营商" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.optName }}</template>
      </el-table-column>
      <el-table-column class-name="status-col" label="网点类型" width="110" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.type">{{type_options[scope.row.type].label}}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="所属机房" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.roomName }}</template>
      </el-table-column>
      <el-table-column class-name="status-col" label="入户终端SN" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.terminalSn}}</template>
      </el-table-column>
      <el-table-column class-name="status-col" label="终端类型" width="110" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.terminalType =='ENTER_HOUSE'">供氧入户终端</span>
          <span v-if="scope.row.terminalType =='TRANSFER'">供氧中转终端</span>
          <span v-if="scope.row.terminalType =='GENERAL_CONTROL'">总控终端</span>
          <span v-if="scope.row.terminalType =='OXY_UPTAKE'">取氧终端</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="产品线" width="110" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.productLine =='EOS'">标准化安全氧疗</span>
          <span v-if="scope.row.productLine == 'OXY'">氧调</span>
          <span v-if="scope.row.productLine == 'BBY'">抱抱氧</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="付费类型" width="110" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.payType =='FIRST_RECHARGE'">先充值</span>
          <span v-if="scope.row.payType =='NO_PAY'">无需付费</span>
          <span v-if="scope.row.payType =='POSTPAID'">后付费</span>
          <span v-if="scope.row.contractType =='WHOLE'">全款购买设备</span>
          <span v-if="scope.row.contractType =='BOTTOM_GUARD'">低首付，保底预收</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="网点创建时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time"/>
          <span>{{ scope.row.createDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right" width="250">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="handleClick(scope.row)">网点详情</el-button>
          <el-button type="text" size="small" @click="goOxygen(scope.row)" v-if="scope.row.terminalType =='ENTER_HOUSE' && buttonArray.includes('up_n')">房间分控管理</el-button>
          <el-button type="text" size="small" @click="goDepartment(scope.row)" v-if="scope.row.terminalType =='GENERAL_CONTROL' && buttonArray.includes('department_n')">维护科室终端</el-button>
          <el-button type="text" size="small" @click="goHumidifier(scope.row)" v-if="scope.row.terminalType =='ENTER_HOUSE' && buttonArray.includes('humidifier_n')">附件管理</el-button>
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
  import {networkList} from '@/api/table'
  import {parseTime} from "@/utils";

  export default {
    name: 'operators_dot_list',
    data() {
      return {
        list: [],
        listLoading: true,
        optId: JSON.parse(sessionStorage.getItem("user")).type == 'OPT' ?JSON.parse(sessionStorage.getItem("user")).optId: "",
        user: JSON.parse(sessionStorage.getItem("user")),
        buttonArray:JSON.parse(sessionStorage.getItem("buttonArray")),
        value1: [],
        name: "",
        roomId:"",
        roomName: "",
        contacts: "",
        optName: "",
        pageSize: 10,
        productLine: "",
        pageNo: 1,
        total: 0,
        select: {province: '', city: '', area: ''},
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
        type_options: {
          HOSPITAL: {
            value: 'HOSPITAL',
            label: '医院'
          }, HEALTH_CENTER: {
            value: 'HEALTH_CENTER',
            label: '卫生院'
          }, HOTEL: {
            value: 'HOTEL',
            label: '酒店'
          }, PHARMACY: {
            value: 'PHARMACY',
            label: '药房'
          }, BEADHOUSE: {
            value: 'BEADHOUSE',
            label: '养老院'
          }, GYM: {
            value: 'GYM',
            label: '健身房'
          }, COMMUNITY: {
            value: 'COMMUNITY',
            label: '社区'
          }, OTHER: {
            value: 'OTHER',
            label: '其他'
          }
        },
      }
    },
    created() {
      this.roomId = this.$router.currentRoute.query.roomId
      this.optId = this.$router.currentRoute.query.optId
      this.fetchData()
    },
    methods: {
      searchShow() {
        this.optId = ""
        this.roomId = ""
        this.fetchData()
      },
      fetchData() {
        var params = {
          pageNo: this.pageNo,
          endTime: this.value1[1] ? parseTime(this.value1[1]).substring(0, 10) + ' 23:59:59' : '',
          optName: this.optName,
          name:this.name,
          contacts:this.contacts,
          roomId:this.roomId,
          optId:this.optId,
          pageSize: this.pageSize,
          productLine: this.productLine,
          cityName: this.select.city == "市" ? "" : this.select.city,
          provinceName: this.select.province == "省" ? "" : this.select.province,
          regionName: this.select.area == "区" ? "" : this.select.area,
          roomName: this.roomName,
          startTime: this.value1[0] ? parseTime(this.value1[0]).substring(0, 10) + ' 00:00:00' : '',
          token: sessionStorage.getItem("token"),
          export: false,
        }
        networkList(params).then(res => {
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
        this.roomName = ""
        this.contacts = ""
        this.optName = ""
        this.select = {province: '', city: '', area: ''}
        this.value1 = []
        this.fetchData()
      },
      // 导出表格
      exportExcel() {
        var params = {
          pageNo: this.form.pageNo,
          endTime: this.value1[1] ? parseTime(this.value1[1]).substring(0, 10) + ' 23:59:59' : '',
          optName: this.optName,
          contacts:this.contacts,
          name:this.name,
          optId: this.user.type == 'OPT' ? this.user.optId : "",
          pageSize: this.form.pageSize,
          productLine: this.productLine,
          cityName: this.select.city == "市" ? "" : this.select.city,
          provinceName: this.select.province == "省" ? "" : this.select.province,
          regionName: this.select.area == "区" ? "" : this.select.area,
          roomName: this.roomName,
          startTime: this.value1[0] ? parseTime(this.value1[0]).substring(0, 10) + ' 00:00:00' : '',
          token: sessionStorage.getItem("token"),
          fileName: this.form.fileName,
          sheetName: this.form.sheetName,
          allExport: this.form.allExport,
          excelColumn: ['id', 'name', 'area', 'contacts', 'phone', 'optName', 'type', 'roomName', 'terminalSn', 'terminalType', 'productLine', 'payType', 'createDate'],
          excelHead: ["网点编号", "网点名称", "所在地区", "联系人", "联系人电话", "当前所属运营商", "网点类型", "所属机房", "入户终端SN", "终端类型", "产品线", "付费类型", "网点创建时间"],
          export: true,
        }
        if(this.form.fileName == "" || this.form.sheetName == "" || this.form.allExport == ""){
          this.$message.error("请填写完整")
          return
        }
        networkList(params).then(res => {
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
      selectShow(data) {
        this.select = {province: data.province.value, city: data.city.value, area: data.area.value}
      },
      onChangeProvince(data) {
        this.select.province = data.value
      },
      onChangeCity(data) {
        this.select.city = data.value
      },
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
      //科室终端
      goDepartment(e) {
        if (this.user.type == "PLATFORM") {
          this.$router.push({name: 'department', query: {id: e.id, type: 1}})
        } else if (this.user.type == "OPT") {
          this.$router.push({name: 'department', query: {id: e.id, type: 2}})
        } else {
          this.$router.push({name: 'department', query: {id: e.id, type: 3}})
        }
      },
      //加湿器管理
      goHumidifier(e){
        if (this.user.type == "PLATFORM") {
          this.$router.push({name: 'humidifier', query: {id: e.id, type: 1}})
        } else if (this.user.type == "OPT") {
          this.$router.push({name: 'humidifier', query: {id: e.id, type: 2}})
        } else {
          this.$router.push({name: 'humidifier', query: {id: e.id, type: 3}})
        }
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

