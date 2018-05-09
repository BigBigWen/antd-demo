import React from 'react';
import {
  Button,
  Popconfirm,
  Icon,
  message,
  Form,
  Modal,
  Select,
  TreeSelect,
  Input,
  Tooltip,
  Row,
  Col,
  Spin
} from 'antd';
import {
  deleteLoss,
  addLoss,
  lossAutoCreate,
  upDateLoss,
  loadMeasurementCircuitTree,
  getLoss
} from 'rest/api/Loss';
import { lossType } from './const';
import People from './imgs/people.png';
import Robot from './imgs/robot.png';
import Filters from 'components/Filters/Filters';
import DetailTable from 'components/DetailTable/DetailTable';
import { LossConfigTitle } from './const';
import { transformData } from './lib';
import { relative } from 'path';
import TableFactory from 'components/Hoc/TableFactory';

const ButtonGroup = Button.Group;
const Option = Select.Option;
const FormItem = Form.Item;

const Fragment = React.Fragment;

const findNodeInMeasurement = (target, arr) => {
  let find = false;
  const findCircuit = (target, arr) => {
    for (let i of arr) {
      if (find) {
        break;
      } else if (i.value === target) {
        find = true;
        break;
      } else if (i.children) {
        findCircuit(target, i.children);
      } else {
        continue;
      }
    }
  };
  findCircuit(target, arr);
  return find;
};

class LossModalCom extends React.Component {
  state = {
    circuitTreeData: []
  };
  startMonitors = [];
  endMonitors = [];

  componentDidMount() {
    const { record, circuitTreeData } = this.props;
    if (record) {
      this.props.form.setFieldsValue({
        name: record.name,
        type: lossType.find(a => a.label === record.type).value,
        startMonitors: record.startMonitors.map(a => `${a.id}_${a.type}`),
        endMonitors: record.endMonitors.map(a => `${a.id}_${a.type}`)
      });
      this.setState({
        circuitTreeData: [...circuitTreeData].filter(
          i => i.value === record.measurement.id + '_MEASUREMENT'
        )
      });
      this.startMonitors = record.monitors;
      this.endMonitors = record.endMonitors;
    }
  }

