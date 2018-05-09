import React from 'react';
import {
  Button,
  Popconfirm,
  Modal,
  Form,
  Input,
  Select,
  Cascader,
  DatePicker,
  message
} from 'antd';
import { Link } from 'react-router-dom';
import EditAuth from 'components/EditAuth/EditAuth';
import { TICKET_WRITE, MANUAL_ALARM_WRITE } from 'constants/authority';
import {
  delSuggestion,
  postRecordDisappear,
  postRecord,
  postSuggestion
} from 'rest/api/Alarm';
import { generateTicket } from 'rest/api/Ticket';
import { TableEventTypeOptions } from 'constants/options';
import { loadProjectSiteCircuitTree } from 'rest/api/Tree';
import moment from 'moment';
const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;

const Fragment = React.Fragment;

export class SafetyHazardOperation extends React.Component {
  state = { loading: false };
  generateTicketFunc = (key, pair, site) => {
    this.setState({
      loading: true
    });
    generateTicket(key, pair, site).then(json => {
      this.props.loadData();
      this.setState({ loading: false });
    });
  };
  render() {
    const { record, loadData } = this.props;
    const { loading } = this.state;
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
          ) : !record.disappearRecordTime ? (
            <EditAuth auth={TICKET_WRITE}>
              <Button
                type="primary"
                onClick={() =>
                  this.generateTicketFunc(record.key, record.pair, record.site)
                }
                loading={loading}
              >
                {'生成工单'}
              </Button>
            </EditAuth>
          ) : null}
        </div>
        <div className="btn-wrapper lg">
          {record.disappearRecordTime ? (
            <Button type="link" disabled>
              已恢复
            </Button>
          ) : (
            <EditAuth auth={MANUAL_ALARM_WRITE}>
              <Button
                type="danger"
                onClick={() =>
                  postRecordDisappear(record.key, record.pair, record.site)
                }
              >
                确认恢复
              </Button>
            </EditAuth>
          )}
        </div>
      </Fragment>
    );
  }
}

export const MeasuresOperation = ({ record, loadData }) => {
  const delSuggestionFun = id => {
    delSuggestion(id).then(json => {
      loadData();
      message.success('删除成功');
    });
  };
  return (
    <EditAuth auth={MANUAL_ALARM_WRITE}>
      <Popconfirm
        title="确定删除这条建议措施吗?"
        placement="topLeft"
        onConfirm={() => delSuggestionFun(record.id)}
      >
        <div className="btn-wrapper">
          <Button type="link" size="small" style={{ paddingLeft: 0 }}>
            删除
          </Button>
        </div>
      </Popconfirm>
    </EditAuth>
  );
};

