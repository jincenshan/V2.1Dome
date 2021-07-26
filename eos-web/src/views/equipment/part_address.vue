<template>
  <div style="margin-left: 30px;margin-top: 70px">
    <div style="margin-left: 30px;margin-top: 20px;margin-bottom: 20px;">
      <label style="color: #20a0ff">{{snNo}}<a style="margin-left: 20px;margin-right: 20px"></a>制氧机位置轨迹</label>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      style="border: 1px solid #EBEEF5;"
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="采集经纬度" width="150">
        <template slot-scope="scope">经度{{ scope.row.lat }}，纬度{{ scope.row.lng }}</template>
      </el-table-column>
      <el-table-column label="位置" width="150" align="center">
        <template slot-scope="scope">{{ scope.row.address }}</template>
      </el-table-column>
      <el-table-column align="center" label="部采集经纬度" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.createDate}}</span>
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
  </div>
</template>

<script>
  import {equipAddressList} from '@/api/table'
  import {getBaseUrl} from '@/utils/auth'
  export default {
    name: 'part_address',
    data(){
      return{
        equipId:'',
        snNo:'',
        partName:'',
        pageSize:10,
        pageNo:1,
        total:'',
        list:[],
        listLoading:true,
      }
    },
    created() {
      this.equipId = this.$router.currentRoute.query.equipId
      this.snNo =  this.$router.currentRoute.query.snNo
      this.fetchData()
    },
    methods:{
      fetchData(){
        equipAddressList(getBaseUrl({equipParId:this.equipId, pageSize: this.pageSize,pageNo: this.pageNo})).then(res=>{
          if(res.code != 0) {
            this.list = res.data.list
            this.total = parseInt(res.data.total)
            this.listLoading = false
          }
        })
      },
      handleCurrentChange(val) {
        this.pageNo = val
        this.fetchData()
      },
      handNextClick() {
        this.pageNo = this.pageNo + 1
        this.fetchData()
      },
      handPrevClick() {
        if (this.pageNo == 1) {
          return
        } else {
          this.pageNo = this.pageNo - 1
        }
        this.fetchData()
      },
    }
  }
</script>

<style scoped>

</style>
