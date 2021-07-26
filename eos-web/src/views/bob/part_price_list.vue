<template>
  <div class="dashboard-container">
    <div class="details_from">
      <div class="top_div">
        <div>
        <label>区域商品销售指导价格</label>
        <el-select v-model="state" clearable placeholder="按状态" style="margin-left: 20px;" @change="listShow">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-button type="warning" @click="resetForm()" style="margin-left: 20px;">重置</el-button>
        </div>
        <div>
        <el-button type="danger" @click="auditClick('','',2)" style="margin-left: 20px;">批量审核确认</el-button>
        </div>
      </div>
      <div class="content">
        <div class="content_left">
          <el-button v-for="(item,index) in area_list" :key="index" @click="parentIdShow(item.id)" style="width: 100%;margin-left: 0px;margin-top: 2px;border: none;background-color: #dfe4ed;border-radius: 0px">{{item.name}}</el-button>
        </div>
        <div class="content_right">
          <div  v-for="(item,index) in table_list" :key="index">
          <el-table
            ref="multipleTable"
            :data="item.prices"
            tooltip-effect="dark"
            style="width: 100%"
            border
            @selection-change="handleSelectionChange">
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column
              :label="item.area.areaName"
              width="120">
              <template slot-scope="scope">{{ scope.row.goodsSpec }}</template>
            </el-table-column>
            <el-table-column
              label="指导价格范围"
              width="120">
              <template slot-scope="scope">￥{{ scope.row.salePrice }}</template>
            </el-table-column>
            <el-table-column
              label="失效日期"
              width="120">
              <template slot-scope="scope">{{ scope.row.effectiveDate + (scope.row.state == 2?"生效":" ")}}</template>
            </el-table-column>
            <el-table-column
              label="状态"
              width="120">
              <template slot-scope="scope">{{ scope.row.state == 1?"待审核":(scope.row.state == 2?"已生效": "已失效")}}</template>
            </el-table-column>
            <el-table-column
              label="创建者"
              width="120">
              <template slot-scope="scope">{{ scope.row.createdName }}</template>
            </el-table-column>
            <el-table-column
              label="审核者"
              width="120">
              <template slot-scope="scope">{{ scope.row.auditor }}</template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="200">
              <template slot-scope="scope">
                <el-button type="text" size="small" v-if="scope.row.state == 1" @click="auditClick(item.area.areaName,scope.row,1)">审核</el-button>
                <el-button type="text" size="small" @click="deleteClick(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div>
            <el-button type="danger" @click="addClick(item.area.areaName,item.area.areaId)" style="margin-left: 20px;margin-bottom: 20px">增加</el-button>
          </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog :title="areaName+'  新增指导价格'" :visible.sync="is_from" @close="colseClick()" width="500px"
               :close-on-click-modal="false">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="130px" class="demo-ruleForm">
        <el-form-item label="选择商品规格" prop="goodsId">
          <el-select v-model="ruleForm.goodsId" clearable placeholder="请选择商品规格" style="width:250px">
            <el-option
              v-for="item in ruleForm.option_name"
              :key="item.id"
              :label="item.goodsName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="指导价格范围" prop="salePrice">
          <div style="display: flex;flex-direction: row;width: 300px">
            <el-input v-model="ruleForm.salePrice" style="width: 250px" v-input-filter:price></el-input>
            <span style="margin-left: 10px">元</span>
          </div>
        </el-form-item>
        <div style="display: flex;flex-direction: row;justify-content: center;align-items: center">
          <span style="font-size: 12px;color: #5a5e66;margin-right: 20px">设置后，负责该地区的运营商在针对网点设置销售价格时，最低不可低于该价格</span>
          <el-button type="primary" @click="submitForm()" style="width: 100px">保存</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {areapriceAudit, areapriceDelete, areapriceList, areapriceSave, goodsSpec, queryByType} from '@/api/table'
