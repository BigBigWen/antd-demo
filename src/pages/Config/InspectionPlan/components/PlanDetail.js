import React from 'react';
import moment from 'moment';
import { Form, Input, Button, Icon, DatePicker, Modal } from 'antd';
import { dateLabel } from 'lib/helper';
import { dateUnitDict, spaceCheck } from 'constants/const';
import PlanProgress from './PlanProgress';
import Header from './DetailListHeader';
import Item from './DetailListItem';
import './PlanDetail.less';

const FormItem = Form.Item;
const { TextArea } = Input;
const baseModalStyle = {
  textAlign: 'center',
  fontSize: 16,
  fontWeight: 'bold'
};

const planButton = {
  ACTIVE: [
    {
      label: '停止巡检计划',
      type: 'danger',
      action: 'shutDown'
    }
  ],
  INACTIVE: [
    {
      label: '启动',
      type: 'primary',
      action: 'reStart'
    },
    {
      label: '已关闭',
      type: 'default',
      disabled: true
    }
  ]
};

const FORM_LAYOUT = {
  wrapperCol: {
    style: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      flex: '1 1 auto'
    }
  },
  labelCol: {
    style: {
      display: 'flex',
      flex: '0 0 auto',
      width: '130px',
      textAlign: 'right'
    }
  }
};

