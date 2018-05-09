import React from 'react';
import { isEqual } from 'lodash';
import { connect } from 'react-redux';
import { Form } from 'antd';
import moment from 'moment';
import Header from './DetailListHeader';
import Item from './DetailListItem';
import {
  repairStatusSteps,
  repairClosedSteps,
  alertTypes
} from 'constants/ticketConfig';
import Steps from './TicketSteps';
import StepItem from './TicketStepHorItem';
import ProcedureItem from './TicketStepVerItem';
import CommentForm from './TicketComment';
import CustomTextarea from './CustomTextarea';
import AssignList from './AssignList';
import './TicketDetail.less';
import {
  createTicketSteps,
  createTicketHistories,
  displayText,
  spaceCheck
} from '../lib';
import store from 'store/index';
import { postRepairSupplement } from 'rest/api/Ticket';

const FormItem = Form.Item;

class TicketDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editable: false,
      comment: props.info.comment
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props.info, nextProps.info)) {
      if (
        nextProps.info.state === 'Closed' ||
        nextProps.info.state === 'Approved'
      ) {
        this.setState({
          editable: false,
          comment: nextProps.info.comment
        });
      } else {
        this.props.form.resetFields();
        this.setState({
          comment: nextProps.info.comment
        });
      }
    }
  }
  toggleEditable = () => {
    this.setState({ editable: !this.state.editable });
    if (this.state.editable) {
      this.submit();
    }
  };

  submit = () => {
    this.props.form.validateFields((error, value) => {
      if (!error) {
        postRepairSupplement(this.props.info.id, value).then(res => {
          this.setState({ comment: res.comment });
        });
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { info } = this.props;
    const detailData = info && info.id ? info : {};
    const alarmObj = alertTypes.find(i => i.id === detailData.alarmLevel);
    const alarmLevel = displayText(alarmObj ? alarmObj.name : '');
    const alarmTime = moment(detailData.alarmTime).format(
      'YYYY-MM-DD HH:mm:ss'
    );
    const project = detailData.project || {};
    const site = detailData.site || {};
    const siteName = displayText(site.name);
    const siteAddress = displayText(detailData.address);
    const contact = displayText(detailData.contact);
    const contactPhone = displayText(detailData.contactPhone);
    const updateTime = moment(detailData.updateTime).format(
      'YYYY-MM-DD HH:mm:ss'
    );
    const currentState = detailData.state;
    const wholeHistories = [
      ...(detailData.histories || []),
      { state: currentState, assignee: detailData.assignee }
    ].reverse();
    const histories = createTicketHistories(wholeHistories);

    const stepsTpl =
      currentState === 'Closed' ? repairClosedSteps : repairStatusSteps;

    const steps = createTicketSteps(stepsTpl)(wholeHistories);

    const { user } = store.getState();
    const { userId } = user;
    const assigneeId = (detailData.assignee || {}).id;
    const isMyTicket = () => {
      return userId === assigneeId;
    };
    const isLastStep = () => {
      return detailData.state === 'Closed' || detailData.state === 'Approved';
    };

    return (
      <div className="ticket-detail-list">
        <Header text={'工单内容'} />
        <Item label={'报警名称'} content={detailData.alarmName} />
        <Item label={'报警级别'} content={alarmLevel} />
        <Item label={'触发时间'} content={alarmTime} />
        <Item label={'触发数值'} content={displayText(detailData.value)} />
        <Item label={'关键点'} content={displayText(detailData.keyPoint)} />
        <Item label={'建议措施'} content={displayText(detailData.suggestion)} />
        <Header text={'工单信息'} />
        <Item
          label={'工单编号'}
          content={displayText(detailData.serialNumber)}
        />
        <Item label={'项目'} content={displayText(project.name)} />
        <Item label={'配电房'} content={siteName} />
        <Item label={'地址'} content={siteAddress} />
        <Item label={'联系人'} content={contact} />
        <Item label={'联系方式'} content={contactPhone} />
        <Item label={'生成时间'} content={updateTime} />
        <Header text={'工单状态'} />
        <div className="steps-wrapper">
          <Steps
            steps={steps}
            current={currentState}
            direction={'horizontal'}
            StepNode={StepItem}
          />
        </div>
        {histories.length !== 0 && (
          <div className="procedure-wrapper">
            <div className="label">当前流程</div>
            <div className="steps-wrapper">
              <Steps
                steps={histories}
                StepNode={ProcedureItem}
                direction={'vertical'}
              />
            </div>
          </div>
        )}
        <div>
          <Header
            text={`工单${
              isLastStep() || currentState === 'Executing' ? '反馈' : '备注'
            }`}
          />
          <CommentForm
            editable={this.state.editable}
            toggleEditable={this.toggleEditable}
            editBtn={isMyTicket() && isLastStep()}
          >
            {isMyTicket() && (this.state.editable || !isLastStep()) ? (
              <FormItem>
                {getFieldDecorator('comment', {
                  initialValue: isLastStep() ? this.state.comment : '',
                  rules: [
                    { required: true, message: '请输入工单反馈!' },
                    { pattern: spaceCheck, message: '请不要全部输入空格' }
                  ] //提示信息及placeholder待定
                })(
                  <CustomTextarea
                    rows={12}
                    maxLength={200}
                    placeholder="请输入工单反馈"
                    onChange={this.props.getComment}
                  />
                )}
              </FormItem>
            ) : (
              <div className="static-text">{this.state.comment}</div>
            )}
          </CommentForm>
        </div>
      </div>
    );
  }
}

export default Form.create()(TicketDetail);
