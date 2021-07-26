<template>
  <div style="margin-top: 70px;margin-left: 20px">
    <div style="margin-left: 30px;margin-top: 20px;margin-bottom: 20px;">
      <label style="color: #20a0ff">SN:{{snNo}}<a v-if="typeCode == 'OXY'" style="margin-left: 20px;margin-right: 20px">制氧机</a><a
        v-if="typeCode == 'CONTROL'" style="margin-left: 20px;margin-right: 20px">控制器</a><a v-if="typeCode == 'HOME'"
                                                                                            style="margin-left: 20px;margin-right: 20px">房间分控终端</a>
        部件运行概况</label>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      style="border: 1px solid #EBEEF5;width: 86%"
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="部件名称" width="150">
        <template slot-scope="scope">{{ scope.row.partName}}</template>
      </el-table-column>
      <el-table-column label="部件SN" width="150" align="center">
        <template slot-scope="scope">{{ scope.row.snNo }}</template>
      </el-table-column>
      <el-table-column label="部件规格" width="150" align="center">
        <template slot-scope="scope">{{ scope.row.specName }}</template>
      </el-table-column>
      <el-table-column label="运行状态" width="150" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.runState == 'NORMAL'">正常运行</span>
          <span v-if="scope.row.runState == 'STOP'">停止工作</span>
        </template>
      </el-table-column>
      <el-table-column label="累计使用时长(h)" width="150" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.totalRunningTime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="已保养次数" width="150" align="center">
        <template slot-scope="scope">{{ scope.row.maintainNum }}</template>
      </el-table-column>
      <el-table-column label="下次保养日期" width="150" align="center">
        <template slot-scope="scope" >{{scope.row.nextMaintainDate}}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="最后一次运行监控请求时间" width="250">
        <template slot-scope="scope">
          <i class="el-icon-time"/>
          <span>{{ scope.row.createDate}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right" width="250">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="historyShow(scope.row)">历史记录</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import {partRunDetail} from '@/api/table'
  import {getBaseUrl} from '@/utils/auth'

  export default {
    name: 'part_sun_details',
    data() {
      return {
        equipId: '',
        typeCode: '',
        pageNo: 1,
        pageSize: 10,
        list: [],
        listLoading: true,
        snNo: "",
      }
    },
    created() {
      this.equipId = this.$router.currentRoute.query.equipId
      this.typeCode = this.$router.currentRoute.query.typeCode
      this.snNo = this.$router.currentRoute.query.snNo
      partRunDetail(this.equipId).then(res => {
        if (res.code != 0) {
          res.data.map(item => {
            item.equipCodeName = ''
            if (item.equipCode == "OXY") {
              item.equipCodeName = "制氧机"
            } else if (item.equipCode == "CONTROL") {
              item.equipCodeName = "控制器"
            } else if (item.equipCode == "GENERAL_CONTROL") {
              item.equipCodeName = "总控终端"
            } else if (item.equipCode == "TRANSFER") {
              item.equipCodeName = "中转终端"
            } else if (item.equipCode == "ENTER_HOUSE") {
              item.equipCodeName = "入户终端"
            } else if (item.equipCode == "OXY_UPTAKE") {
              item.equipCodeName = "取氧终端"
            }
          })
          this.list = res.data
          this.listLoading = false
        }
      })
    },
    methods: {
      historyShow(row) {
        this.$router.push({name: 'part_address', query: {equipId: row.equipParId, partName: row.partName, snNo: row.snNo}})
      }
    },
  }
</script>

<style scoped>

</style>
