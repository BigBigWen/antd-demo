import React from 'react';
import { Row, Col } from 'antd';
import { getTableData } from 'lib/helper';
import './TableForChart.less';

const notEmptyArray = arr => arr && arr.length;

const TableForChart = ({ tableData, tabConfig }) => {
  return notEmptyArray(tableData) ? (
    <Row className="c-table-for-chart-wrapper">
      {getTableData(tableData || [], tabConfig.columnsNum).map((item, ind) => (
        <Col span={24 / tabConfig.columnsNum} key={ind}>
          <Row className="table-title">
            {tabConfig.configData.map((a, ind) => (
              <Col key={ind} span={a.col || 24 / tabConfig.configData.length}>
                {a.title}
              </Col>
            ))}
          </Row>
          {item.map(data => (
            <Row key={data.ts} className="table-row ">
              {tabConfig.configData.map((column, i) => (
                <Col
                  className="table-col"
                  key={column.key}
                  span={column.col || 24 / tabConfig.configData.length}
                >
                  {data[column.key]}
                </Col>
              ))}
            </Row>
          ))}
        </Col>
      ))}
    </Row>
  ) : null;
};

export default TableForChart;
