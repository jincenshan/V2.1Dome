import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/eos-system/vue-admin-template/table/list',
    method: 'get',
    params
  })
}
//获取角色列表
export function getRole(data) {
  return request({
    url: '/eos-system/sys/role/list',
    method: 'post',
    data
  })
}
//添加角色
export function addRole(data) {
  return request({
    url: '/eos-system/sys/role/add',
    method: 'post',
    data
  })
}
//更新角色权限
export function updateRoleTree(data) {
  return request({
    url: '/eos-system/sys/user/updatePermission',
    method: 'post',
    data
  })
}
//查询角色权限
export function searchRoleTree(data) {
  return request({
    url: '/eos-system/sys/user/rolePermissions',
    method: 'post',
    data
  })
}
//删除角色
export function deleteRole(data) {
  return request({
    url:'/eos-system/sys/role/delete',
    method:'post',
    data
  })
}
//运营商列表
export function operatorList(data) {
  return request({
    url:'/eos-system/sys/operator/list',
    method:'post',
    data,
    responseType:data.export?'blob':''
  })
}
//运营商添加
export function operatorAdd(data) {
  return request({
    url:'/eos-system/sys/operator/add',
    method:'post',
    data
  })
}
//运营商详情
export function operatorDetail(data) {
  return request({
    url:'/eos-system/sys/operator/detail',
    method:'post',
    data
  })
}
//运营商更新
export function operatorUpdate(data) {
  return request({
    url:'/eos-system/sys/operator/update',
    method:'post',
    data
  })
}
//机房列表
export function computerList(data) {
  return request({
    url:'/eos-system/sys/motor/room/list',
    method:'post',
    data,
    responseType:data.export?'blob':''
  })
}
//修改机房
export function computerUpdate(data) {
  return request({
    url:'/eos-system/sys/motor/room/update',
    method:'post',
    data
  })
}
//控制器选择列表
export function computerGeneralSelect(data) {
  return request({
    url:'/eos-system/sys/motor/room/control/select/list',
    method:'post',
    data,
    responseType:data.export?'blob':''
  })
}
//机房总控终端列表
export function computerGeneralList(data) {
  return request({
    url:'/eos-system/sys/motor/room/general/control/list',
    method:'post',
    data,
    responseType:data.export?'blob':''
  })
}
//机房总控终端选择列表
export function computerGeneraSelect(data) {
  return request({
    url:'/eos-system/sys/motor/room/general/control/select',
    method:'post',
    data
  })
}
//新增机房总控终端
export function computerGeneralAdd(data) {
  return request({
    url:'/eos-system/sys/motor/room/general/control/add',
    method:'post',
    data
  })
}
//机房详情
export function computerDetail(data) {
  return request({
    url:'/eos-system/sys/motor/room/detail',
    method:'post',
    data
  })
}
//机房控制器列表
export function computerControlList(data) {
  return request({
    url:'/eos-system/sys/motor/room/control/list',
    method:'post',
    data,
    responseType:data.export?'blob':''
  })
}
//添加机房
export function computerAdd(data) {
  return request({
    url:'/eos-system/sys/motor/room/add',
    method:'post',
    data
  })
}
//网点维护人员
export function netWorkDefend() {
  return request({
    url:'/eos-system/sys/user/netservice',
    method:'get'
  })
}
//控制器添加
export function computerContorlAdd(data) {
  return request({
    url:'/eos-system/sys/motor/room/control/add',
    method:'post',
    data
  })
}
//运营商投资列表
export function operatorSelect(data) {
  return request({
    url:'/eos-system/sys/operator/select/invest',
    method:'post',
    data,
  })
}
//获取运营商选择列表
export function operatorRoleSelect(data) {
  return request({
    url:'/eos-system/sys/operator/sellList',
    method:'post',
    data
  })
}
//供氧运营商选择列表
export function operatorSup(data) {
  return request({
    url:'/eos-system/sys/operator/select/sup',
    method:'post',
    data
  })
}
//设备型号管理列表

export function equipmentList(data) {
  return request({
    url:'/eos-system/equipment/model/list',
    method:'post',
    data
  })
}
//设备型号添加
export function equipmentAdd(data) {
  return request({
    url:'/eos-system/equipment/model/add',
    method:'post',
    data
  })
}
//设备型号更新
export function updateEquipModel(data) {
  return request({
    url:'/eos-system/equipment/updateEquipModel',
    method:'post',
    data
  })
}
//设备规格添加
export function equipmentSpecAdd(data) {
  return request({
    url:'/eos-system/equipment/part/spec/add',
    method:'post',
    data
  })
}

