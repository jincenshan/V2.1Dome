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
      <el-select v-model="terminalType" clearable placeholder="终端类型" style="margin-left: 10px;width: 130px">
        <el-option
          v-for="item in typeCode_options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-select v-model="payType" clearable placeholder="付费类型" style="margin-left: 10px;width: 130px">
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
      <el-button style="margin-left:30px;background-color: #30B08F;color: white;" @click="serachShow()">查询</el-button>
      <el-button type="warning" @click="resetForm()">重置</el-button>
      <button type="button" class="el-button el-button--primary el-button--medium"
              v-if="list.length !=0 && buttonArray.includes('canExport')" @click="dialogFormVisible = true"><i
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
          <span v-if="scope.row.type">{{net_type_options[scope.row.type].label}}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="所属机房" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.roomName }}</template>
      </el-table-column>
      <el-table-column class-name="status-col" label="终端SN" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.terminalSn}}</template>
      </el-table-column>
      <el-table-column class-name="status-col" label="终端类型" width="110" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.terminalType =='ENTER_HOUSE'">供氧入户终端</span>
          <span v-else-if="scope.row.terminalType =='TRANSFER'">供氧中转终端</span>
          <span v-else-if="scope.row.terminalType =='GENERAL_CONTROL'">总控终端</span>
          <span v-else-if="scope.row.terminalType =='OXY_UPTAKE'">取氧终端</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="付费类型" width="110" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.payType =='FIRST_RECHARGE'">先充值</span>
          <span v-if="scope.row.payType =='NO_PAY'">无需付费</span>
          <span v-if="scope.row.payType =='POSTPAID'">后付费</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="网点累计使用流量" width="110" align="center" prop="oxyOut" sortable>
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
          <el-button type="text"  size="small" @click="handleClick(scope.row)" style="padding: 0px " v-if="buttonArray.includes('share_oxy_detail_n')">网点详情</el-button>
