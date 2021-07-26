<template>
  <div class="app-container">
    <div class="block">
      <label>请下载导入模板后，在模板中录入数据，显示在该页面批量入库</label>
      <el-upload
        class="upload-demo"
        ref="upload"
        :format ="['xlsx','xls']"
        :action="url"
        :headers="token"
        :on-success="uploadSuccess"
        :on-error="uploadFail"
        :disabled="disabled"
        :show-file-list="false"
       >
        <button type="button" class="el-button el-button--primary el-button--medium" style="margin-left: 50px;margin-right: 50px" @click="submitUpload"><i class="el-icon-document"/><span>
        批量导入
      </span></button>
      </el-upload>
      <button type="button" class="el-button el-button--primary el-button--medium" @click="goodsUploadShow"><i class="el-icon-document"/><span>
        批量入库
      </span></button>
      <el-link href="http://oxy.platform.ncmed.cn/%E6%B0%A7%E7%96%97%E8%A2%8B%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.xlsx" type="primary" style="margin-left: 50px">下载模板</el-link>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      style="border: 1px solid #EBEEF5"
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="序号" width="150">
        <template slot-scope="scope">
          {{ scope.row.seq }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="二维码编号" width="150">
        <template slot-scope="scope">
          {{ scope.row.showSn }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="氧疗袋设备S/N" width="150">
        <template slot-scope="scope">
          {{ scope.row.bagSn }}
        </template>
      </el-table-column>
      <el-table-column label="规格型号" width="150" align="center">
        <template slot-scope="scope">{{ scope.row.goodsSpec }}</template>
      </el-table-column>
      <el-table-column label="入库人" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.operator }}</template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="250">
        <template slot-scope="scope">
          <el-button type="text" size="small"
                     @click="deteleShow(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="错误提示" :visible.sync="dialogTableVisible" width="600px">
      <el-table :data="errosMessage">
        <el-table-column label="提示" width="560"> <template slot-scope="scope">
          {{ scope.row}}
        </template></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import inputFilter from "@/utils/input";
import {getToken} from "@/utils/auth";
import {goodsUpload} from "@/api/table";
import store from "@/store";

export default {
  name: "oxygen_edit_bag",
  directives: {
    inputFilter
  },
  data() {
    return {
      list: [],
      errosMessage:[],
      listLoading: false,
      disabled:false,
      user: JSON.parse(sessionStorage.getItem("user")),
      buttonArray: JSON.parse(sessionStorage.getItem("buttonArray")),
      token:{
        Authorization:getToken(),
      },
      pageNo: 1,
      pageSize: 10,
      url:store.state.routes.baseUrl+'/eos-bby/oxygenbag/importBag',
      dialogTableVisible:false,
    }
  },
  created() {
  },
  methods: {
    submitUpload() {
      if(this.list.length != 0){
        this.$message.error("之前导入的数据，还没入库；请删除或者批量入库后，再导入")
        return
      }else {
        this.listLoading = true
        this.$refs.upload.submit();
      }
    },
    uploadSuccess(response, file, fileList){
      this.listLoading = false
      this.list = response.data.oxygenBagInDtos
      this.errosMessage = response.data.errosMessage
      if(this.errosMessage.length != 0){
        this.dialogTableVisible = true
      }
      this.disabled = (this.list.length != 0?true:false)
    },
    uploadFail(){
      this.listLoading = false
    },
    deteleShow(row){
      this.$confirm('确认后该条记录, 将会在当前页面清除?', '确认删除', {
        confirmButtonText: '确认删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let array = []
        this.list.forEach(function (item){
          if( row.seq != item.seq){
            array.push(item)
          }
        })
        this.list = array
      }).catch(() => {

      });
    },
    goodsUploadShow(){
      if(this.list.length == 0){
        this.$message.error("请先上传数据")
        return
      }
      this.$confirm('本次入库'+this.list.length+'PCS氧疗袋?', '确定入库', {
        confirmButtonText: '确定入库',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        goodsUpload(this.list).then(res =>{
          if(res.code == 1){
            this.$message.success("入库成功")
            this.list = []
            this.$router.push({name: 'oxygen_bag_go'})
          }else {
            this.$message.error("入库失败")
          }
        })
      }).catch(() => {
      });
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

</style>