//获取部件列表
export function equipmentPartList(data) {
  return request({
    url:'/eos-system/equipment/equip/part/list',
    method:'post',
    data,
    responseType:data.export?'blob':''
  })
}

//设备部件新增
export function equipmentPartAdd(data) {
  return request({
    url:'/eos-system/equipment/equip/part/add',
    method:'post',
    data
  })
}
//设备部件更新
export function equipmentPartReplace(data) {
  return request({
    url:'/eos-system/equipment/equip/part/update',
    method:'post',
    data
  })
}


//部件详情设备
export function equipmentPartDetail(data) {
  return request({
    url:'/eos-system/equipment/equip/part/detail',
    method:'post',
    data
  })
}
//查询设备部件规格列表
export function equipmentPartSpecList(data) {
  return request({
    url:'/eos-system/equipment/part/spec/list',
    method:'post',
    data
  })
}

//部件修改
export function equipmentPartUpdate(data) {
  return request({
    url:'/eos-system/equipment/part/spec/update',
    method:'post',
    data
  })
}
//部件规格选择列表
export function equipmentSpecSelect(data) {
  return request({
    url:'/eos-system/equipment/part/spec/select',
    method:'post',
    data
  })
}
//设备入库
export function equipmentStorageIn(data) {
  return request({
    url:'/eos-system/equipment/in/storage',
    method:'post',
    data
  })
}
//设备出库
export function equipmentStorageOut(data) {
  return request({
    url:'/eos-system/equipment/out/storage',
    method:'post',
    data
  })
}
//添加部件规格关联
export function equipmentSpecPartRel(data) {
  return request({
    url:'/eos-system/equipment/add/rel/part/spec',
    method:'post',
    data
  })
}
//查询设备未关联可添加部件
export function equipmentSpecPartNo(data) {
  return request({
    url:'/eos-system/equipment/query/not/rel/part',
    method:'post',
    data
  })
}
//查询设备已关联部件
export function equipmentSpecPartYes(data) {
  return request({
    url:'/eos-system/equipment/query/rel/part',
    method:'post',
    data
  })
}
//查询设备已关联部件规格

export function equipmentSpecPartYesSpec(data) {
  return request({
    url:'/eos-system/equipment/query/rel/part/spec',
    method:'post',
    data
  })
}
//更换设备部件规格
export function equipmentSpecPartYesUpdate(data) {
  return request({
    url:'/eos-system/equipment/update/rel/spec/update',
    method:'post',
    data
  })
}
//修改已经关联的部件规格SN
export function equipmentSpecPartYesSpecSN(data) {
  return request({
    url:'/eos-system/equipment/update/rel/spec/snno',
    method:'post',
    data
  })
}

//出入库列表查询

export function equipmentSpecPartList(data) {
  return request({
    url:'/eos-system/equipment/out/in/list',
    method:'post',
    data,
    responseType:data.export?'blob':''
  })
}

//设备激活
export function activationOk(data) {
  return request({
    url:'/eos-system/sys/motor/room/control/activation',
    method:'post',
    data
  })
}

//取氧口激活
export function uptakeOk(data) {
  return request({
    url:'/eos-system/sys/network/oxy/uptake/activation',
    method:'post',
    data
  })
}

//部件更换记录
export function recordRemember(data) {
  return request({
    url:'/eos-system/equipment/part/spec/update/record',
    method:'post',
    data,
    responseType:data.export?'blob':''
  })
}

//制氧机分组
export function groupList(data) {
  return request({
    url:'/eos-system/sys/motor/room/oxy/group/list',
    method:'post',
    data,
    responseType:data.export?'blob':''
  })
}
//所属制氧机分组列表
export function groupListOxy(data) {
  return request({
    url:'/eos-system/sys/motor/room/group/oxy/list',
    method:'post',
    data,
    responseType:data.export?'blob':''
  })
}

//制氧机异常报警信息列表
export function oxyExceptionList(data) {
  return request({
    url:'/eos-system/equipment/oxy/exception/list',
    method:'post',
    data,
    responseType:data.export?'blob':''
  })
}

//制氧机问题解决
export function oxyExceptionSolve(data) {
  return request({
    url:'/eos-system/equipment/exception/solve',
    method:'post',
    data,
    responseType:data.export?'blob':''
  })
}

