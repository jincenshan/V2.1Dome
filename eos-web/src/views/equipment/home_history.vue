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
<!--      <el-table-column align="center" label="终端ID" width="200">-->
<!--        <template slot-scope="scope">{{ scope.row.id }}</template>-->
<!--      </el-table-column>-->
      <el-table-column label="终端SN" width="150" align="center">
        <template slot-scope="scope">{{ scope.row.snNo }}</template>
      </el-table-column>
      <el-table-column class-name="status-col" label="所驻网点" width="150" align="center">
        <template slot-scope="scope">
          <span style="color: #20a0ff" @click="listDetail(scope.row.netId)">{{ scope.row.netName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="终端设备型号" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.modelName }}</template>
      </el-table-column>
      <el-table-column label="房间内取氧口数量" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.terminal }}</template>
      </el-table-column>
      <el-table-column class-name="status-col" label="累计出氧量" width="120" prop="totalOxyOutput" align="center" sortable>
        <template slot-scope="scope">
          <span>{{scope.row.totalOxyOutput}}L</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="总运行时长（h）" width="150" align="center">
        <template slot-scope="scope"><span>{{scope.row.useTotalDuration}}</span></template>
      </el-table-column>
      <el-table-column class-name="status-col" label="连续运行时长（min）" width="180" align="center">
        <template slot-scope="scope">{{ scope.row.continuousUseDuration }}</template>
      </el-table-column>
      <el-table-column class-name="status-col" label="浓度" width="150" align="center">
        <template slot-scope="scope">{{ scope.row.potency }}%</template>
      </el-table-column>
      <el-table-column class-name="status-col" label="设置浓度上下限" width="150" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.minPotency && scope.row.minPotency">{{ scope.row.minPotency+"-"+ scope.row.maxPotency}}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="大气压压力" width="150" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.atmosphericPressure }}</span></template>
      </el-table-column>
      <el-table-column class-name="status-col" label="相对海拔（m）" width="150" align="center">
        <template slot-scope="scope">{{ scope.row.altitude }}</template>
      </el-table-column>
      <el-table-column class-name="status-col" label="温度/湿度" width="150" align="center">
        <template slot-scope="scope">
          <span>{{(scope.row.temperature ? scope.row.temperature:'')+"℃/"+scope.row.humidity+"%"}}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="二氧化碳浓度PPM" width="150" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.co2Density }}</span></template>
      </el-table-column>
      <el-table-column class-name="status-col" label="设备使用状态" width="110" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.status == 'NORMAL'">正常运行</span>
          <span v-if="scope.row.status == 'STOP'">停止运行</span>
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
      <el-table-column align="center" prop="created_at" label="激活时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time"/>
          <span>{{ scope.row.activationDate}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="数据更新时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time"/>
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
  import {historyEquip} from "@/api/table";
  import {parseTime} from "@/utils";

  export default {
    name: "home_history",
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
        this.$router.push({name: 'operators_dot_detils', query: {id: e, type: 1}})
      },
    }
  }
</script>

<style scoped>

</style>