  componentWillReceiveProps(nextProps) {
    const { record } = this.props;
    if (
      JSON.stringify(nextProps.circuitTreeData) !==
      JSON.stringify(this.props.circuitTreeData)
    ) {
      if (!record) {
        this.setState({ circuitTreeData: [...nextProps.circuitTreeData] });
      }
    }
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.handleSubmit(values, this.props.record).then(json => {
          this.props.onFilterChange();
          this.handleCancel();
          this.props.form.resetFields();
        });
      }
    });
  };

  handleCancel = e => {
    const { record, circuitTreeData } = this.props;
    this.props.handleCancel();
    if (record) {
      this.props.form.setFieldsValue({
        name: record.name,
        type: (lossType.find(a => a.label === record.type) || {}).value,
        startMonitors: record.startMonitors.map(a => a.id),
        endMonitors: record.endMonitors.map(a => a.id)
      });
      this.setState({
        circuitTreeData: [...circuitTreeData].filter(
          i => i.value === record.measurement.id + '_MEASUREMENT'
        )
      });
    } else {
      this.props.form.resetFields();
      this.setState({ circuitTreeData });
    }
  };

  handleMonitorsChange = (value, label, extra, type) => {
    const { circuitTreeData, record } = this.props;
    this[type] = value;
    if (value.length) {
      const target = value[value.length - 1];
      const [id, type] = target.split('_');
      if (type === 'MEASUREMENT') {
        this.setState({
          circuitTreeData: circuitTreeData.filter(i => i.value === target)
        });
      } else {
        for (let measurement of circuitTreeData) {
          if (findNodeInMeasurement(target, measurement.children)) {
            this.setState({
              circuitTreeData: [measurement]
            });
            break;
          }
        }
      }
    } else {
      const { startMonitors, endMonitors } = this;
      if (!startMonitors.length && !endMonitors.length) {
        this.setState({ circuitTreeData });
      }
    }
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { circuitTreeData } = this.state;
    const { showModal, visible, handleSubmit, record } = this.props;
    return (
      <Fragment>
        <Modal
          title={record ? '编辑损耗对象' : '添加损耗对象'}
          visible={visible}
          onOk={this.handleSubmit}
          onCancel={this.handleCancel}
          maskClosable={false}
          className="loss-modal-container"
        >
          <Form onSubmit={this.handleSubmit}>
            <FormItem {...formItemLayout} label="损耗名称">
              {getFieldDecorator('name', {
                rules: [
                  { required: true, message: '请输入名称' },
                  { max: 20, message: '请输入不超过20字' }
                ]
              })(<Input placeholder="请输入名称" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="损耗类型">
              {getFieldDecorator('type', {
                rules: [{ required: true, message: '请选择损耗类型' }]
              })(
                <Select placeholder="请选择损耗类型">
                  {lossType.map(item => (
                    <Option key={item.value} value={item.value}>
                      {item.label}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
            <Row className="startMonitor-container">
              <FormItem {...formItemLayout} label="起始监测点">
                {getFieldDecorator('startMonitors', {
                  rules: [{ required: true, message: '请选择起始监测点' }]
                })(
                  <TreeSelect
                    multiple
                    dropdownStyle={{ height: '280px', overflow: 'auto' }}
                    treeData={circuitTreeData}
                    treeNodeFilterProp="title"
                    placeholder="请选择回路"
                    onChange={(value, label, extra) =>
                      this.handleMonitorsChange(
                        value,
                        label,
                        extra,
                        'startMonitors'
                      )
                    }
                  />
                )}
              </FormItem>
            </Row>
            <Row className="endMonitor-container">
              <FormItem {...formItemLayout} label="终止监测点">
                {getFieldDecorator('endMonitors', {
                  rules: [{ required: true, message: '请选择终止监测点' }]
                })(
                  <TreeSelect
                    multiple
                    dropdownStyle={{ height: '280px', overflow: 'auto' }}
                    treeNodeFilterProp="title"
                    treeData={circuitTreeData}
                    placeholder="请选择回路"
                    onChange={(value, label, extra) =>
                      this.handleMonitorsChange(
                        value,
                        label,
                        extra,
                        'endMonitors'
                      )
                    }
                  />
                )}
              </FormItem>
            </Row>
          </Form>
        </Modal>
      </Fragment>
    );
  }
}
const LossModal = Form.create()(LossModalCom);

export class LossOperation extends React.Component {
  state = {
    visible: false
  };
  showModal = () => {
    this.setState({
      visible: true
    });
  };
  handleSubmit = (values, record) => {
    let start = values.startMonitors.map(a => {
      return {
        id: a.split('_')[0],
        type: a.split('_')[1],
        position: 'START'
      };
    });
    let end = values.endMonitors.map(a => {
      return {
        id: a.split('_')[0],
        type: a.split('_')[1],
        position: 'END'
      };
    });
    const result = {
      auto: false,
      monitors: start.concat(end),
      name: values.name,
      type: values.type
    };
    return upDateLoss(record.id, result);
  };
  handleCancel = e => {
    this.setState({
      visible: false
    });
  };
  deleteLossFun = id => {
    deleteLoss(id).then(json => {
      //删除页面最后一项后拿上一页的内容
      const isLastItem =
        this.props.numberOfElements === 1 && this.props.page !== 0;
      this.props.onFilterChange(
        isLastItem ? { page: this.props.page - 1 } : null
      );
      message.success('删除成功');
    });
  };
  changeAuto = record => {
    let start = record.startMonitors.map(a => {
      return {
        id: a.id,
        type: a.type,
        position: 'START'
      };
    });
    let end = record.endMonitors.map(a => {
      return {
        id: a.id,
        type: a.type,
        position: 'END'
      };
    });
    const data = {
      auto: !record.auto,
      name: record.name,
      type: lossType.find(a => a.label === record.type).value,
      monitors: start.concat(end)
    };
    upDateLoss(record.id, data).then(json => {
      this.props.onFilterChange();
    });
  };
  render() {
    const { visible } = this.state;
    const { record, onFilterChange, projectId, circuitTreeData } = this.props;
    return (
      <div className="loss-operation-container">
        <div className="btn-wrapper">
          <Button
            style={{ paddingLeft: 0 }}
            type="link"
            onClick={this.showModal}
          >
            编辑
          </Button>
        </div>
        <Popconfirm
          title="确定删除吗?"
          placement="topLeft"
          onConfirm={() => this.deleteLossFun(record.id)}
        >
          <div className="btn-wrapper">
            <Button type="link">删除</Button>
          </div>
        </Popconfirm>
        <div className="btn-wrapper lg">
          <Tooltip
            title={`当前为${record.auto ? '自动' : '人工'}状态，自动生成时会被${
              record.auto ? '删除' : '保留'
            }，可点击切换状态`}
          >
            <Button type="link">
              <img
                onClick={() => this.changeAuto(record)}
                src={record.auto ? Robot : People}
              />
            </Button>
          </Tooltip>
        </div>
        {visible && (
          <LossModal
            showModal={this.showModal}
            visible={visible}
            handleSubmit={this.handleSubmit}
            handleCancel={this.handleCancel}
            record={record}
            onFilterChange={onFilterChange}
            circuitTreeData={circuitTreeData}
          />
        )}
      </div>
    );
  }
}

export class AddLoss extends React.Component {
  state = {
    visible: false,
    autogenerationVisible: false,
    autoLoading: false
  };
  showAutoModal = () => {
    this.setState({
      autogenerationVisible: true
    });
  };
  handleAutoCancel = () => {
    this.setState({
      autogenerationVisible: false
    });
  };
  showModal = () => {
    this.setState({
      visible: true
    });
  };
  handleSubmit = values => {
    let start = values.startMonitors.map(a => {
      return {
        id: a.split('_')[0],
        type: a.split('_')[1],
        position: 'START'
      };
    });
    let end = values.endMonitors.map(a => {
      return {
        id: a.split('_')[0],
        type: a.split('_')[1],
        position: 'END'
      };
    });
    const result = {
      auto: false,
      monitors: start.concat(end),
      name: values.name,
      type: values.type
    };
    return addLoss(result);
  };
  handleCancel = e => {
    this.setState({
      visible: false
    });
  };
  lossAutoCreate = () => {
    this.setState({
      autoLoading: true
    });
    lossAutoCreate(this.props.projectId).then(json => {
      this.props.loadProject(this.props.projectId);
      this.setState({
        autoLoading: false
      });
      const isNull = json && json.length;
      if (!isNull) {
        message.warn('自动生成损耗对象0个！请手动添加');
      }
      this.handleAutoCancel();
      this.props.onFilterChange({ page: 0 });
    });
  };
  render() {
    const { visible, autogenerationVisible, autoLoading } = this.state;
    const {
      onFilterChange,
      circuitTreeData,
      showLossBadge,
      projectId,
      siteId
    } = this.props;
    return (
      <div>
        <ButtonGroup>
          <Button onClick={this.showModal}> 人工添加 </Button>
          <Button
            type="primary"
            onClick={this.showAutoModal}
            className="auto-btn-container"
          >
            自动生成
            <Tooltip title="回路有更新！请更新损耗配置">
              <div className="badge-container" hidden={!showLossBadge}>
                !
              </div>
            </Tooltip>
          </Button>
        </ButtonGroup>
        <LossModal
          showModal={this.showModal}
          visible={visible}
          handleSubmit={this.handleSubmit}
          handleCancel={this.handleCancel}
          onFilterChange={onFilterChange}
          circuitTreeData={circuitTreeData}
        />

        <Modal
          visible={this.state.autogenerationVisible}
          onOk={this.lossAutoCreate}
          onCancel={this.handleAutoCancel}
        >
          <Spin spinning={autoLoading}>
            <div className="autogeneration-modal">
              是否删除已有<span className="modal-auto-text">自动生成对象</span>且生成新的对象
            </div>
          </Spin>
        </Modal>
      </div>
    );
  }
}

class LossConfigCom extends React.Component {
  state = {
    circuitTreeData: []
  };
  componentWillReceiveProps(nextProps) {
    if (nextProps.query.projectId !== this.props.query.projectId) {
      loadMeasurementCircuitTree(nextProps.query.projectId).then(json => {
        this.setState({ circuitTreeData: json });
      });
    }
  }
  componentDidMount() {
    const { query } = this.props;
    const isLoad =
      this.state.circuitTreeData && this.state.circuitTreeData.length;
    loadMeasurementCircuitTree(query.projectId).then(json => {
      this.setState({ circuitTreeData: json });
    });
  }
  render() {
    const {
      onFilterChange,
      total,
      data,
      query,
      loading,
      HandelBtn,
      showLossBadge,
      siteId,
      loadProject,
      numberOfElements
    } = this.props;
    const { circuitTreeData } = this.state;
    return (
      <div className="page-loss-config">
        <div className="filter-wrapper">
          <div>
            <span className="title">损耗对象</span>
          </div>
          <div className="filters-container">
            <Filters
              config={config}
              query={query}
              onFilterChange={query => onFilterChange({ page: 0, ...query })}
              expandable={false}
            />
            <div className="filters-btn">
              <HandelBtn
                siteId={siteId}
                projectId={query.projectId}
                onFilterChange={onFilterChange}
                circuitTreeData={circuitTreeData}
                showLossBadge={showLossBadge}
                loadProject={loadProject}
              />
            </div>
          </div>
        </div>
        <Row className="table-wrapper">
          <DetailTable
            pageSize={query.size}
            page={query.page}
            loading={loading}
            total={total}
            columns={LossConfigTitle}
            data={transformData(data)}
            operationRender={record => (
              <LossOperation
                circuitTreeData={circuitTreeData}
                projectId={query.projectId}
                record={record}
                onFilterChange={onFilterChange}
                numberOfElements={numberOfElements}
                page={query.page}
              />
            )}
            onPageChange={onFilterChange}
          />
        </Row>
      </div>
    );
  }
}

export const LossConfigContainer = TableFactory({
  getAction: getLoss,
  HandelBtn: AddLoss
  // query: { projectId: this.props.match.params.id, page: 0, size: 10 },
  // showLossBadge: project.showLossBadge
})(LossConfigCom);

const config = [
  {
    key: 'lossName',
    type: 'Search',
    placeholder: '请输入对象名称',
    wrapperStyle: {
      marginRight: '23px'
    }
  },
  {
    key: 'lossType',
    type: 'BtnSelect',
    options: [
      { label: '总损耗', value: { lossType: 'TOTAL_LOSS' } },
      { label: '变损', value: { lossType: 'TRANSFORMER_LOSS' } },
      { label: '线损', value: { lossType: 'CIRCUIT_LOSS' } }
    ]
  }
];

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