//控制器运行监控
export function controlMonitorList(data) {
  return request({
    url:'/eos-system/equipment/control/run/monitor/list',
    method:'post',
    data,
    responseType:data.export?'blob':''
  })
}

//控制器异常报警信息列表
export function controlExceptionList(data) {
  return request({
    url:'/eos-system/equipment/control/exception/list',
    method:'post',
    data,
    responseType:data.export?'blob':''
  })
}

//设备部件运行详情
export function partRunDetail(data) {
  return request({
    url:'/eos-system/equipment/getEquipPartDetail/'+data,
    method:'get',
  })
}

//设备部件详情
export function partDetail(data) {
  return request({
    url:'/eos-system/equipment/equip/part/info/'+data,
    method:'get',
  })
}

//设备保养计划
export function planReplaceList(data) {
  return request({
    url:'/eos-system/equipment/maintain/plan/list',
    method:'post',
    data,
    responseType:data.export?'blob':''
  })
}

//确认保养
export function maintainSure(data) {
  return request({
    url:'/eos-system/equipment/sure/maintain',
    method:'post',
    data
  })
}

//取供氧终端设备
export function terminalList(data) {
  return request({
    url:'/eos-system/equipment/terminal/equip/list',
    method:'post',
    data,
    responseType:data.export?'blob':''
  })
}

//设备部件运行记录查询
export function equipAddress(data) {
  return request({
    url:'/eos-system/equipment/queryEquipPartRecord',
    method:'post',
    data,
    responseType:data.export?'blob':''
  })
}

//轨迹列表
export function equipAddressList(data) {
  return request({
    url:'/eos-system/equipAdress/list',
    method:'post',
    data,
    responseType:data.export?'blob':''
  })
}

//制氧机运行监控
export function oxyMonitorList(data) {
  return request({
    url:'/eos-system/equipment/oxy/run/monitor/list',
    method:'post',
    data,
    responseType:data.export?'blob':''
  })
}

//入驻网点列表
export function networkList(data) {
  return request({
    url:'/eos-system/sys/network/list',
    method:'post',
    data,
    responseType:data.export?'blob':''
  })
}
//添加网点
export function networkAdd(data) {
  return request({
    url:'/eos-system/sys/network/add',
    method:'post',
    data
  })
}

//网点详情
export function networkDetail(data) {
  return request({
    url:'/eos-system/sys/network/detail',
    method:'post',
    data
  })
}

//网点更新
export function networkUpdate(data) {
  return request({
    url:'/eos-system/sys/network/update',
    method:'post',
    data
  })
}

//新增入户终端
export function networkHouseAdd(data) {
  return request({
    url:'/eos-system/sys/network/enter/house/add',
    method:'post',
    data
  })
}

//取氧口终端激活
export function networkHouseUptake(data) {
  return request({
    url:'/eos-system/sys/network/oxy/uptake/activation',
    method:'post',
    data
  })
}

//取氧口终端列表
export function networkHouseUptakeList(data) {
  return request({
    url:'/eos-system/sys/network/oxy/uptake/list',
    method:'post',
    data,
    responseType:data.export?'blob':''
  })
}

//分控列表
export function subControlList(data) {
  return request({
    url:'/eos-system/sys/network/oxy/sub/control/list',
    method:'post',
    data,
    responseType:data.export?'blob':''
  })
}

//加湿器管理列表
export function humidifierList(data) {
  return request({
    url:'/eos-system/sys/network/humidifier/list',
    method:'post',
    data,
    responseType:data.export?'blob':''
  })
}

//可添加加湿器列表
export function humidifierAddList(data) {
  return request({
    url:'/eos-system/sys/network/humidifier/select/list',
    method:'post',
    data,
    responseType:data.export?'blob':''
  })
}
//加湿器添加
export function humidifierAdd(data) {
  return request({
    url:'/eos-system/sys/network/add/humidifier',
    method:'post',
    data,
    responseType:data.export?'blob':''
  })
}

//一体机终端新增
export function overAllAdd(data) {
  return request({
    url:'/eos-system/sys/network/enter/overall/add',
    method:'post',
    data,
    responseType:data.export?'blob':''
  })
}


//分控信息补录
export function controlSubAdd(data) {
  return request({
    url:'/eos-system/sys/network/sub/control/info/edit',
    method:'post',
    data,
    responseType:data.export?'blob':''
  })
}

