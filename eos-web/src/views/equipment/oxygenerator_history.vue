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
<!--      <el-table-column align="center" label="制氧机ID" width="200">-->
<!--        <template slot-scope="scope">{{ scope.row.id }}</template>-->
<!--      </el-table-column>-->
      <el-table-column label="制氧机SN" width="150" align="center">
        <template slot-scope="scope">{{ scope.row.snNo }}</template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="更新时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time"/>
          <span>{{ scope.row.createDate}}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="设备运行状态" width="150" align="center">
        <template slot-scope="scope">
          <span v-if=" scope.row.runningState == 'RUNNING'">运行中</span>
          <span v-if=" scope.row.runningState == 'RESTING'">休息中</span>
          <span v-if=" scope.row.runningState == 'UNCONNECTED'">未连接</span>
          <span v-if=" scope.row.runningState == 'ARREARS'">欠费停机</span>
          <span v-if=" scope.row.runningState == 'OVERSTEP'">额外用完</span>
          <span v-if=" scope.row.runningState == 'NONWORKING'">非供氧时段</span>
          <span v-if=" scope.row.runningState == 'ALARM'">报警</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="总运行时长（h）" width="150" align="center">
        <template slot-scope="scope"><span>{{scope.row.useTotalDuration}}</span></template>
      </el-table-column>
      <el-table-column class-name="status-col" label="氧气浓度" width="110" align="center" prop="potency" sortable>
        <template slot-scope="scope">
          <span>{{ scope.row.potency}}%</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="输出压力（kg/m²）" width="180" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.outputPressure}}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="瞬时流量" width="110" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.instantFlow}}L/min</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="累计出氧量（m³）" width="170" prop="totalOxyOutput" align="center" sortable>
        <template slot-scope="scope">
          <span>{{scope.row.totalOxyOutput}}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="连续运行时长（min）" width="180" align="center">
        <template slot-scope="scope">{{ scope.row.continuousUseDuration }}</template>
      </el-table-column>
      <el-table-column class-name="status-col" label="设备使用状态" width="110" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.status == 'NORMAL'">正常运行</span>
          <span v-if="scope.row.status == 'STOP'">停止运行</span>
        </template>
      </el-table-column>
<!--      <el-table-column label="所属机房" width="150" align="center">-->
<!--        <template slot-scope="scope">-->
<!--          <span style="color: #20a0ff" @click="listDetail(scope.row.roomId)">{{ scope.row.roomName }}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column label="所属控制器" width="110" align="center">-->
<!--        <template slot-scope="scope">{{ scope.row.controlSn }}</template>-->
<!--      </el-table-column>-->
<!--      <el-table-column class-name="status-col" label="所属产品线" width="110" align="center">-->
<!--        <template slot-scope="scope">-->
<!--          <span v-if="scope.row.productLine">{{ scope.row.productLine.replace("OXY","氧调") }}</span></template>-->
<!--      </el-table-column>-->
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
  import {historyEquip} from "@/api/table";
  import {parseTime} from "@/utils";

  export default {
    name: "oxygenerator_history",
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
        historyEquip(params).then(res => {
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
        this.$router.push({name: 'computer_room_details', query: {id: e, type: 1}})
      },
      oxyDetail(row) {
        this.$router.push({name: 'oxygenerator_monitor', query: {controlId: row.id}})
      },
    }
  }
</script>

<style scoped>

</style>
