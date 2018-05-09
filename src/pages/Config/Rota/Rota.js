import React from 'react';
import classNames from 'classnames';
import { groupBy, isNil, isString, sortBy } from 'lodash';
import nzh from 'nzh';
import { withRouter } from 'react-router-dom';
import {
  Button,
  Form,
  Card,
  DatePicker,
  Select,
  Tooltip,
  Modal,
  Input
} from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import store from 'store/index';
moment.locale('zh-cn');

import {
  SUPER_AGENT,
  DATA_AGENT,
  YARDMAN_AGENT,
  CHARGE_AGENT
} from 'constants/userType';
import UserSelector from './components/UserSelector';
import Loading from 'components/Loading';
import Calendar from './components/Calendar';
import './Rota.less';
import { getUser } from 'rest/api/User';
import {
  getRotaPlan,
  generateRota,
  clearRota,
  getRota,
  changeRota
} from 'rest/api/Rota';

const nzhcn = nzh.cn;
const FormItem = Form.Item;
const TIPS = '生成值班表的起始日期从值班周期的哪一天开始值班';

const FORM_LAYOUT = {
  labelCol: { span: 9 },
  wrapperCol: { offset: 1, span: 14 }
};

const BUTTON_LAYOUT = {
  labelCol: { span: 0 },
  wrapperCol: { span: 10, offset: 10 }
};

const MANAGER_AUTH = CHARGE_AGENT;
const YARDMAN_AUTH = YARDMAN_AGENT;
const AUTH = [SUPER_AGENT, DATA_AGENT, YARDMAN_AGENT, CHARGE_AGENT];

const getTime = obj => {
  const addZero = num => {
    if (num >= 0 && num < 10) {
      return `0${num}`;
    }
    return num;
  };
  return `${addZero(obj.fromMinute / 60)}:00 ~ ${addZero(
    obj.toMinute / 60
  )}:00`;
};

