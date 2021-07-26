<template>
  <el-tabs v-model="table_id" :tab-position="tabPosition" @tab-click="getPartDetail()" style="margin-top: 70px">
    <el-tab-pane v-for="item in table_list" :name="item.id" :key="item.id" :label="item.name">
      <el-table
        :data="tableData"
        stripe
        style="border: 1px solid #EBEEF5;"
        align="center"
      >
        <el-table-column
          width="180"
        >
          <template slot="header" slot-scope="scope">
            <a style="color: #20a0ff;text-decoration:palegoldenrod" @click="hreadShow()">{{table_name}}</a>
          </template>
          <template slot-scope="scope">
            <a style="color: #20a0ff;text-decoration:palegoldenrod" @click="addShow(scope.row)" pror="name">{{scope.row.name}}</a>
          </template>
        </el-table-column>
        <el-table-column
          prop="maintainDuration"
          label="保养周期（小时）"
          align="center"
          width="180">
        </el-table-column>
        <el-table-column
          prop="code"
          label="系统编码"
          align="center"
          width="180">
        </el-table-column>
        <el-table-column
          prop="modelNames"
          label="所使用设备型号"
          align="center"
          width="180">
        </el-table-column>
        <el-table-column width="150">
          <template slot="header" slot-scope="scope">
            <el-button type="danger" @click="addShow()" style="margin-right: 20px"
                       v-if="buttonArray.includes('add_equiment_parts')">添加
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-tab-pane>
    <el-dialog :title='table_name +(is_edit?"——规格维护":"新增规格")' :visible.sync="is_from" @close="colseClick()"
               width="500px" :close-on-click-modal="false">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="规格名称" prop="name">
          <el-input v-model="ruleForm.name" style="width: 250px" maxlength="50" placeholder="请输入规格名称" :disabled="is_edit"></el-input>
        </el-form-item>
        <el-form-item label="设备名称" prop="equipTypeCode">
          <el-select v-model="ruleForm.equipTypeCode" clearable multiple placeholder="请选择设备名称"
                     @change="selectShow(1)" style="width: 250px;">
            <el-option
              v-for="item in options_type"
              :key="'in'+item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="设备型号" prop="modelIds">
          <div style="display: flex;flex-direction: column">
            <el-select v-model="ruleForm.modelIds" clearable multiple placeholder="请选择设备型号" style="width: 250px;">
              <el-option
                v-for="item in ruleForm.options_ids"
                :key="item.id+'786'"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
            <p style="display: flex;margin: 0px;line-height: 10px;color: #8c939d;font-size: 8px;margin-top: 5px">
              可多选，不选则默认全选</p>
          </div>
        </el-form-item>
        <el-form-item label="保养周期(h)" prop="maintainDuration">
          <el-input v-model="ruleForm.maintainDuration" maxlength="50" style="width: 250px" v-input-filter:int
                    placeholder="请输入保养周期"></el-input>
        </el-form-item>
        <el-form-item label="系统编码" prop="code">
          <el-input v-model="ruleForm.code" maxlength="50" style="width: 250px" placeholder="请输入系统编码" :disabled="is_edit"></el-input>
        </el-form-item>
        <div style="display: flex;flex-direction: row;justify-content: center;align-items: center;">
          <span style="font-size: 12px;color: #5a5e66;margin-right: 20px">保存后再编辑，只可编辑设备名称和设备型号，保养周期</span>
          <el-button type="primary" @click="submitForm(1)" style="width: 100px">提交</el-button>
        </div>
      </el-form>
    </el-dialog>
    <el-dialog title="编辑部件" :visible.sync="is_part_from" @close="colseClick()" width="500px"
               :close-on-click-modal="false">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="部件名称" prop="name">
            <el-input v-model="ruleForm.name" style="width: 250px" maxlength="50" placeholder="请输入部件名称"></el-input>
          </el-form-item>
          <el-form-item label="系统编码" prop="code">
            <el-input v-model="ruleForm.code" style="width: 250px" maxlength="50" placeholder="请输入系统编码(数字与字母组合)"></el-input>
          </el-form-item>
          <el-form-item label="使用设备名称">
            <div style="display: flex;flex-direction: column">
              <el-select v-model="ruleForm.equipTypeCode" clearable multiple placeholder="请选择设备名称"
                         @change="selectShow()" style="width: 250px;">
                <el-option
                  v-for="item in ruleForm.options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <p style="display: flex;margin: 0px;line-height: 10px;color: #8c939d;font-size: 8px;margin-top: 5px">
                可多选，不选则默认全选</p>
            </div>
          </el-form-item>
          <el-form-item label="设备型号">
            <div style="display: flex;flex-direction: column">
              <el-select v-model="ruleForm.modelIds" clearable multiple placeholder="请选择设备型号" style="width: 250px;" @change="selectShow()">
                <el-option
                  v-for="item in ruleForm.options_ids"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
              <p style="display: flex;margin: 0px;line-height: 10px;color: #8c939d;font-size: 8px;margin-top: 5px">
                可多选，不选则默认全选</p>
            </div>
          </el-form-item>
          <div style="display: flex;flex-direction: row;justify-content: center;align-items: center">
