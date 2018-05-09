import React from 'react';
import moment from 'moment';
import { cloneDeep } from 'lodash';
import { PotentialSafetyHazard, SuggestionsAndMeasures } from './const';
import Filters from 'components/Filters/Filters';
import DetailTable from 'components/DetailTable/DetailTable';
import { TableFactory, TabTableFactory } from 'components/Hoc';
import './ManualAlarm.less';
import { loadProjectSiteTree } from 'rest/api/Tree';
import { loadRecordLabour, loadSuggestions } from 'rest/api/Alarm';
import {
  SafetyHazardOperation,
  MeasuresOperation,
  AddSafetyHazardModal,
  AddMeasuresModal
} from './components';

const config = [
  {
    key: ['projectId', 'siteId'],
    type: 'Cascader',
    label: '配电房',
    defaultValue: ['', ''],
    changeOnSelect: true,
    options: [],
    wrapperStyle: {
      width: 250,
      marginLeft: 25
    }
  },
  {
    key: ['from', 'to'],
    type: 'RangePicker',
    label: '生成时间',
    defaultValue: [moment().startOf('day'), moment().endOf('day')],
    wrapperStyle: {
      width: 400
    }
  },
  {
    key: ['test02', 'test03'], //暂时没有
    type: 'RangePicker',
    label: '恢复时间',
    wrapperStyle: {
      width: 400
    },
    defaultValue: [moment(), moment()]
  }
];

const param = [
  {
    id: '1',
    name: '安全隐患',
    getAction: loadRecordLabour,
    config: config,
    columns: [...PotentialSafetyHazard],
    AlarmOperation: SafetyHazardOperation,
    handleBtn: AddSafetyHazardModal,
    query: {},
    operationWidth: '175px'
  },
  {
    id: '2',
    name: '建议措施',
    getAction: loadSuggestions,
    config: config,
    columns: [...SuggestionsAndMeasures],
    AlarmOperation: MeasuresOperation,
    handleBtn: AddMeasuresModal,
    query: {},
    operationWidth: '40px'
  }
];

class ManualAlarm extends React.Component {
  state = {
    config: this.props.config,
    loading: false
  };
  jointConfig = async () => {
    this.setState({
      loading: true
    });
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
    let config = cloneDeep([...this.state.config]);
    config[0].options = projectOptions;
    this.setState({
      loading: false,
      config: [...config]
    });
  };
  componentDidMount() {
    this.jointConfig();
  }

  render() {
    const {
      columns,
      data,
      onFilterChange,
      AlarmOperation,
      total,
      query,
      loading,
      operationWidth
    } = this.props;
    const { config } = this.state;
    return (
      <div className="page-manualAlarm">
        <Filters
          config={this.state.config}
          onFilterChange={onFilterChange}
          query={query}
        />
        <DetailTable
          columns={columns}
          data={[...data]}
          total={total}
          operationRender={record => (
            <AlarmOperation record={record} loadData={onFilterChange} />
          )}
          operationWidth={operationWidth}
          onPageChange={onFilterChange}
          pageSize={query.size || 10}
          page={query.page || 1}
          loading={loading}
        />
      </div>
    );
  }
}

export default TabTableFactory([...param], config)(ManualAlarm);
