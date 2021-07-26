<template>
  <div style="margin-top: 70px;margin-left: 20px">
    <div style="margin-left: 30px;margin-top: 20px;margin-bottom: 20px;">
      <el-date-picker
        v-model="timedata"
        type="daterange"
        range-separator="至"
        start-placeholder="最近一次更新时间"
        end-placeholder="最近一次更新时间"
        style="margin-left:10px"
      />
      <el-button style="margin-left:100px;background-color: #30B08F;color: white" @click="searchShow()">查询</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      style="border: 1px solid #EBEEF5;width: 100%"
      highlight-current-row
      height="650"
    >
      <el-table-column align="center" label="终端ID" width="200">
        <template slot-scope="scope">{{ scope.row.equipId }}</template>
      </el-table-column>
      <el-table-column label="终端SN" width="150" align="center">
        <template slot-scope="scope">{{ scope.row.snNo }}</template>
      </el-table-column>
      <el-table-column class-name="status-col" label="所驻网点" width="150" align="center">
        <template slot-scope="scope">
          <span style="color: #20a0ff" @click="listDetail(scope.row.netId)">{{ scope.row.netName }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="科室名称" width="150" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.deptName }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="设备型号" width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.modelName }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="累计用氧量m³" width="150" align="center">
        <template slot-scope="scope">{{ scope.row.totalOxyOutput }}</template>
      </el-table-column>
      <el-table-column class-name="status-col" label="本月用氧量" width="150" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.monthlyDosage}}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="氧气压力Kpa" width="120" align="center" prop="totalOxyOutput" sortable>
        <template slot-scope="scope">
          <span>{{scope.row.oxygenPressure}}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="压缩空气压力Kpa" width="120" align="center" prop="totalOxyOutput" sortable>
        <template slot-scope="scope">
          <span>{{scope.row.airPressure}}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="负压压力传感器" width="120" align="center" prop="totalOxyOutput" sortable>
        <template slot-scope="scope">
          <span>{{scope.row.negativePressure}}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="瞬时流量" width="150" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.instantFlow }}L/min</span></template>
      </el-table-column>
      <el-table-column class-name="status-col" label="设备使用状态" width="150" align="center">
        <template slot-scope="scope" >
          {{scope.row.status}}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="数据更新时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" v-if="scope.row.modifyDate"/>
          <span>{{ scope.row.createTime}}</span>
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
import {deptflowHistorys} from "@/api/table";
import {parseTime} from "@/utils";

export default {
  name: "department_history",
  data() {
    return {
      listLoading: false,
      list: [],
      snNo: "",
      pageNo: 1,
      pageSize: 10,
      total: 0,
      timedata:[],
    }
  },
  created() {
    this.equipId = this.$router.currentRoute.query.equipId
    this.snNo = this.$router.currentRoute.query.snNo
    this.fetchData();
  },
  methods: {
    fetchData() {
      var params = {
        equipId: this.equipId,
        pageSize: this.pageSize,
        pageNo: this.pageNo,
        endDate:this.timedata[1] ? parseTime(this.timedata[1]).substring(0, 10) + ' 23:59:59' : '',
        startDate: this.timedata[0] ? parseTime(this.timedata[0]).substring(0, 10) + ' 00:00:00' : '',
      }
      deptflowHistorys(params).then(res => {
        this.list = res.data.list
        this.total = parseInt(res.data.total)
      })
    },
    //查询数据
    searchShow(){
      this.pageNo = 1
      this.fetchData()
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
    listDetail(e) {
      this.$router.push({name: 'operators_dot_detils', query: {id: e, type: 1}})
    },
  }
}
</script>

<style scoped>

</style>