//选择售后服务商列表
export function serviceList(data) {
  return request({
    url:'/eos-system/sys/operator/serviceList',
    method:'post',
    params: data
  })
}

//附件设备运行监控
export function enclosureList(data) {
  return request({
    url:'/eos-system/equipment/enclosure/run/list',
    method:'post',
    data,
    responseType:data.export?'blob':''
  })
}

//入户终端选择列表
export function networkEnterSelect(data) {
  return request({
    url:'/eos-system/sys/network/enter/house/select',
    method:'post',
    data,
    responseType:data.export?'blob':''
  })
}

//分控终端选择列表
export function subControlSelect(data) {
  return request({
    url:'/eos-system/sys/network/sub/control/select',
    method:'post',
    data,
    responseType:data.export?'blob':''
  })
}

//所属网点入户终端
export function networkEnterList(data) {
  return request({
    url:'/eos-system/sys/network/enter/house/has/bind',
    method:'post',
    data,
    responseType:data.export?'blob':''
  })
}

//控制器启用停用
export function controlShutdown(data) {
  return request({
    url:'/eos-system/equipment/control/enable/shutdown',
    method:'post',
    data
  })
}

//制氧机启用停用
export function oxyShutdown(data) {
  return request({
    url:'/eos-system/equipment/enable/shutdown',
    method:'post',
    data
  })
}

//入户终端启用停用
export function homeShutdown(data) {
  return request({
    url:'/eos-system/equipment/home/terminal/shutdown',
    method:'post',
    data
  })
}

//所有运营商选择列表
export function selectAllList(data) {
  return request({
    url:'/eos-system/sys/operator/all/type/select/list',
    method:'post',
    data,
    responseType:data.export?'blob':''
  })
}

//分润项目保存
export function profitSetting(data) {
  return request({
    url:'/eos-system/order/profit/setting',
    method:'post',
    data
  })
}

//分润项目设置查询
export function profitQuery(data) {
  return request({
    url:'/eos-system/order/profit/query',
    method:'post',
    data
  })
}

//分润项目审核
export function profitAudit(data) {
  return request({
    url:'/eos-system/order/profit/audit',
    method:'post',
    data
  })
}

//安装入户订单管理列表
export function houseList(data) {
  return request({
    url:'/eos-system/order/enter/house/list',
    method:'post',
    data,
    responseType:data.export?'blob':''
  })
}

//流量付费订单管理列表
export function payList(data) {
  return request({
    url:'/eos-system/order/flow/pay/list',
    method:'post',
    data,
    responseType:data.export?'blob':''
  })
}
//财务分账列表
export function accountList(data) {
  return request({
    url:'/eos-system/order/account/list',
    method:'post',
    data,
    responseType:data.export?'blob':''
  })
}
//财务分账明细
export function accountListDetail(data) {
  return request({
    url:'/eos-system/order/account/detail/list',
    method:'post',
    data,
    responseType:data.export?'blob':''
  })
}

// 预收金维护
export function advanceEdit(data) {
  return request({
    url:'/eos-system/sys/network/advance/edit',
    method:'post',
    data
  })
}

//预收金查询
export function advanceQuery(data) {
  return request({
    url:'/eos-system/sys/network/advance/query',
    method:'post',
    data
  })
}
//待收款列表
export function contractFlow(data) {
  return request({
    url:'/eos-system/sys/network/contract/flow/fee/list',
    method:'post',
    data,
    responseType:data.export?'blob':''
  })
}
//流量费用编辑
export function contractEdit(data) {
  return request({
    url:'/eos-system/sys/network/contract/flow/fee/edit',
    method:'post',
    data
  })
}

//设备参数设置
export function equipSetting(data) {
  return request({
    url:'/eos-system/sys/motor/room/equip/params/setting',
    method:'post',
    data
  })
}

//老机房控制器列表
export function oldRoomListControl(data) {
  return request({
    url:'/eos-system/sys/motor/room/old/control/list',
    method:'post',
    data
  })
}

// 老机房维护SN
export function oldRoomListControlEdit(data) {
  return request({
    url:'/eos-system/sys/motor/room/old/oxy/sn/edit',
    method:'post',
    data
  })
}

//老机房添加控制器
export function oldRoomListControlAdd(data) {
  return request({
    url:'/eos-system/sys/motor/room/old/add/control',
    method:'post',
    data
  })
}

