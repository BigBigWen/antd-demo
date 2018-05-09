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
const AllYear = 'AllYears';

export default class DateSwitch extends React.Component {
  static defaultProps = {
    defaultValue: moment(),
    disabledDate: () => {},
    btnGroup: ['按小时'],
    defaultSelectBtn: '',
    getDate: () => {}
  };
  static propTypes = {
    disabledDate: PropTypes.func,
    defaultValue: PropTypes.instanceOf(moment),
    defaultSelectBtn: PropTypes.string,
    getDate: PropTypes.func
  };
  state = {
    defaultSelectBtn: this.props.defaultSelectBtn || [...this.props.btnGroup][0]
  };
  componentWillReceiveProps(nextProps) {
    if (nextProps.defaultSelectBtn !== this.props.defaultSelectBtn) {
      this.setState({
        defaultSelectBtn: nextProps.defaultSelectBtn
      });
    }
  }

  changeTab = type => {
    this.setState(
      {
        defaultSelectBtn: type
      },
      () => {
        this.changeDate(
          type === '按年' ? AllYear : this.props.defaultValue || moment()
        );
      }
    );
  };

  changeDate = date => {
    this.props.getDate({
      date: date === AllYear ? date : moment(date).format('x'),
      interval: this.state.defaultSelectBtn
    });
  };
  render() {
    const { defaultSelectBtn } = this.state;
    const {
      defaultValue,
      disabledDate,
      disabledDateYear,
      btnGroup
    } = this.props;
    return (
      <div className="c-date-switch">
        <div className="btnGroup-wrapper">
          {btnGroup.map(btn => (
            <Button
              className="dateBtn"
              onClick={() => this.changeTab(btn)}
              key={btn}
              type={defaultSelectBtn === btn ? 'primary' : 'default'}
            >
              {btn}
            </Button>
          ))}
        </div>
        <div className="data-wrapper">
          <span>统计时间:&nbsp;&nbsp;&nbsp;</span>
          {defaultSelectBtn === '按小时' && (
            <DatePicker
              defaultValue={defaultValue || moment()}
              format={dateFormat}
              onChange={this.changeDate}
              allowClear={false}
              disabledDate={disabledDate || null}
            />
          )}
          {defaultSelectBtn === '按日' && (
            <MonthPicker
              defaultValue={defaultValue || moment()}
              format={monthFormat}
              onChange={this.changeDate}
              allowClear={false}
              popupStyle={{ width: '194px', height: '210px' }}
              disabledDate={disabledDate || null}
            />
          )}
          {defaultSelectBtn === '按月' && (
            <YearSelect
              defaultValue={defaultValue || moment()}
              onChange={this.changeDate}
              disabledDate={disabledDateYear || null}
            />
          )}
        </div>
      </div>
    );
  }
}
