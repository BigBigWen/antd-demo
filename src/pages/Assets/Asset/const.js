import React from 'react';
export const assetTitle = [
  {
    title: '回路名称',
    dataIndex: 'circuitName',
    width: '8%'
  },
  {
    title: '回路编号',
    dataIndex: 'circuitNumber',
    width: '8%'
  },
  {
    title: '所在柜子型号',
    dataIndex: 'cabinetModel',
    width: '7%'
  },
  {
    title: '柜子尺寸',
    dataIndex: 'cabinetSize',
    width: '7%'
  },
  {
    title: '成套厂家',
    dataIndex: 'manufacturer',
    width: '7%'
  },
  {
    title: '元件名称',
    dataIndex: 'componentName',
    width: '7%'
  },
  {
    title: '元件型号',
    dataIndex: 'componentModel',
    width: '7%'
  },
  {
    title: '元件生产厂家',
    dataIndex: 'componentManufacturer',
    width: '7%'
  },
  {
    title: '元件数量',
    dataIndex: 'componentQuantity',
    width: '7%'
  },
  {
    title: '欠压脱扣器380VAC',
    dataIndex: 'qianYaTuoKouQi380VAC',
    width: '7%',
    render: text => {
      return text ? (
        <span style={{ color: '#ff8400' }}>√</span>
      ) : (
        <span>×</span>
      );
    }
  },
  {
    title: '分励脱扣器380VAC',
    dataIndex: 'fenLiTuoKouQi380VAC',
    width: '7%',
    render: text => {
      return text ? (
        <span style={{ color: '#ff8400' }}>√</span>
      ) : (
        <span>×</span>
      );
    }
  },
  {
    title: '电动操作机构220VAC',
    dataIndex: 'dianDongCaoZuoJiGou220VAC',
    width: '7%',
    render: text => {
      return text ? (
        <span style={{ color: '#ff8400' }}>√</span>
      ) : (
        <span>×</span>
      );
    }
  },
  {
    title: '欠压脱扣器220VAC',
    dataIndex: 'qianYaTuoKouQi220VAC',
    width: '7%',
    render: text => {
      return text ? (
        <span style={{ color: '#ff8400' }}>√</span>
      ) : (
        <span>×</span>
      );
    }
  },
  {
    title: '分励脱扣器220VAC',
    dataIndex: 'fenLiTuoKouQi220VAC',
    width: '7%',
    render: text => {
      return text ? (
        <span style={{ color: '#ff8400' }}>√</span>
      ) : (
        <span>×</span>
      );
    }
  }
];
