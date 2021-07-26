<template>
  <div class="app-container">
    <div class="block">
      <el-input v-model="username" class="input_class" placeholder="按员工账户" clearable width="120" />
      <el-select v-model="roleId" clearable placeholder="按运营角色">
        <el-option
          v-for="item in options"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <el-button style="margin-left:100px;background-color: #30B08F;color: white" @click="fetchData()">查询</el-button>
      <el-button type="warning" @click="resetShow()">重置</el-button>
      <el-button type="danger" @click="addShow(1)" v-if="buttonArray.includes('user_add_n')">新增员工</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      fit
      highlight-current-row
      style="border: 1px solid #EBEEF5"
    >
      <el-table-column align="center" label="员工ID" width="200">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>
      <el-table-column label="账号" width="150" align="center">
        <template slot-scope="scope">{{ scope.row.username }}</template>
      </el-table-column>
      <el-table-column label="姓名" width="150" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="产品线" width="150" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.productLine">{{ scope.row.productLine.replace("OXY","氧调")}}</span>
        </template>
      </el-table-column>
      <el-table-column label="运营角色" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.roleName }}</template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="250">
        <template slot-scope="scope">
          <el-button type="text" size="small" v-if="buttonArray.includes('setRole_n')" @click="handleClick(scope.row)">设置角色</el-button>
          <el-button type="text" size="small" v-if="buttonArray.includes('delete_n')" @click="deleteShow(scope.row)">移除该员工</el-button>
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
    <el-dialog title="新增员工" :visible.sync="is_from" width="450px" :close-on-click-modal="false">
        <el-form :model="ruleForm" :rules="rules"  ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="员工账号" prop="phone">
            <el-input v-model="ruleForm.phone" placeholder="请输入员工账号" style="width: 250px" v-input-filter:phone></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="name">
            <el-input v-model="ruleForm.name" placeholder="请输入员工姓名" style="width: 250px"></el-input>
          </el-form-item>
          <el-form-item label="负责产品线" >
            <el-select v-model="ruleForm.productLine" clearable multiple placeholder="请选择产品线" style="width: 250px">
              <el-option
                v-for="item in options_type"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="设置角色" >
            <el-select v-model="ruleForm.roleIds" clearable multiple placeholder="按运营角色" style="width: 250px">
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <div style="display: flex;flex-direction: row;justify-content: center;align-items: center">
            <div style="font-size: 12px;width: 330px">
              <span>负责产品线，可多选； 不选，代表不限全选。</span>
              <span>如选择了某产品线，登录后台时，只会显示 对应产品线数据</span>
            </div>
            <el-button type="primary" @click="submitForm(1)">提交</el-button>
          </div>
        </el-form>
    </el-dialog>
    <el-dialog title="设置角色" :visible.sync="is_setting" width="400px" :close-on-click-modal="false">
      <div style="display: flex;flex-direction: column;justify-content: flex-start">
      <el-select v-model="roleIds" clearable multiple placeholder="按运营角色" style="width: 300px">
        <el-option
          v-for="item in options"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <div style="display: flex;flex-direction: row;justify-content:flex-start;align-items: center;margin-top: 20px">
        <div style="font-size: 12px;width: 250px;">
          <span>可多选，选择该角色后，该员工登录后台，将显示该角色对应的功能权限点</span>
        </div>
        <el-button type="primary" @click="submitForm(2)">提交</el-button>
      </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { userList,userAdd,userSetting,userDelete} from '@/api/user'
  import {getBaseUrl} from "@/utils/auth";
  import {getRole} from "@/api/table";
  import inputFilter from "@/utils/input.js";

  export default {
    name: 'staff',
    directives: {
      inputFilter
    },
    data() {
      return {
        list: [],
        user: JSON.parse(sessionStorage.getItem("user")),
        buttonArray:JSON.parse(sessionStorage.getItem("buttonArray")),
        listLoading: true,
        options: [],
        username:"",
        roleId:'',
        roleIds:[],
        userId:'',
        fileName:"",
        sheetName:"",
        allExport:"",
        excelColumn:[],
        excelHead:[],
        export:'',
        pageNo:1,
        pageSize:10,
        total:0,
        is_from:false,
        is_setting:false,
        options_type:[],
        ruleForm:{
          name: "",
          phone:"",
          productLine:"",
          roleIds:[],
        },
        rules: {
          name: [
            {required: true, message: '请输入', trigger: 'blur'},
          ],
          phone: [
            {required: true, message: '请输入', trigger: 'blur'},
          ],
        },
      }
    },
    created() {
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
        }else if (item == "BBY") {
          arr.push(
            {
              value: 'BBY',
              label: '抱抱氧'
            })
        }
      })
      this.options_type = arr
      let params = {
        name: "",
        pageNo: 1,
        pageSize: 100,
      }
      getRole(getBaseUrl(params)).then(response => {
        if(response.code !=0) {
          this.options = response.data.list
        }
      })
      this.fetchData()
    },
    methods: {

      fetchData(){
        let params={
          export:false,
          username:this.username,
          roleId:this.roleId,
        }
        userList(getBaseUrl(params)).then(res=>{
          if(res.code !=0) {
            this.list = res.data.list
            this.listLoading = false
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
      submitForm(e){
        if(e == 1) {
          if (this.ruleForm.phone) {
            const phoneReg = new RegExp('^(13|14|15|16|17|18|19)[0-9]{9}$')
            if (!phoneReg.test(this.ruleForm.phone)) {
              this.$message.error('请完整填写信息')
              this.ruleForm.phone = ""
              return;
            }
          }
          if(this.ruleForm.name == ""){
            this.$message.error('请完整填写信息')
            return
          }
          let params = {
            name: this.ruleForm.name,
            phone: this.ruleForm.phone,
            productLine: this.ruleForm.productLine.toString(),
            roleIds: this.ruleForm.roleIds,
            username: this.ruleForm.phone,
            token: sessionStorage.getItem("token"),
          }
          userAdd(params).then(res => {
            if(res.code !=0) {
              this.is_from = false
              this.$router.go(0)
            }
          })
        }else {
          userSetting(getBaseUrl({userId:this.userId,roleIds:this.roleIds})).then(res=>{
            if(res.code !=0) {
              this.$router.go(0)
            }
          })
        }

      },
      resetShow(){
        this.roleId = ''
        this.username = ''
      },
      addShow(e){
        if(e == 1){
          this.is_from = true
        }else {
          this.is_setting = true
        }
      },
      handleClick(row){
        this.userId = row.id
        this.roleIds = row.roleIds?row.roleIds.split(','):[]
        this.is_setting = true
      },
      deleteShow(row){
        this.$confirm('删除后,该员工将不能进入管理后台?', '确认移除', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          userDelete(getBaseUrl({id:row.id})).then(res=>{
            if(res.code !=0) {
              this.$router.go(0)
            }
          })
        }).catch(() => {
        });
      }
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
  .block_div{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    background: rgba(0,0,0,0.5);
    position: absolute;
    z-index: 20;
    top: 0;
    left: 0;
  }
  .block_div_content{
    width: 400px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: white;
    border-radius: 10px;
  }
  .block_hread{
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
  .demo-ruleForm{
    margin-top: 20px;
    margin-bottom: 20px;
    align-items: center;
    justify-content: center;
  }
</style>
