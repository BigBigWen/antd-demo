import React from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { isEqual, sortBy, findIndex } from 'lodash';
import { Tooltip, Button } from 'antd';
import moment from 'moment';
import store from 'store/index';

import { inRange } from '../lib';
import { CHARGE_AGENT, YARDMAN_AGENT } from 'constants/userType';
import './Calendar.less';

const MANAGER_AUTH = CHARGE_AGENT;
const YARMAN_AUTH = YARDMAN_AGENT;

const weekdayArr = [
  '星期日',
  '星期一',
  '星期二',
  '星期三',
  '星期四',
  '星期五',
  '星期六'
];
let today = new Date();
let year = today.getFullYear(),
  month = today.getMonth(),
  date = today.getDate();
let firstDay = new Date(year, month, 1);
let dayOfWeek = firstDay.getDay();

class Calendar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showTable: true,
      calendar: this.renderCalendar(year, month, props.data),
      selected: findIndex(
        this.renderCalendar(year, month, props.data),
        p => moment().format('YYYY-M-DD') === `${year}-${month + 1}-${p.date}`
      )
    };
    this.onClickDetail = this.onClickDetail.bind(this);
  }

  componentDidMount() {
    const { selected } = this.state;
    this.props.onSelectDate(selected);
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props.data, nextProps.data)) {
      this.setState({
        calendar: this.renderCalendar(year, month, nextProps.data)
      });
    }
  }

  isLeapYear = year => {
    return year % 4 === 0
      ? year % 100 !== 0 ? 1 : year % 400 === 0 ? 1 : 0
      : 0;
  };

  renderCalendar = (year, month, data) => {
    let firstDay = new Date(year, month, 1);
    let dayOfWeek = firstDay.getDay();
    let month_day_arr = [
      31,
      28 + this.isLeapYear(year),
      31,
      30,
      31,
      30,
      31,
      31,
      30,
      31,
      30,
      31
    ];
    let row_num = Math.ceil((dayOfWeek + month_day_arr[month]) / 7);
    let calendar = [];
    for (let i = 1; i <= row_num * 7; i++) {
      const dutyManager = data[i - dayOfWeek]
        ? sortBy(data[i - dayOfWeek].filter(p => p.type === MANAGER_AUTH), [
            p => p.fromMinute,
            p => p.toMinute,
            p => p.user.createTime
          ])[0].user.name
        : '';
      const dutyYardman = data[i - dayOfWeek]
        ? sortBy(data[i - dayOfWeek].filter(p => p.type === YARMAN_AUTH), [
            p => p.fromMinute,
            p => p.toMinute,
            p => p.user.createTime
          ])[0].user.name
        : '';
      if (i <= dayOfWeek || i - dayOfWeek > month_day_arr[month]) {
        calendar.push({ date: '', duty: [], dutyManager: '', dutyYardman: '' });
      } else if (i - dayOfWeek >= 10) {
        calendar.push({
          date: i - dayOfWeek,
          duty: sortBy(data[i - dayOfWeek], p => p.fromMinute) || [],
          dutyManager,
          dutyYardman
        });
      } else {
        calendar.push({
          date: '0' + (i - dayOfWeek),
          duty: sortBy(data[i - dayOfWeek], p => p.fromMinute) || [],
          dutyManager,
          dutyYardman
        });
      }
    }
    return calendar;
  };

  handleLastClick = () => {
    if (month <= 0) {
      month = 12;
      year = year - 1;
    }
    month = month - 1;
    const startTime = moment(`${year}-${month + 1}`, 'YYYY-M')
      .startOf('month')
      .valueOf();
    const endTime = moment(`${year}-${month + 1}`, 'YYYY-M')
      .endOf('month')
      .valueOf();
    const callback = data =>
      this.setState({
        calendar: this.renderCalendar(year, month, data),
        selected: null
      });
    this.props.reloadData({ startTime, endTime }, callback);
  };

  handleNextClick = () => {
    month = month + 1;
    if (month >= 12) {
      year = year + 1;
      month = 0;
    }
    const startTime = moment(`${year}-${month + 1}`, 'YYYY-M')
      .startOf('month')
      .valueOf();
    const endTime = moment(`${year}-${month + 1}`, 'YYYY-M')
      .endOf('month')
      .valueOf();
    const callback = data =>
      this.setState({
        calendar: this.renderCalendar(year, month, data),
        selected: null
      });
    this.props.reloadData({ startTime, endTime }, callback);
  };

  onClickDetail(date, index) {
    this.setState({ selected: index });
    this.props.onSelectDate(date);
  }

  render() {
    const {} = this.props;
    const { selected } = this.state;
    const { user } = store.getState();
    const { userId } = user;

    return (
      <div className="calendar">
        <div className="calendar-content">
          <div className="calendar-head">
            {weekdayArr.map((item, index) => <div key={index}>{item}</div>)}
          </div>
          <div className="calendar-body">
            {this.state.calendar.map((item, index) => (
              <div
                className={classNames('calendar-day', {
                  'calendar-today':
                    moment().format('YYYY-M-DD') ===
                    `${year}-${month + 1}-${item.date}`,
                  'calendar-my-duty-day':
                    item.duty.some(p => p.user.id === userId) &&
                    selected !== index,
                  'calendar-selected': selected === index,
                  'calendar-new': inRange(
                    parseInt(item.date),
                    this.props.calendarRange
                  )
                })}
                key={index}
                onClick={() => this.onClickDetail(parseInt(item.date), index)}
              >
                <div
                  className={classNames(
                    'calendar-date',
                    {
                      'calendar-date-before-today': moment(
                        `${year}-${month + 1}-${item.date}`,
                        'YYYY-MM-DD'
                      ).isBefore(moment().add(-1, 'day'))
                    },
                    {
                      'calendar-date-after-today': !moment(
                        `${year}-${month + 1}-${item.date}`,
                        'YYYY-MM-DD'
                      ).isBefore(moment().add(-1, 'day'))
                    }
                  )}
                >
                  {item.date}
                </div>
                <div
                  className={classNames('calendar-info', {
                    'calendar-date-before-today': moment(
                      `${year}-${month + 1}-${item.date}`,
                      'YYYY-MM-DD'
                    ).isBefore(moment().add(-1, 'day'))
                  })}
                >
                  <div className="calendar-info-item">
                    <Tooltip placement="top" title={item.dutyManager}>
                      {item.dutyManager}
                    </Tooltip>
                  </div>
                  <div className="calendar-info-item">
                    <Tooltip placement="top" title={item.dutyYardman}>
                      {item.dutyYardman}
                    </Tooltip>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="select-btn">
          <Button className="prevMonth-btn" onClick={this.handleLastClick}>
            上月
          </Button>
          <Button
            className="nextMonth-btn"
            type="info"
            onClick={this.handleNextClick}
          >
            下月
          </Button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => {
  return {
    exportWorkHourSheet: () => dispatch(exportWorkHourSheet())
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Calendar)
);
