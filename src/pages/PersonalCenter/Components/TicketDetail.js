import React from 'react';
import {} from 'antd';
import RepairDetail from './RepairDetail';
import InspectionDetail from './InspectionDetail';
import './TicketDetail.less';

export default class TicketDetail extends React.Component {
  render() {
    const { type, info, getImages, oss, getComment, height } = this.props;
    return (
      <div className="ticket-detail" style={{ height: height }}>
        <div className="title">工单详情</div>
        {info && info.id ? (
          type === 'repair' ? (
            <RepairDetail
              info={info}
              getComment={getComment}
              handleClick={this.handleClick}
            />
          ) : (
            <InspectionDetail
              info={info}
              getComment={getComment}
              getImages={getImages}
              oss={oss}
            />
          )
        ) : (
          <div className="empty-info" />
        )}
      </div>
    );
  }
}
