<template>
  <div class="dashboard-container">
    <div class="details_from">
  <el-form :label-position="labelPosition" label-width="250px" :model="rule">
    <div style="display: flex;flex-direction: row;justify-content: space-between;height: 70px;align-items: flex-start">
      <label>平台免费赠送次数平台</label>
      <el-button type="danger" @click="submitForm('ruleForm')">保存</el-button>
    </div>
    <el-form-item label="邀请用户注册赠送次数" >
      <el-input v-model="rule.ivNumber"></el-input>
      <span style="margin-left: 15px">次</span>
      <el-tooltip class="item" effect="dark" content="设置后，平台所有用户邀请其他用户所获得的赠送次数，将会执行运营商的设置的次数（被邀请的用户要产生购买行为后，方可赠送）" placement="right-end">
        <i class="el-icon-question" style="width: 20px;height: 20px;margin-left: 15px;display: flex;flex-direction: row;align-items: center"></i>
      </el-tooltip>
    </el-form-item>
    <el-form-item label="氧疗袋购买免费赠送次数指导次数">
      <el-input v-model="rule.giftNumber"></el-input>
      <span style="margin-left: 15px">%</span>
      <el-tooltip class="item" effect="dark" content="设置后，运营商设置的数量，只可低于或者等于该数字" placement="right-end">
        <i class="el-icon-question" style="width: 20px;height: 20px;margin-left: 15px;display: flex;flex-direction: row;align-items: center"></i>
      </el-tooltip>
    </el-form-item>
    <el-form-item label="免费赠送次数有效期">
      <el-input v-model="rule.bugNumber"></el-input>
      <span style="margin-left: 15px">%</span>
      <el-tooltip class="item" effect="dark" content="设置后，运营商设置的数量，只可低于或者等于该数字" placement="right-end">
        <i class="el-icon-question" style="width: 20px;height: 20px;margin-left: 15px;display: flex;flex-direction: row;align-items: center"></i>
      </el-tooltip>
    </el-form-item>
  </el-form>
    </div>
  </div>
</template>

<script>
import {queryByGroup,saveByGroup} from '@/api/table'
export default {
  name: "number_message",
  data(){
    return{
      labelPosition:'left',
      group:'PLATFORMGIFT',
      list: [],
      rule:{
        ivNumber: "",
        giftNumber: "",
        bugNumber: "",
      },
    }
  },
  created() {
    queryByGroup({group:this.group}).then(res =>{
      if(res.code != 0){
        res.data.forEach(item =>{
          if(item.code =="INVITE_REGISTER_COUNT"){
            this.rule.ivNumber = item.val
          }else if (item.code =="GIFT_VALID_DAYS"){
            this.rule.giftNumber = item.val
          }else if (item.code =="BUG_OXYGENBAG_COUNT"){
            this.rule.bugNumber = item.val
          }
        })
        this.list = res.data
      }
    })
  },
  methods:{
    submitForm(){
      this.list.forEach(item =>{
        if(item.code =="INVITE_REGISTER_COUNT"){
          item.val = this.rule.ivNumber
        }else if (item.code =="GIFT_VALID_DAYS"){
          item.val = this.rule.giftNumber
        }else if (item.code =="BUG_OXYGENBAG_COUNT"){
          item.val = this.rule.bugNumber
        }
      })
      this.list = this.list
      saveByGroup(this.list).then(res =>{
        this.$message.success("保存成功！")
      })
    }
  }
}
</script>

<style scoped>
.details_from {
  width: 45%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 50px;
  border: 1px solid #CECECE;
  border-radius: 10px;
  margin-left: 100px;
  margin-top: 30px;
  margin-bottom: 20px;
}

</style>
<style>
.el-form-item__content{
  display: flex;
  flex-direction: row;
  align-items: center;
}
</style>
