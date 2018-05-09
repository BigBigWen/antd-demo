import React from 'react';
import { Row, Col, Button, Popconfirm, Upload, message } from 'antd';
import TableFactory from 'components/Hoc/TableFactory';
import Tree from 'components/Tree/Tree';
import DetailTable from 'components/DetailTable/DetailTable';
import { reportTitle } from './const';
import { loadReport, deleteAsset } from 'rest/api/Alarm';
import { ReportOperation, AddReport } from './components';
import './Report.less';
const ButtonGroup = Button.Group;
import { loadTreeData } from 'rest/Assets/Asset';

class ReportCom extends React.Component {
  state = {
    loading: false
  };
  render() {
    const {
      projectOptions,
      treeData,
      selectedProjectId,
      selectedTree,
      data,
      changeProject,
      onFilterChange,
      total,
      HandleBtn,
      query,
      loading
    } = this.props;
    return (
      <div className="page-assets-report">
        <div className="search-tree-container">
          <Tree
            onFilterChange={onFilterChange}
            loadData={loadTreeData}
            enableMulti={false}
          />
        </div>
        <div className="report-table-container">
          <Row className="report-table-title">
            <Col span={4} className="report-table-title-left">
              管理报告列表
            </Col>
            <Col offset={17} span={3} className="report-table-title-right">
              <HandleBtn site={selectedTree} loadData={onFilterChange} />
            </Col>
          </Row>
          <Row>
            <DetailTable
              loading={loading}
              page={query.page}
              pageSize={query.size}
              total={total}
              operationWidth={'20px'}
              columns={reportTitle}
              data={data}
              onPageChange={onFilterChange}
              operationRender={record => (
                <ReportOperation record={record} loadData={onFilterChange} />
              )}
            />
          </Row>
        </div>
      </div>
    );
  }
}

export default TableFactory({
  query: {},
  getAction: loadReport,
  HandleBtn: AddReport
})(ReportCom);
