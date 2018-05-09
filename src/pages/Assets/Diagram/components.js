import React from 'react';
import { Modal, Table, Button } from 'antd';
import moment from 'moment';
import { getValueLabel, timeFormat } from './lib';
import history from 'lib/history';
const ButtonGroup = Button.Group;

export class SystemModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      telemetryData: [...this.props.telemetryData], // 遥测
      telecommandData: [...this.props.telecommandData], // 遥信
      showAllArr: false
    };
    this.activeBtn = 'telemetry';
    this.showMore = this.showMore.bind(this);
    this.changeTab = this.changeTab.bind(this);
    this.cancel = this.cancel.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      telemetryData: [...nextProps.telemetryData],
      telecommandData: [...nextProps.telecommandData]
    });
  }

  showMore() {
    this.setState({
      showAllArr: true
    });
  }

  changeTab(value) {
    this.activeBtn = value;
    this.setState({
      showAllArr: false
    });
  }
  cancel() {
    this.setState({
      showAllArr: false
    });
    this.activeBtn = 'telemetry';
    this.props.cancel();
  }

  render() {
    const { state, cancel, circuit } = this.props;
    const { telemetryData, telecommandData, showAllArr } = this.state;
    let pointData = (this.activeBtn === 'telemetry'
      ? [...telemetryData]
      : [...telecommandData]
    ).map(item => {
      let result = { ...item };
      result.ts = moment(item.ts).format('YYYY-MM-DD HH:mm:ss');
      result.value = getValueLabel(parseFloat(item.value), 2);
      return result;
    });
    const confirm = (row, cell) => {
      if (cell.pointType === '遥信') {
        return cell.value === '0.00' ? '0' : cell.value === '--' ? '--' : 1;
      } else {
        return cell.value;
      }
    };
    let columns = [
      {
        title: '数据点',
        dataIndex: 'description',
        key: 'description',
        width: '190'
      },
      {
        title: '数值',
        dataIndex: 'value',
        key: 'value',
        width: '200',
        render: (text, record) => confirm(text, record)
      },
      {
        title: '时间',
        dataIndex: 'ts',
        key: 'value',
        width: '200'
      }
    ];
    return (
      <Modal
        visible={state}
        onCancel={this.cancel}
        className="system-modal"
        title={circuit.name || '--'}
        footer={null}
      >
        <div className="system-modal-tabs">
          <div className="tabs-container">
            <ButtonGroup>
              <Button
                type={this.activeBtn === 'telemetry' ? 'primary' : ''}
                onClick={() => this.changeTab('telemetry')}
              >
                {' '}
                遥测
              </Button>
              <Button
                type={this.activeBtn === 'telecommand' ? 'primary' : ''}
                onClick={() => this.changeTab('telecommand')}
              >
                遥信
              </Button>
            </ButtonGroup>
          </div>
          <Table
            columns={columns}
            dataSource={
              showAllArr
                ? pointData
                : pointData.filter(i => i.type === 1 || i.value !== '--')
            }
            scroll={{ y: '275px' }}
            pagination={false}
          />

          <div className="more-btn" onClick={this.showMore}>
            {showAllArr ? '' : '更多'}
          </div>
        </div>
      </Modal>
    );
  }
}

export class SystemAlarmModal extends React.Component {
  render() {
    const { state, cancel, data } = this.props;
    const onRowDoubleClick = row => {
      history.push(
        `/assets/abnormityAlarm?read=false&project=${row.project.id}&site=${
          row.site
        }&circuit=${row.circuitObj.id}`
      );
    };
    const columns = [
      {
        title: '报警级别',
        dataIndex: 'level',
        key: 'level',
        width: '120'
      },
      {
        title: '报警类型',
        dataIndex: 'eventType',
        key: 'eventType',
        width: '120'
      },
      {
        title: '报警名称',
        dataIndex: 'name',
        key: 'name',
        width: '120'
      },
      {
        title: '所属回路',
        dataIndex: 'circuit',
        key: 'circuit',
        width: '120'
      },
      {
        title: '关键点',
        dataIndex: 'keyPointName',
        key: 'keyPointName',
        width: '120'
      },
      {
        title: '触发时间',
        dataIndex: 'appearRecordTime',
        key: 'appearRecordTime',
        width: '120',
        render: (text, record) => timeFormat(text, record)
      },
      {
        title: '触发数值',
        dataIndex: 'appearDataValue',
        key: 'appearDataValue',
        width: '120'
      }
    ];
    return (
      <Modal
        visible={state}
        aria-labelledby="system-alarm-modal"
        onCancel={cancel}
        className="system-alarm-modal"
      >
        <div className="system-modal-title">
          <span className="circuit-name">报警列表</span>
          <span
            className="glyphicon glyphicon-remove right"
            onClick={() => cancel()}
          />
        </div>
        <Table columns={columns} dataSource={data} />
      </Modal>
    );
  }
}
