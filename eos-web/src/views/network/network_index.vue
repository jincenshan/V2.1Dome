<template>
  <div class="app-container">
    <div class="block">
      <el-input v-model="name" class="input_class" placeholder="按模板名称" clearable/>
      <el-button style="margin-left:100px;background-color: #30B08F;color: white" @click="fetchData()">查询</el-button>
      <el-button type="danger" @click="AddForwork()" v-if="buttonArray.includes('add_formwork')">新增</el-button>
      <el-button type="warning" @click="resetForm()">重置</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      style="border: 1px solid #EBEEF5"
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="模板编号" width="200">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>
      <el-table-column label="模板名称" width="150" align="center">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>
      <el-table-column label="供氧时段" width="150" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.oxySupplyPeriodS +'-'+scope.row.oxySupplyPeriodE}}</span>
        </template>
      </el-table-column>
      <el-table-column label="用氧配额m³" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.oxySupplyQuota }}</template>
      </el-table-column>
      <el-table-column class-name="status-col" label="阶梯价格管理项" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.priceNum }}</template>
      </el-table-column>
      <el-table-column class-name="status-col" label="关联入户终端数" width="150" align="center">
        <template slot-scope="scope">{{scope.row.terminalNum}}</template>
      </el-table-column>
      <el-table-column class-name="status-col" label="状态" width="150" align="center">
        <template slot-scope="scope">
          <span v-if=" scope.row.status == '1'">正常运行</span>
          <span v-if=" scope.row.status == '0'">停止运行</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="创建时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time"/>
          <span>{{ scope.row.createDate}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right" width="150">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="handleClick(scope.row)"
                     v-if="buttonArray.includes('formwork_detail') && !type">详情
          </el-button>
          <el-button type="text" size="small" @click="formworkShow(scope.row)"
                     v-if="buttonArray.includes('formwork_select') && type">选择此模板
          </el-button>
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
  import {netoxytemplateList, netoxytemplateSaveRel} from '@/api/table'
  export default {
    name: "network_index",
    data() {
      return {
        list: [],
        user: JSON.parse(sessionStorage.getItem("user")),
        buttonArray: JSON.parse(sessionStorage.getItem("buttonArray")),
        listLoading: true,
        name: '',
        total: 0,
        pageNo: 1,
        pageSize: 10,
        type:false,
        netIds:[],
      }
    },
    created() {
      this.type = this.$router.currentRoute.query.type
      this.netIds = this.$router.currentRoute.query.netIds
      this.fetchData()
    },
    methods: {
      fetchData() {
        let list_params = {
          pageNo: this.pageNo,
          name: this.name,
          pageSize: this.pageSize,
        }
        netoxytemplateList(list_params).then(res => {
          if (res.code != 0) {
            this.list = res.data.list
            this.total = parseInt(res.data.total)
            this.listLoading = false
          }
        })
      },
      handleClick(row) {
          this.$router.push({name: 'network_details', query: {id: row.id}})
      },
      formworkShow(row){
          let data = {
            netIds: this.netIds,
            templateId: row.id
          }
          netoxytemplateSaveRel(data).then(res => {
            if (res.code == 1) {
              this.$message({
                message: '选择成功',
                type: 'success'
              })
            } else {
              this.$message({
                message: '选择失败',
                type: 'warning'
              })
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
      //增加运营商
      AddForwork() {
        this.$router.push({name: 'network_details'})
      },
      //重置
      resetForm() {
        this.name = ''
        this.fetchData()
      },
    }
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

  .input_class {
    width: 150px;
    display: flex;
    margin-right: 20px;
  }
</style>
<style>
  .el-date-editor .el-range-separator {
    height: auto;
  }

  .el-input__icon {
    height: auto;
  }

  .el-input__inner {
    height: 30px;
  }

  .el-tabs__content {
    position: static;
  }

  .el-form-item {
    margin-bottom: 10px;
  }

  .distpicker-address-wrapper select {
    height: 30px;
    padding: 0 15px;
    font-size: 14px;
    background-color: #FFF;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #DCDFE6
  }
</style>
<style>
  ::-webkit-scrollbar {
    width: 5px;
  }

  ::-webkit-scrollbar-track {
    background: white;
  }

  ::-webkit-scrollbar-thumb {
    background: white;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #DCDFE6;
  }

  ::-webkit-scrollbar-thumb:active {
    background: #99a9bf;
  }

  .el-table__fixed-right {
    height: 100% !important;
  }
</style>


