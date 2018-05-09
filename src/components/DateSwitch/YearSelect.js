import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input, Icon } from 'antd';
import './YearSelect.less';
import Trigger from 'rc-trigger';
import 'rc-trigger/assets/index.css';
import moment from 'moment';

class YearSelect extends Component {
  static defaultProps = {
    onChange: () => {},
    disabledDate: () => {
      return false;
    }
  };
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    disabledDate: PropTypes.func
  };
  constructor(props) {
    super(props);
    this.state = {
      allDate: undefined,
      currentYear: new Date().getFullYear(),
      currentShow: ''
    };
  }
  componentDidMount() {
    this.getYear(this.props.value.year() || new Date().getFullYear());
    this.setState({
      currentYear: this.props.value.year()
    });
  }

  getYear = year => {
    let yearArr = [];
    for (let i = 0; i <= 3; i++) {
      //制造当前展示的年份数据,等差数列 [3n-4,3n-3,3n-2]
      yearArr.push({
        value: [year + (3 * i - 4), year + (3 * i - 3), year + (3 * i - 2)]
      });
    }
    this.setState({
      allDate: yearArr,
      currentShow: `${year - 4}-${year + 7}`
    });
  };
  onPreChange = () => {
    this.getYear(parseInt(this.state.currentShow.slice(0, 4)) + 4 - 12);
  };
  onNextChange = () => {
    this.getYear(parseInt(this.state.currentShow.slice(0, 4)) + 4 + 12);
  };
  onClickToSelect = id => {
    let curYear;
    [...this.state.allDate].forEach(item =>
      item.value.forEach(a => (a === id ? (curYear = a) : null))
    );
    this.props.onChange(moment(curYear, 'YYYY').valueOf());
    this.setState({ currentYear: curYear });
    document.getElementById('selector').click();
  };
  render() {
    const { disabledDate } = this.props;
    const { currentYear, currentShow } = this.state;
    let arr = this.state.allDate || [];
    return (
      <div className="c-yearSelect ant-calendar-picker">
        <Trigger
          action={['click']}
          popupTransitionName="fade"
          popup={
            <div
              className="c-year-container"
              style={{
                width: '194px',
                fontSize: '12px',
                color: '#333',
                boxShadow: '0px 4px 9px 0 rgba(127, 127, 127, 0.24)',
                height: '210px',
                backgroundColor: '#fff'
              }}
            >
              <div
                style={{
                  height: '26px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid #dcdcdc',
                  padding: '0px 8px'
                }}
              >
                <a onClick={this.onPreChange}>
                  <Icon type="left" />
                </a>
                <span>{currentShow}</span>
                <a onClick={this.onNextChange}>
                  <Icon type="right" />
                </a>
              </div>
              <table style={{ width: '100%', borderCollapse: 'none' }}>
                <tbody>
                  {arr.map((item, index) => (
                    <tr
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0px 8px',
                        marginTop: '10px'
                      }}
                      key={index}
                    >
                      {item.value.map(a => (
                        <td
                          onClick={() => this.onClickToSelect(a)}
                          className="year-item"
                          style={{
                            backgroundColor: `${
                              disabledDate(a)
                                ? '#f5f5f5'
                                : a === currentYear ? '#ffd100' : ''
                            }`,
                            padding: '8px 10px',
                            cursor: `${
                              disabledDate(a) ? 'no-drop' : 'pointer'
                            }`,
                            color: `${disabledDate(a) ? '#dcdcdc' : ''}`
                          }}
                          key={a}
                        >
                          {a}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          }
          popupAlign={{
            points: ['tl', 'b1'],
            offset: [0, 3]
          }}
        >
          <Input
            ref={ele => {
              this.selector = ele;
            }}
            id="selector"
            className="yearInput"
            placeholder="请选择年份"
            defaultValue={currentYear}
            value={currentYear}
            suffix={
              <Icon type="calendar" style={{ color: 'rgba(0,0,0,.25)' }} />
            }
            readOnly
          />
        </Trigger>
      </div>
    );
  }
}

export default YearSelect;
