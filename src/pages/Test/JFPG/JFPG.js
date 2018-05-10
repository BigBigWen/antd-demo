import React from 'react';
import {
  Form,
  Radio,
  Input,
  InputNumber,
  Checkbox,
  Tooltip,
  Row,
  Col,
  DatePicker
} from 'antd';
import moment from 'moment';
const FormItem = Form.Item;
import './JFPGCom.less';

const RadioGroup = Radio.Group;
const { RangePicker } = DatePicker;

const intersect = (a, b) => new Set([...a].filter(x => b.has(x)));
const union = (a, b) => new Set([...a, ...b]);
const difference = (a, b) => new Set([...a].filter(x => !b.has(x)));
const isChild = (a, b) => [...b].every(x => a.has(x));

class JFPGComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      boundary: { start: null, end: null },
      hovering: new Set(),
      currentHover: { start: null, end: null },
      result: {
        jian: new Set(),
        feng: new Set(),
        ping: new Set(),
        gu: new Set()
      },
      currentType: 'jian'
    };
  }
  onCurrentTypeChange = e => {
    this.setState({ currentType: e.target.value });
  };
  onSeasonChange = e => {
    this.props.onSeasonChange(e.target.checked);
  };
  getClassName = id => {
    const { jian, feng, ping, gu } = this.state.result;
    if (jian.has(id)) {
      return 'jian';
    } else if (feng.has(id)) {
      return 'feng';
    } else if (ping.has(id)) {
      return 'ping';
    } else if (gu.has(id)) {
      return 'gu';
    } else {
      return 'default';
    }
  };
  onItemHover = value => {
    const { Price } = this.props;
    if (this.state.boundary.start !== null) {
      let [start, end] = Price.compareSize(value, this.state.boundary.start);
      this.setState({
        hovering: new Set(Price.getTimeArr(start, end))
      });
    }
  };
  onItemClick = value => {
    const { Price } = this.props;
    const { currentType, boundary, result } = this.state;
    if (currentType) {
      if (!boundary.start && boundary.start !== 0) {
        this.setState({ boundary: { start: value, end: null } });
      } else {
        this.setState(
          {
            result: Price.onEndItemClick(value, boundary, result, currentType),
            boundary: { start: null, end: null },
            hovering: new Set()
          },
          () => {
            console.log(this.state.result);
            this.props.handelChangeResult(this.state.result);
          }
        );
      }
    }
  };
  onChangeSummerTime = value => {
    this.setState({ summertime: value });
  };

  render() {
    const { boundary, hovering, summertime, currentType } = this.state;
    const { showSeason, season, Price } = this.props;
    const timeAxis = Price.getTimeAxis();
    return (
      <div>
        <div className="btn-wrapper">
          <RadioGroup
            onChange={this.onCurrentTypeChange}
            value={this.state.currentType}
          >
            <Radio value={'jian'} className="jian-radio">
              尖峰
            </Radio>
            <Radio value={'feng'} className="feng-radio">
              高峰
            </Radio>
            <Radio value={'ping'} className="ping-radio">
              平段
            </Radio>
            <Radio value={'gu'} className="gu-radio">
              低谷
            </Radio>
          </RadioGroup>
          {showSeason && (
            <Checkbox checked={season} onChange={this.onSeasonChange}>
              分季节
            </Checkbox>
          )}
        </div>
        <div className="bar-wrapper">
          {timeAxis.map(i => (
            <Tooltip title={i.label} key={i.value}>
              <div
                className={`time-item ${
                  Object.values(boundary).includes(i.value)
                    ? `${currentType}Marked`
                    : this.getClassName(i.value)
                } ${hovering.has(i.value) && `${currentType}Hovering`}`}
                onClick={() => this.onItemClick(i.value)}
                onMouseOver={() => this.onItemHover(i.value)}
              >
                {''}
              </div>
            </Tooltip>
          ))}
        </div>
      </div>
    );
  }
}
export default JFPGComponent;
