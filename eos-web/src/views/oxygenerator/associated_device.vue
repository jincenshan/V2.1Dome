<template>
  <div class="tab_main" style="margin-top: 50px">
    <div class="tab_main_div" style="margin-top: 50px">
      <div class="tab_main_hread">
        <el-button type="danger" style="height: 40px" @click="addShow(1)">新增</el-button>
        <a>SN:{{snNo_one}}&nbsp;&nbsp;设备规格维护</a>
        <a></a>
      </div>
      <div class="tab_mian_content">
        <div style="display: flex;flex-direction: column;">
          <el-button class="tab_button" v-if="!list">请先关联部件</el-button>
          <el-button class="tab_button" v-if="list" v-for="item in list" :key="item.relId"  @click="getRelShow({partId:item.partId,relId:item.relId,partName:item.partName})">{{item.partName}}</el-button>
        </div>
        <el-table
          v-loading="listLoading"
          :data="list_data"
          element-loading-text="Loading"
          style="border: 1px solid #EBEEF5"
          fit
          highlight-current-row
        >
          <el-table-column align="center" :label="button_name" width="150">
            <template slot-scope="scope">
              {{scope.row.specName}}
            </template>
          </el-table-column>
          <el-table-column align="center" prop="created_at" label="请输入S/N" width="450">
            <template slot-scope="scope" style="display: flex;flex-direction: row;justify-content: space-between">
              <el-input v-model="scope.row.snNo" class="input_class" :disabled="is_input" placeholder="请输入S/N" clearable style="width: 220px;border: none" v-input-filter:china/>
              <el-button type="primary" v-if="!is_input" @click="addShow({id:scope.row.id,snNo:scope.row.snNo})" style="width: 70px;height: 30px;padding:0px;margin-left: 20px">提交</el-button>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="editShow({id:scope.row.id,specId:scope.row.specId})">更换</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-dialog :title="'SN:'+snNo_one+'选择部件规格'" :visible.sync="is_from" width="400px" :close-on-click-modal="false" @click="colseClick">
          <div class="tab_mian_content" style="background-color: white;position: relative;">
            <div v-if="!is_edit">
              <el-button class="tab_button"  v-for="item in list_button" :key="item.partId" @click="buttonShow({typeCode:item.typeCode,partId:item.partId})">{{item.partName}}</el-button>
            </div>
            <div>
              <el-radio-group v-model="specId" style="display: flex;