<!--            <span style="font-size: 12px;color: #5a5e66;margin-right: 20px">提交后不可修改，请谨慎选择</span>-->
            <el-button type="primary" @click="submitForm(2)" style="width: 120px;margin-top: 20px">保存</el-button>
          </div>
        </el-form>
    </el-dialog>
<!--        <el-tab-pane name="add">-->
<!--          <span slot="label"><i class="el-icon-plus"></i> 设备部件</span>-->
<!--          <div class="table_add">-->
<!--            <el-form :model="ruleForm" :rules="rules" label-position="right" ref="ruleForm" label-width="100px"-->
<!--                     class="demo-ruleForm">-->
<!--              <el-form-item label="部件名称" prop="name" style="margin-top: 50px">-->
<!--                <el-input v-model="ruleForm.name" style="width: 250px" placeholder="请输入部件名称"></el-input>-->
<!--              </el-form-item>-->
<!--              <el-form-item label="系统编码"  prop="code">-->
<!--                <el-input v-model="ruleForm.code" style="width: 250px" placeholder="请输入系统编码"></el-input>-->
<!--              </el-form-item>-->
<!--              <el-form-item label="使用设备名称"  >-->
<!--                <div style="display: flex;flex-direction: column">-->
<!--                <el-select v-model="ruleForm.equipTypeCode" clearable multiple placeholder="请选择设备名称"-->
<!--                           @change="selectShow()" style="width: 250px;">-->
<!--                  <el-option-->
<!--                    v-for="item in ruleForm.options"-->
<!--                    :key="item.value"-->
<!--                    :label="item.label"-->
<!--                    :value="item.value"-->
<!--                  />-->
<!--                </el-select>-->
<!--                  <p style="display: flex;margin: 0px;line-height: 10px;color: #8c939d;font-size: 8px;margin-top: 5px">可多选，不选则默认全选</p>-->
<!--                </div>-->
<!--              </el-form-item>-->
<!--              <el-form-item label="设备型号" >-->
<!--                <div style="display: flex;flex-direction: column">-->
<!--                <el-select v-model="ruleForm.modelIds" clearable multiple placeholder="请选择设备型号" style="width: 250px;">-->
<!--                  <el-option-->
<!--                    v-for="item in ruleForm.options_ids"-->
<!--                    :key="item.id"-->
<!--                    :label="item.name"-->
<!--                    :value="item.id"-->
<!--                  />-->
<!--                </el-select>-->
<!--                  <p style="display: flex;margin: 0px;line-height: 10px;color: #8c939d;font-size: 8px;margin-top: 5px">可多选，不选则默认全选</p>-->
<!--                </div>-->
<!--              </el-form-item>-->
<!--              <div style="display: flex;flex-direction: row;justify-content: center;align-items: center">-->
<!--                <span style="font-size: 12px;color: #5a5e66;margin-right: 20px">提交后不可修改，请谨慎选择</span>-->
<!--                <el-button type="primary" @click="submitForm(2)">保存</el-button>-->
<!--              </div>-->
<!--            </el-form>-->
<!--          </div>-->
<!--        </el-tab-pane>-->
  </el-tabs>

