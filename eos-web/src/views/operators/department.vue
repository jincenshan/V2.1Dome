<template>
  <el-tabs type="border-card" v-model="pane_name" @tab-click="computerList()" style="margin-top: 50px">
    <el-tab-pane label="科室终端管理" name="on">
      <div>
        <el-button type="danger" @click="addShow(1)" style="margin-bottom: 20px"
                   v-if="buttonArray.includes('department_add_n')">新增
        </el-button>
      </div>
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="Loading"
        style="border: 1px solid #EBEEF5"
        fit
        highlight-current-row
      >
        <el-table-column align="center" label="设备编号" width="200">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="设备SN" width="150" align="center">
          <template slot-scope="scope">{{ scope.row.snNo }}</template>
        </el-table-column>
        <el-table-column label="设备型号" width="150" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.modelName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="安装科室名称" width="150" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.deptName }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="创建时间" width="200">
          <template slot-scope="scope">
            <i class="el-icon-time"/>
            <span>{{ scope.row.createDate }}</span>
          </template>
        </el-table-column>
        <el-table-column class-name="status-col" label="使用状态" width="110" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 'NORMAL'">正常使用</span>
            <span v-if="scope.row.status == 'STOP'">停止使用</span>
          </template>
        </el-table-column>
      </el-table>
    </el-tab-pane>
    <el-dialog title="新增科室终端" :visible.sync="is_from" width="400px" :close-on-click-modal="false" @close="colseClick">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
        <el-form-item label="设备S/N" prop="equipId">
          <el-select v-model="ruleForm.equipId" clearable placeholder="按设备S/N" style="width: 200px">
            <el-option
              v-for="item in ruleForm.options"
              :key="item.id"
              :label="item.snNo"
              :value="item.id"
            />
          </el-select>
          <el-tooltip class="item" effect="dark" content="制氧机机器或系统分配的ID" placement="right-end">
            <i class="el-icon-question" style="width: 20px;height: 20px;margin-left: 15px"></i>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="安装科室名称" prop="deptName">
          <div style="display: flex;flex-direction: row;width: 300px">
            <el-input v-model="ruleForm.deptName" style="width: 250px"></el-input>
          </div>
        </el-form-item>
        <div style="display: flex;flex-direction: row;justify-content: center;align-items: center">
          <el-button type="primary" @click="submitForm('ruleForm')" style="width: 100px">提交</el-button>
        </div>
      </el-form>
    </el-dialog>
  </el-tabs>
</template>

<script>
import {
  addTerminal,
  deptTerminalList,
  selectTerminal
} from '@/api/table'
import {getBaseUrl} from "@/utils/auth";

export default {
  name: 'department',
  data() {
    return {
      id: '',
      list: [],
      buttonArray: JSON.parse(sessionStorage.getItem("buttonArray")),
      list_data: [],
      listLoading: true,
      is_from: false,
      pane_name:'on',
      ruleForm: {
        options: [],
        equipId: "",
        deptName:"",
      },
      rules: {
        equipId: [{required: true, message: "请选择", trigger: 'blur'}],
        deptName:[{required: true, message: "请输入", trigger: 'blur'}],
      }
    }
  },
  created() {
    this.id = this.$router.currentRoute.query.id
    this.type = this.$router.currentRoute.query.type
    this.fetchData();
  },
  methods: {
    fetchData() {
      deptTerminalList(getBaseUrl({netId: this.id})).then(res => {
        if (res.code != 0) {
          this.list = res.data
        }
        this.listLoading = false
      })
    },
    //切换
    computerList() {
      if(this.pane_name == "on"){
        this.fetchData()
      }else {
        //二氧化碳列表
      }

    },
    colseClick() {
      this.is_from = false
      this.ruleForm.options = []
      this.ruleForm.equipId = ""
      this.ruleForm.deptName = ""
    },
    addShow(e) {
      this.is_from = true
      if(this.pane_name == "on"){
        selectTerminal().then(res => {
          if (res.code != 0) {
            this.ruleForm.options = res.data
          }
        })
      }else {
        //  二氧化碳数据添加

      }
    },
    //提交
    submitForm(e) {
      addTerminal(getBaseUrl({netId: this.id, equipId: this.ruleForm.equipId,deptName:this.ruleForm.deptName})).then(res => {
        if (res.code != 0) {
          this.is_from = false
          this.ruleForm.options = []
          this.ruleForm.equipId = ""
          this.ruleForm.deptName = ""
          this.fetchData();
        }
      })
    },
  },
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
