<template>
  <el-tabs type="border-card" v-model="pane_name" @tab-click="computerTabber()" style="margin-top: 50px">
    <el-tab-pane label="网点详情" name="on">
      <div class="dashboard-container">
        <div class="details_from">
          <el-form :model="ruleForm" :label-position="from_l" :rules="rules" ref="ruleForm" :show-message="false"
                   label-width="150px"
                   class="demo-ruleForm" :disabled="is_from">
            <el-form-item v-if="ruleForm.id" label="运营商编号">
              <span style="width: 350px">{{ ruleForm.id }}</span>
            </el-form-item>
            <el-form-item label="网点名称" prop="name">
              <el-input v-model="ruleForm.name" style="width: 350px" placeholder="请输入网点名称"
                        v-input-filter:special></el-input>
            </el-form-item>
            <el-form-item label="所在地区" prop="area">
              <el-cascader
                ref="cascaderAddr"
                v-model="ruleForm.area"
                :options="addressArea"
                placeholder="请选择省市区"
                :props="areaProps"
                @change="selectShow"
                style="width: 350px"
              >
              </el-cascader>
            </el-form-item>
            <el-form-item label="详细地址">
              <el-input v-model="ruleForm.address" style="width:350px " placeholder="请输入详细地址"
                        v-input-filter:special></el-input>
            </el-form-item>
            <el-form-item label="网点类型">
              <el-select v-model="ruleForm.type" clearable placeholder="网点类型" style="width: 350px">
                <el-option
                  v-for="item in ruleForm.type_options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="经营性质" v-if="ruleForm.type == 'HOSPITAL'">
              <el-select v-model="ruleForm.properties" clearable placeholder="经营性质" style="width: 350px">
                <el-option
                  v-for="item in ruleForm.properties_options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="等级" v-if="ruleForm.type == 'HOSPITAL'">
              <el-select v-model="ruleForm.rank" clearable placeholder="等级" style="width: 350px">
                <el-option
                  v-for="item in ruleForm.rank_options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="床位数" v-if="ruleForm.type == 'HOSPITAL'">
              <el-select v-model="ruleForm.berthCount" clearable placeholder="床位数" style="width: 350px">
                <el-option
                  v-for="item in ruleForm.berthCount_options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="所属产品线" prop="productLine">
              <el-select v-model="ruleForm.productLine" clearable placeholder="所属产品线" style="width: 350px"
                         @change="productLineClick">
                <el-option
                  v-for="item in ruleForm.productLine_options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="终端类型" prop="terminalType" v-if="ruleForm.productLine == 'EOS'">
              <el-select v-model="ruleForm.terminalType" clearable placeholder="终端类型" style="width: 350px">
                <el-option
                  v-for="item in ruleForm.typeCode_options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="终端类型" prop="terminalType" v-if="ruleForm.productLine == 'OXY'">
              <el-select v-model="ruleForm.terminalType" clearable placeholder="终端类型" style="width: 350px">
                <el-option
                  v-for="item in ruleForm.typeCode_options_OXY"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="付费类型" prop="payType" v-if="ruleForm.productLine == 'OXY'">
              <el-select v-model="ruleForm.payType" clearable placeholder="付费类型" style="width: 350px">
                <el-option
                  v-for="item in ruleForm.payType_options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="签约类型" prop="contractType" v-if="ruleForm.productLine == 'EOS'">
              <el-select v-model="ruleForm.contractType" clearable placeholder="付费类型" style="width: 350px">
                <el-option
                  v-for="item in ruleForm.payType_options_EOS"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="所属机房" prop="roomName">
              <el-select v-model="ruleForm.roomName" clearable placeholder="所属机房" style="width: 350px"
                         @change="roomClick">
                <el-option
                  v-for="item in ruleForm.room_options"
                  :key="item.id"
                  :label="item.name"
                  :value="item"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="售后服务商" prop="serviceOptName" v-if="ruleForm.productLine == 'OXY'">
              <el-select v-model="ruleForm.serviceOptName" clearable placeholder="请选择售后服务商" style="width: 350px"
                         @change="serviceClick">
                <el-option
                  v-for="item in ruleForm.service_options"
                  :key="item.id"
                  :label="item.name"
                  :value="item"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="上级中转网点">
              <el-select v-model="ruleForm.superTransferNetName" clearable placeholder="请选择上级中转网点" style="width: 350px"
                         @change="superClick">
                <el-option
                  v-for="item in ruleForm.super_options"
                  :key="item.id"
                  :label="item.name"
                  :value="item"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="我方供氧销售联系人" prop="serviceUser">
              <el-select v-model="ruleForm.serviceUser" clearable placeholder="请选择维护员" style="width: 350px">
                <el-option
                  v-for="item in ruleForm.defendList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="网点联系人" required prop="contacts">
              <el-col :span="11">
                <el-form-item prop="name">
                  <el-input v-model="ruleForm.contacts" placeholder="请输入姓名" style="width: 150px"
                            v-input-filter:special></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="电话号码" prop="phone">
                  <el-input v-model="ruleForm.phone" style="width: 150px" placeholder="请输入电话号码"
                            v-input-filter:phone></el-input>
                </el-form-item>
              </el-col>
            </el-form-item>
            <el-form-item prop="date2" label="网点创建人" label-width="150" v-if="ruleForm.createrName">
              <span style="margin-left: 50px">{{ ruleForm.createrName }}</span>
            </el-form-item>
            <el-form-item v-if="type ==2" style="display: flex;flex-direction: row;justify-content: center">
              <el-button type="primary" @click="submitForm('ruleForm')"
                         v-if="buttonArray.includes('dot_submit_n') || buttonArray.includes('dot_submit_n_eos')">保存
              </el-button>
              <el-button @click="resetForm('ruleForm')" v-if="!ruleForm.id">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-tab-pane>
    <el-tab-pane label="网点分润信息管理" name="up" v-if="tabber == 1">
      <div class="details_from">
        <el-form :model="distribution_form" :disabled="is_edit" style="width: 100%">
          <el-tabs v-model="pane_type" @tab-click="computerTabberShow()">
            <el-tab-pane label="氧疗取氧订单分润项目" name="OXY_FEE">
              <div class="block" style="height: 50px;align-items: center;border-bottom: 1px solid #edf2fc;">
                <span>订单邀请引流方固定5%</span>
                <span style="margin-left: 50px">因每笔订单的邀请注册方不一样；分润比例在1%~5%之间</span>
                <el-button style="margin-left: 50px" type="danger" @click="addProfit(1)">新增</el-button>
              </div>
              <template v-for="(item,index) in distribution_form.list_data">
                <div class="list_div">
                  <div class="block">
                    <label style="color: #1482f0;margin-bottom: 20px;width: 40%"
                           v-if="!item.profitData">{{ item.profitTypeName }}</label>
                    <div style="width: 40%;margin-bottom: 20px">
                      <el-select v-model="item.profitData" v-if="item.profitData" clearable placeholder="请选择运营商类型"
                                 style="width: 250px;" @change="profitTypeShow(item.profitData,index)">
                        <el-option
                          v-for="items in distribution_form.options_operation"
                          :key="items.value"
                          :label="items.label"
                          :value="items"
                        />
                      </el-select>
                    </div>
                    <i class="el-icon-delete" style="color: red;" @click="deleteData(index)"
                       v-if="item.profitData"></i>
                  </div>
                  <div class="block" v-if="item.profitType <= 4">
                    <span style="width: 40%;">{{ item.profitName }}</span>
                    <span v-if="!item.isEdit">{{ item.profitRate }}</span>
                    <el-input v-model="item.profitRate" v-if="item.isEdit" class="input_class" placeholder="请输入百分比"
                              clearable
                              style="margin-right: 20px;" v-input-filter:price/>
                    <span style="margin-left: 10px">%</span>
                  </div>
                  <div class="block" v-if="item.profitType > 4">
                    <div style="width: 40%;margin-bottom: 20px">
                      <el-select v-model="item.profitId" v-if="item.isEdit" clearable
                                 placeholder="请选择运营商"
                                 style="width: 250px;">
                        <el-option
                          v-show="item.profitId == items.id || !optTypes_delete_two.includes(items.id)"
                          v-for="items in distribution_form.optTypes_two[item.profitData.value]"
                          :key="items.id"
                          :label="items.name"
                          :value="items.id"
                        />
                      </el-select>
                    </div>
                    <el-input v-model="item.profitRate" v-if="item.isEdit" class="input_class"
                              placeholder="请输入百分比"
                              clearable
                              style="margin-right: 20px;" v-input-filter:price/>
                    <span style="margin-left: 10px">%</span>
                  </div>

                </div>
              </template>
            </el-tab-pane>
            <el-tab-pane label="氧疗袋分润项目设置" name="BAG_FEE">
              <div class="block" style="height: 50px;align-items: center;border-bottom: 1px solid #edf2fc;">
                <span>订单邀请引流方固定5%</span>
                <span style="margin-left: 50px">因每笔订单的邀请注册方不一样；分润比例在1%~5%之间</span>
                <el-button style="margin-left: 50px" type="danger" @click="addProfit(1)">新增</el-button>
              </div>
              <template v-for="(item,index) in distribution_form.list_data">
                <div class="list_div">
                  <div class="block">
                    <label style="color: #1482f0;margin-bottom: 20px;width: 40%"
                           v-if="!item.profitData">{{ item.profitTypeName }}</label>
                    <div style="width: 40%;margin-bottom: 20px">
                      <el-select v-model="item.profitData" v-if="item.profitData" clearable placeholder="请选择运营商类型"
                                 style="width: 250px;" @change="profitTypeShow(item.profitData,index)">
                        <el-option
                          v-for="items in distribution_form.options_operation"
                          :key="items.value"
                          :label="items.label"
                          :value="items"
                        />
                      </el-select>
                    </div>
                    <i class="el-icon-delete" style="color: red;" @click="deleteData(index)"
                       v-if="item.profitData"></i>
                  </div>
                  <div class="block" v-if="item.profitType <= 4">
                    <span style="width: 40%;">{{ item.profitName }}</span>
                    <span v-if="!item.isEdit">{{ item.profitRate }}</span>
                    <el-input v-model="item.profitRate" v-if="item.isEdit" class="input_class" placeholder="请输入百分比"
                              clearable
                              style="margin-right: 20px;" v-input-filter:price/>
                    <span style="margin-left: 10px">%</span>
                  </div>
                  <div class="block" v-if="item.profitType > 4">
                    <div style="width: 40%;margin-bottom: 20px">
                      <el-select v-model="item.profitId" v-if="item.isEdit" clearable
                                 placeholder="请选择运营商"
                                 style="width: 250px;">
                        <el-option
                          v-show="item.profitId == items.id || !optTypes_delete_two.includes(items.id)"
                          v-for="items in distribution_form.optTypes_two[item.profitData.value]"
                          :key="items.id"
                          :label="items.name"
                          :value="items.id"
                        />
                      </el-select>
                    </div>
                    <el-input v-model="item.profitRate" v-if="item.isEdit" class="input_class"
                              placeholder="请输入百分比"
                              clearable
                              style="margin-right: 20px;" v-input-filter:price/>
                    <span style="margin-left: 10px">%</span>
                  </div>
                </div>
              </template>
            </el-tab-pane>
          </el-tabs>
        </el-form>
        <div slot="footer" class="dialog-footer"
             style="display: flex;flex-direction: row;justify-content: space-between;width: 100%;margin-top:20px">
          <span style="font-size: 12px;color: #8c939d;width: 80%;text-align: left">该笔订单的消费者，是由A用户邀请注册的，A用户为引流合伙人，设置了分润比例为3%；  则比如该笔订单实付金额为5元；分给KOL3%就是0.15元；剩余的引流2%，分给平台系统方</span>
          <el-button type="primary" @click="submitShow()">保存</el-button>
        </div>
      </div>
    </el-tab-pane>
    <el-tab-pane label="网点销售价格维护" name="price" v-if="tabber == 1">
      <div class="dashboard-container">
        <div class="details_from" style="width: 75%">
          <div class="block" style="height: 50px;align-items: center;border-bottom: 1px solid #edf2fc">
            <label>网点销售价格</label>
            <el-select v-model="priceForm.state" clearable placeholder="按状态" style="margin-left: 30px;" @change="listShow">
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
              @change="listShow"
            />
            <el-button style="margin-left: 30px" type="danger" @click="addPrice()">新增</el-button>
            <el-button type="warning" @click="resetPriceForm()" style="margin-left: 30px;">重置</el-button>
          </div>
          <el-table
            ref="multipleTable"
            :data="priceForm.listData"
            tooltip-effect="dark"
            style="width: 100%"
            >
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
                {{ scope.row.state == 0 ? "非失效" : (scope.row.state == 1 ? "待审核" : (scope.row.state == 2 ? "审核通过" : (scope.row.state == 3 ? "已生效" : (scope.row.state == 5 ? "已失效" : " "))))}}
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
                <el-button type="text" size="small" v-if="scope.row.state == 1 " @click="auditClick(scope.row)">审核</el-button>
                <el-button type="text" size="small" @click="deleteClick(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-dialog title="设置价格" :visible.sync="priceForm.is_price_from" @close="colseClick()" width="500px"
                   :close-on-click-modal="false">
          <el-form :model="priceForm.priceDate" :rules="rules" ref="ruleForm" label-width="130px" class="demo-ruleForm">
            <el-form-item label="选择商品规格" prop="goodsId">
              <el-select v-model="priceForm.priceDate.goodsId" clearable placeholder="请选择商品规格" style="width:250px">
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
                <el-input v-model="priceForm.priceDate.salePrice" style="width: 250px" v-input-filter:price></el-input>
                <span style="margin-left: 10px">元</span>
              </div>
            </el-form-item>
            <el-form-item label="生效日期" prop="effectiveDate">
              <el-date-picker
                v-model="priceForm.priceDate.effectiveDate"
                type="date"
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
    </el-tab-pane>
    <el-tab-pane label="历史修改记录" name="history" v-if="tabber == 1">
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import {parseTime} from "@/utils";
import {
  computerList,
  networkDetail,
  networkList,
  serviceList,
  networkAdd,
  networkUpdate,
  netWorkDefend,
  princeCityQuery,
  selectAllList,
  netshareQuery,
  netshareSave,
  netpriceOptList,
  netpriceSave,
  netpriceAudit,
  netpriceDelete,
  goodsSpec,
} from "@/api/table";
import {getBaseUrl, getToken} from "@/utils/auth";
import VDistpicker from "v-distpicker";
import inputFilter from "@/utils/input";

