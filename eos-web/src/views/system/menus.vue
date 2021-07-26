<template>
  <div class="dashboard-container">
    <div style="display: flex;flex-direction: row;height: 95%">
    <el-tree
      :data="menus_list"
      :props="defaultProps"
      accordion
      @node-click="handleNodeClick"
      @node-contextmenu="rightClick"
    >
    </el-tree>
    </div>
    <div class="input_view" @contextmenu.prevent="rightClick(2)" v-if="tree_name">
      <label>所属菜单：{{tree_name}}</label>
      <div class="input_view_conten">
        <label>菜单名称：</label>
        <el-input placeholder="请输入菜单名称" class="input_class" v-model="input1">
        </el-input>
      </div>
      <div class="input_view_conten">
        <label>英文名称：</label>
        <el-input placeholder="请输入英文名称" class="input_class" v-model="input2">
        </el-input>
      </div>
      <div class="input_view_conten">
        <label>菜单路径：</label>
        <el-input placeholder="请输入菜单路径" class="input_class" v-model="input5">
        </el-input>
      </div>
      <div class="input_view_conten">
        <label>重定向地址：</label>
        <el-input placeholder="请输入重定向地址" class="input_class" v-model="input3">
        </el-input>
      </div>
      <div class="input_view_conten">
        <label>菜单图标：</label>
        <el-input placeholder="请输入菜单图标" class="input_class" v-model="icon">
        </el-input>
      </div>
      <div class="input_view_conten">
        <label>优先级：</label>
        <el-input placeholder="输入值越大菜单展示越靠前" class="input_class" type="number" v-model="input4">
        </el-input>
      </div>
      <div class="input_view_conten">
        <label>类型：</label>
        <el-select v-model="value" clearable placeholder="请选择" style="width: 250px">
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
        <el-select v-model="productLine" clearable multiple placeholder="请选择产品线" style="width: 250px">
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
        <el-input placeholder="请输入菜单的详细描述" class="input_class" v-model="description">
        </el-input>
      </div>
      <div style="margin-top: 30px">
        <el-button v-if="button_state" style="background-color: #30B08F;color: white" @click="edit_menus">编辑</el-button>
        <el-button v-if="button_state &&tree_name" type="danger" @click="delete_menus">删除</el-button>
        <el-button v-if="!button_state" type="danger" @click="add_menus" height="50">新增</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import {addMenus, getMenus, editMenus,deleteMenus} from '@/api/user'
  import {getBaseUrl}from'@/utils/auth'
  export default {
    name: 'menus',
    data() {
      return {
        drawer: true,
        dialog: false,
        loading: false,
        button_state: true,
        parentId: '',
        input1: '',
        input2: '',
        input3: '',
        input4: '',
        input5: '',
        icon:"",
        description:"",
        tree_name:'',
        menus_list:[{id:0,label:"全部",children:[]}],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
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
        value:'',
        value_name: '',
      };
    },
    created() {
      this.menusShow();
    },
    methods: {
      menusShow(){
        let menus = [];
        let rtMenus = [];
        getMenus(getBaseUrl({})).then(response => {
          if (response.data.length == 0 || response.data == undefined) {
            this.$message({
              message: '服务器异常',
              type: 'warning'
            });
          } else {
            menus = response.data
            for (let i = 0; i < menus.length; i++) {
              if (!menus[i]) {
                menus.splice(i, 1);
                i--;
                continue;
              }
              if (!menus[i].parentId || menus[i].parentId == 0) {
                let mn = menus[i];
                rtMenus.push({
                  label: mn.name,
                  children: [],
                  id: mn.id,
                  enname: mn.enname,
                  redirect: mn.redirect,
                  type: mn.type,
                  uri: mn.uri,
                  sort:mn.sort,
                  icon:mn.icon,
                  productLine:mn.productLine.split(','),
                  description:mn.description,
                });
                menus.splice(i, 1);
                i--;
              }
            }
            this.generator(menus, rtMenus);
            this.menus_list[0].children = rtMenus
            this.menus_list = this.menus_list
          }
        })
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
        this.value = key.data.type
        this.productLine=key.data.productLine
        this.description = key.data.description
        this.icon = key.data.icon
      },
      rightClick(e) {
        if (e == 2) {
          this.parentId = ''
        }
        this.button_state = false
        this.input1 = ''
        this.input2 = ''
        this.input3 = ''
        this.input4 = ''
        this.input5 = ''
        this.icon = ''
        this.value = ''
        this.productLine = ""
        this.description =""
      },
      generator(menus, parents) {
        if (menus.length > 0) {
          parents.map(p => {
            for (let i = 0; i < menus.length; i++) {
              let mn = menus[i];
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
                  icon:mn.icon,
                  productLine:mn.productLine.split(','),
                  description:mn.description,
                });
                menus.splice(i, 1);
                i--;
              }
            }
            if (p.children.length > 0) {
              this.generator(menus, p.children);
            }
          })
        }
      },
      add_menus() {
        var params = {
          parentId: this.parentId,
          name: this.input1,
          enname: this.input2,
          redirect: this.input3,
          sort: this.input4,
          uri: this.input5,
          type: this.value,
          icon:this.icon,
          productLine:this.productLine.toString(),
          token:sessionStorage.getItem("token"),
          description: this.description
        }
        addMenus(params).then(response => {
          if(response.code !=0) {
            this.$message({
              message: '添加成功',
              type: 'success'
            });
            this.parentId = 0
            this.input1 = ''
            this.input2 = ''
            this.input3 = ''
            this.input4 = ''
            this.input5 = ''
            this.value = ''
            this.icon = ''
            this.productLine =""
            this.description =""
            this.menusShow();
          }
        })
      },
      edit_menus() {
        let param = {
          id: this.parentId,
          name: this.input1,
          enname: this.input2,
          redirect: this.input3,
          sort: this.input4,
          uri: this.input5,
          type: this.value,
          icon:this.icon,
          productLine:this.productLine.toString(),
          token:sessionStorage.getItem("token"),
          description: this.description
        }
        editMenus(param).then(response => {
          if(response.code !=0) {
            this.$message({
              message: '编辑成功',
              type: 'success'
            });
            this.input1 = ''
            this.input2 = ''
            this.input3 = ''
            this.input4 = ''
            this.input5 = ''
            this.value = ''
            this.icon = ''
            this.productLine =""
            this.description =""
            this.menusShow();
          }
        })
      },
      //删除菜单
      delete_menus(){
        deleteMenus(getBaseUrl({id:this.parentId})).then(res =>{
          if(res.code !=0) {
            this.$message({
              message: '删除成功',
              type: 'success'
            });
            this.input1 = ''
            this.input2 = ''
            this.input3 = ''
            this.input4 = ''
            this.input5 = ''
            this.value = ''
            this.icon = ''
            this.productLine =""
            this.description =""
            this.menusShow();
          }
        })
      },
    }
  }
</script>

<style lang="scss" scoped>
  .dashboard {
    &-container {
      margin: 30px;
    }

    &-text {
      font-size: 30px;
      line-height: 46px;
    }
  }

  .dashboard-container {
    padding: 32px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    width: 95%;
    position: relative;
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
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border: 1px solid #CECECE;
    border-radius: 10px;
    margin-left: 100px;
    padding: 30px;
  }

  .input_class {
    width: 250px;
    display: flex;
    margin-left: 30px;
  }

  .el-tree {
    width: 250px;
    background-color: #0094Dc;
    color: white;
    border-radius: 10px;
    height: 750px;
    overflow-x: auto;
  }

  .el-tree-node__content:hover {
    background-color: #6BC3EE;
  }
</style>
<style lang="css">
  .el-tree-node__expand-icon {
    /*color: white;*/
    width: 20px;
    height: 20px;
  }

  .el-tree-node__content:hover {
    background-color: #6BC3EE;
  }

  .el-tree-node:focus > .el-tree-node__content {
    background-color: #6BC3EE;
  }
</style>

