import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { pick, isArray, isEqual } from 'lodash';
import { Form, Input, Select, Button, Cascader, DatePicker } from 'antd';
import moment from 'moment';
import BtnSelect from '../UI/BtnSelect';
import './Filters.less';

const FormItem = Form.Item;
const Search = Input.Search;
const Option = Select.Option;
const { RangePicker } = DatePicker;

const defaultWidth = 180;
const defaultMarginLeft = 15;

const getCascaderResult = (keys, arr) =>
  keys.reduce((prev, current, currentIndex) => {
    prev[current] = arr[currentIndex];
    return prev;
  }, {});

export default class Filters extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expand: false,
      configs: []
    };
  }

  componentDidMount() {
    const { query } = this.props;
    this.setState({
      configs: this.props.config.map((item, index) =>
        this.transConfigToForm(item, query)
      )
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.config) {
      const { query } = this.props;
      this.setState({
        configs: nextProps.config.map((item, index) =>
          this.transConfigToForm(item, query)
        )
      });
    }
    if (!isEqual(nextProps.query, this.props.query)) {
      const { config } = this.props;
      this.setState({
        configs: config.map((item, index) =>
          this.transConfigToForm(item, nextProps.query)
        )
      });
    }
  }

  onExpandChange = () => this.setState({ expand: !this.state.expand });

  // 将config每一项转换为对应的表单元素
  transConfigToForm = (config, query) => {
    const wrapperStyle = {
      ...config.wrapperStyle,
      marginLeft: (config.wrapperStyle || {}).marginLeft || defaultMarginLeft
    };
    const formItemStyle = {
      ...config.itemStyle,
      width: (config.itemStyle || {}).width || defaultWidth
    };
    const { onFilterChange } = this.props;
    let children = null;
    switch (config.type) {
      case 'Search':
        children = (
          <Search
            style={formItemStyle}
            defaultValue={query[config.key] || config.defaultValue || ''}
            placeholder={config.placeholder || '请输入'}
            onSearch={value => onFilterChange({ [config.key]: value })}
            onBlur={e => onFilterChange({ [config.key]: e.target.value })}
          />
        );
        break;
      case 'Select':
        children = (
          <Select
            value={query[config.key] || config.defaultValue}
            style={formItemStyle}
            placeholder={config.placeholder || '请选择'}
            defaultValue={config.defaultValue || ''}
            onSelect={val => onFilterChange({ [config.key]: val })}
          >
            {[...(config.options || [])].map(option => (
              <Option value={option.value} key={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        );
        break;
      case 'Cascader':
        children = (
          <Cascader
            value={
              Object.values(pick(query, config.key)).length
                ? Object.values(pick(query, config.key))
                : config.defaultValue
            }
            placeholder={config.placeholder || '请选择'}
            style={formItemStyle}
            expandTrigger="hover"
            changeOnSelect={config.changeOnSelect}
            options={config.options || []}
            defaultValue={config.defaultValue || []}
            onChange={val =>
              onFilterChange({ ...getCascaderResult(config.key, val) })
            }
          />
        );
        break;
      case 'DatePicker':
        children = (
          <DatePicker
            value={
              moment(query[config.key], 'x') || moment(config.defaultValue, 'x')
            }
            style={formItemStyle}
            placeholder={config.placeholder || '请选择时间'}
            defaultValue={moment(config.defaultValue)}
            showToday={false}
            onChange={date =>
              onFilterChange({ [config.key]: moment(date).format('x') })
            }
          />
        );
        break;
      case 'RangePicker':
        children = (
          <RangePicker
            value={
              query[config.key[0]]
                ? [
                    moment(query[config.key[0]], 'x'),
                    moment(query[config.key[1]], 'x')
                  ]
                : config.defaultValue
            }
            style={formItemStyle}
            placeholder={config.placeholder || ['开始日期', '截止日期']}
            defaultValue={(config.defaultValue || []).map(i => moment(i))}
            onChange={date =>
              onFilterChange({
                [config.key[0]]: moment(date[0]).format('x'),
                [config.key[1]]: moment(date[1]).format('x')
              })
            }
          />
        );
        break;
      case 'BtnSelect':
        children = (
          <BtnSelect
            value={pick(query, isArray(config.key) ? config.key : [config.key])}
            style={formItemStyle}
            defaultValue={config.defaultValue || null}
            options={config.options || []}
            onClick={val => onFilterChange(val)}
          />
        );
        break;
      default:
        children = null;
    }
    return (
      <FormItem
        key={`${Math.random()}`}
        className="filter-item"
        style={wrapperStyle}
        label={config.label || ''}
      >
        {children}
      </FormItem>
    );
  };

  render() {
    const { expandable, style } = this.props;
    const { expand, configs } = this.state;
    return (
      <div className="c-filters" id="filters">
        <Form className={`filter-form ${expand ? 'expand' : ''}`} style={style}>
          {configs}
        </Form>
        {expandable && (
          <div className="expand-btn">
            <a onClick={this.onExpandChange}>{expand ? '收起' : '更多'}</a>
          </div>
        )}
      </div>
    );
  }
}
