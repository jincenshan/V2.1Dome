<template>
  <div class="app-container">
    <div class="block">
      <el-select v-model="typeCode" clearable placeholder="请选择运营商类型"
                 style="width: 250px;margin-left: 30px">
        <el-option
          v-for="item in options_type"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-select v-model="productLines" clearable multiple placeholder="请选择产品线" style="width: 250px;margin-left: 10px">
        <el-option
          v-for="item in option_productLine"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-button style="margin-left:10px;background-color: #30B08F;color: white" @click="settingClick()">查询</el-button>
    </div>
    <div class="block">
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
        <el-button style="width: 100px;background-color: #00608f;color: white;"
                   @click="treeSubmit()" v-if="buttonArray.includes('NetPermission_Add')">保存
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
        <el-select v-model="value" clearable placeholder="请选择" :disabled="true"  style="width: 250px">
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
  </div>
</template>

<script>
  import {getBaseUrl, getToken} from "@/utils/auth";
  import {getMenus,permissionByCode,permissionByCodeUpdate} from "@/api/user";

  export default {
    name: "operator_outlets",
    data() {
      return {
        typeCode: '',
        buttonArray:JSON.parse(sessionStorage.getItem("buttonArray")),
        options_type: [
          {
            value: 'INVEST',
            label: '供氧机房投资商'
          },
          {
            value: 'SERVICE',
            label: '售后服务提供商'
          },
          {
            value: 'SELL',
            label: '供氧销售服务商'
          },
          {
            value: 'SUP',
            label: '供氧系统运营商'
          }
        ],
        menus_list: [],
        list_arr:[],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
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
        is_tree:false,
        tree_name:'',
        button_state: true,
        parentId: '',
        input1: '',
        input2: '',
        input3: '',
        input4: '',
        input5: '',
        value:"",
        description:"",
        options: [
          {
            value: '1',
            label: '页面'
          },
          {
            value: '2',
            label: '接口'
          }
        ],
        productLines:[],
      }
    },
    methods: {
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
        this.value = key.data.type == 1 ? "页面" : "接口"
        this.productLine=key.data.productLine
        this.description = key.data.description
      },
      handleCheckChange(e) {
        if (this.id == e.id) {
          return
        } else {
          let res = this.$refs.tree.getCheckedNodes(false,true)
          let arr = []
          res.forEach((item) => {
            arr.push(item.id)
          })
          this.permissionIds = arr
        }
      },
      //设置
      settingClick() {
          this.is_tree = true
          let menus = []
          let rtMenus = []
          getMenus(getBaseUrl({})).then(response => {
            if (!response.data || response.data.length == 0) {
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
                    sort:mn.sort,
                    productLine:mn.productLine.split(','),
                    description:mn.description,
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
      },
      setCheckedNodes() {
        permissionByCode({type: this.typeCode,productLine:this.productLines.toString(), token:sessionStorage.getItem("token"),}).then(res => {
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
                p.children.push({  label: mn.name,
                  children: [],
                  id: mn.id,
                  enname: mn.enname,
                  redirect: mn.redirect,
                  type: mn.type,
                  uri: mn.uri,
                  sort:mn.sort,
                  productLine:mn.productLine.split(','),
                  description:mn.description,
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
      treeSubmit() {
        if(this.productLines.length == 0 || !this.productLines){
          this.$message.error("请选择产品线")
          return
        }
        let res = this.$refs.tree.getCheckedNodes(false,true)
        let arr = []
        res.forEach((item) => {
          arr.push(item.id)
        })
        let tree_data = {
          ids: arr,
          type: this.typeCode,
          productLine:this.productLines.toString(),
          token:getToken(),
        }
        permissionByCodeUpdate(tree_data).then(res => {
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