import inputFilter from "@/utils/input";
    export default {
      name: "part_price_list",
      directives: {
        inputFilter
      },
      data(){
          return{
            state:'',
            options: [{
              label: '待审核',
              value: '1'
            }, {
              label: '已生效',
              value: '2'
            }, {
              label: '已失效',
              value: '3'
            }],
            area_list:[],
            parentId:"",//区域id,
            areaId:"",
            table_list:[],
            selectIds:[],
            areaName:"",
            is_from:false,
            ruleForm: {
              goodsId: '',
              option_name: [],
              salePrice: '',
            },
            rules: {
              salePrice: [{required: true,message:"请输入", trigger: 'blur' }],
              goodsId:[{required: true,message:"请选择", trigger: 'blur' }],
            },
          }
      },
      created() {
        this.state = localStorage.getItem('state')?localStorage.getItem('state'):''
        queryByType({type:1}).then(res=>{
          if(res.code != 0){
            this.area_list = res.data
            this.parentId = res.data[0].id
            this.parentIdShow()
          }
        })
      },
      methods:{
        resetForm(){
          this.state = ""
          localStorage.setItem('state',"")
          this.listShow()
        },
        parentIdShow(id){
          if(id){
            this.parentId = id
          }
          this.listShow()
        },
        listShow(){
          localStorage.setItem('state',this.state)
          areapriceList({areaId:this.parentId,state:this.state}).then(res =>{
            if(res.code != 0){
              this.table_list = res.data
            }
          })
        },
        handleSelectionChange(val) {
          let ids = []
          val.map(item=>{
            return ids.push(item.id)
          })
          this.selectIds = ids
        },
        deleteClick(row){
          let ids = []
          ids.push(row.id)
          areapriceDelete(ids).then(res=>{
            if(res.code !=0){
              this.$router.go(0)
            }
          })
        },
        auditClick(areaName,row,type){
          let ids=[]
          let title = ""
          if(type == 1){
            ids.push(row.id)
            title = areaName+"  "+row.goodsSpec
          }else {
            ids = this.selectIds
            title = "您一共选择了"+ids.length+"笔数据"
            if(ids.length == 0){
              this.$message.error("您未勾选任何数据！")
              return
            }
          }
          this.$confirm('审核通过后，将会实时生效；原来的该规格指导价格将会失效。如有问题请与创建者联系', title, {
            confirmButtonText: '确认通过',
            type: 'warning'
          }).then(() => {
            this.auditClickShow(ids)
          })
        },
        auditClickShow(ids){
          areapriceAudit({auditRemark:"",ids:ids,state:1}).then(res=>{
            if(res.code !=0){
              this.$router.go(0)
            }
          })
        },
        addClick(areaName,areaId){
          this.areaName = areaName
          this.areaId = areaId
          this.is_from = true
          goodsSpec({goodsType:0}).then(res=>{
            this.ruleForm.option_name = res.data
          })
        },
        colseClick(){
          this.is_from = false
          this.ruleForm.goodsId = ""
          this.ruleForm.salePrice = ""
        },
        submitForm(){
          areapriceSave({goodsId:this.ruleForm.goodsId,salePrice:this.ruleForm.salePrice,areaId:this.areaId}).then(res=>{
            if(res.code !=0){
              this.is_from = false
              this.ruleForm.goodsId = ""
              this.ruleForm.salePrice = ""
              this.$message.success("保存成功！")
              this.listShow()
            }
          })
        },
      }
    }
</script>

<style scoped>
.details_from {
  width: 75%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px solid #CECECE;
  border-radius: 10px;
  margin-left: 100px;
  margin-top: 30px;
  margin-bottom: 20px;
}
.top_div{
  width: 98%;
  height: 60px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #CECECE;
}
.content{
  width:98%;
  display: flex;
  flex-direction: row;
  margin-bottom: 20px;
}
.content_left{
  width: 12%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.content_right{
  width: 88%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-left: 5px;
}
</style>
