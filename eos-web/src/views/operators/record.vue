<template>
  <div style="margin-top: 70px;margin-left: 30px">
    <div style="margin-left: 30px;margin-top: 20px;margin-bottom: 20px;">
      <label style="color: #20a0ff">SN:{{snNo}} <span>制氧机</span> 部件更换记录</label>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      style="border: 1px solid #EBEEF5"
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="更换记录ID" width="150">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>
      <el-table-column label="部件名称" width="150" align="center">
        <template slot-scope="scope">{{ scope.row.partName }}</template>
      </el-table-column>
      <el-table-column label="原规格" width="150" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.oldSpecName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="原SN" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.oldSnNo }}</template>
      </el-table-column>
      <el-table-column class-name="status-col" label="更新后规格" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.newSpecName }}</template>
      </el-table-column>
      <el-table-column class-name="status-col" label="更新后SN" width="150" align="center">
        <template slot-scope="scope">{{ scope.row.newSnNo }}</template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="更换时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time"/>
          <span>{{ scope.row.createDate}}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import {recordRemember} from "@/api/table";
  import {getBaseUrl} from "@/utils/auth";

  export default {
    name: "record",
    data() {
      return {
        equipId: '',
        partId: '',
        list: [],
        id: '',
        snNo:'',
        listLoading: true
      }
    },
    created() {
      this.equipId = this.$router.currentRoute.query.equipId
      this.partId = this.$router.currentRoute.query.partId
      this.snNo  = this.$router.currentRoute.query.snNo
      recordRemember(getBaseUrl({equipId: this.equipId, partId: this.partId})).then(res => {
        if(res.code !=0) {
          this.list = res.data.list
          this.listLoading = false
        }
      })
    }
  }
</script>

<style scoped>

</style>
