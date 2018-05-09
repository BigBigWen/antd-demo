import React from 'react';
import Card from 'components/CardForData/CardForData';

import { tabs } from '../const';
import { Chart } from 'Chart';
import { getLoatRatioChartOption, getLoadChartOption } from '../lib';
import NotFound from 'components/UI/NotFound';
import { notEmptyForChart } from 'lib/helper';

const Fragment = React.Fragment;

const LoadAnalysis = ({ query, loadRatioData, loadData, cardData }) => {
  const currentItem = tabs[5];
  return (
    <Fragment>
      <div className="card-container">
        {currentItem.cardData.map(card => (
          <div className="card-item" key={card.cardName}>
            <Card
              name={card.cardName}
              value={cardData[card.key]}
              unit={card.unit}
              tooltip={card.cardName}
            />
          </div>
        ))}
      </div>
      {notEmptyForChart(loadData) || notEmptyForChart(loadRatioData) ? (
        <div className="double-chart-container">
          {notEmptyForChart(loadRatioData) ? (
            <Chart
              option={getLoatRatioChartOption(loadRatioData, query) || []}
              style={{ width: '50%' }}
            />
          ) : (
            <NotFound />
          )}
          {notEmptyForChart(loadData) ? (
            <Chart
              option={getLoadChartOption(loadData, query) || []}
              style={{ width: '50%' }}
            />
          ) : (
            <NotFound />
          )}
        </div>
      ) : (
        <NotFound />
      )}
    </Fragment>
  );
};

export default LoadAnalysis;
