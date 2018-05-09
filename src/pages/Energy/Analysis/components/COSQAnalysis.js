import React from 'react';

import { tabs } from '../const';
import { Chart } from 'Chart';
import TableForChart from 'components/TableForChart/TableForChart';
import { getCOSQChartOption } from '../lib';
import NotFound from 'components/UI/NotFound';
import { notEmptyForChart } from 'lib/helper';

const Fragment = React.Fragment;

const COSQAnalysis = ({ query, chartData, tableData }) => {
  const currentItem = tabs[6];
  return (
    <Fragment>
      <div className="main-chart">
        {notEmptyForChart(chartData) ? (
          <div>
            <Chart
              option={getCOSQChartOption(chartData, query) || []}
              style={{ width: 'calc(100% - 24px)' }}
            />
            <div className="table-container">
              <TableForChart
                tableData={tableData}
                tabConfig={currentItem.tableData}
              />
            </div>
          </div>
        ) : (
          <NotFound />
        )}
      </div>
    </Fragment>
  );
};

export default COSQAnalysis;
