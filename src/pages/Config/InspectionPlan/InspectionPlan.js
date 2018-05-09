import React from 'react';
import { Tabs, Button, Modal } from 'antd';
import moment from 'moment';
import TableFactory from 'components/Hoc/TableFactory';
import DetailTable from 'components/DetailTable/DetailTable';
import Filters from 'components/Filters/Filters';
import { inspectionPlanTitle, config } from './const';
import PlanDetail from './components/PlanDetail';
import AddForm from './components/AddForm';
import API from 'rest/Config/InspectionPlan';
const {
  loadProjectSiteTree,
  loadInspectionPlan,
  loadInspectionPlanDetail,
  postInspectionPlan,
  putInspectionPlan,
  shutDownPlan,
  reStartPlan
} = API;
import './InspectionPlan.less';

const TabPane = Tabs.TabPane;
const rowClassName = selectedId => record => {
  return record.id === selectedId ? 'selected' : '';
};

class InspectionPlan extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      config: config,
      showCreateModal: false,
      detailData: {}
    };
  }

  componentDidMount() {
    this.createConfig();
  }

  createConfig = async () => {
    let projectOptions = await loadProjectSiteTree();
    projectOptions.unshift({
      value: '',
      label: '全部项目',
      children: [
        {
          value: '',
          label: '全部配电房'
        }
      ]
    });
    let config = [...this.state.config];
    config[0].options = projectOptions;
    this.setState({ config: [...config] });
  };

  onRowClick = async record => {
    let detailData = await loadInspectionPlanDetail(record.id);
    this.setState({ detailData });
  };

  onModalSubmit = async data => {
    let json = await postInspectionPlan(data);
    this.setState({ showCreateModal: false });
    this.props.onFilterChange();
  };

  onDetailSubmit = async data => {
    let detailData = await putInspectionPlan(data);
    this.setState({ detailData });
  };

  handleShutDown = async id => {
    await shutDownPlan(id);
    let detailData = await loadInspectionPlanDetail(id);
    this.setState({ detailData });
  };

  handleRestart = async id => {
    await reStartPlan(id);
    let detailData = await loadInspectionPlanDetail(id);
    this.setState({ detailData });
  };

  render() {
    const { showCreateModal, detailData, config } = this.state;
    const { onFilterChange, total, data, query, loading } = this.props;

    return (
      <div className="page-inspection-plan">
        <div className="filter-wrapper">
          <div className="filter-content">
            <div className="title">巡检计划</div>
            <Filters
              style={{ justifyContent: 'flex-end' }}
              config={config}
              query={query}
              onFilterChange={onFilterChange}
              expandable
            />
          </div>
          <Button
            type="primary"
            onClick={() => this.setState({ showCreateModal: true })}
          >
            新增计划
          </Button>
        </div>
        <div className="main-content">
          <div className="sub-content">
            <DetailTable
              columns={inspectionPlanTitle}
              data={data}
              loading={loading}
              onRowClick={this.onRowClick}
              rowClassName={rowClassName(detailData.id)}
              onPageChange={onFilterChange}
              pageSize={query.size}
              page={query.page}
              footer={() => <div>当前符合条件计划数:{total}</div>}
            />
            {!!data.length && (
              <PlanDetail
                data={detailData}
                onSubmit={this.onDetailSubmit}
                handleShutDown={this.handleShutDown}
                handleRestart={this.handleRestart}
              />
            )}
          </div>
        </div>
        <Modal
          footer={null}
          title="新增巡检计划"
          visible={showCreateModal}
          maskClosable={false}
          onCancel={() => this.setState({ showCreateModal: false })}
        >
          {showCreateModal && (
            <AddForm
              cascaderData={config[0].options}
              onSubmit={this.onModalSubmit}
              onCancel={() => this.setState({ showCreateModal: false })}
            />
          )}
        </Modal>
      </div>
    );
  }
}

export default TableFactory({
  getAction: loadInspectionPlan
})(InspectionPlan);