</template>

<script>
  import {
    equipmentList,
    equipmentPartAdd,
    equipmentPartList,
    equipmentPartDetail,
    equipmentSpecAdd,
    equipmentPartUpdate, partDetail, equipmentPartReplace
  } from "@/api/table";
  import {getBaseUrl} from "@/utils/auth";
  import inputFilter from "@/utils/input";

  export default {
    name: "equipment_parts",
    directives: {
      inputFilter
    },
    data() {
      return {
        tabPosition: "left",
        buttonArray: JSON.parse(sessionStorage.getItem("buttonArray")),
        table_id: '',
        table_name: '',
        table_list: [],
        tableData: [],
        is_from: false,
        is_edit: false,
        equipType: [],
        ruleForm: {
          name: "",
          code: "",
          equipTypeCode: '',
          options_ids: [],
          modelIds: [],
          modelNames: [],
          maintainDuration: "",
          specId: '',
          options: [
            {
              value: 'OXY',
              label: '制氧机'
            },
            {
              value: 'CONTROL',
              label: '控制器'
            },
            {
              value: 'HUMIDIFIER',
              label: '加湿器'
            },
            {
              value: 'GENERAL_CONTROL',
              label: '总控终端'
            },
            {
              value: 'TRANSFER',
              label: '中转终端'
            },
            {
              value: 'ENTER_HOUSE',
              label: '入户终端'
            },
            {
              value: 'OXY_UPTAKE',
              label: '取氧终端'
            },
            {
              value: 'SUB_CONTROL',
              label: '分体终端'
            },
            {
              value: 'OVERALL_SUB_CONTROL',
              label: '一体终端'
            }
          ],
        },
        options_type: [],
        is_part_from: false,
        rules: {
          name: [{required: true, message: "请输入", trigger: 'blur'}],
          maintainDuration: [{required: true, message: "请输入", trigger: 'blur'},],
          modelIds: [{required: true, message: "请选择", trigger: 'blur'},],
          equipTypeCode: [{required: true, message: "请选择", trigger: 'blur'},],
          code: [{required: true, message: "请输入", trigger: 'blur'},],
        },
      }
    },
    beforeCreate() {
      equipmentPartList(getBaseUrl({})).then(res => {
        if (res.code != 0) {
          this.table_id = res.data[0].id
          this.table_name = res.data[0].name
          this.equipType = res.data[0].typeCode.split(",")
          for (let i in res.data) {
            res.data[i].name = res.data[i].name + "   " + res.data[i].code
          }
          this.table_list = res.data
          this.getPartDetail()
        }
      })
    },
    methods: {
      submitForm(e) {
        if (!this.is_edit) {
          if (e == 2) {
            if(this.ruleForm.code =='' || this.ruleForm.name == ''){
              this.$message.error("请填写完整")
              return
            }
            let add_params = {
              code: this.ruleForm.code,
              equipTypeCode: this.ruleForm.equipTypeCode.toString(),
              modelIds: this.ruleForm.modelIds,
              name: this.ruleForm.name,
              partId: this.table_id,
            }
            equipmentPartReplace(getBaseUrl(add_params)).then(res => {
              if (res.code != 0) {
                this.ruleForm.code = ''
                this.ruleForm.equipTypeCode = ''
                this.ruleForm.modelIds = []
                this.ruleForm.name = ''
                this.$router.go(0);
              }
            })
          } else if (e == 1) {
            if(this.ruleForm.code =='' || this.ruleForm.name == '' || this.ruleForm.maintainDuration == ''){
              this.$message.error("请填写完整")
              return
            }
            let adds_params = {
              code: this.ruleForm.code,
              equipCode: this.ruleForm.equipTypeCode.toString(),
              modelIds: this.ruleForm.modelIds,
              name: this.ruleForm.name,
              maintainDuration: this.ruleForm.maintainDuration.replace(/\D/g, ''),
              partId: this.table_id,
            }
            equipmentSpecAdd(getBaseUrl(adds_params)).then(res => {
              if (res.code != 0) {
                this.ruleForm.code = ''
                this.ruleForm.equipTypeCode = ''
                this.ruleForm.modelIds = ''
                this.ruleForm.name = ''
                this.is_from = false
                this.ruleForm.maintainDuration = ''
                this.$router.go(0);
              }
            })
          }
        } else {
          let adds_params = {
            modelIds: this.ruleForm.modelIds,
            typeCode: this.ruleForm.equipTypeCode.toString(),
            maintainDuration: this.ruleForm.maintainDuration.replace(/\D/g, ''),
            id: this.ruleForm.specId,
            partId: this.table_id,
          }
          equipmentPartUpdate(getBaseUrl(adds_params)).then(res => {
            if (res.code != 0) {
              this.ruleForm.code = ''
              this.ruleForm.modelIds = ''
              this.ruleForm.name = ''
              this.is_from = false
              this.is_edit = false
              this.ruleForm.maintainDuration = ''
              this.$router.go(0);
            }
          })
        }
      },
      getPartDetail() {
        if (this.table_id != 'add') {
          this.ruleForm.code = ''
          this.ruleForm.equipTypeCode = ''
          this.ruleForm.modelIds = []
          this.ruleForm.name = ''
          var id = this.table_id
          this.table_list.map(item => {
            if (id == item.id) {
              this.table_name = item.name
              this.equipType = item.typeCode.split(",")
            }
          })
          var options_type = []
          for (let i in this.ruleForm.options) {
            for (let j in this.equipType) {
              if (this.ruleForm.options[i].value == this.equipType[j]) {
                options_type.push(this.ruleForm.options[i])
              }
            }
          }
          this.options_type = options_type
          equipmentPartDetail(getBaseUrl({partId: id})).then(res => {
            if (res.code != 0) {
              this.tableData = res.data
            }
          })
        }
      },
      hreadShow(){
        this.is_part_from = true
        partDetail(this.table_id).then(res =>{
          this.ruleForm.code = res.data.code
          this.ruleForm.equipTypeCode = res.data.typeCode?res.data.typeCode.split(","):''
          this.ruleForm.modelIds = res.data.modelIds
          this.ruleForm.name = res.data.name
          this.selectShow(1)
        })
      },
      colseClick() {
        this.is_from = false
        this.is_edit = false
        this.ruleForm.code = ''
        this.ruleForm.equipTypeCode = ''
        this.ruleForm.modelIds = []
        this.ruleForm.name = ''
        this.ruleForm.maintainDuration = ''
        this.is_part_from = false
      },
      addShow(e) {
        if (e) {
          this.ruleForm.code = e.code
          this.ruleForm.modelIds = e.modelIds.split(",")
          this.ruleForm.modelNames = e.modelNames.split(",")
          this.ruleForm.equipTypeCode = e.equipCode.split(",")
          this.ruleForm.name = e.name
          this.ruleForm.maintainDuration = e.maintainDuration
          this.ruleForm.specId = e.specId
          this.selectShow(1)
          this.is_edit = true
        } else {
          this.is_edit = false
        }
        this.is_from = true
      },
      selectShow(e) {
        equipmentList(getBaseUrl({
          pageNo: 1,
          name: "",
          pageSize: 100,
          typeCode: this.ruleForm.equipTypeCode.toString(),
          partId: (e == 1 && this.ruleForm.modelIds != "") ? this.table_id : "",
        })).then(res => {
          if (res.code != 0) {
            let arr = []
            for (let key in res.data.list) {
              arr.push({id: res.data.list[key].id, name: res.data.list[key].name})
            }
            this.ruleForm.options_ids = arr
          }
        })
      }
    }
  }
</script>

<style scoped>
  .table_add {
    width: 500px;
    height: 450px;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 40px;
    margin-left: 30px;
    border-radius: 10px;
    border: 1px solid #DCDFE6;
    position: fixed;
  }

  .block_div {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.5);
    position: fixed;
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
    width: 470px;
    display: flex;
    flex-direction: column;
  }
</style>

