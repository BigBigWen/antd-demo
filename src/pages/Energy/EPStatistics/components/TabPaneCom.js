import React from 'react';
import { Row, Col, Select, Form, Radio, DatePicker, Button, Spin } from 'antd';
import moment from 'moment';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { isEqual } from 'lodash';
import DateSwitch from 'components/DateSwitch/ControlDateSwitch';
import { Chart } from 'Chart';
import YearSelect from 'components/DateSwitch/YearSelect';
import './TabPaneCom.less';
import { getChartOption } from '../lib';
import API from 'rest/Energy/EPStatistics';
import { changeTime } from 'lib/helper';
import NotFound from 'components/UI/NotFound';
import { notEmptyForChart } from 'lib/helper';
const { exportEP } = API;
const Option = Select.Option;
const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { MonthPicker } = DatePicker;

export class BaseProject extends React.Component {
  componentDidMount() {
    this.onSelectChange((this.props.projects[0] || {}).value);
  }
  componentWillReceiveProps(nextProps) {
    if (
      !isEqual(nextProps.projects, this.props.projects) &&
      nextProps.aggrLevel !== 'project'
    ) {
      this.onSelectChange(
        (nextProps.projects[0] || {}).value || this.props.aggrLevelKey
      );
    }
  }
  getDate = date => {
    changeTime(date, this.props.onFilterChange);
  };
  onSelectChange = value => {
    this.props.onFilterChange({ aggrLevelKey: value, aggrLevel: 'project' });
  };
  render() {
    const { query, tabsActiveKey, loading, chartData, projects } = this.props;
    return (
      <div className="page-ep-statistics-tabPaneCom-container">
        <div className="tittle-filter">
          <span className="name">用电量统计</span>
          <div className="select-container">
            <span className="select-name">统计项目</span>
            <Select
              value={query.aggrLevelKey}
              style={{ width: 190 }}
              onChange={this.onSelectChange}
            >
              {projects.map(project => (
                <Option key={project.value} value={project.value}>
                  {project.label}
                </Option>
              ))}
            </Select>
          </div>
          <DateSwitch
            btnGroup={['H', 'D', 'M', 'Y']}
            value={moment(query.tsStart, 'x')}
            selectBtn={query.aggrby}
            getDate={this.getDate}
          />
        </div>
        <div className="chart">
          {notEmptyForChart(chartData) ? (
            <Chart
              option={getChartOption(chartData, query)}
              style={{ width: 'calc(100% - 24px)' }}
            />
          ) : (
            <NotFound />
          )}
        </div>
      </div>
    );
  }
}
export class BaseGroup extends React.Component {
  getDate = date => {
    changeTime(date, this.props.onFilterChange);
  };
  render() {
    const { query, tabsActiveKey, loading, chartData, projects } = this.props;
    return (
      <div className="page-ep-statistics-tabPaneCom-container">
        <div className="tittle-filter">
          <span className="name">用电量统计</span>
          <DateSwitch
            btnGroup={['H', 'D', 'M', 'Y']}
            value={moment(query.tsStart, 'x')}
            selectBtn={query.aggrby}
            getDate={this.getDate}
          />
        </div>
        <div className="chart">
          {notEmptyForChart(chartData) ? (
            <Chart
              option={getChartOption(chartData, query)}
              style={{ width: 'calc(100% - 24px)' }}
            />
          ) : (
            <NotFound />
          )}
        </div>
      </div>
    );
  }
}

const report = [
  { label: '回路', value: 'circuit' },
  { label: '计费进线', value: 'mesurement' },
  { label: '项目', value: 'project' },
  { label: '公司', value: 'group' }
];
const dateModes = [
  { label: '按小时', mode: 'H', format: 'yyyy-mm-dd' },
  { label: '按日', mode: 'D', format: 'yyyy-mm' },
  { label: '按月', mode: 'M', format: 'yyyy' },
  { label: '按年', mode: 'Y', format: 'yyyy' }
];

const dateFormat = 'YYYY-MM-DD';
const monthFormat = 'YYYY-MM';

class TabPaneFormCom extends React.Component {
  state = {
    mode: 'H',
    loading: false
  };
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        this.setState({ loading: true });
        await exportEP({
          type: values.type,
          mode: values.mode,
          time: moment(values.time).valueOf(),
          groupId: this.props.groupId
        });
        this.setState({
          loading: false
        });
      }
    });
  };
  handleModeChange = e => {
    this.setState({
      mode: e.target.value
    });
  };
  getDatePicker = mode =>
    mode === 'H' ? (
      <DatePicker format={dateFormat} />
    ) : mode === 'D' ? (
      <MonthPicker format={monthFormat} />
    ) : mode === 'M' ? (
      <YearSelect />
    ) : (
      <div />
    );

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 2, offset: 8 },
      wrapperCol: { span: 5 }
    };
    const { mode, loading } = this.state;
    return (
      <div className="page-ep-statistics-tabPaneCom-container">
        <Spin spinning={loading}>
          <Form onSubmit={this.handleSubmit} style={{ paddingTop: '10%' }}>
            <FormItem {...formItemLayout} label="统计层级">
              {getFieldDecorator('type', {
                initialValue: 'circuit',
                rules: [{ required: true, message: '请选择统计层级!' }]
              })(
                <Select placeholder="请选择统计层级!">
                  {report.map(a => (
                    <Option key={a.value} value={a.value}>
                      {a.label}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
            <FormItem
              labelCol={{ span: 2, offset: 8 }}
              wrapperCol={{ span: 6 }}
              label="统计周期"
            >
              {getFieldDecorator('mode', {
                initialValue: 'H',
                rules: [{ required: true, message: '请选择统计周期!' }]
              })(
                <RadioGroup onChange={this.handleModeChange}>
                  {dateModes.map(date => (
                    <RadioButton key={date.mode} value={date.mode}>
                      {date.label}
                    </RadioButton>
                  ))}
                </RadioGroup>
              )}
            </FormItem>
            {(mode === 'H' || mode === 'D' || mode === 'M') && (
              <FormItem {...formItemLayout} label="选择日期">
                {getFieldDecorator('time', {
                  initialValue: moment(),
                  rules: [{ required: true, message: '请选择日期!' }]
                })(this.getDatePicker(mode))}
              </FormItem>
            )}
            <FormItem wrapperCol={{ span: 5, offset: 10 }}>
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: '100%' }}
              >
                生成报表
              </Button>
            </FormItem>
          </Form>
        </Spin>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  groupId: state.user.groupId
});

const mapDispatchToProps = dispatch => {
  return {};
};
export const TabPaneForm = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Form.create()(TabPaneFormCom))
);