//老机房制氧机列表
export function oldRoomListOxy(data) {
  return request({
    url:'/eos-system/sys/motor/room/old/oxy/list',
    method:'post',
    data,
    responseType:data.export?'blob':''
  })
}

//是否激活
export function activationIs(data) {
  return request({
    url:'/eos-system/equipment/query/is/activation',
    method:'post',
    data
  })
}

//设备历史记录
export function historyEquip(data) {
  return request({
    url:'/eos-system/equipment/queryEquipRecord',
    method:'post',
    data,
    responseType:data.export?'blob':''
  })
}
//网点供氧模板列表
export function netoxytemplateList(data) {
  return request({
    url:'/eos-system/sys/netoxytemplate/list',
    method:'post',
    data,
    responseType:data.export?'blob':''
  })
}

//网点供氧模板新增
export function netoxytemplateAdd(data) {
  return request({
    url:'/eos-system/sys/netoxytemplate/add',
    method:'post',
    data
  })
}

//网点供氧模板详情
export function netoxytemplateDetail(data) {
  return request({
    url:'/eos-system/sys/netoxytemplate/info/'+data,
    method:'get',
  })
}

//网点供氧模板修改
export function netoxytemplateUpdate(data) {
  return request({
    url:'/eos-system/sys/netoxytemplate/update/'+data.templateId+'/'+data.status,
    method:'put',
  })
}

//运维人员列表
export function manageList(data) {
  return request({
    url:'/eos-system/sys/user/rootservice/'+data,
    method:'get',
  })
}

//入户终端与分控终端网点管理
export function netoxytemplateTerminals(data) {
  return request({
    url:'/eos-system/sys/netoxytemplate/terminals',
    method:'post',
    data,
    responseType:data.export?'blob':''
  })
}

//网点供氧模板关系绑定
export function netoxytemplateSaveRel(data) {
  return request({
    url:'/eos-system/sys/netoxytemplate/saveRel',
    method:'post',
    data
  })
}

//总控设备运行模式设置
export function controlRunmode(data) {
  return request({
    url:'/eos-system/sys/motor/room/general/control/runmode',
    method:'post',
    params: data
  })
}

//氧疗袋列表信息查询
export function oxygenBagList(data) {
  return request({
    url:'/eos-bby/oxygenbag',
    method:'post',
    data,
    responseType:data.export?'blob':''
  })
}

//氧疗袋销售出库
export function oxygenBagUp(data) {
  return request({
    url:'/eos-bby/oxygenbag/out',
    method:'put',
    data
  })
}

//商品规格表
export function goodsSpec(data) {
  return request({
    url:'/eos-bby/goods/spec/getEffectiveSpecs/'+data.goodsType,
    method:'get',
  })
}

//保存氧疗袋表信息
export function goodsSpecSave(data) {
  return request({
    url:'/eos-bby/oxygenbag/save',
    method:'post',
    data
  })
}

//批量入库
export function goodsUpload(data) {
  return request({
    url:'/eos-bby/oxygenbag/storageBatch',
    method:'post',
    data
  })
}

//事件管理列表
export function eventList(data) {
  return request({
    url:'/eos-bby/eventlog',
    method:'post',
    data,
    responseType:data.export?'blob':''
  })
}

//分组查询参数配置
export function queryByGroup(data) {
  return request({
    url:'/eos-bby/sysconfig/queryByGroup/'+data.group,
    method:'get'
  })
}

//保存系统参数
export function saveByGroup(data) {
  return request({
    url:'/eos-bby/sysconfig/save',
    method:'post',
    data
  })
}

//根据类型查区域列表
export function queryByType(data) {
  return request({
    url:'/eos-system/sys/region/queryByType/'+data.type,
    method:'get'
  })
}

//根据父类ID查询子区域列表
export function queryByParentId(data) {
  return request({
    url:'/eos-system/sys/region/queryByParentId/'+data.parentId,
    method:'get'
  })
}

//商品区域知道价格列表信息查询
export function areapriceList(data) {
  return request({
    url:'/eos-bby/areaprice/list',
    method:'post',
    data,
    responseType:data.export?'blob':''
  })
}

//删除商品区域指导价格表信息
export function areapriceDelete(data) {
  return request({
    url:'/eos-bby/areaprice/delete',
    method:'delete',
    data
  })
}

//保存商品区域指导价格表信息
export function areapriceSave(data) {
  return request({
    url:'/eos-bby/areaprice/save',
    method:'post',
    data
  })
}

