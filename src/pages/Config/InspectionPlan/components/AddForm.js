import React from 'react';
import moment from 'moment';
import { isNil } from 'lodash';
import { Form, Input, Select, DatePicker, Button } from 'antd';
import Period from './Period';
import { spaceCheck } from 'constants/const';
import { timeStamp } from 'lib/helper';

const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;

const FORM_LAYOUT = {
  labelCol: {
    sm: { span: 6, offset: 2 }
  },
  wrapperCol: {
    sm: { span: 12 }
  }
};

class PlanForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: (props.cascaderData || []).map(item => ({
        label: item.label,
        value: item.value
      })),
      sites: [],
      startTime: moment().startOf('day'),
      endTime: moment().add(1000, 'year')
    };
    this.cascaderData = props.cascaderData || [];
    this.submit = this.submit.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      projects: (nextProps.cascaderData || []).map(item => ({
        label: item.label,
        value: item.value
      }))
    });
    this.cascaderData = nextProps.cascaderData;
  }

  disabledStartTime = current => {
    const { endTime } = this.state;
    return (
      current <
        moment()
          .add(-1, 'day')
          .endOf('day') || current > endTime
    );
  };

  disabledEndTime = current => {
    const { startTime } = this.state;
    return (
      (current && current < moment().startOf('day')) || current < startTime
    );
  };

  submit() {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const callback = () => this.props.form.resetFields();
        const formData = Object.assign(
          {},
          { ...values },
          {
            firstTime: timeStamp(moment(values.firstTime).startOf('day')),
            validateTime: timeStamp(moment(values.validateTime).endOf('day')),
            period: values.period.value,
            unit: values.period.unit
          }
        );
        this.props.onSubmit(formData, callback);
      }
    });
  }

  onCancel = () => {
    this.props.form.resetFields();
    this.props.onCancel();
  };
  validator = (rule, value, callback) => {
    if (value.value > 9999) {
      callback('请输入不超过9999');
    } else if (value.value === '') {
      callback('请填写间隔周期');
    }
    callback();
  };

  onProjectChange = val => {
    const result =
      this.cascaderData.find(project => project.value === val) || {};
    const sites = result.children || [];
    this.setState({ sites });
    this.props.form.setFieldsValue({ siteId: '' });
  };

  handleFirstDateChange = val => {
    if (val === null) {
      this.setState({
        startTime: moment().startOf('day')
      });
    } else {
      this.setState({
        startTime: val
      });
    }
  };

  handleEndDateChange = val => {
    if (val === null) {
      this.setState({
        endTime: moment().add(1000, 'year')
      });
    } else {
      this.setState({
        endTime: val
      });
    }
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { projects, sites } = this.state;
    return (
      <Form>
        <FormItem {...FORM_LAYOUT} label="巡检计划名称">
          {getFieldDecorator('name', {
            rules: [
              { required: true, message: '请填写计划名称' },
              { max: 30, message: '请输入不超过30字' },
              { pattern: spaceCheck, message: '请不要全部输入空格' }
            ]
          })(<Input />)}
        </FormItem>
        <FormItem {...FORM_LAYOUT} label="所属项目">
          {getFieldDecorator('projectId', {
            rules: [{ required: true, message: '请选择项目' }]
          })(
            <Select onChange={this.onProjectChange}>
              {projects.map((p, index) => (
                <Option key={index} value={p.value}>
                  {p.label}
                </Option>
              ))}
            </Select>
          )}
        </FormItem>
        <FormItem {...FORM_LAYOUT} label="所属配电房">
          {getFieldDecorator('siteId', {
            rules: [{ required: true, message: '请选择配电房' }]
          })(
            <Select
              disabled={isNil(this.props.form.getFieldValue('projectId'))}
            >
              {sites.map((p, index) => (
                <Option key={index} value={p.value}>
                  {p.label}
                </Option>
              ))}
            </Select>
          )}
        </FormItem>
        <FormItem {...FORM_LAYOUT} label="巡检内容">
          {getFieldDecorator('content', {
            rules: [
              { required: true, message: '请填写巡检内容' },
              { max: 500, message: '请输入不超过500字' },
              { pattern: spaceCheck, message: '请不要全部输入空格' }
            ]
          })(<TextArea rows={3} />)}
        </FormItem>
        <FormItem {...FORM_LAYOUT} label="首次巡检日期">
          {getFieldDecorator('firstTime', {
            rules: [{ required: true, message: '请选择首次巡检日期' }]
          })(
            <DatePicker
              disabledDate={this.disabledStartTime}
              onChange={this.handleFirstDateChange}
            />
          )}
        </FormItem>
        <FormItem {...FORM_LAYOUT} label="服务有效日期">
          {getFieldDecorator('validateTime', {
            rules: [{ required: true, message: '请选择服务有效日期' }]
          })(
            <DatePicker
              disabledDate={this.disabledEndTime}
              onChange={this.handleEndDateChange}
            />
          )}
        </FormItem>
        <FormItem {...FORM_LAYOUT} label="巡检间隔周期">
          {getFieldDecorator('period', {
            initialValue: { value: 1, unit: 'DAY' },
            rules: [{ validator: this.validator }]
          })(<Period />)}
        </FormItem>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            paddingBottom: 16
          }}
        >
          <Button
            type="primary"
            style={{ marginRight: '40px' }}
            onClick={this.submit}
          >
            保存
          </Button>
          <Button onClick={this.onCancel}>取消</Button>
        </div>
      </Form>
    );
  }
}

export default Form.create()(PlanForm);