<!--          <el-button type="text" size="small" @click="openShow(scope.row,0)" style="padding: 0px"-->
<!--                     v-if="scope.row.isAudit == 'YES' && scope.row.terminalType =='ENTER_HOUSE' && scope.row.payType !='NO_PAY' && buttonArray.includes('share_oxy_n') && user.type =='OPT'">-->
<!--               分润项目设置-->
<!--          </el-button>-->
<!--          <el-button type="text" size="small" @click="openShow(scope.row,1)" style="padding: 0px"-->
<!--                     v-if="scope.row.isAudit == 'No' && scope.row.terminalType =='ENTER_HOUSE' && scope.row.payType !='NO_PAY' && buttonArray.includes('look_n')">-->
<!--          分润项目查看-->
<!--          </el-button>-->
            <el-button type="text" size="small" @click="openShow(scope.row,0)" style="padding: 0px"
                     v-if="scope.row.isAudit == 'YES' && (scope.row.terminalType =='ENTER_HOUSE' || scope.row.terminalType =='TRANSFER') && scope.row.payType !='NO_PAY' && buttonArray.includes('share_oxy_n') && user.type =='OPT'">
               分润项目设置
          </el-button>
          <el-button type="text" size="small" @click="openShow(scope.row,1)" style="padding: 0px"
                     v-if="scope.row.isAudit == 'No' && (scope.row.terminalType =='ENTER_HOUSE' || scope.row.terminalType =='TRANSFER') && scope.row.payType !='NO_PAY' && buttonArray.includes('look_n')">
            分润项目查看
          </el-button>
          <el-button type="text" size="small" style="padding: 0px"
                     v-if="scope.row.isAudit == 'YES' && scope.row.payType !='NO_PAY' && buttonArray.includes('examine_n') && user.type =='OPT'"
                     @click="openShow(scope.row,1)">分润项目审核
          </el-button>
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
    <el-dialog title="分润项目设置" :visible.sync="is_distribution" :close-on-click-modal="false" @close="closeShow">
      <el-form :model="distribution_form" :disabled="is_edit">
        <el-tabs v-model="pane_name"  @tab-click="computerList()">
          <el-tab-pane label="安装费" name="on" v-if="!is_super">
            <div class="block" style="align-items: center">
              <span style="margin-right: 20px">安装费</span>
              <el-input v-model="amount" v-input-filter:price class="input_class" maxlength="20" placeholder="请输入价格" clearable style="margin-right: 20px"/>
              <span style="margin-left: 20px;margin-right: 35px">元</span>
              <el-button type="danger" @click="addShow()" v-if="!is_edit">增加分润运营商</el-button>
            </div>
            <div v-show="selectArray.length !=0" v-for="(item,index) in selectArray" :key="index">
              <div class="block" style="align-items: center">
                <el-select v-model="item.optType" clearable placeholder="请选择运营商类型"
                           style="width: 250px;" @change="operation_show">
                  <el-option
                    v-for="items in options_operation"
                    :key="items.value"
                    :label="items.label"
                    :value="items.value"
                  />
                </el-select>
                <i class="el-icon-delete" style="color: red;margin-left: 30px" @click="deleteData(index)"
                   v-if="!is_edit"></i>
              </div>
              <div class="block" style="align-items: center">
                <el-select v-model="item.optId" clearable placeholder="请选择运营商"
                           style="width: 250px;">
                  <el-option
                    v-show="item.optId == itema.id || !optTypes_delete.includes(itema.id)"
                    v-for="itema in optTypes[item.optType]"
                    :key="itema.id"
                    :label="itema.name"
                    :value="itema.id"
                  />
                </el-select>
                <el-input v-model="item.profitRate" class="input_class" placeholder="请输入百分比" clearable
                          style="margin-right: 20px;margin-left: 30px" v-input-filter:int/>
                <span style="margin-left: 10px">%</span>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="入户费" name="go" v-if="!is_super">
            <div class="block" style="align-items: center">
              <span style="margin-right: 20px">入户费</span>
              <el-input v-model="amount_one" class="input_class" maxlength="20" placeholder="请输入价格" clearable
                        style="margin-right: 20px" v-input-filter:price/>
              <span style="margin-left: 20px;margin-right: 35px">元</span>
              <el-button type="danger" @click="addShow()" v-if="!is_edit">增加分润运营商</el-button>
            </div>
            <div v-show="selectArrayOne.length !=0" v-for="(item,index) in selectArrayOne" :key="index">
              <div class="block" style="align-items: center">
                <el-select v-model="item.optType" clearable placeholder="请选择运营商类型"
                           style="width: 250px;" @change="operation_one_show">
                  <el-option
                    v-for="items in options_operation"
                    :key="items.value"
                    :label="items.label"
                    :value="items.value"
                  />
                </el-select>
                <i class="el-icon-delete" style="color: red;margin-left: 30px" @click="deleteData(index)"
                   v-if="!is_edit"></i>
              </div>
              <div class="block" style="align-items: center">
                <el-select v-model="item.optId" clearable placeholder="请选择运营商类型"
                           style="width: 250px;" >
                  <el-option
                    v-show="item.optId == itema.id || !optTypes_delete_one.includes(itema.id)"
                    v-for="itema in optTypes_one[item.optType]"
                    :key="itema.id"
                    :label="itema.name"
                    :value="itema.id"
                  />
                </el-select>
                <el-input v-model="item.profitRate" class="input_class" placeholder="请输入百分比" clearable
                          style="margin-right: 20px;margin-left: 30px" v-input-filter:int/>
                <span style="margin-left: 10px">%</span>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="流量付费" name="up">
            <div class="block" style="align-items: center">
              <span style="margin-right: 20px" v-if="!is_super">每L/min单价</span>
              <el-input v-if="!is_super" v-model="amount_two" maxlength="20" class="input_class" placeholder="请输入单价" clearable
                        style="margin-right: 20px" v-input-filter:price/>
              <span v-if="!is_super" style="margin-right: 40px">元</span>
              <el-button type="danger" @click="addShow()" v-if="!is_edit">增加分润运营商</el-button>
            </div>
            <div class="block" style="align-items: center">
              <span style="margin-right: 20px">付费周期</span>
              <el-select v-model="payCycle" clearable placeholder="请选择付费周期"
                         style="width: 130px;">
                <el-option
                  v-for="items in payCycle_options"
                  :key="items.value"
                  :label="items.label"
                  :value="items.value"
                  v-if="!is_super"
                />
                <el-option
                  v-for="items in payCycle_options_s"
                  :key="items.value"
                  :label="items.label"
                  :value="items.value"
                  v-if="is_super"
                />
              </el-select>
            </div>
            <div v-show="selectArrayTwo.length !=0" v-for="(item,index) in selectArrayTwo" :key="index">
              <div class="block" style="align-items: center">
                <el-select v-model="item.optType" clearable placeholder="请选择运营商类型"
                           style="width: 250px;" @change="operation_two_show">
                  <el-option
                    v-for="items in options_operation"
                    :key="items.value"
                    :label="items.label"
                    :value="items.value"
                  />
                </el-select>
                <i class="el-icon-delete" style="color: red;margin-left: 30px" @click="deleteData(index)"
                   v-if="!is_edit"></i>
              </div>
              <div class="block" style="align-items: center">
                <el-select v-model="item.optId" clearable placeholder="请选择运营商"
                           style="width: 250px;" >
                  <el-option
                    v-show="item.optId == itema.id || !optTypes_delete_two.includes(itema.id)"
                    v-for="itema in optTypes_two[item.optType]"
                    :key="itema.id"
                    :label="itema.name"
                    :value="itema.id"
                  />
                </el-select>
                <el-input v-model="item.profitRate" class="input_class" placeholder="请输入百分比" clearable
                          style="margin-right: 20px;margin-left: 30px" v-input-filter:int/>
                <span style="margin-left: 10px">%</span>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <div slot="footer" class="dialog-footer"
           style="display: flex;flex-direction: row;justify-content: space-between;width: 100%">
        <span style="font-size: 12px;color: #8c939d;width: 80%;text-align: left" v-if="pane_name == 'go'">费用设置后，付费业主，将会在微信上通过建行聚合支付付款，进入二清账户，按此比例分账；每个费用项目，全部分润比例加起来，必须等于100%</span>
        <span style="font-size: 12px;color: #8c939d;width: 80%;text-align: left" v-if="pane_name == 'on'">安装费设置后，付费业主，将会在微信上通过建行聚合支付付款，进入二清账户，按此比例分账；每个费用项目，全部分润比例加起来，必须等于100%</span>
        <span style="font-size: 12px;color: #8c939d;width: 80%;text-align: left" v-if="pane_name == 'up'">该笔分润，用户付款后，根据该分润比例，建行可进行分账</span>
        <!--        <el-button @click="closeShow()">取 消</el-button>-->
        <el-button type="primary" @click="submitShow()" v-if="!is_edit && user.type =='OPT'">确 定</el-button>
        <el-button type="primary" @click="auditShow()" v-if="is_edit && user.type =='OPT' && is_pass == 'WAIT_AUDIT'">审核通过</el-button>
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
  import {selectAllList, networkList, profitSetting, profitAudit, profitQuery} from '@/api/table'
  import {parseTime} from "@/utils";
  import {getBaseUrl, getToken} from "@/utils/auth";
  import inputFilter from "@/utils/input";

  export default {
    name: 'operator_on_dot',
    directives: {
      inputFilter
    },
    data() {
      return {
        list: [],
        listLoading: true,
        is_distribution: false,
        optId: JSON.parse(sessionStorage.getItem("user")).type == 'OPT' ? JSON.parse(sessionStorage.getItem("user")).optId : "",
        user: JSON.parse(sessionStorage.getItem("user")),
        buttonArray:JSON.parse(sessionStorage.getItem("buttonArray")),
        value1: [],
        name: "",
        total: 0,
        roomName: "",
        contacts: "",
        optName: "",
        pageSize: 10,
        pageNo: 1,
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
        typeCode: "",
        terminalType: "",
        payType: "",
        payType_options: [
          {
            value: 'FIRST_RECHARGE',
            label: '先充值'
          },
          {
            value: 'NO_PAY',
            label: '无需付费'
          },
          {
            value: 'POSTPAID',
            label: '后付费'
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
        rules: {
          fileName: [{required: true, message: "请输入", trigger: 'blur'}],
          sheetName: [{required: true, message: "请输入", trigger: 'blur'}],
          allExport:[{required: true, message: "请选择", trigger: 'blur'}],
        },
        formLabelWidth: '120px',
        is_pass:'',
        is_super:false,
        selectArray: [],
        selectArrayOne: [],
        selectArrayTwo: [],
        options_operation: [
          {
            value: 'INVEST',
            label: '投资服务商'
          },
          {
            value: 'SERVICE',
            label: '售后服务商'
          },
          {
            value: 'SELL',
            label: '销售服务商'
          },
          {
            value: 'SUP',
            label: '供氧服务商'
          }
        ],
        optTypes: {
          INVEST: [],
          SERVICE: [],
          SELL: [],
          SUP: [],
        },
        optTypes_one: {
          INVEST: [],
          SERVICE: [],
          SELL: [],
          SUP: [],
        },
        optTypes_two: {
          INVEST: [],
          SERVICE: [],
          SELL: [],
          SUP: [],
        },
        optTypes_delete: [],
        optTypes_delete_one: [],
        optTypes_delete_two: [],
        amount: "",
        amount_one: "",
        amount_two: "",
        pane_name: "on",
        netId: "",
        payCycle: "",
        payCycle_options: [{
          value: 'MONTH',
          label: '按月'
        },
          {
            value: 'QUARTER',
            label: '按季'
          }],
        payCycle_options_s: [{
          value: 'MONTH',
          label: '按月'
        }],
        price_id: "",
        is_edit: "",
        net_type_options: {
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
      this.optId = this.$router.currentRoute.query.optId
      this.fetchData()
    },
    methods: {
      fetchData() {
        var params = {
          pageNo: this.pageNo,
          endTime: this.value1[1] ? parseTime(this.value1[1]).substring(0, 10) + ' 23:59:59' : '',
          name: this.name,
          contacts: this.contacts,
          terminalType: this.terminalType,
          payType: this.payType,
          optId: this.optId,
          pageSize: this.pageSize,
          cityName: this.select.city == "市" ? "" : this.select.city,
          provinceName: this.select.province == "省" ? "" : this.select.province,
          regionName: this.select.area == "区" ? "" : this.select.area,
          roomName: this.roomName,
          startTime: this.value1[0] ? parseTime(this.value1[0]).substring(0, 10) + ' 00:00:00' : '',
          token: sessionStorage.getItem("token"),
          export: false,
          productLine: "OXY",
        }
        networkList(params).then(res => {
          if (res.code != 0) {
            this.list = res.data.list
            this.total = parseInt(res.data.total)
            this.listLoading = false
          }
        })

      },
      serachShow() {
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
        this.$router.push({name: 'operators_dot_detils', query: {id: row.id, type: 3}})
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
      operation_show() {
        this.optTypes_delete = [];
        for (const item of this.selectArray) {
          if (item.optId) {
            this.optTypes_delete.push(item.optId);
          }
        }
      },
      operation_one_show() {
        this.optTypes_delete_one = [];
        for (const item of this.selectArrayOne) {
          if (item.optId) {
            this.optTypes_delete_one.push(item.optId);
          }
        }
      },
      operation_two_show() {
        this.optTypes_delete_two = [];
        for (const item of this.selectArrayTwo) {
          if (item.optId) {
            this.optTypes_delete_two.push(item.optId);
          }
        }
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
        this.pageNo = 1
        this.terminalType = ""
        this.payType = ""
        this.fetchData()
      },
      // 导出表格
      exportExcel() {
        var params = {
          pageNo: this.form.pageNo,
          endTime: this.value1[1] ? parseTime(this.value1[1]).substring(0, 10) + ' 23:59:59' : '',
          name: this.name,
          contacts: this.contacts,
          terminalType: this.terminalType,
          payType: this.payType,
          optId: this.optId,
          pageSize: this.form.pageSize,
          cityName: this.select.city == "市" ? "" : this.select.city,
          provinceName: this.select.province == "省" ? "" : this.select.province,
          regionName: this.select.area == "区" ? "" : this.select.area,
          roomName: this.roomName,
          startTime: this.value1[0] ? parseTime(this.value1[0]).substring(0, 10) + ' 00:00:00' : '',
          token: sessionStorage.getItem("token"),
          fileName: this.form.fileName,
          sheetName: this.form.sheetName,
          allExport: this.form.allExport,
          excelColumn: ['id', 'name', 'area', 'contacts', 'phone', 'optName', 'type', 'roomName', 'terminalSn', 'terminalType', 'payType', 'oxyOut', 'createDate'],
          excelHead: ["网点编号", "网点名称", "所在地区", "联系人", "联系人电话", "当前所属运营商", "网点类型", "所属机房", "终端SN", "终端类型", "付费类型", "网点累计使用流量(L)", "网点创建时间"],
          export: true,
          productLine: "OXY",
          token: getToken(),
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
      openShow(row, is_edit) {
        this.selectArray = []
        this.selectArrayOne = []
        this.selectArrayTwo = []
        selectAllList({type: "INVEST",productLine: "OXY", token: getToken(),}).then(res => {
          if (res.code != 0) {
            this.optTypes.INVEST = res.data
            this.optTypes_one.INVEST = res.data
            this.optTypes_two.INVEST = res.data
          }
        })
        selectAllList({type: "SERVICE",productLine: "OXY", token: getToken(),}).then(res => {
          if (res.code != 0) {
            this.optTypes.SERVICE = res.data
            this.optTypes_one.SERVICE = res.data
            this.optTypes_two.SERVICE = res.data
          }
        })
        selectAllList({type: "SELL",productLine: "OXY", token: getToken(),}).then(res => {
          if (res.code != 0) {
            this.optTypes.SELL = res.data
            this.optTypes_one.SELL = res.data
            this.optTypes_two.SELL = res.data
          }
        })
        selectAllList({type: "SUP",productLine: "OXY", token: getToken(),}).then(res => {
          if (res.code != 0) {
            this.optTypes.SUP = res.data
            this.optTypes_one.SUP = res.data
            this.optTypes_two.SUP = res.data
          }
        })
        if (is_edit == 0 && this.user.type == 'OPT') {
          this.is_edit = false
        } else {
          this.is_edit = true
        }
        this.netId = row.id
        let type = ""
        if (this.pane_name == "on") {
          type = "INSTALL"
        } else if (this.pane_name == "go") {
          type = "ENTER_HOUSE"
        } else if (this.pane_name == "up") {
          type = "FLOW"
        }
        if(row.superTransferNetId && row.superTransferNetName){
          this.is_super = true
          this.pane_name = "up"
          type = "FLOW"
        }else {
          this.is_super = false
        }
        profitQuery({netId: this.netId, type: type, productLine: "OXY", token: getToken(),}).then(res => {
          if (res.code != 0) {
            if (!res.data) {
              this.price_id = ""
              this.is_pass = ""
            } else {
              this.price_id = res.data.id
              this.is_pass = res.data.status
              if (this.pane_name == "on") {
                this.amount = res.data.amount;
                this.selectArray = res.data.optRates
              } else if (this.pane_name == "go") {
                this.amount_one = res.data.amount
                this.selectArrayOne = res.data.optRates
              } else if (this.pane_name == "up") {
                this.amount_two = res.data.unitPrice
                this.payCycle = res.data.payCycle
                this.selectArrayTwo = res.data.optRates
              }
            }
            this.is_distribution = true
          }
        })
      },
      closeShow() {
        this.is_distribution = false
        this.is_pass = ""
        this.is_edit = false
        this.price_id = ""
        this.amount = ""
        this.amount_one = ""
        this.amount_two = ""
        this.selectArray = []
        this.selectArrayOne = []
        this.selectArrayTwo = []
        this.optTypes_delete=[]
        this.optTypes_delete_one= []
        this.optTypes_delete_two= []
        this.fetchData()
      },
      auditShow() {
        profitAudit(getBaseUrl({id: this.price_id})).then(res => {
          if (res.code != 0) {
            this.$message({
              type: 'success',
              message: '审核成功!'
            });
            this.computerList()
          }
        })
      },
      submitShow() {
        let params = {}
        let price = 0
        if (this.pane_name == "on") {
          this.selectArray.map(item => {
            price += parseInt(item.profitRate)
          })
          if(this.amount == ""){
            this.$message.error("请填写金额")
            return;
          }
          if(this.selectArray.length == 0){
            this.$message.error("请增加至少一位分润运营商")
            return;
          }
          params = {
            amount: this.amount,
            netId: this.netId,
            optRates: this.selectArray,
            id: this.price_id,
            type: "INSTALL",
            productLine: "OXY",
            token: getToken(),
          }
        } else if (this.pane_name == "go") {
          this.selectArrayOne.map(item => {
            price += parseInt(item.profitRate)
          })
          if(this.amount_one == ""){
            this.$message.error("请填写金额")
            return;
          }
          if(this.selectArrayOne.length == 0){
            this.$message.error("请增加至少一位分润运营商")
            return;
          }
          params = {
            amount: this.amount_one,
            netId: this.netId,
            optRates: this.selectArrayOne,
            id: this.price_id,
            type: "ENTER_HOUSE",
            productLine: "OXY",
            token: getToken(),
          }
        } else if (this.pane_name == "up") {
          this.selectArrayTwo.map(item => {
            price += parseInt(item.profitRate)
          })
          if(this.amount_two == "" && !this.is_super){
            this.$message.error("请填写金额")
            return;
          }
          if(this.selectArrayTwo.length == 0){
            this.$message.error("请增加至少一位分润运营商")
            return;
          }
          params = {
            unitPrice: this.amount_two,
            netId: this.netId,
            payCycle: this.payCycle,
            optRates: this.selectArrayTwo,
            id: this.price_id,
            type: "FLOW",
            productLine: "OXY",
            token: getToken(),
          }
        }
        if ((this.pane_name == "on" && this.selectArray.length != 0) || (this.pane_name == "go" && this.selectArrayOne.length != 0) || (this.pane_name == "up" && this.selectArrayTwo.length != 0)) {
          if (price != 100) {
            this.$message.error("分润比例不可大于或小于100%")
            return
          }
        }
        profitSetting(getBaseUrl(params)).then(res => {
          if (res.code != 0) {
            // this.$router.go(0)
            this.selectArray = []
            this.selectArrayOne = []
            this.selectArrayTwo = []
            this.$message({
              type: 'success',
              message: '添加成功!'
            });
            this.computerList()
          }
        })

      },
      addShow() {
        if (this.pane_name == "on") {
          this.selectArray.push({
            optId: "",
            optType: "",
            profitRate: "",
          });
        } else if (this.pane_name == "go") {
          this.selectArrayOne.push({
            optId: "",
            optType: "",
            profitRate: "",
          });
        } else if (this.pane_name == "up") {
          this.selectArrayTwo.push({
            optId: "",
            optType: "",
            profitRate: "",
          });
        }
      },
      computerList() {
        let type = ""
        if (this.pane_name == "on") {
          type = "INSTALL"
        } else if (this.pane_name == "go") {
          type = "ENTER_HOUSE"
        } else if (this.pane_name == "up") {
          type = "FLOW"
        }
        profitQuery({netId: this.netId, type: type, productLine: "OXY", token: getToken(),}).then(res => {
          if (res.code != 0) {
            if (!res.data) {
              this.price_id = ""
              this.is_pass = ""
            } else {
              this.price_id = res.data.id
              this.is_pass = res.data.status
              if (this.pane_name == "on") {
                this.amount = res.data.amount;
                this.selectArray = res.data.optRates
              } else if (this.pane_name == "go") {
                this.amount_one = res.data.amount
                this.selectArrayOne = res.data.optRates
              } else if (this.pane_name == "up") {
                this.amount_two = res.data.unitPrice
                this.payCycle = res.data.payCycle
                this.selectArrayTwo = res.data.optRates
              }
            }
          }
        })
      },
      deleteData(index) {
        if (this.pane_name == "on") {
          this.selectArray.splice(index, 1);
          this.optTypes_delete.splice(index, 1);
        } else if (this.pane_name == "go") {
          this.selectArrayOne.splice(index, 1);
          this.optTypes_delete_one.splice(index, 1);
        } else if (this.pane_name == "up") {
          this.selectArrayTwo.splice(index, 1);
          this.optTypes_delete_two.splice(index, 1);
        }
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

  .el-table--scrollable-x .el-table__body-wrapper {
    overflow-x: auto;
  }

  .el-table__fixed-right {
    height: 100% !important;
  }
</style>