//审核区域价格
export function areapriceAudit(data) {
  return request({
    url:'/eos-bby/areaprice/audit',
    method:'post',
    data
  })
}

//运营商分润设置查询
export function areapriceSearch(data) {
  return request({
    url:'/eos-bby/operatorprofitsetting/info/'+data.optId+'/BBY',
    method:'get',
  })
}

//保存运营商分润设置信息
export function operatorprofitSetting(data) {
  return request({
    url:'/eos-bby/operatorprofitsetting/save',
    method:'post',
    data,
  })
}

//获取所有的省市
export function princeCity(data) {
  return request({
    url:'/eos-system/sys/region/queryNationwideExcludeRegion',
    method:'get'
  })
}

//获取所有省市区
export function princeCityQuery(data) {
  return request({
    url:'/eos-system/sys/region/queryNationwide',
    method:'get'
  })
}

//网点分润列表设置查询
export function netshareQuery(data) {
  return request({
    url:'/eos-bby/netshare/profits/'+data.netId+'/'+data.type,
    method:'get'
  })
}

//网点分润保存
export function netshareSave(data) {
  return request({
    url:'/eos-bby/netshare/save',
    method:'post',
    data
  })
}
//网点销售价格列表设置
export function netpriceList(data) {
  return request({
    url:'/eos-bby/netprice',
    method:'post',
    data,
    responseType:data.export?'blob':''
  })
}
//新增网点销售价格表信息
export function netpriceSave(data) {
  return request({
    url:'/eos-bby/netprice/save',
    method:'post',
    data
  })
}

//审核网点销售价格信息
export function netpriceAudit(data) {
  return request({
    url:'/eos-bby/netprice/audit',
    method:'post',
    data
  })
}
//删除网点销售价格信息
export function netpriceDelete(data) {
  return request({
    url:'/eos-bby/netprice/delete',
    method:'delete',
    data
  })
}
//网点列表销售价格列表
export function netpriceOptList(data) {
  return request({
    url:'/eos-bby/netprice/priceList',
    method:'post',
    data,
    responseType:data.export?'blob':''
  })
}

//抱抱氧订单列表
export function bbyOrderList(data) {
  return request({
    url:'/eos-bby/order',
    method:'post',
    data,
    responseType:data.export?'blob':''
  })
}

//订单退款处理
export function refundOrder(data) {
  return request({
    url:'/eos-bby/order/refund',
    method:'put',
    data
  })
}
//订单退款详情
export function refundDetail(data) {
  return request({
    url:'/eos-bby/order/refundDetail/'+data.orderId,
    method:'get',
  })
}

//获取运营商旗下网点列表
export function getNetsByOpt() {
  return request({
    url:'/eos-system/sys/network/getNetsByOpt',
    method:'get',
  })
}

//批量保存网点销售价格
export function saveBatch(data) {
  return request({
    url:'/eos-bby/netprice/saveBatch',
    method:'post',
    data
  })
}

//财务账户列表
export function accountBobList(data) {
  return request({
    url:'/eos-bby/account/list',
    method:'post',
    data,
    responseType:data.export?'blob':''
  })
}

//财务账户明细
export function accountBobListDetail(data) {
  return request({
    url:'/eos-bby/account/detailList',
    method:'post',
    data,
    responseType:data.export?'blob':''
  })
}

//用户信息列表
export function userList(data) {
  return request({
    url:'/eos-bby/user',
    method:'post',
    data,
    responseType:data.export?'blob':''
  })
}

//新增科室终端
export function addTerminal(data) {
  return request({
    url:'/eos-system/sys/network/dept/terminal/add',
    method:'post',
    data,
    responseType:data.export?'blob':''
  })
}

//科室终端选择列表
export function selectTerminal(data) {
  return request({
    url:'/eos-system/sys/network/deptTerminal/select/list',
    method:'post',
    data,
  })
}

//科室终端列表
export function deptTerminalList(data) {
  return request({
    url:'/eos-system/sys/network/deptTerminalList/'+data.netId,
    method:'get',
  })
}

//科室流量监控查询
export function deptflowList(data) {
  return request({
    url:'/eos-system/deptflow',
    method:'post',
    data,
    responseType:data.export?'blob':''
  })
}

//科室设备历史记录查询
export function deptflowHistorys(data) {
  return request({
    url:'/eos-system/deptflow/historys',
    method:'post',
    data,
    responseType:data.export?'blob':''
  })
}
