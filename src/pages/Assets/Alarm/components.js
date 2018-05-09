import React from 'react';
import { Button, Modal, Popover } from 'antd';
import { Link } from 'react-router-dom';
import Item from 'components/UI/DetailListItem';
import EditAuth from 'components/EditAuth/EditAuth';
import Confirm from 'components/UI/Confirm';
import { TableEventTypeOptions, AlarmLevel } from 'constants/options';
import { TICKET_WRITE, MANUAL_ALARM_WRITE } from 'constants/authority';
import API from 'rest/Assets/Alarm';
const { readRecord, generateTicket, postRecordDisappear } = API;

const Fragment = React.Fragment;

class AlarmModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showPopover: false };
  }
  handleConfirmFun = (key, pair, site) => {
    this.props.handleConfirm(key, pair, site);
    this.setState({ showPopover: false });
  };
  getBtn = () => {
    const { showPopover } = this.state;
    const { handleConfirm, record } = this.props;
    if (record.disappearFlag) {
      return (
        <Button type="danger" disabled>
          手动解除报警
        </Button>
      );
    } else {
      return (
        <Popover
          trigger="click"
          visible={showPopover}
          onVisibleChange={visible => this.setState({ showPopover: visible })}
          content={
            <Confirm
              title="确定解除么?"
              handleCancel={() => this.setState({ showPopover: false })}
              handleConfirm={() =>
                this.handleConfirmFun(record.key, record.pair, record.site)
              }
            />
          }
        >
          <Button type="danger">手动解除报警</Button>
        </Popover>
      );
    }
  };
  render() {
    const { showModal, handleHideModal, handleConfirm, record } = this.props;
    const eventType =
      TableEventTypeOptions.find(i => i.value === record.eventType) || {};
    const level = AlarmLevel.find(item => item.value === record.level) || {};
    const footer = [
      this.getBtn(),
      <Button onClick={handleHideModal}>关闭</Button>
    ];
    return (
      <Modal
        title="详情"
        visible={showModal}
        onCancel={handleHideModal}
        footer={footer}
      >
        <Item label={'报警级别'} content={level.label} />
        <Item label={'报警类型'} content={eventType.label} />
        <Item label={'报警名称'} content={record.name} />
        <Item label={'报警描述'} content={record.description} />
        <Item label={'所属项目'} content={(record.project || {}).name} />
        <Item label={'所属配电房'} content={(record.siteObj || {}).name} />
        <Item label={'所属回路'} content={(record.circuitObj || {}).name} />
        <Item label={'关键点'} content={record.keyPointName} />
        <Item label={'触发时间'} content={record.appearRecordTime} />
        <Item label={'触发数值'} content={record.appearDataValue} />
        <Item
          label={'是否恢复'}
          content={record.disappearFlag ? '已恢复' : '未恢复'}
        />
        <Item label={'恢复时间'} content={record.disappearRecordTime} />
        <Item label={'恢复数值'} content={record.disappearDataValue} />
        <Item label={'是否确定'} content={record.read ? '已确定' : '未确定'} />
        <Item
          label={'是否生成工单'}
          content={record.ticketId ? '已生成' : '未生成'}
        />
      </Modal>
    );
  }
}

export class AlarmOperation extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showModal: false };
  }

  readRecordFun = (key, pair, site) => {
    const { loadData } = this.props;
    readRecord(key, pair, site).then(json => loadData());
  };

  generateTicketFun = (key, pair, site) => {
    const { loadData } = this.props;
    generateTicket(key, pair, site).then(json => {
      this.readRecordFun(key, pair, site);
      loadData();
    });
  };

  handleConfirm = async (key, pair, site) => {
    const json = await postRecordDisappear(key, pair, site);
    this.props.loadData(site);
    this.setState({
      showModal: false
    });
    this.readRecordFun(key, pair, site);
  };

  render() {
    const { showModal } = this.state;
    const { record } = this.props;
    return (
      <Fragment>
        <div className="btn-wrapper lg">
          {record.ticketId ? (
            <Button type="link">
              <Link
                to={{
                  pathname: '/personal-center',
                  query: { ticketId: record.ticketId }
                }}
              >
                {'查看工单'}
              </Link>
            </Button>
          ) : !record.disappearFlag ? (
            <EditAuth auth={TICKET_WRITE}>
              <Button
                type="primary"
                onClick={() =>
                  this.generateTicketFun(record.key, record.pair, record.site)
                }
              >
                {'生成工单'}
              </Button>
            </EditAuth>
          ) : null}
        </div>
        <div className="btn-wrapper md">
          {record.disappearFlag ? (
            <Button type="link" disabled>
              已恢复
            </Button>
          ) : record.read ? (
            <Button disabled>已读</Button>
          ) : (
            <EditAuth auth={MANUAL_ALARM_WRITE}>
              <Button
                type="danger"
                disabled={!!record.disappearRecordTime}
                onClick={() =>
                  this.readRecordFun(record.key, record.pair, record.site)
                }
              >
                确定
              </Button>
            </EditAuth>
          )}
        </div>
        <div className="btn-wrapper sm">
          <Button
            type="link"
            onClick={() => this.setState({ showModal: true })}
          >
            详情
          </Button>
        </div>
        <AlarmModal
          record={record}
          showModal={showModal}
          handleConfirm={this.handleConfirm}
          handleHideModal={() => this.setState({ showModal: false })}
        />
      </Fragment>
    );
  }
}
