import React from 'react';
import {
  Button,
  Popconfirm,
  message,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Upload
} from 'antd';
import { deleteReport, addReport } from 'rest/api/Alarm';
import { ReportTypeOptions } from './const';
import moment from 'moment';
const FormItem = Form.Item;
const Option = Select.Option;
const { MonthPicker } = DatePicker;
const { TextArea } = Input;
import Oss from 'lib/oss';

export const ReportOperation = ({ record, loadData }) => {
  const deleteReportFun = id => {
    deleteReport(id).then(json => {
      loadData();
      message.success('删除成功');
    });
  };
  return (
    <Popconfirm
      title="确定删除吗?"
      onConfirm={() => deleteReportFun(record.id)}
    >
      <Button type="link" size="small" style={{ paddingLeft: '0px' }}>
        删除
      </Button>
    </Popconfirm>
  );
};

class AddReportCom extends React.Component {
  state = {
    visible: false,
    reportType: '0',
    fileList: []
  };
  onChangeType = value => {
    this.setState({
      reportType: value
    });
  };
  showModal = () => {
    this.setState({
      visible: true
    });
  };
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const form = {
          site: this.props.site,
          name: values.name,
          type: ReportTypeOptions.find(item => item.value === values.eventType)
            .label,
          reportTime: values.data
            ? moment(values.date).format('YYYY-MM-DD')
            : moment(new Date()).format('YYYY-MM-DD') //todo接口修改
        };
        values.eventType === '1'
          ? (form.content = values.content)
          : (form.url = this.state.url);

        addReport(form).then(json => {
          this.props.loadData();
          this.handleCancel();
          this.props.form.resetFields();
          this.setState({
            fileList: [],
            reportType: '0'
          });
        });
      }
    });
  };
  handleCancel = e => {
    this.setState({
      visible: false
    });
  };
  handleChange = info => {
    let fileList = info.fileList;
    fileList = fileList.slice(-2);
    fileList = fileList.map(file => {
      if (file.response) {
        file.url = file.response.url;
      }
      return file;
    });
    fileList = fileList.filter(file => {
      if (file.response) {
        return file.response.status === 'success';
      }
      return true;
    });
    if (fileList && fileList.length === 1) {
      this.setState({ fileList });
    }
  };
  onRemove = () => {
    this.setState({
      fileList: []
    });
  };
  beforeUpload = file => {
    const allowSize = 3000000;
    const isSizeAllowed = file.size <= allowSize;
    if (!isSizeAllowed) {
      message.error('上传pdf的大小不能超过3M!');
      this.setState({ fileList: [] });
    }
    return isSizeAllowed;
  };
  handleUpload = async ({ file, onProgress }) => {
    let returnFile = await Oss.upload({
      key: file.name + moment().format('x'),
      file: file,
      options: {
        progress: async percentage => {
          onProgress({ percent: percentage * 100 });
        }
      }
    });
    let url = await Oss.getFileUrl(file.name + moment().format('x'));
    let fileList = [
      {
        ...this.state.fileList,
        uid: returnFile.name,
        name: returnFile.name
      }
    ];
    this.setState({
      fileList,
      url
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const { reportType, fileList } = this.state;
    const props = {
      action: '',
      accept: '.pdf',
      onChange: this.handleChange,
      onRemove: this.onRemove,
      beforeUpload: this.beforeUpload,
      customRequest: this.handleUpload
    };
    return (
      <div>
        <Button type="primary" onClick={this.showModal}>
          添加报告
        </Button>
        <Modal
          title="添加报告"
          visible={this.state.visible}
          onOk={this.handleSubmit}
          onCancel={this.handleCancel}
        >
          <Form onSubmit={this.handleSubmit}>
            <FormItem {...formItemLayout} label="报告名称">
              {getFieldDecorator('name', {
                rules: [{ required: true, message: '请输入名称' }]
              })(<Input placeholder="请输入名称" />)}
            </FormItem>

            <FormItem {...formItemLayout} label="报告类型">
              {getFieldDecorator('eventType', {
                rules: [{ required: true, message: '请选择' }]
              })(
                <Select
                  placeholder="请选择报告类型"
                  onChange={this.onChangeType}
                >
                  {ReportTypeOptions.map(item => (
                    <Option key={item.value} value={item.value}>
                      {item.label}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
            {reportType === '1' && (
              <FormItem {...formItemLayout} label="报告月份">
                {getFieldDecorator('data', {
                  rules: [{ required: true, message: '请选择' }]
                })(
                  <MonthPicker
                    defaultValue={moment()}
                    format={'YYYY-MM'}
                    style={{ width: '100%' }}
                  />
                )}
              </FormItem>
            )}
            {reportType === '1' && (
              <FormItem {...formItemLayout} label="建议措施">
                {getFieldDecorator('content', {
                  rules: [{ required: true, message: '请输入建议措施' }]
                })(
                  <TextArea
                    placeholder="请输入隐患描述"
                    autosize={{ minRows: 4, maxRows: 6 }}
                  />
                )}
              </FormItem>
            )}
            {(reportType === '2' ||
              reportType === '3' ||
              reportType === '4') && (
              <FormItem {...formItemLayout} label="报告上传">
                {getFieldDecorator('file', {
                  rules: [{ required: true, message: '请输入名称' }]
                })(
                  <Upload {...props} fileList={fileList}>
                    <Button>请选择报告</Button>
                  </Upload>
                )}
              </FormItem>
            )}
          </Form>
        </Modal>
      </div>
    );
  }
}
export const AddReport = Form.create()(AddReportCom);
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
