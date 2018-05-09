import React from 'react';
import { Link } from 'react-router-dom';
import { Modal, Button } from 'antd';
import { columns, TableEventTypeOptions, AlarmLevel } from '../const';
import './AlarmModal.less';
import DetailTable from 'components/DetailTable/DetailTable';
import EditAuth from 'components/EditAuth/EditAuth';
import { TICKET_WRITE, MANUAL_ALARM_WRITE } from 'constants/authority';
import API from 'rest/Overview';
const { readRecord, postRecordDisappear, generateTicket } = API;
const Fragment = React.Fragment;

export default class AlarmModal extends React.Component {
  render() {
    const { state, cancel, data } = this.props;
    let modalData = [...data].map(a => {
      return {
        ...a,
        eventType: (
          TableEventTypeOptions.find(item => item.value === a.eventType) || {}
        ).label,
        level: (AlarmLevel.find(item => item.value === a.level) || {}).label
      };
    });
    return (
      <Modal
        visible={state}
        onCancel={cancel}
        className="overview-alarm-modal"
        title="报警列表"
        footer={null}
        style={{ top: '70px', left: '0', right: '0' }}
        width="1080px"
      >
        <DetailTable
          columns={columns}
          data={modalData}
          // scroll={{ y: 1000 }}
          pagination={null}
          operationRender={record => <AlarmOperation record={record} />}
        />
      </Modal>
    );
  }
}

class AlarmOperation extends React.Component {
  generateTicketFun = (key, pair, site) => {
    generateTicket(key, pair, site);
    readRecord(key, pair, site);
  };

  render() {
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
                  this.generateTicketFun(record.key, record.pair, record.siteId)
                }
              >
                {'生成工单'}
              </Button>
            </EditAuth>
          ) : null}
        </div>
        <div className="btn-wrapper md">
          <EditAuth auth={MANUAL_ALARM_WRITE}>
            <Button
              type="danger"
              disabled={!!record.disappearRecordTime}
              onClick={() => readRecord(record.key, record.pair, record.siteId)}
            >
              确定
            </Button>
          </EditAuth>
        </div>
      </Fragment>
    );
  }
}
