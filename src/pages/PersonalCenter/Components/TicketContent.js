import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Menu, Button } from 'antd';
import DetailTable from 'components/DetailTable/DetailTable';
import Filters from 'components/Filters/Filters';
import TicketDetail from './TicketDetail';
import moment from 'moment';
import { repairTicketTitle, inspectionTicketTitle } from '../const';
import {
  RepairTicketOperation,
  InspectionTicketOperation
} from './TicketOperation';
// import Pagination from '../../components/TablePagination';
import {
  getRepairTicket,
  postRepairAction,
  getRepairDetail,
  getInspectionTicket,
  postInspectionAction,
  getInspectionDetail,
  getUser,
  getRepairTicketNumber
} from 'rest/api/Ticket';
import {
  statusDict,
  insStatusDict,
  Executing,
  Assigning,
  Waiting
} from 'constants/ticketConfig';
import './TicketContent.less';
import AssignList from './AssignList';
import Oss from 'lib/oss';
import Loading from 'components/Loading';
import store from 'store/index';
const defaultPageSize = 10;
const superAuth = [1, 2, 7, 8];
const normalAuth = [1, 2, 3, 7, 8];

const handleRowClassName = selectedId => record => {
  return record.id === selectedId ? 'selected' : '';
};

class TicketContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageSize: defaultPageSize,
      repairData: [],
      inspectionData: [],
      repairInfo: {},
      inspectionInfo: {},
      assigneeId: undefined,
      comment: '',
      images: [],
      selectedId: null,
      showModal: true,
      user: [],
      feedback: false,
      repairTotal: null,
      inspectionTotal: null,
      loading: true,
      operationCol: true,
      currentPage: 0
    };
    this.filter = {
      key: null,
      assigneeId: null,
      state: null,
      usedAssigneeId: null,
      page: 0,
      size: defaultPageSize
    };
    this.oss = Oss;
  }

  componentDidMount() {
    if (this.props.activeKey === 'repair') {
      const ticketId = (this.props.location.query || {}).ticketId;
      if (ticketId) {
        getRepairTicketNumber(ticketId).then(json => {
          const number = Math.ceil((json.allCount - json.beforeCount) / 10);
          this.filter = { ...this.filter, page: number - 1 };
          this.loadRepairTicket(this.filter).then(json => {
            this.setState({ currentPage: number });
            this.loadRepairDetail(ticketId);
          });
        });
      } else {
        this.loadRepairTicket(this.filter);
      }
    }

    this.props.activeKey === 'inspection' &&
      this.loadInspectionTicket(this.filter);
    getUser().then(data => {
      const { user } = store.getState();
      const { userId } = user;
      const me = data.content.find(p => p.id === userId) || {};
      this.setState({
        user: data.content.filter(p => p.group.id === (me.group || {}).id)
      });
    });
  }
  componentWillReceiveProps(nextProps) {
    if (
      nextProps.activeKey !== this.props.activeKey &&
      nextProps.activeKey === this.props.type
    ) {
      this.props.type === 'repair' && this.loadRepairTicket(this.filter);
      this.props.type === 'inspection' &&
        this.loadInspectionTicket(this.filter);
    }
  }
  loadRepairTicket = params => {
    this.setState({ loading: true });
    return getRepairTicket(params).then(json => {
      let total = json.totalElements;
      let data = json.content || [];
      let listData = data.map(i =>
        Object.assign(
          {},
          {
            time: moment(i.createTime).format('YYYY-MM-DD HH:mm:ss'),
            content: i.alarmName,
            project: (i.project || {}).name,
            status: statusDict[i.state],
            assignee: i.assignee,
            state: i.state,
            id: i.id,
            key: i.id,
            prevState: i.prevState
          }
        )
      );
      this.setState({
        repairData: listData,
        repairTotal: total,
        repairInfo: {},
        loading: false
      });
    });
  };
  loadInspectionTicket = params => {
    this.setState({ loading: true });
    getInspectionTicket(params).then(json => {
      let data = json.content || [];
      let total = json.totalElements;
      let listData = data.map(i =>
        Object.assign(
          {},
          {
            name: i.name,
            project: (i.project || {}).name,
            date: moment(i.createTime).format('YYYY-MM-DD HH:mm:ss'),
            status: statusDict[i.state],
            state: i.state,
            assignee: i.assignee,
            id: i.id,
            key: i.id
          }
        )
      );
      this.setState({
        inspectionData: listData,
        inspectionTotal: total,
        inspectionInfo: {},
        loading: false
      });
    });
  };
  handlePageChange = ({ page, size }) => {
    if (size) {
      this.setState({ pageSize: size, currentPage: 0 });
      this.filter = Object.assign({ ...this.filter }, { page: 0, size });
    } else {
      this.setState({ currentPage: page });
      this.filter = Object.assign({ ...this.filter }, { page: page });
    }
    this.props.type === 'repair'
      ? this.loadRepairTicket(this.filter)
      : this.loadInspectionTicket(this.filter);
  };
  loadRepairDetail = id => {
    getRepairDetail(id).then(json => {
      let info = json || {};
      this.setState({
        repairInfo: info
      });
    });
  };
  loadInspectionDetail = id => {
    getInspectionDetail(id).then(json => {
      let info = json || {};
      this.setState({
        inspectionInfo: info
      });
    });
  };
  handleFilter = params => {
    this.filter = Object.assign({ ...this.filter, page: 0 }, { ...params });
    this.props.type === 'repair'
      ? this.setState({
          operationCol:
            this.filter.state === 'Approved' || this.filter.state === 'Closed'
              ? false
              : true
        })
      : this.setState({
          operationCol: this.filter.state === 'Finished' ? false : true
        });
    this.props.type === 'repair'
      ? this.loadRepairTicket(this.filter)
      : this.loadInspectionTicket(this.filter);
    this.setState({
      repairInfo: [],
      inspectionInfo: [],
      currentPage: 0
    });
  };
  handleRepairItemClick = async (record, user, action) => {
    const actionBody = {
      action: action,
      assigneeId: (record.assignee || {}).id,
      comment: record.id === this.state.repairInfo.id ? this.state.comment : ''
    };
    let result = await postRepairAction(record.id, actionBody);
    this.loadRepairTicket(this.filter);
    this.loadRepairDetail(record.id);
  };
  handleInspectionItemClick = async (record, user, action) => {
    const actionBody = {
      action: action,
      assigneeId: user.id,
      comment:
        record.id === this.state.inspectionInfo.id ? this.state.comment : '',
      images: this.state.images
    };
    let result = await postInspectionAction(record.id, actionBody);
    this.loadInspectionTicket(this.filter);
    this.loadInspectionDetail(record.id);
  };
  handleRowClick = record => {
    if (
      record.id !== this.state.repairInfo.id &&
      record.id !== this.state.inspectionInfo.id
    ) {
      this.setState({
        comment: ''
      });
    }
    if (this.props.type === 'repair') {
      this.loadRepairDetail(record.id);
    } else {
      this.loadInspectionDetail(record.id);
    }
  };
  getComment = comment => this.setState({ comment });
  getImages = images =>
    this.setState({
      images: images.map((item, index) => item.uid)
    });

  handleAssignClick = async (id, record, action) => {
    const actionBody = {
      action: action,
      assigneeId: id,
      comment: this.state.comment
    };
    let result = await postRepairAction(record.id, actionBody);
    this.loadRepairTicket(this.filter);
    this.loadRepairDetail(record.id);
  };
  handleInsAssignClick = async (id, record, action) => {
    const actionBody = {
      action: action,
      assigneeId: id,
      comment: this.state.comment,
      images: this.state.images
    };
    let result = await postInspectionAction(record.id, actionBody);
    this.loadInspectionTicket(this.filter);
    this.loadInspectionDetail(record.id);
  };
  filterUsers = (record, users) => {
    const { user } = store.getState();
    const { userId } = user;
    return record.state === Waiting
      ? [...users].filter(
          i => superAuth.includes(i.authority) && i.id !== userId
        )
      : record.state === Assigning
        ? [...users].filter(
            i => normalAuth.includes(i.authority) || i.id === userId
          )
        : record.state === Executing
          ? [...users].filter(
              i => normalAuth.includes(i.authority) && i.id !== userId
            )
          : [];
  };
  render() {
    const keys = Object.keys(statusDict);
    const insKeys = Object.keys(insStatusDict);
    const { user } = store.getState();
    const { userId } = user;
    const filterContent = [
      {
        type: 'Select',
        defaultValue: '全部',
        label: '工单所属',
        key: 'assigneeId',
        options: [
          { label: '全部', value: '' },
          {
            label: '待我处理',
            value: userId || 0
          }
        ]
      },
      {
        type: 'Select',
        label: '工单状态',
        key: 'state',
        defaultValue: '全部',
        options:
          this.props.type === 'repair'
            ? keys.map((item, index) => ({
                value:
                  item === 'all'
                    ? [
                        'Waiting',
                        'Assigning',
                        'Executing',
                        'Finished',
                        'Approved',
                        'Closed'
                      ].toString()
                    : item,
                label: statusDict[item]
              }))
            : insKeys.map((item, index) => ({
                value:
                  item === 'all'
                    ? ['Assigning', 'Executing', 'Finished'].toString()
                    : item,
                label: statusDict[item]
              }))
      },
      {
        type: 'Search',
        placeholder: '请输入工单内容、编号或项目',
        key: 'key',
        itemStyle: { width: '280px' }
        // onInputChange: this.onInputChange
      }
    ];
    const menu = (
      <Menu onClick={this.handleAssignClick}>
        {this.state.user.map(item => (
          <Menu.Item key={item.id}>{item.name}</Menu.Item>
        ))}
      </Menu>
    );

    const operationRender = record => {
      const notSelected = this.state.inspectionInfo.id !== record.id;
      const commentInvalid =
        record.state === Executing &&
        (!this.state.comment && this.state.comment !== 0);
      return this.props.type === 'repair' ? (
        <RepairTicketOperation
          record={record}
          user={{ id: userId }}
          handleClick={this.handleRepairItemClick}
          assignUsers={this.filterUsers(record, this.state.user)}
          handleAssign={this.handleAssignClick}
        />
      ) : (
        <InspectionTicketOperation
          record={record}
          user={{ id: userId }}
          handleClick={this.handleInspectionItemClick}
          assignUsers={this.filterUsers(record, this.state.user)}
          handleInsAssign={this.handleInsAssignClick}
          disabled={
            (notSelected || commentInvalid) && record.state !== 'Assigning'
          }
        />
      );
    };

    const columns = () => {
      return this.props.type === 'repair'
        ? repairTicketTitle
        : inspectionTicketTitle;
    };
    const assigneeId =
      this.props.type === 'repair'
        ? (this.state.repairInfo.assignee || {}).id
        : (this.state.inspectionInfo.assignee || {}).id;
    const selectedId =
      this.props.type === 'repair'
        ? this.state.repairInfo.id
        : this.state.inspectionInfo.id;
    const tableData =
      this.props.type === 'repair'
        ? this.state.repairData
        : this.state.inspectionData;

    return (
      <div className="main-content">
        <div className="filter-wrapper">
          <Filters
            query={this.filter}
            config={filterContent}
            onFilterChange={this.handleFilter}
            expandable={false}
          />
        </div>
        <div className="sub-content">
          <div
            className="ticket-detail-table"
            style={{ width: tableData.length ? '65%' : '100%' }}
          >
            <DetailTable
              rowClassName={record => handleRowClassName(selectedId)(record)}
              onRowClick={this.handleRowClick}
              operationRender={this.state.operationCol ? operationRender : null}
              columns={columns()}
              data={tableData}
              page={this.state.currentPage}
              pageSize={this.state.pageSize}
              total={
                this.props.type === 'repair'
                  ? this.state.repairTotal
                  : this.state.inspectionTotal
              }
              onPageChange={this.handlePageChange}
              footer={() => (
                <div>
                  当前符合条件工单数:{this.props.type === 'repair'
                    ? this.state.repairTotal
                    : this.state.inspectionTotal}
                </div>
              )}
            />
          </div>
          {!!tableData.length && (
            <TicketDetail
              type={this.props.type}
              info={
                this.props.type === 'repair'
                  ? this.state.repairInfo
                  : this.state.inspectionInfo
              }
              handleClick={
                this.props.type === 'repair'
                  ? this.handleRepairItemClick
                  : this.handleInspectionItemClick
              }
              getComment={this.getComment}
              getImages={this.getImages}
              oss={this.oss}
            />
          )}
        </div>
        <Loading loading={this.state.loading} text="加载数据中..." />
      </div>
    );
  }
}

export default withRouter(TicketContent);