class PlanDetail extends React.Component {
  state = {
    editable: false,
    previewVisible: false,
    previewImage: '',
    fileList: [],
    showShutDownModal: false,
    showRestartModal: false
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.data && nextProps.data.id !== this.props.data.id) {
      this.setState({ editable: false });
    }
  }

  toggleEditable = () => {
    this.setState({ editable: !this.state.editable });
  };

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true
    });
  };

  handleChange = ({ fileList }) => this.setState({ fileList });

  handleSubmit = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const formData = Object.assign(
          {},
          { ...this.props.data },
          { ...values },
          {
            validateTime: moment(values.validateTime)
              .endOf('day')
              .format('x')
          }
        );
        this.props.onSubmit(formData);
        this.setState({ editable: false });
      }
    });
  };

  handleshutDown = id => {
    this.props.handleShutDown(id);
    this.setState({
      showShutDownModal: false
    });
  };
  handleRestart = id => {
    this.props.handleRestart(id);
    this.setState({
      showRestartModal: false
    });
  };

  showShutDownModal = () => {
    this.setState({
      showShutDownModal: true
    });
  };
  showRestartModal = () => {
    this.setState({
      showRestartModal: true
    });
  };

  disabledStartTime = current => {
    return (
      moment(current).format('x') < this.props.data.firstTime ||
      moment(current).format('x') <=
        moment()
          .subtract(1, 'days')
          .endOf('day')
          .format('x')
    );
  };

  handleCancel = () => {
    this.setState({
      showShutDownModal: false
    });
  };

  handleRestartCancel = () => {
    this.setState({
      showRestartModal: false
    });
  };

  render() {
    const { editable } = this.state;
    const { data, height } = this.props;
    const { getFieldDecorator } = this.props.form;
    const validData = data && data.id;
    const currentState = data.state || 'CLOSED';
    const project = data.project || {};
    const site = data.site || {};
    const tickets = data.tickets || [];

    const invalidValidateTime = (rule, value, callback) => {
      if (this.disabledStartTime(value)) {
        callback(new Error('请选择不早于首次巡检日期和今日的日期'));
      } else {
        callback();
      }
    };
    return (
      <div className="plan-detail" style={{ height: height }}>
        <div className="title">
          <span>巡检计划详情</span>
          {validData && (
            <span>
              <Icon
                style={{
                  cursor: 'pointer',
                  color: '#4bb2d8',
                  fontSize: 18
                }}
                type="edit"
                onClick={() => {
                  this.setState({ editable: true });
                }}
              />
            </span>
          )}
        </div>
        {validData ? (
          <div className="ticket-detail-list">
            <Form>
              <Header text={'巡检内容'} />
              <FormItem {...FORM_LAYOUT} label={'巡检内容'}>
                {editable ? (
                  getFieldDecorator('content', {
                    initialValue: data.content,
                    rules: [
                      { required: true, message: '请填写巡检内容' },
                      { max: 500, message: '请输入不超过500字' },
                      { pattern: spaceCheck, message: '请不要全部输入空格' }
                    ]
                  })(<TextArea autosize />)
                ) : (
                  <span className="ticket-detail-list-text">
                    {data.content}
                  </span>
                )}
              </FormItem>
              <Header text={'巡检信息'} />
              <FormItem {...FORM_LAYOUT} label={'巡检计划名称'}>
                {editable ? (
                  getFieldDecorator('name', {
                    initialValue: data.name,
                    rules: [
                      {
                        required: true,
                        message: '请输入巡检信息'
                      },
                      { max: 30, message: '请输入不超过30字' },
                      { pattern: spaceCheck, message: '请不要全部输入空格' }
                    ]
                  })(<Input />)
                ) : (
                  <span className="ticket-detail-list-text">{data.name}</span>
                )}
              </FormItem>
              <FormItem {...FORM_LAYOUT} label={'项目'}>
                <span className="ticket-detail-list-text">{project.name}</span>
              </FormItem>
              <FormItem {...FORM_LAYOUT} label={'配电房'}>
                <span className="ticket-detail-list-text">{site.name}</span>
              </FormItem>
              <FormItem {...FORM_LAYOUT} label={'首次巡检日期'}>
                <span className="ticket-detail-list-text">
                  {dateLabel(data.firstTime, 'YYYY-MM-DD')}
                </span>
              </FormItem>
              <FormItem {...FORM_LAYOUT} label="服务有效日期">
                {editable ? (
                  getFieldDecorator('validateTime', {
                    rules: [
                      {
                        required: true,
                        message: '请选择服务有效日期'
                      },
                      { validator: invalidValidateTime }
                    ],
                    initialValue: moment(data.validateTime)
                  })(<DatePicker disabledDate={this.disabledStartTime} />)
                ) : (
                  <span className="ticket-detail-list-text">
                    {dateLabel(data.validateTime, 'YYYY-MM-DD')}
                  </span>
                )}
              </FormItem>
              <FormItem {...FORM_LAYOUT} label={'巡检周期间隔'}>
                <span className="ticket-detail-list-text">
                  {data.period + dateUnitDict[data.unit]}
                </span>
              </FormItem>
              <FormItem {...FORM_LAYOUT} label={'已巡检次数'}>
                <span className="ticket-detail-list-text">{data.count}次</span>
              </FormItem>
              {!!tickets.length && <Header text={'巡检进度'} />}
              {!!tickets.length && <PlanProgress tickets={tickets} />}
              <div className="plan-button">
                {editable ? (
                  <div>
                    <Button
                      type="primary"
                      onClick={this.handleSubmit}
                      style={{ marginRight: '20px' }}
                    >
                      保存
                    </Button>
                    <Button
                      onClick={() =>
                        this.setState({
                          editable: false
                        })
                      }
                    >
                      取消
                    </Button>
                  </div>
                ) : (
                  (planButton[currentState] || []).map(btn => (
                    <Button
                      key={btn.label}
                      type={btn.type}
                      disabled={
                        !!btn.disabled ||
                        moment().format('x') > data.validateTime
                      }
                      style={{ marginRight: '20px' }}
                      onClick={
                        btn.action === 'shutDown'
                          ? this.showShutDownModal
                          : this.showRestartModal
                      }
                    >
                      {btn.label}
                    </Button>
                  ))
                )}
              </div>
            </Form>
          </div>
        ) : (
          <div className="empty-info" />
        )}
        <Modal
          visible={this.state.showShutDownModal}
          onCancel={this.handleCancel}
          closable={false}
          footer={
            <div>
              <Button onClick={this.handleCancel}>取消</Button>
              <Button
                type="danger"
                onClick={() => this.handleshutDown(data.id)}
              >
                确定终止
              </Button>
            </div>
          }
        >
          <p style={{ ...baseModalStyle, marginTop: 25 }}>
            是否终止该巡检计划？
          </p>
          <p style={baseModalStyle}>若终止计划，则从今日起，不再生产巡检工单</p>
        </Modal>
        <Modal
          visible={this.state.showRestartModal}
          onCancel={this.handleRestartCancel}
          closable={false}
          footer={
            <div>
              <Button onClick={this.handleRestartCancel}>取消</Button>
              <Button
                type="primary"
                onClick={() => this.handleRestart(data.id)}
              >
                执行
              </Button>
            </div>
          }
        >
          <p
            style={{
              ...baseModalStyle,
              marginLeft: 0,
              textAlign: 'center',
              marginTop: 25
            }}
          >
            是否执行该巡检计划？
          </p>
        </Modal>
      </div>
    );
  }
}

export default Form.create()(PlanDetail);
