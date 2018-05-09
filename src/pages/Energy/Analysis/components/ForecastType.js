import React from 'react';
import { Chart } from 'Chart';
import { getForecastChartOption } from '../lib';
import './ForecastType.less';
import NotFound from 'components/UI/NotFound';
import { notEmptyForChart } from 'lib/helper';

const ForecastType = ({
  query,
  chartData,
  capacity,
  maxPdmdBasedPayment,
  demandPrice,
  capacityBasedPayment,
  manualPdmd,
  basicPayment,
  capacityBased,
  maxPdmdBased,
  capacityPrice,
  maxPdmd
}) => {
  return (
    <div className="forecastType-container">
      <div className="card-container">
        <div className="left-container">
          <div className="row">
            <div className="card">
              <div className="title">变压器容量</div>
              <div className="card-context">
                <span>{capacity}</span>KWh
              </div>
            </div>
            <div className="card">
              <div className="title">本月实际最大需量</div>
              <div className="card-context">
                <span>{maxPdmd}</span>KWh
              </div>
            </div>
            <div className="card capacityPrice">
              <div className="title ">估计下月按容基本电费</div>
              <div className="card-context">
                <span>{capacityBasedPayment}</span>元
              </div>
            </div>
          </div>
          <div className="row">
            <div className="card">
              <div className="title">本月申报需量</div>
              <div className="card-context">
                <span>{manualPdmd}</span>KWh
              </div>
            </div>
            <div className="card">
              <div className="title">预估本月基本电费</div>
              <div className="card-context">
                <span>{basicPayment}</span>KWh
              </div>
            </div>
            <div className="card demandPrice">
              <div className="title">预估下月按需基本电费</div>
              <div className="card-context">
                <span>{maxPdmdBasedPayment}</span>元
              </div>
            </div>
          </div>
        </div>
        <div className="right-container">
          <div className="title">推荐计费方式</div>
          <div className="context">
            <span className="type">
              {' '}
              {maxPdmdBased ? '需' : capacityBased ? '容' : ''}
            </span>
            <span className="price">
              {Math.abs(
                (
                  (capacityBasedPayment || 0) - (maxPdmdBasedPayment || 0)
                ).toFixed(0)
              )}
            </span>
            <span className="footer"> 预估可节省费用</span>
          </div>
        </div>
      </div>
      <div className="main-chart">
        {notEmptyForChart(chartData) ? (
          <Chart
            option={getForecastChartOption(chartData, query) || []}
            style={{ width: 'calc(100% - 24px)' }}
          />
        ) : (
          <NotFound />
        )}
      </div>
    </div>
  );
};

export default ForecastType;