class AddSafetyHazardModalCom extends React.Component {
  state = {
    visible: false,
    circuitOptions: []
  };
  componentDidMount() {
    this.getCircuitOption();
  }
  getCircuitOption = async () => {
    this.setState({
      circuitOptions: await loadProjectSiteCircuitTree()
    });
  };
  showModal = () => {
    this.setState({
      visible: true
    });
  };
  handleSubmit = e => {
    e.preventDefault();
    const {
      validateFieldsAndScroll,
      getFieldsValue,
      resetFields
    } = this.props.form;
    validateFieldsAndScroll((err, values) => {
      if (!err) {
        postRecord({
          name: values.name,
          description: values.description,
          eventType: values.eventType,
          project: values.circuitStr[0],
          site: values.circuitStr[1],
          circuit: values.circuitStr[2]
        }).then(json => {
          this.props.loadData();
          this.handleCancel();
          this.props.form.resetFields();
        });
      }
    });
  };
  handleCancel = e => {
    this.setState({
      visible: false
    });
  };
  siteRequired = (rule, val, callback) => {
    const result =
      val instanceof Array
        ? val.length >= 2
        : val !== undefined && val !== null && val !== '';
    if (!result) {
      callback('至少选择到配电房');
    }
    callback();
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { circuitOptions } = this.state;
    return (
      <div>
        <Button type="primary" onClick={this.showModal}>
          新增隐患
        </Button>
        <Modal
          title="新增安全隐患"
          visible={this.state.visible}
          onOk={this.handleSubmit}
          onCancel={this.handleCancel}
        >
          <Form onSubmit={this.handleSubmit}>
            <FormItem {...formItemLayout} label="隐患名称">
              {getFieldDecorator('name', {
                rules: [{ required: true, message: '请输入名称' }]
              })(<Input placeholder="请输入名称" />)}
            </FormItem>

            <FormItem {...formItemLayout} label="隐患类型">
              {getFieldDecorator('eventType', {
                rules: [{ required: true, message: '请输入名称' }]
              })(
                <Select placeholder="请选择隐患类型">
                  {TableEventTypeOptions.map(item => (
                    <Option key={item.value} value={item.value}>
                      {item.label}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="所属回路">
              {getFieldDecorator('circuitStr', {
                rules: [
                  { required: true, message: '请输入名称' },
                  { validator: this.siteRequired }
                ]
              })(
                <Cascader
                  expandTrigger="hover"
                  changeOnSelect
                  options={[...circuitOptions]}
                  placeholder="请选择回路"
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="隐患描述">
              {getFieldDecorator('description', {
                rules: [{ required: true, message: '请输入隐患描述' }]
              })(
                <TextArea
                  placeholder="请输入隐患描述"
                  autosize={{ minRows: 4, maxRows: 6 }}
                />
              )}
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
}
export const AddSafetyHazardModal = Form.create()(AddSafetyHazardModalCom);
class AddMeasuresModalCom extends React.Component {
  state = {
    visible: false,
    circuitOptions: []
  };
  componentDidMount() {
    this.getCircuitOption();
  }
  getCircuitOption = async () => {
    this.setState({
      circuitOptions: await loadProjectSiteCircuitTree()
    });
  };
  showModal = () => {
    this.setState({
      visible: true
    });
  };
  handleCancel = e => {
    this.setState({
      visible: false
    });
  };
  siteRequired = (rule, val, callback) => {
    const result =
      val instanceof Array
        ? val.length >= 2
        : val !== undefined && val !== null && val !== '';
    if (!result) {
      callback('至少选择到配电房');
    }
    callback();
  };
  handleSubmit = e => {
    e.preventDefault();
    const {
      validateFieldsAndScroll,
      getFieldsValue,
      resetFields
    } = this.props.form;
    validateFieldsAndScroll((err, values) => {
      if (!err) {
        postSuggestion({
          type: values.name,
          description: values.description,
          time: moment(values.time).format('YYYY-MM-DD HH:mm:ss'),
          site: values.circuitStr[1],
          circuit: values.circuitStr[2]
        }).then(json => {
          this.props.loadData();
          this.handleCancel();
          this.props.form.resetFields();
        });
      }
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const { circuitOptions } = this.state;
    return (
      <div>
        <Button type="primary" onClick={this.showModal}>
          新增建议
        </Button>
        <Modal
          title="新增建议措施"
          visible={this.state.visible}
          onOk={this.handleSubmit}
          onCancel={this.handleCancel}
        >
          <Form onSubmit={this.handleSubmit}>
            <FormItem {...formItemLayout} label="建议名称">
              {getFieldDecorator('name', {
                rules: [{ required: true, message: '请输入名称' }]
              })(<Input placeholder="请输入名称" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="生成时间">
              {getFieldDecorator('time', {
                initialValue: moment(),
                rules: [{ required: true, message: '请选择生成时间' }]
              })(
                <DatePicker
                  showTime
                  format={'YYYY-MM-DD HH:mm:ss'}
                  style={{ width: '100%' }}
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="所属回路">
              {getFieldDecorator('circuitStr', {
                rules: [
                  { required: true, message: '请输入名称' },
                  { validator: this.siteRequired }
                ]
              })(
                <Cascader
                  changeOnSelect
                  options={[...circuitOptions]}
                  placeholder="请选择回路"
                  expandTrigger="hover"
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="建议描述">
              {getFieldDecorator('description', {
                rules: [{ required: true, message: '请输入建议描述' }]
              })(
                <TextArea
                  placeholder="请输入建议描述"
                  autosize={{ minRows: 4, maxRows: 6 }}
                />
              )}
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
}

export const AddMeasuresModal = Form.create()(AddMeasuresModalCom);

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 }
  }
};
