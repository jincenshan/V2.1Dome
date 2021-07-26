<template>
  <div class="app-container">
    <div class="block">
<!--      <el-input v-model="name" class="input_class" placeholder="角色名称" clearable style="width: 220px"/>-->
<!--      <el-button style="margin-left:20px;background-color: #30B08F;color: white" @click="fetchData()">查询</el-button>-->
<!--      <el-button type="warning" @click="resetForm()">重置</el-button>-->
      <el-button type="danger" @click="addShow(1)" v-if="buttonArray.includes('add_equiment_type')">新增</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      style="border: 1px solid #EBEEF5;"
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="设备型号编号" width="200">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>
      <el-table-column label="所使用产品线" width="150" align="center">
        <template slot-scope="scope">{{ scope.row.productLine }}</template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="设备名称" width="150">
        <template slot-scope="scope">
          {{ scope.row.equipName }}
        </template>
      </el-table-column>
      <el-table-column label="设备型号名称" width="150" align="center">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>
      <el-table-column class-name="status-col" label="型号系统编码" width="150" align="center">
        <template slot-scope="scope">{{ scope.row.code }}</template>
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
    <el-dialog title="设备型号维护" :visible.sync="is_from" width="450px" :close-on-click-modal="false">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm">
          <el-form-item label="设备名称" prop="equipCode">
            <el-select v-model="ruleForm.equipCode" clearable placeholder="请选择设备名称" style="width: 200px">
              <el-option
                v-for="item in ruleForm.options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="用于哪产品线" prop="productLine">
            <el-select v-model="ruleForm.productLine" clearable multiple placeholder="请选择" style="width: 200px">
              <el-option
                v-for="item in ruleForm.option1"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="型号名称" prop="name">
            <el-input v-model="ruleForm.name" style="width: 200px" maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="型号编码" prop="code">
            <el-input v-model="ruleForm.code" style="width: 200px" maxlength="50"></el-input>
          </el-form-item>
          <div style="display: flex;flex-direction: row;justify-content: center;align-items: center">
            <span style="font-size: 12px;color: #5a5e66;margin-right: 20px">新增后不可删除</span>
            <el-button type="primary" @click="submitForm()" style="width: 100px">提交</el-button>
          </div>
        </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import {equipmentList,equipmentAdd} from '@/api/table'
  import {getBaseUrl} from '@/utils/auth'

  export default {
    name: 'equipment_type',
    data() {
      return {
        list: [],
        buttonArray:JSON.parse(sessionStorage.getItem("buttonArray")),
        listLoading: true,
        name: '',
        total:0,
        pageNo: 1,
        pageSize: 10,
        is_from: false,
        ruleForm: {
          name: '',
          equipCode: '',
          productLine: [],
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
            },
            {
              value: 'DEPT_TERMINAL',
              label: '科室终端'
            }
          ],
          option1: [{
            value: 'OXY',
            label: '氧调'
          }, {
            value: 'EOS',
            label: '标准化安全氧疗'
          }, {
            value: 'BBY',
            label: '抱抱氧'
          }]
        },
        rules: {
          equipCode: [
            {required: true,message:"请输入",trigger: 'blur'},
          ],
          productLine: [
            {required: true,message:"请输入",trigger: 'blur'},
          ],
          name: [
            {required: true,message:"请输入",trigger: 'blur'},
          ],
          code: [
            {required: true,message:"请输入",trigger: 'blur'},
          ]
        },
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      fetchData() {
        equipmentList(getBaseUrl({
          pageNo: this.pageNo,
          name: this.name,
          pageSize: this.pageSize
        })).then(res => {
          if(res.code !=0) {
            this.listLoading = false
            this.list = res.data.list
            this.total = parseInt(res.data.total)
          }
        })
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
      // 增加
      submitForm() {
        if(this.ruleForm.code =='' || this.ruleForm.name == '' || this.ruleForm.equipCode == '' || this.ruleForm.productLine == []){
          this.$message.error("请填写完整")
          return
        }
        let add_params = {
          code:this.ruleForm.code,
          equipCode: this.ruleForm.equipCode,
          name:this.ruleForm.name,
          productLine: this.ruleForm.productLine.toString(),
          token:sessionStorage.getItem("token")
        }
        equipmentAdd(add_params).then(res =>{
          if(res.code !=0) {
            this.is_from = false
            this.$router.go(0);
          }
        })
      },
      colseClick() {
        this.is_from = false
      },
      addShow(e) {
        this.is_from = true
      },
      resetForm(){
        this.name = ""
        this.fetchData()
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
</style>
