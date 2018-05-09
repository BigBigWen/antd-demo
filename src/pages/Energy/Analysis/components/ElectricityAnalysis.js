import React from 'react';

import { tabs } from '../const';
import { Chart } from 'Chart';
import TableForChart from 'components/TableForChart/TableForChart';
import { getElectricityChartOption } from '../lib';
import { notEmptyForChart } from 'lib/helper';
import NotFound from 'components/UI/NotFound';

const Fragment = React.Fragment;

const ElectricityAnalysis = ({ query, chartData, tableData }) => {
  const currentItem = tabs[3];
  return notEmptyForChart(chartData) ? (
    <Fragment>
      <div className="main-chart">
        <Chart
          option={getElectricityChartOption(chartData, query) || []}
          style={{ width: 'calc(100% - 24px)' }}
        />
      </div>
      <div className="table-container">
        <TableForChart
          tableData={tableData}
          tabConfig={currentItem.tableData}
        />
      </div>
    </Fragment>
  ) : (
    <NotFound />
  );
};

export default ElectricityAnalysis;