flex-direction: column;width:250px;">
              <el-radio style="height: 30px"  v-for="item in list_button_spec" :key="item.specId" :label="item.specId" v-if="partId != item.specId">{{item.name}}</el-radio>
              </el-radio-group>
            </div>
          </div>
        <div style="display: flex;flex-direction: row;justify-content: flex-end;align-items: center;margin-top: 20px">
          <span v-if="list_button_spec.length == 0" style="margin-right: 20px;font-size: 10px;color: #97a8be">暂无更多可替换规格，请到设备部件管理配置</span>
          <el-button type="primary" @click="addShow(2)" style="width: 70px;height: 30px;padding:0px" v-if="!is_edit">确定</el-button>
          <el-button type="primary" @click="updateShow()" style="width: 70px;height: 30px;padding:0px" v-if="is_edit">确定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import {equipmentSpecPartYes,equipmentSpecPartNo,equipmentSpecPartYesSpec,equipmentPartDetail,equipmentSpecPartRel,equipmentSpecPartYesSpecSN,equipmentSpecPartYesUpdate}from '@/api/table'
  import {getBaseUrl} from '@/utils/auth'
  import inputFilter from "@/utils/input";
    export default {
      name: "associated_device",
      directives: {
        inputFilter
      },
      data(){
          return {
            id:'',
            listLoading:false,
            list:[],
            list_data:[],
            typeCode:'',
            // typeCode_detail:"",
            is_from:false,
            is_edit:false,
            list_button:[],
            button_id:'',
            button_name:'',
            list_button_spec:[],
            relId:'',
            specId:'',
            partId:'',
            snNO:'',
            snNo_one:"",
            notInId:'',
            is_input:false,
          }
      },
      created() {
        this.id = this.$router.currentRoute.query.id
        this.typeCode = this.$router.currentRoute.query.typeCode
        this.snNo_one = this.$router.currentRoute.query.snNo
        equipmentSpecPartYes(getBaseUrl({equipId:this.id,typeCode:this.typeCode})).then(res=>{
          if(res.code !=0) {
            this.list = res.data
            this.button_name = res.data[0].partName
            this.button_id = res.data[0].relId
            this.partId = res.data[0].partId
            this.relId = res.data[0].relId
            this.getRelShow()
          }
        })
      },
      methods:{
        addShow(e){
          //添加部件
          if(e == 1){
            this.is_from = true
            this.is_edit = false
            equipmentSpecPartNo(getBaseUrl({equipId:this.id,typeCode:this.typeCode})).then(res =>{
              if(res.code !=0) {
                this.list_button = res.data
                this.button_id = res.data[0].partId
                // this.typeCode_detail = res.data[0].typeCode
                this.getSpecShow()
              }
            })
          }else if(e == 2){
            //确定添加
            let add_data = {
              equipId:this.id,
              partAndSpecIds:[{specId: this.specId,partId: this.button_id}]
            }
            if(this.specId == "" || this.button_id ==""){
              this.$message.error("请正确的选择部件与规格")
            }else {
              equipmentSpecPartRel(getBaseUrl(add_data)).then(res =>{
                if(res.code !=0) {
                  this.is_from = false
                  this.$router.go(0);
                  equipmentSpecPartYes(getBaseUrl({equipId: this.groupId, typeCode: "OXY"})).then(res => {
                    if(res.code !=0) {
                      // this.list = res.data
                      this.button_name = res.data[0].partName
                      this.button_id = res.data[0].relId
                      this.partId = res.data[0].partId
                      this.relId = res.data[0].relId
                      this.getRelShow()
                    }
                  })
                }
              })
            }
          }else{
            //修改
            equipmentSpecPartYesSpecSN(getBaseUrl({relSpecId:e.id,snNo:e.snNo})).then(res=>{
              if(res.code !=0) {
                this.is_input = true
                // this.$router.go(0);
                this.getRelShow()
              }
            })
          }
        },
        //更换部件规格
        editShow(e){
          this.is_from = true
          this.is_edit = true
          this.notInId = e.id
          equipmentPartDetail(getBaseUrl({equipId:this.id,partId:this.partId,notInId:e.specId})).then(res =>{
            if(res.code !=0) {
              this.list_button_spec = res.data
            }
          })
        },
        //获取未绑定部件规格详情
        getSpecShow(){
          equipmentPartDetail(getBaseUrl({equipId:this.id,partId:this.button_id,typeCode:this.typeCode})).then(res =>{
            if(res.code !=0) {
              this.list_button_spec = res.data
            }
          })
        },
        //获取已绑定部件规格列表
        getRelShow(e){
          if(e){
            this.relId = e.relId
            this.partId = e.partId
            this.button_name = e.partName
          }
          equipmentSpecPartYesSpec(getBaseUrl({relId:this.relId})).then(res=>{
            if(res.code !=0) {
              this.list_data = res.data
              if(res.data.length != 0 && res.data[0].snNo){
                this.is_input = true
              }else {
                this.is_input = false
              }
            }
          })
        },
        updateShow(){
          var up_data ={
            equipId:this.id,
            newSpecId: this.specId,
            partId: this.partId,
            relPartId: this.relId,
            relSpecId: this.notInId,
          }
          equipmentSpecPartYesUpdate(getBaseUrl(up_data)).then(res =>{
            if(res.code !=0) {
              this.$router.go(0);
              this.getRelShow()
            }
          })
        },
        colseClick() {
          this.is_from = false
          this.is_edit = false
        },
        //点击已绑定的规格列表
        buttonShow(e){
          this.button_id = e.partId
          this.specId = ""
          // this.typeCode_detail = e.typeCode
          this.getSpecShow()
        },
      }
    }
</script>

<style scoped>
  .tab_main{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
  .tab_main_div{
    width: 70%;
    height: 50%;
    display: flex;
    flex-direction: column;
    border: 1px solid #d3dce6;
    border-radius: 10px;
  }
  .tab_main_hread{
    width:100%;
    height: 60px;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    border-bottom: 1px solid #d3dce6;
    align-items: center;
  }
  .tab_mian_content{
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .tab_button{
    width: 100px;
    height: 50px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    background: aliceblue;
    border-radius: 0px;
    border: none;
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
  .el-button+.el-button{
    margin-left: 0px;
  }
  .tab_button:hover{
    background-color: #97a8be;
    color: white;
  }
  .tab_button:focus{
    background-color: #97a8be;
    color: white;
  }
</style>