export default {
  name: "operators_dot_detils",
  components: {VDistpicker},
  directives: {
    inputFilter
  },
  data() {
    return {
      type: '', //网点类型
      from_l: 'right', //排版
      is_from: false, //弹窗
      pane_name: 'on',
      tabber: '',
      user: JSON.parse(sessionStorage.getItem("user")), //用户信息
      buttonArray: JSON.parse(sessionStorage.getItem("buttonArray")), //按钮显示
      addressArea: [],
      areaProps: {
        value: 'id',
        label: 'name',
      },
      ruleForm: {
        id: '', //表单数据字段
        name: "",
        rank: "",
        address: '',
        cityCode: "",
        cityName: "",
        regionCode: "",
        regionName: "",
        provinceCode: "",
        provinceName: "",
        payType: "",
        contractType: "",
        properties: "",
        productLine: "", //产品线
        productLine_options: [], // 产品线列表
        room_options: [], // 机房列表
        roomId: "", //机房ID
        roomName: "", //机房名称
        defendList: "", //网点列表
        service_options: [],
        berthCount: "",
        serviceOptName: "",
        serviceOptId: "",
        super_options: [],
        superTransferNetName: "",
        superTransferNetId: "",
        terminalType: "",
        phone: "",
        serviceUser: "", //网点维护员
        contacts: "",
        type: "",
        area: [],
        areaName: [],
        type_options: [{
          value: 'HOSPITAL',
          label: '医院'
        }, {
          value: 'HEALTH_CENTER',
          label: '卫生院'
        }, {
          value: 'HOTEL',
          label: '酒店'
        }, {
          value: 'PHARMACY',
          label: '药房'
        }, {
          value: 'BEADHOUSE',
          label: '养老院'
        }, {
          value: 'GYM',
          label: '健身房'
        }, {
          value: 'COMMUNITY',
          label: '社区'
        }, {
          value: 'OTHER',
          label: '其他'
        },],
        typeCode_options: [
          {
            value: 'GENERAL_CONTROL',
            label: '总控终端'
          }
        ],
        typeCode_options_OXY: [
          {
            value: 'TRANSFER',
            label: '中转终端'
          },
          {
            value: 'ENTER_HOUSE',
            label: '入户终端'
          }
        ],
        rank_options: [{
          value: 'THREE_LEVEL',
          label: '三级'
        },
          {
            value: 'FIRST_CLASS',
            label: '甲等'
          },
          {
            value: 'UNRATED',
            label: '未定级'
          }],
        properties_options: [
          {
            value: 'PUBLIC',
            label: '公立医院'
          },
          {
            value: 'PRIVATE',
            label: '民营医院'
          }],
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
        payType_options_EOS: [
          {
            value: 'WHOLE',
            label: '全款购买设备'
          },
          {
            value: 'BOTTOM_GUARD',
            label: '低首付，保底预收'
          }
        ],
        berthCount_options: [
          {
            value: 'ONE',
            label: '100-200'
          },
          {
            value: 'TWO',
            label: '200-500'
          },
          {
            value: 'THREE',
            label: '500-800'
          },
          {
            value: 'FOUR',
            label: '800-1100'
          },
          {
            value: 'FIVE',
            label: '1100-2000'
          },
          {
            value: 'SIX',
            label: '2000以上'
          }
        ],
      },
      rules: {
        name: [{required: true, message: "请输入", trigger: 'blur'}],
        productLine: [{required: true, message: "请选择", trigger: 'blur'}],
        terminalType: [{required: true, message: "请选择", trigger: 'blur'}],
        payType: [{required: true, message: "请选择", trigger: 'blur'}],
        contractType: [{required: true, message: "请选择", trigger: 'blur'}],
        roomName: [{required: true, message: "请选择", trigger: 'blur'}],
        serviceOptName: [{required: true, message: "请选择", trigger: 'blur'}],
        phone: [{required: true, message: "请输入", trigger: 'blur'}],
        serviceUser: [{required: true, message: "请选择", trigger: 'blur'}],
        contacts: [{required: true, message: "请输入", trigger: 'blur'}],
        area: [{required: true, message: "请输入", trigger: 'blur'}],
        goodsId: [{required: true, message: "请选择", trigger: 'blur'}],
        salePrice: [{required: true, message: "请选择", trigger: 'blur'}],
        effectiveDate: [{required: true, message: "请选择", trigger: 'blur'}],
      },
      distribution_form: {
        list_data: [],//分润数组
        options_arr: [],//运营商数组
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
        optTypes_two: {
          INVEST: [],
          SERVICE: [],
          SELL: [],
          SUP: [],
        },
      },//分润设置
      is_edit: false,//是否可以编辑
      pane_type: 'OXY_FEE',
      optTypes_delete_two:[],
      priceForm:{
        options: [{
          label: '非失效',
          value: '0'
        },{
          label: '待审核',
          value: '1'
        },{
          label: '审核通过',
          value: '2'
        }, {
          label: '已生效',
          value: '3'
        }, {
          label: '已失效',
          value: '5'
        }],
        EffectiveDate:[],//生效日期
        state:'',
        listData:[],
        is_price_from:false,
        priceDate:{
          goodsId:"",
          option_name:[],
          effectiveDate:'',
        },
      }
    }
  },
  created() {
    this.type = this.$router.currentRoute.query.type
    this.ruleForm.id = this.$router.currentRoute.query.id
    this.tabber = this.$router.currentRoute.query.tabber ? this.$router.currentRoute.query.tabber : 0
    let arr = []
    this.user.productLine.split(",").map(item => {
      if (item == "EOS") {
        arr.push({
          value: 'EOS',
          label: '标准化安全氧疗'
        })
      } else if (item == "OXY") {
        arr.push(
          {
            value: 'OXY',
            label: '氧调'
          })
      } else if (item == "BBY") {
        arr.push(
          {
            value: 'BBY',
            label: '抱抱氧'
          })
      }
    })
    this.ruleForm.productLine_options = arr
    //维护员列表
    netWorkDefend().then(res => {
      if (res.code != 0) {
        this.ruleForm.defendList = res.data
      }
    })
    princeCityQuery().then(res => {
      if (res.code != 0) {
        this.addressArea = res.data
      }
    })
    if (this.type != 2) {
      this.is_from = true
    }
    if (this.ruleForm.id) {
      networkDetail(getBaseUrl({netId: this.ruleForm.id})).then(res => {
        if (res.code != 0) {
          this.ruleForm.area[0] = res.data.provinceId.toString()
          this.ruleForm.area[1] = res.data.cityId.toString()
          this.ruleForm.area[2] = res.data.regionId.toString()
          this.ruleForm.areaName[0] = res.data.provinceName
          this.ruleForm.areaName[1] = res.data.cityName
          this.ruleForm.areaName[2] = res.data.regionName
          this.ruleForm.address = res.data.address
          this.ruleForm.berthCount = res.data.berthCount
          this.ruleForm.name = res.data.name
          this.ruleForm.payType = res.data.payType
          this.ruleForm.contractType = res.data.contractType
          this.ruleForm.productLine = res.data.productLine
          this.ruleForm.properties = res.data.properties
          this.ruleForm.rank = res.data.rank
          this.ruleForm.roomId = res.data.roomId
          this.ruleForm.roomName = res.data.roomName
          this.ruleForm.serviceOptId = res.data.serviceOptId
          this.ruleForm.serviceOptName = res.data.serviceOptName
          this.ruleForm.superTransferNetId = res.data.superTransferNetId
          this.ruleForm.superTransferNetName = res.data.superTransferNetName
          this.ruleForm.terminalType = res.data.terminalType
          this.ruleForm.type = res.data.type
          this.ruleForm.serviceUser = res.data.serviceUser
          this.ruleForm.phone = res.data.phone
          this.ruleForm.contacts = res.data.contacts
          this.ruleForm.createrName = res.data.createrName
          this.selectShowList()
        }
      })
    }
  },
  methods: {
    //提交按钮事件
    submitForm(formName) {
      var params = {
        id: this.ruleForm.id,
        address: this.ruleForm.address,
        berthCount: this.ruleForm.berthCount,
        name: this.ruleForm.name,
        payType: this.ruleForm.payType,
        contractType: this.ruleForm.contractType,
        productLine: this.ruleForm.productLine,
        properties: this.ruleForm.properties,
        cityId: this.ruleForm.area[1],
        cityName: this.ruleForm.areaName[1],
        provinceName: this.ruleForm.areaName[0],
        provinceId: this.ruleForm.area[0],
        regionId: this.ruleForm.area[2],
        regionName: this.ruleForm.areaName[2],
        rank: this.ruleForm.rank,
        roomId: this.ruleForm.roomId,
        roomName: this.ruleForm.roomName,
        serviceOptId: this.ruleForm.serviceOptId,
        serviceOptName: this.ruleForm.serviceOptName,
        superTransferNetId: this.ruleForm.superTransferNetId,
        superTransferNetName: this.ruleForm.superTransferNetName,
        terminalType: this.ruleForm.terminalType,
        token: sessionStorage.getItem("token"),
        type: this.ruleForm.type,
        phone: this.ruleForm.phone,
        contacts: this.ruleForm.contacts,
        serviceUser: this.ruleForm.serviceUser,
      }
      if (!this.ruleForm.name || this.ruleForm.areaName.length == 0 || (this.ruleForm.productLine == 'OXY' && this.ruleForm.serviceOptName == "") || this.ruleForm.contacts == "" || this.ruleForm.phone == "" || this.ruleForm.productLine == "" || this.ruleForm.serviceUser == "" || (this.ruleForm.productLine == 'EOS' && this.ruleForm.terminalType == "") || (this.ruleForm.productLine == 'EOS' && this.ruleForm.contractType == "") || (this.ruleForm.productLine == 'OXY' && this.ruleForm.payType == "") || !this.ruleForm.roomName) {
        this.$message.error('请填写完整的网点信息')
        return
      }
      const phoneReg = new RegExp('^(13|14|15|16|17|18|19)[0-9]{9}$')
      if (!phoneReg.test(this.ruleForm.phone)) {
        this.$message.error('手机号输入错误')
        this.ruleForm.phone = ""
        return;
      }
      if (this.ruleForm.id) {
        networkUpdate(params).then(res => {
          if (res.code != 0) {
            this.$router.go(-1)
          }
        })
      } else {
        networkAdd(params).then(res => {
          if (res.code != 0) {
            this.$router.go(-1)
          }
        })
      }
    },
    //重置
    resetForm() {
      this.ruleForm.address = ""
      this.ruleForm.berthCount = ""
      this.ruleForm.name = ""
      this.ruleForm.payType = ""
      this.ruleForm.contractType = ""
      this.ruleForm.productLine = ""
      this.ruleForm.properties = ""
      this.ruleForm.area = []
      this.ruleForm.areaName = []
      this.ruleForm.rank = ""
      this.ruleForm.roomId = ""
      this.ruleForm.roomName = ""
      this.ruleForm.serviceOptId = ""
      this.ruleForm.serviceOptName = ""
      this.ruleForm.superTransferNetId = ""
      this.ruleForm.superTransferNetName = ""
      this.ruleForm.terminalType = ""
      this.ruleForm.type = ""
      this.ruleForm.serviceUser = ""
      this.ruleForm.phone = ""
      this.ruleForm.contacts = ""
    },
    // 城市选择
    selectShow(data) {
      this.ruleForm.areaName = this.$refs['cascaderAddr'].getCheckedNodes()[0].pathLabels
    },
    // 机房选择
    roomClick(row) {
      this.ruleForm.roomId = row.id
      this.ruleForm.roomName = row.name
    },
    // 运营商选择
    serviceClick(row) {
      this.ruleForm.serviceOptId = row.id
      this.ruleForm.serviceOptName = row.name
    },
    //产品线选择
    productLineClick(row) {
      this.ruleForm.roomName = ""
      this.ruleForm.productLine = row
      this.ruleForm.room_options = []
      this.ruleForm.terminalType = this.ruleForm.productLine == 'EOS' ? "GENERAL_CONTROL" : ""
      this.ruleForm.payType = ""
      this.ruleForm.contractType = ""
      serviceList({productLine: this.ruleForm.productLine}).then(res => {
        if (res.code != 0) {
          this.ruleForm.service_options = res.data
        }
      })
      this.selectShowList()
    },
    //选择产品线调用事件与初始化页面数据
    selectShowList() {
      networkList({type: "TRANSFER", productLine: this.ruleForm.productLine}).then(res => {
        if (res.code != 0) {
          this.ruleForm.super_options = res.data.list
        }
      })
      computerList(({productLine: this.ruleForm.productLine, token: getToken()})).then(res => {
        if (res.code != 0) {
          let arr = []
          res.data.list.map(item => {
            arr.push({id: item.id, name: item.name})
          })
          this.ruleForm.room_options = arr
        }
      })
    },
    superClick(row) {
      this.ruleForm.superTransferNetId = row.id
      this.ruleForm.superTransferNetName = row.name
    },
    //网点切换
    computerTabber() {
      if (this.pane_name == "up") {
        this.computerTabberShow()
      }else if(this.pane_name == "price"){
        this.listShow()
      }
    },
    //氧疗袋切换
    computerTabberShow() {
      netshareQuery({netId: this.ruleForm.id, type: this.pane_type}).then(res => {
        if (res.code != 0) {
          res.data.map(item=>{
            if(item.profitType>4){
              item.profitData = {
                value:  (item.profitType ==5?"INVEST":(item.profitType ==6?"SERVICE":(item.profitType ==7?"SELL":"SUP"))),
                lable:  (item.profitType ==5?"投资服务商":(item.profitType ==6?"售后服务商":(item.profitType ==7?"销售服务商":"供氧服务商")))
              }
            }
          })
          this.distribution_form.list_data = res.data
        }
      })
      selectAllList({type: "INVEST",productLine: "BBY", token: getToken(),}).then(res => {
        if (res.code != 0) {
          this.distribution_form.optTypes_two.INVEST = res.data
        }
      })
      selectAllList({type: "SERVICE",productLine: "BBY", token: getToken(),}).then(res => {
        if (res.code != 0) {
          this.distribution_form.optTypes_two.SERVICE = res.data
        }
      })
      selectAllList({type: "SELL",productLine: "BBY", token: getToken(),}).then(res => {
        if (res.code != 0) {
          this.distribution_form.optTypes_two.SELL = res.data
        }
      })
      selectAllList({type: "SUP",productLine: "BBY", token: getToken(),}).then(res => {
        if (res.code != 0) {
          this.distribution_form.optTypes_two.SUP = res.data
        }
      })
    },
    //添加分润
    addProfit() {
      this.distribution_form.list_data.push({
        isEdit: true,
        netId:this.ruleForm.id,
        netName: "",
        profitId:'',
        profitName: "",
        profitType: 5,
        type: this.pane_type,
        profitData:{
          lable:"",
          value:"",
        }
      })
    },
    //类型选择
    profitTypeShow(type, index) {
      this.optTypes_delete_two = [];
      for (const item of this.distribution_form.list_data) {
        if (item.profitId) {
          this.optTypes_delete_two.push(item.profitId);
        }
      }
      selectAllList({
        type: type.value,
        productLine: "BBY",
        token: getToken(),
      }).then(res => {
        if (res.code != 0) {
          this.distribution_form.list_data[index].profitName = type.label
          this.distribution_form.list_data[index].profitType = (type.value =="INVEST"?5:(type.value =="SERVICE"?6:(type.value =="SELL"?7:8)))
          this.distribution_form.list_data[index].profitId = ''
          this.distribution_form.options_arr = res.data
        }
      })
    },
    //删除数据
    deleteData(index) {
      this.distribution_form.list_data.splice(index, 1);
    },
    //保存
    submitShow() {
      let price = 0
      this.distribution_form.list_data.map(item =>{
        price += parseFloat(item.profitRate)
      })
      if(price != 95){
        this.$message.error("分润金额加起来必须等于100%")
        return
      }
      netshareSave(this.distribution_form.list_data).then(res => {
        if (res.code != 0) {
          this.$message.success("保存成功！")
        }
      })
    },

  //  重置
    resetPriceForm(){
      this.priceForm.state = ''
      this.priceForm.EffectiveDate = []
      this.priceForm.listData = []
      this.listShow()
    },
    //价格列表
    listShow(){
      let params = {
        endEffectiveDate:this.priceForm.EffectiveDate[1]?parseTime(this.priceForm.EffectiveDate[1]).substring(0, 10) + ' 23:59:59' : '',
        beginEffectiveDate: this.priceForm.EffectiveDate[0] ? parseTime(this.priceForm.EffectiveDate[0]).substring(0, 10) + ' 00:00:00' : '',
        netId:this.ruleForm.id,
        state:this.priceForm.state,
        pageNo:1,
        pageSize:1000,
      }
      netpriceOptList(params).then(res=>{
        if(res.code != 0){
          this.priceForm.listData = res.data
        }
      })
    },
    //添加价格
    addPrice(){
      this.priceForm.is_price_from = true
      goodsSpec({goodsType:0}).then(res=>{
        this.priceForm.priceDate.option_name = res.data
      })
    },
    //关闭
    colseClick(){
      this.priceForm.is_price_from = false
      this.priceForm.priceDate.goodsId = ""
      this.priceForm.priceDate.salePrice = ""
      this.priceForm.priceDate.effectiveDate = ''
    },
    //保存
    submitPriceForm(){
      let params = {
        netId:this.ruleForm.id,
        salePrice:this.priceForm.priceDate.salePrice,
        goodsId:this.priceForm.priceDate.goodsId,
        effectiveDate:parseTime(this.priceForm.priceDate.effectiveDate).substring(0, 10)
      }
      netpriceSave(params).then(res=>{
        if(res.code != 0){
          this.$message.success("添加成功")
          this.colseClick()
          this.listShow()
        }
      })
    },
    //审核
    auditClick(row){
      this.$confirm("确定审核通过", row.goodsSpec+'，￥'+row.salePrice, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let ids = []
        ids.push(row.id)
        netpriceAudit({ids:ids,state:1}).then(res=>{
         if(res.code != 0){
           this.$message({
             type: 'success',
             message: '通过成功!'
           });
           this.listShow()
         }
        })
      }).catch(() => {

      });

    },
    //删除
    deleteClick(row){
      this.$confirm('此操作将会删除此条数据?', '确认删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let ids = []
        ids.push(row.id)
        netpriceDelete(ids).then(res =>{
          if(res.code !=0){
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.listShow()
          }
        })
      }).catch(() => {
      });

    },
  },
}
</script>

<style scoped>
.details_from {
  width: 70%;
  height: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 50px;
  border: 1px solid #CECECE;
  border-radius: 10px;
  margin-left: 100px;
  margin-top: 50px;
}

.list_div {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  border-bottom: 1px dashed #edf2fc;
  margin-top: 10px;
  padding-top: 10px;
  padding-bottom: 10px;
}

.block {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  flex-flow: wrap;
  width: 100%;
}

.el-date-editor .el-range-separator {
  height: auto;
}

.el-input__icon {
  height: auto;
}

.input_class {
  width: 130px;
  display: flex;
  margin-right: 10px;
  height: 30px;
}
</style>
<style>
.el-input__inner {
  height: 30px;
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
