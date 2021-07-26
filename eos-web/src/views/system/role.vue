<template>
  <div class="app-container">
    <div class="block">
<!--      <el-input v-model="input_1" class="input_class" placeholder="角色名称" clearable width="120"/>-->
<!--      <el-button style="margin-left:100px;background-color: #30B08F;color: white" @click="searchClick">查询</el-button>-->
<!--      <el-button type="warning" @click="resetShow">重置</el-button>-->
      <el-button type="danger" @click="addShow(1)" v-if="buttonArray.includes('addRoles_n')">新增</el-button>
    </div>
    <div style="display: flex;flex-direction: row;">
      <div style="width: 40%">
        <el-table
          v-loading="listLoading"
          :data="list"
          element-loading-text="Loading"
          style="border: 1px solid #EBEEF5"
          fit
          highlight-current-row
        >
          <el-table-column align="center" label="角色ID" width="200">
            <template slot-scope="scope">{{ scope.row.id }}</template>
          </el-table-column>
          <el-table-column label="角色名称" width="100" align="center">
            <template slot-scope="scope">{{ scope.row.name }}</template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="250">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="settingClick(scope.row)" v-if="buttonArray.includes('rolePermissions_n')">设置权限点</el-button>
<!--              <el-button type="text" size="small" @click="handleClick(scope.row)">员工解绑</el-button>-->
              <el-button type="text" size="small" @click="deleteShow(scope.row.id)" v-if="buttonArray.includes('deleteRole_n')">删除该角色</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="left_from" v-if="is_tree">
        <el-tree
          :data="menus_list"
          :props="defaultProps"
          accordion
          show-checkbox
          node-key="id"
          ref="tree"
          @node-click="handleNodeClick"
          @check-change="handleCheckChange"
        >
        </el-tree>
        <div style="display: flex;flex-direction: row;justify-content: space-around">
          <el-button style="width: 100px;background-color: #d9d9d9;color: #666666;"
                     @click="is_tree = false">取消
          </el-button>
          <el-button style="width: 100px;background-color: #00608f;color: white;"
                     @click="treeSubmit()">保存
          </el-button>
        </div>
      </div>
      <div class="input_view" v-if="is_tree">
        <label>所属菜单：{{tree_name}}</label>
        <div class="input_view_conten">
          <label>菜单名称：</label>
          <el-input placeholder="请输入菜单名称" class="input_class" :disabled="true" v-model="input1">
          </el-input>
        </div>
        <div class="input_view_conten">
          <label>英文名称：</label>
          <el-input placeholder="请输入英文名称" class="input_class" :disabled="true" v-model="input2">
          </el-input>
        </div>
        <div class="input_view_conten">
          <label>菜单路径：</label>
          <el-input placeholder="请输入菜单路径" class="input_class" :disabled="true" v-model="input5">
          </el-input>
        </div>
        <div class="input_view_conten">
          <label>重定向地址：</label>
          <el-input placeholder="请输入重定向地址" class="input_class" :disabled="true"  v-model="input3">
          </el-input>
        </div>
        <div class="input_view_conten">
          <label>优先级：</label>
          <el-input placeholder="输入值越大菜单展示越靠前" class="input_class" type="number" :disabled="true"  v-model="input4">
          </el-input>
        </div>
        <div class="input_view_conten">
          <label>类型：</label>
          <el-select v-model="type_status" clearable placeholder="请选择" :disabled="true"  style="width: 250px">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <div class="input_view_conten">
          <label>产品线：</label>
          <el-select v-model="productLine" clearable multiple placeholder="请选择产品线" :disabled="true"  style="width: 250px">
            <el-option
              v-for="item in option_productLine"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <div class="input_view_conten">
          <label>详细描述：</label>
          <el-input placeholder="请输入菜单的详细描述" class="input_class"  :disabled="true" v-model="description">
          </el-input>
        </div>
      </div>
    </div>
    <el-dialog title="新增角色" :visible.sync="is_from" width="350px" :close-on-click-modal="false">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="角色名称" prop="name">
            <el-input v-model="ruleForm.name"></el-input>
          </el-form-item>
          <el-form-item label="角色code" prop="code">
            <el-input v-model="ruleForm.code"></el-input>
          </el-form-item>
          <div style="display: flex;flex-direction: row;justify-content: center;align-items: center">
            <el-button type="primary" @click="submitForm('ruleForm')" style="width: 100px">提交</el-button>
          </div>
        </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import { getMenus } from '@/api/user'
  import { getRole, addRole, updateRoleTree,searchRoleTree,deleteRole } from '@/api/table'
  import {getBaseUrl}from'@/utils/auth'
  export default {
    name: 'role',
    data() {
      return {
        list: [],
        user: JSON.parse(sessionStorage.getItem("user")),
        buttonArray:JSON.parse(sessionStorage.getItem("buttonArray")),
        listLoading: true,
        checked_1: false,
        checked_2: false,
        checked_3: false,
        checked_4: false,
        checked_5: false,
        is_tree: false,
        value1: new Date(),
        value2: '',
        input1: '',
        input2: '',
        input3: '',
        input4: '',
        input5: '',
        tree_name:"",
        description:"",
        options: [
          {
            value: 'directory',
            label: '目录'
          },
          {
            value: 'menu',
            label: '页面'
          },
          {
            value: 'button',
            label: '按钮'
          }
        ],
        option_productLine:[{
          value: 'EOS',
          label: '标准化安全氧疗'
        }, {
          value: 'BBY',
          label: '抱抱氧'
        },{
          value: 'OXY',
          label: '氧调'
        }],
        productLine:[],
        pageNo: 1,
        pageSize: 100,
        is_select: 1,
        roleId: '',
        is_role:false,
        roleName:"",
        permissionIds: '',
        type_status: '',
        is_from: false,
        list_arr:[],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        ruleForm: {
          name: '',
          code: '',
          token: this.$store.getters.token
        },
        rules: {
          name: [
            { required: true, message: '请输入', trigger: 'blur' },
          ],
          code: [
            { required: true, message: '请输入', trigger: 'blur' },
          ]
        },
        menus_list: []
      }
    },
    mounted() {
      this.listData()
    },
    methods: {
      //公共数据
      listData() {
        let params = {
          name: "",
          pageNo: this.pageNo,
          pageSize: this.pageSize,
        }
        getRole(getBaseUrl(params)).then(response => {
          if(response.code !=0) {
            this.list = response.data.list
            this.listLoading = false
          }
        })
      },
      //查询
      searchClick() {
        if (this.input_1.length == 0) {
          this.$message({
            message: '请输入要查询的角色名称',
            type: 'warning'
          })
        } else {
          this.listData()
        }
      },
      //树形点击
      handleNodeClick(e, key) {
        this.button_state = true
        this.input1 = key.data.label
        this.input2 = key.data.enname
        this.input3 = key.data.redirect
        this.input4 = key.data.sort
        this.input5 = key.data.uri
        this.parentId = key.data.id
        this.tree_name = key.data.label
        this.type_status = key.data.type
        this.productLine=key.data.productLine
        this.description = key.data.description
      },
      //设置
      settingClick(e) {
        this.roleName = e.name
        if(this.id == e.id){
          return
        }else {
          this.roleId = e.id
          this.is_tree = true
          let menus = []
          let rtMenus = []
          getMenus(getBaseUrl({})).then(response => {
            if (!response.data||response.data.length == 0 ) {
              this.$message({
                message: '服务器异常',
                type: 'warning'
              })
            } else {
              menus = response.data
              for (let i = 0; i < menus.length; i++) {
                if (!menus[i]) {
                  menus.splice(i, 1)
                  i--
                  continue
                }
                if (!menus[i].parentId || menus[i].parentId == 0) {
                  let mn = menus[i]
                  rtMenus.push({
                    label: mn.name,
                    children: [],
                    id: mn.id,
                    enname: mn.enname,
                    redirect: mn.redirect,
                    type: mn.type,
                    uri: mn.uri,
                    sort: mn.sort,
                    productLine: mn.productLine.split(','),
                    description: mn.description,
                    disabled: (this.user.type == 'OPT' && this.roleName == '超级管理员') ? true : false
                  })
                  menus.splice(i, 1)
                  i--
                }
              }
              this.generator(menus, rtMenus)
              this.menus_list = rtMenus
              this.setCheckedNodes()
            }
          })
        }
      },
      setCheckedNodes() {
        searchRoleTree(getBaseUrl({roleId: this.roleId})).then(res => {
          if(res.code !=0) {
            res.data.forEach(item => {
              this.$refs.tree.setChecked(item.id,true,false);
            })
          }
        })
      },
      //菜单子集筛选
      generator(menus, parents) {
        if (menus.length > 0) {
          parents.map(p => {
            for (let i = 0; i < menus.length; i++) {
              let mn = menus[i]
              if (mn.parentId && mn.parentId == p.id) {
                p.children.push({
                  label: mn.name,
                  children: [],
                  id: mn.id,
                  enname: mn.enname,
                  redirect: mn.redirect,
                  type: mn.type,
                  uri: mn.uri,
                  sort:mn.sort,
                  productLine:mn.productLine.split(','),
                  description:mn.description,
                  disabled: (this.user.type == 'OPT'&& this.roleName =='超级管理员')?true:false
                })
                menus.splice(i, 1)
                i--
              }
            }
            if (p.children.length > 0) {
              this.generator(menus, p.children)
            }
          })
        }
      },
      //表单提交
      submitForm(formName) {
        addRole(getBaseUrl(this.ruleForm)).then(res => {
          if(res.code !=0) {
            this.is_from = false
            this.ruleForm.name = ''
            this.ruleForm.code = ''
            this.listData()
          }
        })
      },
      handleCheckChange(e) {
        if(this.id == e.id){
          return
        }else {
          let res = this.$refs.tree.getCheckedNodes(false,true)
          let arr = []
          res.forEach((item) => {
            arr.push(item.id)
          })
          this.permissionIds = arr
        }
      },
      treeSubmit() {
        let tree_data = {
          roleId: this.roleId,
          permissionIds: this.permissionIds,
        }
        updateRoleTree(getBaseUrl(tree_data)).then(res => {
          if(res.code !=0) {
            this.roleId = ''
            this.permissionIds = []
            this.is_tree = false
          }
        })
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`)

      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`)
      },
      //关闭
      colseClick() {
        this.is_from = false
      },
      //增加
      addShow(e) {
        if (e == 2) {
          this.is_select = true
        }
        this.is_from = true
        this.is_tree = false
      },
      //重置
      resetShow() {
        this.input_1 = ''
        this.listData()
      },
      //删除角色
      deleteShow(e){
        deleteRole(getBaseUrl({id:e,})).then(res =>{
          if(res.code !=0) {
            this.$router.go(0)
          }
        })
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
    background-color: #0094Dc;
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
  }

  .table_icon {
    width: 350px;
    display: flex;
    flex-direction: column;
    padding-left: 30px;
    padding-top: 20px;
    height: 500px;
    color: white;
  }

  .left_from {
    width: 250px;
    height: 600px;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 10px;
    background-color: #0094Dc;
    margin-left: 30px;
  }

  .el-tree {
    width: 250px;
    background-color: #0094Dc;
    color: white;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    padding-top: 20px;
    height: 500px;
    overflow-x: auto;
  }
  .input_view_conten {
    display: flex;
    margin-top: 15px;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 95%;
  }

  .input_view {
    width: 480px;
    height: 480px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border: 1px solid #CECECE;
    border-radius: 10px;
    margin-left: 30px;
    padding-left: 30px;
    padding-right: 30px;
  }

  .input_class {
    width: 250px;
    display: flex;
    margin-left: 30px;
  }
</style>
<style lang="css">
  .el-tree-node__expand-icon {
    /*color: white;*/
    width: 20px;
    height: 20px;
  }

  .el-tree-node__content:hover {
    background-color: #6BC3EE !important;
  }

  .el-tree-node:focus > .el-tree-node__content {
    background-color: #6BC3EE !important;
  }

  .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
    background-color: #5a5e66;
    border: #5a5e66;
  }

  .el-checkbox__input.is-checked + .el-checkbox__label {
    color: #5a5e66;
  }
</style>

