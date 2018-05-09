import React from 'react';
import { Button } from 'antd';
import {
  NORMAL_AGENT,
  CHARGE_AGENT,
  SUPER_AGENT,
  DATA_AGENT,
  YARDMAN_AGENT
} from 'constants/userType';
import UserSelector from './UserSelector';
import store from 'store/index';

const baseStyle = {
  marginRight: 10
};

const repairTicketStatus = {
  Waiting: [
    {
      name: '确认',
      type: 'danger',
      action: 'confirm'
    },
    {
      name: '转他人确定',
      type: 'default',
      action: 'transfer',
      dropDown: true
    }
  ],
  Assigning: [
    { name: '分配', type: 'danger', action: 'assign', dropDown: true },
    { name: '关闭', type: 'default', action: 'close' }
  ],
  Executing_Executing: [
    { name: '完成', type: 'info', action: 'finish' },
    {
      name: '转他人执行',
      type: 'default',
      action: 'transfer',
      dropDown: true
    }
  ],
  Executing_Assigning: [
    { name: '完成', type: 'info', action: 'finish' },
    {
      name: '转他人执行',
      type: 'default',
      action: 'transfer',
      dropDown: true
    }
  ],
  Executing_Finished: [{ name: '完成', type: 'info', action: 'finish' }],
  Finished: [
    { name: '退回', type: 'danger', action: 'fail' },
    { name: '验证通过', type: 'success', action: 'pass' }
  ],
  Approved: [],
  Closed: []
};

const inspectionSchema = {
  normal: {
    Assigning: [{ action: 'accept', name: '接受', type: 'primary' }],
    Executing: [{ action: 'finish', name: '完成', type: 'primary' }],
    Finished: []
  },
  super: {
    Assigning: [
      { action: 'assign', name: '分配', type: 'default', dropDown: true },
      { action: 'accept', name: '接受', type: 'primary' }
    ],
    Executing: [{ action: 'finish', name: '完成', type: 'primary' }],
    Finished: []
  }
};

export const inspectionTicketStatus = {
  [NORMAL_AGENT]: inspectionSchema.normal,
  [CHARGE_AGENT]: inspectionSchema.super,
  [SUPER_AGENT]: inspectionSchema.super,
  [YARDMAN_AGENT]: inspectionSchema.super,
  [DATA_AGENT]: inspectionSchema.super
};

export const RepairTicketOperation = ({
  record,
  user,
  handleClick,
  assignUsers,
  handleAssign
}) => {
  if (user.id === (record.assignee || {}).id) {
    const currentState =
      record.state === 'Executing'
        ? `${record.state}_${record.prevState}`
        : record.state;
    const operation = (repairTicketStatus[currentState] || []).map(
      (item, index) =>
        item.dropDown ? (
          <UserSelector
            key={item.name + index}
            user={assignUsers}
            onChangeUser={id => handleAssign(id, record, item.action)}
          >
            <Button size="small" type={item.type} key={index} style={baseStyle}>
              {item.name}
            </Button>
          </UserSelector>
        ) : (
          <Button
            size="small"
            type={item.type}
            key={item.name + index}
            onClick={() => handleClick(record, user, item.action)}
            style={baseStyle}
          >
            {item.name}
          </Button>
        )
    );
    return <div>{operation}</div>;
  }
  return null;
};

export const InspectionTicketOperation = ({
  record,
  user,
  handleClick,
  assignUsers,
  handleInsAssign,
  disabled
}) => {
  if ((record.assignee || {}).id === user.id || record.state === 'Assigning') {
    const { user } = store.getState();
    const { authority } = user;
    const operation = inspectionTicketStatus[authority][record.state].map(
      (item, index) =>
        item.dropDown ? (
          <UserSelector
            key={item.name + index}
            user={assignUsers}
            onChangeUser={id => handleInsAssign(id, record, item.action)}
          >
            <Button size="small" type={item.type} key={index} style={baseStyle}>
              {item.name}
            </Button>
          </UserSelector>
        ) : (
          <Button
            size="small"
            type={item.type}
            key={item.name + index}
            onClick={() => handleClick(record, user, item.action)}
            style={baseStyle}
            disabled={disabled}
          >
            {item.name}
          </Button>
        )
    );
    return <div>{operation}</div>;
  }
  return null;
};
