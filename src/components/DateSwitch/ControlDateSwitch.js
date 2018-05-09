import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { Button, DatePicker } from 'antd';
import './DateSwitch.less';
import moment from 'moment';
import YearSelect from './YearSelect';
const { MonthPicker } = DatePicker;

const dateFormat = 'YYYY-MM-DD';
const monthFormat = 'YYYY-MM';
const timeFormat = 'YYYY-MM-DD HH:mm:ss';
const AllYAer = 'allYear';
const btnName = {
  H: '按小时',
  D: '按日',
  M: '按月',
  Y: '按年'
};

export default class DateSwitch extends React.Component {
  static defaultProps = {
    disabledDate: () => {},
    btnGroup: ['H'],
    getDate: () => {}
  };
  static propTypes = {
    disabledDate: PropTypes.func,
    getDate: PropTypes.func
  };
  changeTab = type => {
    this.changeDate(
      type === 'Y' ? AllYAer : this.props.value || moment(),
      btnName[type]
    );
  };

  changeDate = (date, type) => {
    this.props.getDate({
      date: date === AllYAer ? date : moment(date).format('x'),
      interval: type
    });
  };
  render() {
    const {
      disabledDate,
      disabledDateYear,
      btnGroup,
      value,
      selectBtn
    } = this.props;
    return (
      <div className="c-date-switch">
        <div className="btnGroup-wrapper">
          {btnGroup.map(btn => (
            <Button
              className="dateBtn"
              onClick={() => this.changeTab(btn)}
              key={btn}
              type={selectBtn === btn ? 'primary' : 'default'}
            >
              {btnName[btn]}
            </Button>
          ))}
        </div>
        <div className="data-wrapper">
          {selectBtn !== 'Y' && <span>统计时间:&nbsp;&nbsp;&nbsp;</span>}
          {selectBtn === 'H' && (
            <DatePicker
              format={dateFormat}
              onChange={date => this.changeDate(date, '按小时')}
              allowClear={false}
              disabledDate={disabledDate || null}
              value={value}
            />
          )}
          {selectBtn === 'D' && (
            <MonthPicker
              format={monthFormat}
              onChange={date => this.changeDate(date, '按日')}
              allowClear={false}
              popupStyle={{ width: '194px', height: '210px' }}
              disabledDate={disabledDate || null}
              value={value}
            />
          )}
          {selectBtn === 'M' && (
            <YearSelect
              onChange={date => this.changeDate(date, '按月')}
              disabledDate={disabledDateYear || (() => {})}
              value={value}
            />
          )}
        </div>
      </div>
    );
  }
}