class Rota extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showTable: true,
      showPeople: false,
      showConfirmModal: false,
      showDeleteModal: false,
      planData: [],
      onDutyManager: [],
      onDutyYardman: [],
      dutyData: null,
      dayIndexData: [],
      calendarRange: [],
      calendarDate: moment().format('YYYY-MM')
    };
    this.clearStartTime = moment()
      .add(1, 'day')
      .startOf('day')
      .valueOf();
    this.clearEndTime = moment()
      .endOf('month')
      .valueOf();
    this.onGenerateDuty = this.onGenerateDuty.bind(this);
    this.onClearDuty = this.onClearDuty.bind(this);
    this.reloadData = this.reloadData.bind(this);
    this.disabledEndTime = this.disabledEndTime.bind(this);
    this.disabledStartTime = this.disabledStartTime.bind(this);
    this.onPlanChange = this.onPlanChange.bind(this);
    this.onConfirm = this.onConfirm.bind(this);
    this.onSelectDate = this.onSelectDate.bind(this);
  }

  componentDidMount() {
    const startTime = moment()
      .startOf('month')
      .valueOf();
    const endTime = moment()
      .endOf('month')
      .valueOf();
    Promise.all([
      getRotaPlan(),
      getRota({ startTime, endTime }),
      getUser()
    ]).then(([planData, dutyData, userData]) => {
      const { user } = store.getState();
      const [match] = userData.content.filter(p => p.id === user.userId);
      const users = userData.content.filter(p => p.group.id === match.group.id);
      this.setState({
        planData,
        dutyData: groupBy(dutyData, p => p.date[2]),
        managers: users.filter(p => AUTH.includes(p.authority)),
        yardmans: users.filter(p => AUTH.includes(p.authority))
      });
    });
  }

  onGenerateDuty() {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const startTime = values.startTime.startOf('day').valueOf();
        const endTime = values.endTime.endOf('day').valueOf();
        this.setState({
          fromTime: values.startTime.format('YYYY-MM-DD'),
          toTime: values.endTime.format('YYYY-MM-DD')
        });
        values.startTime = startTime;
        values.endTime = endTime;
        const confirm = errorMsg => {
          this.setState({ showConfirmModal: true });
          return errorMsg;
        };
        generateRota(values, confirm).then(data => {
          if (!isString(data)) {
            getRota({
              startTime: moment(startTime)
                .startOf('month')
                .valueOf(),
              endTime: moment(endTime)
                .endOf('month')
                .valueOf()
            }).then(data => {
              this.setState({
                dutyData: groupBy(data, p => p.date[2]),
                calendarRange: [
                  parseInt(moment(startTime).format('DD')),
                  parseInt(moment(endTime).format('DD'))
                ]
              });
            });
          }
        });
      }
    });
  }

  onConfirm() {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const startTime = values.startTime.startOf('day').valueOf();
        const endTime = values.endTime.endOf('day').valueOf();
        values.startTime = startTime;
        values.endTime = endTime;
        values.overwrite = true;
        generateRota(values).then(() => {
          const callback = () =>
            getRota({
              startTime: moment(startTime)
                .startOf('month')
                .valueOf(),
              endTime: moment(endTime)
                .endOf('month')
                .valueOf()
            }).then(data => {
              this.setState({
                showConfirmModal: false,
                dutyData: groupBy(data, p => p.date[2]),
                calendarRange: [
                  parseInt(moment(startTime).format('DD')),
                  parseInt(moment(endTime).format('DD'))
                ]
              });
            });
          this.setState({ calendarRange: [] }, callback);
        });
      }
    });
  }

  onClearDuty() {
    const { calendarDate } = this.state;
    const startTime = moment(calendarDate, 'YYYY-MM')
      .startOf('month')
      .valueOf();
    const endTime = moment(calendarDate, 'YYYY-MM')
      .endOf('month')
      .valueOf();
    clearRota({
      startTime: this.clearStartTime,
      endTime: this.clearEndTime
    }).then(() => {
      getRota({ startTime, endTime }).then(data =>
        this.setState({
          showPeople: false,
          showDeleteModal: false,
          dutyData: groupBy(data, p => p.date[2]),
          calendarRange: []
        })
      );
    });
  }

  reloadData(timeData, callback) {
    getRota(timeData).then(data => {
      this.setState({
        calendarRange: [],
        showPeople: false,
        dutyData: groupBy(data, p => p.date[2]),
        calendarDate: moment(timeData.startTime).format('YYYY-MM')
      });
      this.clearStartTime = moment(timeData.startTime).isBefore(moment())
        ? moment()
            .add(1, 'day')
            .startOf('day')
            .valueOf()
        : moment(timeData.startTime)
            .startOf('month')
            .valueOf();
      this.clearEndTime = timeData.endTime;
      callback(groupBy(data, p => p.date[2]));
    });
  }

  onSelectDate(index) {
    const { dutyData } = this.state;
    const onDutyManager = dutyData[index]
      ? sortBy(dutyData[index], [
          p => p.fromMinute,
          p => p.toMinute,
          p => p.user.createTime
        ])
          .filter(p => p.type === MANAGER_AUTH)
          .map(o => ({ ...o.user, dutyId: o.id, period: getTime(o) }))
      : [];
    const onDutyYardman = dutyData[index]
      ? sortBy(dutyData[index], [
          p => p.fromMinute,
          p => p.toMinute,
          p => p.user.createTime
        ])
          .filter(p => p.type === YARDMAN_AUTH)
          .map(o => ({ ...o.user, dutyId: o.id, period: getTime(o) }))
      : [];
    this.setState({
      showPeople: true,
      onDutyYardman,
      onDutyManager,
      selectedIndex: index
    });
  }

  onChangeUser(id, targetId) {
    changeRota(id, targetId).then(() => {
      const { calendarDate } = this.state;
      const startTime = moment(calendarDate, 'YYYY-MM')
        .startOf('month')
        .valueOf();
      const endTime = moment(calendarDate, 'YYYY-MM')
        .endOf('month')
        .valueOf();
      getRota({ startTime, endTime }).then(data => {
        this.setState({ dutyData: groupBy(data, p => p.date[2]) }, () =>
          this.onSelectDate(this.state.selectedIndex)
        );
      });
    });
  }

  disabledStartTime(current) {
    const { endTime } = this.state;
    if (isNil(endTime)) {
      return current && current < moment().startOf('day');
    }
    return (
      (current && current < moment().startOf('day')) ||
      current > endTime.endOf('day')
    );
  }

  disabledEndTime(current) {
    const { startTime } = this.state;
    if (isNil(startTime)) {
      return current && current < moment().startOf('day');
    }
    return (
      (current && current < moment().startOf('day')) || current < startTime
    );
  }

  onPlanChange(id) {
    const { planData, planId } = this.state;
    const [match] = planData.filter(p => p.id === id);
    if (planId !== id) {
      this.props.form.setFieldsValue({ dayIndex: 1 });
      this.setState({
        dayIndexData: Array.from({ length: match.period }, (val, index) => ({
          value: index + 1,
          label: `第${nzhcn.encodeS(index + 1)}天`
        })),
        planId: id
      });
    } else {
      this.setState({ planId: id });
    }
  }

  render() {
    const {
      planData,
      onDutyManager,
      onDutyYardman,
      showPeople,
      dutyData,
      showConfirmModal,
      managers,
      yardmans,
      dayIndexData,
      calendarDate,
      fromTime,
      toTime,
      calendarRange,
      showDeleteModal,
      selectedIndex
    } = this.state;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { editPermit } = this.props;

    if (!dutyData) {
      return <Loading loading text={'加载数据中...'} />;
    }

    return (
      <div className="page-duty-manage">
        <div className="duty-manage-content">
          <div className="duty-panel">
            <Card title={null}>
              <div className="duty-operation">
                <div className="duty-operation-header">
                  <h4>{editPermit ? '值班管理' : '值班人员'}</h4>
                  {editPermit && (
                    <Button
                      type="primary"
                      onClick={() =>
                        this.props.history.push(
                          '/conf/dutyManage/createDutyPlan'
                        )
                      }
                    >
                      值班计划管理
                    </Button>
                  )}
                </div>
                {editPermit && (
                  <Form>
                    <FormItem {...FORM_LAYOUT} label="值班表起始日期">
                      {getFieldDecorator('startTime', {
                        rules: [{ required: true }]
                      })(
                        <DatePicker
                          style={{ width: '100%' }}
                          placeholder="请选择值班起始日期"
                          size="small"
                          showToday={false}
                          disabledDate={this.disabledStartTime}
                          onChange={startTime => this.setState({ startTime })}
                        />
                      )}
                    </FormItem>
                    <FormItem {...FORM_LAYOUT} label="值班表终止日期">
                      {getFieldDecorator('endTime', {
                        rules: [{ required: true }]
                      })(
                        <DatePicker
                          placeholder="请选择值班终止日期"
                          style={{ width: '100%' }}
                          size="small"
                          showToday={false}
                          disabledDate={this.disabledEndTime}
                          onChange={endTime => this.setState({ endTime })}
                        />
                      )}
                    </FormItem>
                    <FormItem {...FORM_LAYOUT} label="值班计划">
                      {getFieldDecorator('planId', {
                        rules: [{ required: true }]
                      })(
                        <Select
                          style={{ width: '100%' }}
                          size="small"
                          notFoundContent="暂无值班计划"
                          onChange={this.onPlanChange}
                        >
                          {planData.map((item, index) => (
                            <Option value={item.id} key={index}>
                              {item.name}
                            </Option>
                          ))}
                        </Select>
                      )}
                    </FormItem>
                    <FormItem {...FORM_LAYOUT} label="值班衔接日期">
                      {getFieldDecorator('dayIndex', {
                        rules: [{ required: true }]
                      })(
                        <Select
                          size="small"
                          style={{ maxWidth: '90px' }}
                          disabled={isNil(getFieldValue('planId'))}
                        >
                          {dayIndexData.map((item, index) => (
                            <Option value={item.value} key={index}>
                              {item.label}
                            </Option>
                          ))}
                        </Select>
                      )}
                      <Tooltip placment="top" title={TIPS}>
                        <span className="duty-operation-tips">?</span>
                      </Tooltip>
                    </FormItem>
                    <FormItem {...BUTTON_LAYOUT}>
                      <Button
                        type="primary"
                        htmlType="submit"
                        className="duty-manage-generate-button"
                        onClick={this.onGenerateDuty}
                      >
                        添加至值班表
                      </Button>
                    </FormItem>
                  </Form>
                )}
              </div>
              {showPeople && (
                <div className="duty-people-show">
                  <div className="duty-leader">值班业务主管</div>
                  <div className="duty-content-leader">
                    {onDutyManager.length ? (
                      onDutyManager.map((item, index) => (
                        <div className="on-duty-list" key={index}>
                          <span className="name">
                            <Tooltip placement="top" title={item.name}>
                              {item.name}
                            </Tooltip>
                          </span>
                          <span className="tele">{item.phone}</span>
                          <span className="time">{item.period}</span>
                          {moment()
                            .add(-1, 'day')
                            .isAfter(
                              moment(
                                `${calendarDate}-${selectedIndex}`,
                                'YYYY-MM-DD'
                              )
                            ) ? null : (
                            <UserSelector
                              user={managers}
                              onChangeUser={id =>
                                this.onChangeUser(item.dutyId, id)
                              }
                            >
                              <a
                                className={classNames(
                                  'ant-dropdown-link',
                                  'change-tab',
                                  {
                                    'disabled-change-tab': moment()
                                      .add(-1, 'day')
                                      .isAfter(
                                        moment(
                                          `${calendarDate}-${selectedIndex}`,
                                          'YYYY-MM-DD'
                                        )
                                      )
                                  }
                                )}
                              >
                                换人
                              </a>
                            </UserSelector>
                          )}
                        </div>
                      ))
                    ) : (
                      <span className="empty-duty-list">
                        未有指定的业务主管
                      </span>
                    )}
                  </div>
                  <div className="duty-leader">值班调度员</div>
                  <div className="duty-content-worker">
                    {onDutyYardman.length ? (
                      onDutyYardman.map((item, index) => (
                        <div className="on-duty-list" key={index}>
                          <span className="name">
                            <Tooltip placement="top" title={item.name}>
                              {item.name}
                            </Tooltip>
                          </span>
                          <span className="tele">{item.phone}</span>
                          <span className="time">{item.period}</span>
                          {moment()
                            .add(-1, 'day')
                            .isAfter(
                              moment(
                                `${calendarDate}-${selectedIndex}`,
                                'YYYY-MM-DD'
                              )
                            ) ? null : (
                            <UserSelector
                              user={yardmans}
                              onChangeUser={id =>
                                this.onChangeUser(item.dutyId, id)
                              }
                            >
                              <a
                                className={classNames(
                                  'ant-dropdown-link',
                                  'change-tab',
                                  {
                                    'disabled-change-tab': moment()
                                      .add(-1, 'day')
                                      .isAfter(
                                        moment(
                                          `${calendarDate}-${selectedIndex}`,
                                          'YYYY-MM-DD'
                                        )
                                      )
                                  }
                                )}
                              >
                                换人
                              </a>
                            </UserSelector>
                          )}
                        </div>
                      ))
                    ) : (
                      <span className="empty-duty-list">未有指定的调度员</span>
                    )}
                  </div>
                </div>
              )}
            </Card>
          </div>
          <div className="duty-calendar">
            {editPermit ? (
              !planData.length && !Object.keys(dutyData).length ? (
                <div className="duty-calendar-error">
                  <a
                    onClick={() =>
                      this.props.history.push('/conf/dutyManage/createDutyPlan')
                    }
                  >
                    当前值班表为空，请添加值班计划，并添加值班表。
                  </a>
                </div>
              ) : null
            ) : !Object.keys(dutyData).length ? (
              <div className="duty-calendar-error">
                <span>当前值班表为空。</span>
              </div>
            ) : null}
            <Card
              bordered={false}
              title={<span className="duty-calendar-date">{calendarDate}</span>}
              extra={
                editPermit && (
                  <Button
                    type="danger"
                    onClick={() => this.setState({ showDeleteModal: true })}
                  >
                    清空该月值班表
                  </Button>
                )
              }
            >
              <Calendar
                onSelectDate={this.onSelectDate}
                calendarRange={calendarRange}
                data={dutyData}
                reloadData={this.reloadData}
              />
            </Card>
          </div>
        </div>
        <Modal
          width={720}
          closable={false}
          visible={showConfirmModal}
          footer={null}
          wrapClassName="vertical-center-modal"
        >
          <p className="modal-title">
            <span className="modal-title-warning">
              {fromTime}&nbsp;至{toTime}
            </span>已有值班表
          </p>
          <p className="modal-title">
            是否覆盖已有值班内容生成新的<span className="modal-title-warning">
              {fromTime}&nbsp;至{toTime}
            </span>值班表?
          </p>
          <div className="modal-action-button">
            <Button type="primary" onClick={this.onConfirm}>
              确认
            </Button>
            <Button onClick={() => this.setState({ showConfirmModal: false })}>
              取消
            </Button>
          </div>
        </Modal>
        <Modal
          closable={false}
          visible={showDeleteModal}
          footer={null}
          wrapClassName="vertical-center-modal"
        >
          <p className="modal-title">确定删除当月值班表么?</p>
          <div className="modal-action-button">
            <Button type="primary" onClick={this.onClearDuty}>
              确认
            </Button>
            <Button onClick={() => this.setState({ showDeleteModal: false })}>
              取消
            </Button>
          </div>
        </Modal>
      </div>
    );
  }
}

export default withRouter(Form.create()(Rota));
