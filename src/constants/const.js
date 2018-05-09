import moment from 'moment';
export const themes = ['whitesmoke', 'grey'];
// 不分页拿全部数据size设为该值
export const maxSize = 2147483647;
export const allYear = {
  from: moment('2016-01-01 00:00:00').valueOf(),
  to: moment()
    .endOf('year')
    .valueOf()
};
// 工单表单中使用
export const dateUnitDict = {
  DAY: '日',
  WEEK: '周',
  MONTH: '月'
};
export const spaceCheck = /\s*\S+/;
// 报警类型枚举值
export const TableEventTypeOptions = [
  { label: '电压越高限', value: 11 },
  { label: '电压越低限', value: 12 },
  { label: '电流越高限', value: 21 },
  { label: '电流越高高限', value: 22 },
  { label: '越低限', value: 30 },
  { label: '越高限', value: 31 },
  { label: '越低低限', value: 32 },
  { label: '越高高限', value: 33 },
  { label: '增幅报警', value: 34 },
  { label: '降幅报警', value: 35 },
  { label: '通讯故障', value: 36 },
  { label: '开关失电', value: 38 },
  { label: '开关跳闸', value: 39 },
  { label: '开关分闸', value: 40 },
  { label: '开关合闸', value: 41 },
  { label: '开关缺相', value: 42 },
  { label: '电容投入', value: 43 },
  { label: '开关得电', value: 44 },
  { label: '烟感报警', value: 45 },
  { label: '网关失电', value: 46 },
  { label: '电压谐波越高限', value: 47 },
  { label: '电流谐波越高限', value: 48 },
  { label: '电容温度越高限', value: 49 },
  { label: '电容温度越高高限', value: 50 },
  { label: '触头温度越高限', value: 51 },
  { label: '触头温度越高高限', value: 52 },
  { label: '无线测温电池电量不足', value: 53 },
  { label: '变压器温度越高限', value: 54 },
  { label: '变压器温度越高高限', value: 55 },
  { label: '三相电流不平衡度越高限', value: 56 },
  { label: '三相电流不平衡度越高高限', value: 57 },
  { label: '负载率越高限', value: 58 },
  { label: '负载率越高高限', value: 59 },
  { label: '地刀合闸', value: 60 },
  { label: '地刀断开', value: 61 },
  { label: '已储能', value: 62 },
  { label: '未储能', value: 63 },
  { label: '合闸触点闭合', value: 64 },
  { label: '合闸触点未闭合', value: 65 },
  { label: '分闸触点闭合', value: 66 },
  { label: '分闸触点未闭合', value: 67 },
  { label: '工作位置', value: 68 },
  { label: '试验位置', value: 69 },
  { label: 'C相无电压', value: 70 },
  { label: 'C相有电压', value: 71 },
  { label: 'B相无电压', value: 72 },
  { label: 'B相有电压', value: 73 },
  { label: 'A相无电压', value: 74 },
  { label: 'A相有电压', value: 75 },
  { label: '电流偏大', value: 76 },
  { label: '三相电流不平衡度偏大', value: 77 },
  { label: '网关离线', value: 78 }
];
// 首页滚动框定制该枚举值,修改时需注意
export const AlarmLevel = [
  { label: '预警', value: 1 },
  { label: '报警', value: 2 },
  { label: '故障', value: 3 }
];
