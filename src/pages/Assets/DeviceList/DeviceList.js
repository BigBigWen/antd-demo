import React from 'react';
import { Row, Col } from 'antd';

import API from 'rest/Assets/DeviceList';
import { alarmTitle, config } from './const';
import Filters from 'components/Filters/Filters';
import DetailTable from 'components/DetailTable/DetailTable';
import { TableFactory } from 'components/Hoc';
const { loadProjectSiteTree, getDeviceList } = API;
import './DeviceList';

class DeviceList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      config: config
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
    config[2].options = projectOptions;
    this.setState({ config: [...config] });
  };

  render() {
    const { onFilterChange, total, data, query, loading } = this.props;
    return (
      <div className="page-assets-alarm">
        <Row className="filter-wrapper">
          <Col span={4}>
            <span className="title">设备列表</span>
          </Col>
          <Col span={20}>
            <Filters
              style={{ justifyContent: 'flex-end' }}
              config={this.state.config}
              query={query}
              onFilterChange={onFilterChange}
            />
          </Col>
        </Row>
        <Row className="table-wrapper">
          <DetailTable
            loading={loading}
            total={total}
            columns={alarmTitle}
            data={data}
            onPageChange={onFilterChange}
          />
        </Row>
      </div>
    );
  }
}

export default TableFactory({
  getAction: getDeviceList
})(DeviceList);
