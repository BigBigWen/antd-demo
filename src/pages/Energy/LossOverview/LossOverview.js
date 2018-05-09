import React from 'react';
import moment from 'moment';
import { Spin } from 'antd';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import ProjectSelect from 'components/Hoc/ProjectSelect';
import { getOverview, getRank } from 'rest/api/Loss';
import './LossOverview.less';
import {
  Chart,
  getOption,
  monthXAxis,
  singleYAxis,
  getLegend,
  getTooltip,
  getBar,
  dayXAxis,
  getLine
} from 'Chart';
import NotFound from 'components/UI/NotFound';
import {
  rateOption,
  amountOption,
  baseCardStyle,
  getCardOption
} from './const';
import { Card, TotalAmountCard, TotalRateCard, Rank } from './components';
import { Button } from 'antd';
import { numLabel } from 'lib/helper';
const ButtonGroup = Button.Group;

const isAmountOrder = orderType => orderType === 'AMOUNT';

class LossOverview extends React.Component {
  state = {
    circuitLoss: {
      orderType: 'AMOUNT',
      data: [],
      lossType: 'CIRCUIT_LOSS',
      loading: false
    },
    transformerLoss: {
      orderType: 'AMOUNT',
      data: [],
      lossType: 'TRANSFORMER_LOSS',
      loading: false
    },
    overview: {
      loading: false,
      economicLoss: '',
      totalAmount: '',
      moreLossRate: '',
      totalRate: '',
      monthOverMonth: '',
      amountByDay: [],
      rateByDay: []
    }
  };
  changeProject = id => {
    this.reloadData(id);
  };

  changeRank = async (type, key) => {
    const item = this.state[type];
    const newItem = {
      ...item,
      orderType: key,
      loading: true
    };
    this.setState({ [type]: { ...newItem } });
    let data = await getRank(this.props.projectId, newItem);
    this.setState({
      [type]: {
        ...newItem,
        data,
        loading: false
      }
    });
  };

  reloadData = id => {
    if (!id) return;
    this.getAllRankData(id);
    this.getOverviewData(id);
  };

  getAllRankData = async id => {
    const { circuitLoss, transformerLoss } = this.state;
    this.setState({
      circuitLoss: { ...circuitLoss, loading: true },
      transformerLoss: { ...transformerLoss, loading: true }
    });
    let [circuitData, transformerData] = await Promise.all([
      getRank(id, this.state.circuitLoss),
      getRank(id, this.state.transformerLoss)
    ]);
    if (id !== this.props.projectId) {
      this.setState({
        circuitLoss: { ...circuitLoss, loading: false },
        transformerLoss: { ...transformerLoss, loading: false }
      });
    } else {
      this.setState({
        circuitLoss: { ...circuitLoss, data: circuitData, loading: false },
        transformerLoss: {
          ...transformerLoss,
          data: transformerData,
          loading: false
        }
      });
    }
  };

  getOverviewData = async projectId => {
    this.setState({
      overview: { ...this.state.overview, loading: true }
    });
    let json = await getOverview(projectId);
    if (projectId !== this.props.projectId) {
      this.setState({
        overview: { ...this.state.overview, loading: false }
      });
    } else {
      this.setState({
        overview: { ...json, loading: false }
      });
    }
  };

  render() {
    const { circuitLoss, transformerLoss, overview } = this.state;

    const {
      economicLoss,
      moreLossRate,
      totalAmount,
      totalRate,
      amountByDay,
      rateByDay,
      monthOverMonth
    } = overview;
    const { projectId } = this.props;

    return (
      <div className="page-lossRead-wrapper">
        <div className="left">
          <ProjectSelect
            style={{
              marginRight: 16,
              justifyContent: 'center',
              height: 46
            }}
            changeProject={this.changeProject}
          />
          <div className="card-wrapper">
            <Spin size="small" spinning={overview.loading}>
              <Card
                style={{
                  ...baseCardStyle,
                  marginBottom: 16
                }}
                title={{
                  name: '上月总损耗量',
                  value: totalAmount,
                  fix: 2,
                  unit: 'kWh'
                }}
                Footer={<TotalAmountCard economicLoss={economicLoss} />}
                option={getCardOption({
                  option: {
                    series: [
                      getBar({
                        name: '总损耗量',
                        data: amountByDay,
                        color: '#1890ff'
                      })
                    ]
                  },
                  unit: 'kWh'
                })}
              />
            </Spin>
            <Spin size="small" spinning={overview.loading}>
              <Card
                style={baseCardStyle}
                title={{
                  name: '上月总损耗率',
                  value: totalRate,
                  unit: '%',
                  fix: 2
                }}
                Footer={<TotalRateCard monthOverMonth={monthOverMonth} />}
                showTriangle={true}
                option={getCardOption({
                  option: {
                    series: [
                      getLine({
                        name: '总损耗率',
                        data: rateByDay,
                        areaStyle: { color: '#ff8400' },
                        color: '#ec5734'
                      })
                    ]
                  },
                  unit: '%'
                })}
              />
            </Spin>
          </div>
        </div>
        <div className="right">
          <div className="lossRead-rank-container">
            <div className="rank-title-container">
              <div className="rank-title-name">上月变压器损耗统计</div>
              <ButtonGroup>
                <Button
                  type={
                    isAmountOrder(transformerLoss.orderType) ? 'primary' : ''
                  }
                  onClick={() => this.changeRank('transformerLoss', 'AMOUNT')}
                >
                  按损耗量排名
                </Button>
                <Button
                  type={
                    isAmountOrder(transformerLoss.orderType) ? '' : 'primary'
                  }
                  onClick={() => this.changeRank('transformerLoss', 'RATE')}
                >
                  按损耗率排名
                </Button>
              </ButtonGroup>
            </div>
            <Spin spinning={transformerLoss.loading} size="large">
              {transformerLoss.data.length ? (
                <Rank
                  option={
                    isAmountOrder(transformerLoss.orderType)
                      ? amountOption(transformerLoss.data)
                      : rateOption(transformerLoss.data)
                  }
                  titles={[
                    'TOP 9',
                    isAmountOrder(transformerLoss.orderType)
                      ? '损耗率(%)'
                      : '损耗量(kWh)'
                  ]}
                />
              ) : (
                <NotFound />
              )}
            </Spin>
          </div>
          <div className="lossRead-rank-container">
            <div className="rank-title-container">
              <div className="rank-title-name">上月线路损耗统计</div>
              <ButtonGroup>
                <Button
                  type={isAmountOrder(circuitLoss.orderType) ? 'primary' : ''}
                  onClick={() => this.changeRank('circuitLoss', 'AMOUNT')}
                >
                  按损耗量排名
                </Button>
                <Button
                  type={isAmountOrder(circuitLoss.orderType) ? '' : 'primary'}
                  onClick={() => this.changeRank('circuitLoss', 'RATE')}
                >
                  按损耗率排名
                </Button>
              </ButtonGroup>
            </div>
            <Spin spinning={circuitLoss.loading} size="large">
              {circuitLoss.data.length ? (
                <Rank
                  option={
                    isAmountOrder(circuitLoss.orderType)
                      ? amountOption(circuitLoss.data)
                      : rateOption(circuitLoss.data)
                  }
                  titles={[
                    'TOP 9',
                    isAmountOrder(circuitLoss.orderType)
                      ? '损耗率(%)'
                      : '损耗量(kWh)'
                  ]}
                />
              ) : (
                <NotFound />
              )}
            </Spin>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  projectId: state.tree.projectId
});

export default withRouter(connect(mapStateToProps)(LossOverview));
