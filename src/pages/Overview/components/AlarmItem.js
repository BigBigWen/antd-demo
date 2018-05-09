import React from 'react';
import { Link } from 'react-router-dom';
import { TableEventTypeOptions } from 'constants/options';
import EditAuth from 'components/EditAuth/EditAuth';
import { TICKET_WRITE, ALARM_WRITE } from 'constants/authority';
import API from 'rest/Overview';
const { readRecord, postRecordDisappear, generateTicket } = API;

const AlarmLevel = [
  { label: '预警', value: 1, style: 'first' },
  { label: '报警', value: 2, style: 'second' },
  { label: '故障', value: 3, style: 'third' }
];

class ScrollAlarm extends React.Component {
  generateTicketFun = (key, pair, site) => {
    generateTicket(key, pair, site);
    readRecord(key, pair, site);
  };
  render() {
    const { data } = this.props;
    return (
      <div className="alarm-item">
        <div className="alarm-head">
          <div
            className={`level ${
              (AlarmLevel.find(item => item.value === data.level) || {}).style
            }`}
          >
            {(AlarmLevel.find(item => item.value === data.level) || {}).label}
          </div>
          <div className="time">{data.time}</div>
        </div>
        <div className="alarm-name">
          {
            (
              TableEventTypeOptions.find(
                item => item.value === data.eventType
              ) || {}
            ).label
          }
        </div>
        <div className="project-name">{data.projectName}</div>
        <div className="operation">
          <div className="info">
            <div
              className="info-name"
              style={{ width: data.circuitName ? '50%' : '100%' }}
            >
              {data.siteName}
            </div>
            {!!data.circuitName && (
              <div className="info-name">{data.circuitName}</div>
            )}
          </div>
          <div className="btns">
            {data.ticketId ? (
              <Link to="/personal-center" className="check-ticket">
                查看工单
              </Link>
            ) : (
              <EditAuth auth={TICKET_WRITE}>
                <div
                  className="create-ticket"
                  onClick={() =>
                    this.generateTicketFun(data.key, data.pair, data.siteId)
                  }
                >
                  生成工单
                </div>
              </EditAuth>
            )}
            <EditAuth auth={ALARM_WRITE}>
              <div
                className="alarm-read"
                onClick={() => readRecord(data.key, data.pair, data.siteId)}
              >
                确定
              </div>
            </EditAuth>
          </div>
        </div>
      </div>
    );
  }
}
export default ScrollAlarm;
