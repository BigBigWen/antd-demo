import React from 'react';
import { connect } from 'react-redux';
import { Router, Switch, Route, Redirect } from 'react-router-dom';
import Login from './pages/Login/Login';
import {
  OVERVIEW_READ,
  DIAGRAM_READ,
  DC_READ,
  ENVIRONMENTAL_READ,
  ALARM_READ,
  MANUAL_ALARM_READ,
  REPORT_READ,
  ASSET_READ,
  ENERGY_EFFICIENCY_READ,
  STATISTICAL_REPORT_READ,
  EP_ANALYSIS_READ,
  LOSS_READ,
  POWER_ANALYSIS_READ,
  HISTORY_READ,
  ROTA_READ,
  PROJECT_READ,
  REPORTED_INSTALLATION_READ,
  PERMISSION_READ,
  USER_READ,
  INSPECTION_PLAN_READ,
  LOSS_WRITE,
  TICKET_READ,
  TICKET_STAT_READ
} from './constants/authority';
// 全局组件
import Header from 'components/Layout/Header';
import Footer from 'components/Layout/Footer';
import NotMatch from 'components/UI/NotMatch';
import DefaultLayout from 'components/UI/DefaultLayout';
import PrivateRoute from './router/PrivateRoute';
import LoginRoute from './router/LoginRoute';
import RedirectByAuth from './router/RedirectByAuth';
// 总览页
import Overview from './pages/Overview/Overview';
// 资产管理
import Environmental from './pages/Assets/Environmental/Environmental';
import Diagram from './pages/Assets/Diagram/Diagram';
import Alarm from './pages/Assets/Alarm/Alarm';
import ManualAlarm from './pages/Assets/ManualAlarm/ManualAlarm';
import Asset from './pages/Assets/Asset/Asset';
import Report from './pages/Assets/Report/Report';
import DeviceList from './pages/Assets/DeviceList/DeviceList';
// 能效概览
import EnergyOverview from './pages/Energy/Overview/Overview';
import LossOverview from './pages/Energy/LossOverview/LossOverview';
import EPStatistics from './pages/Energy/EPStatistics/EPStatistics';
import EnergyAnalysis from './pages/Energy/Analysis/Analysis';
// 历史数据
import LossHistory from './pages/History/LossHistory/LossHistory';
import History from './pages/History/History/History';
// 配置管理
import LossConfig from './pages/Config/LossConfig/LossConfig';
import InspectionPlan from './pages/Config/InspectionPlan/InspectionPlan';
import Rota from './pages/Config/Rota/Rota';
import TicketStatistics from './pages/Config/TicketStatistics/TicketStatistics';
// 个人任务中心
import PersonalCenter from './pages/PersonalCenter/PersonalCenter';
// 测试
import Test from './pages/Test/Test';
// 样式
import './App.less';

const App = ({ history }) => {
  return (
    <Router history={history}>
      <Switch>
        <Route exact path="/test" component={Test} />
        <Route exact path="/login" component={Login} />
        <LoginRoute>
          <div className="page-content">
            <Header />
            <div className="page-content-wrapper">
              <Switch>
                <Route exact path="/" component={RedirectByAuth} />

                <PrivateRoute
                  path="/overview"
                  component={() => <Overview />}
                  auth={OVERVIEW_READ}
                />
                <PrivateRoute
                  path="/assets/diagram"
                  component={() => <DefaultLayout component={Diagram} />}
                  auth={DIAGRAM_READ}
                />
                <PrivateRoute
                  path="/assets/environmental"
                  component={() => <DefaultLayout component={Environmental} />}
                  auth={ENVIRONMENTAL_READ}
                />
                <PrivateRoute
                  path="/assets/alarm"
                  component={() => <DefaultLayout component={Alarm} />}
                  auth={ALARM_READ}
                />
                <PrivateRoute
                  path="/assets/manual-alarm"
                  component={() => <DefaultLayout component={ManualAlarm} />}
                  auth={MANUAL_ALARM_READ}
                />
                <PrivateRoute
                  path="/assets/asset"
                  component={() => <DefaultLayout component={Asset} />}
                  auth={ASSET_READ}
                />
                <PrivateRoute
                  path="/assets/report"
                  component={() => <DefaultLayout component={Report} />}
                  auth={REPORT_READ}
                />
                <PrivateRoute
                  path="/assets/device-list"
                  component={() => <DefaultLayout component={DeviceList} />}
                  auth={PROJECT_READ}
                />
                <PrivateRoute
                  path="/energy/energy-overview"
                  component={() => <DefaultLayout component={EnergyOverview} />}
                  auth={ENERGY_EFFICIENCY_READ}
                />
                <PrivateRoute
                  path="/energy/loss-overview"
                  component={() => <DefaultLayout component={LossOverview} />}
                  auth={LOSS_READ}
                />
                <PrivateRoute
                  path="/energy/ep-statistics"
                  component={() => <DefaultLayout component={EPStatistics} />}
                  auth={LOSS_READ} // todo 无权限暂时使用
                />
                <PrivateRoute
                  path="/energy/energy-analysis"
                  component={() => <DefaultLayout component={EnergyAnalysis} />}
                  auth={POWER_ANALYSIS_READ}
                />
                <PrivateRoute
                  path="/history/loss-history"
                  component={() => <DefaultLayout component={LossHistory} />}
                  auth={LOSS_READ}
                />
                <PrivateRoute
                  path="/history/history-data"
                  component={() => <DefaultLayout component={History} />}
                  auth={LOSS_READ}
                  // auth={HISTORY_READ}//我没这个权限,调试修改
                />
                <PrivateRoute
                  path="/config/project/:projectId([0-9]+)/loss-config"
                  component={() => <DefaultLayout component={LossConfig} />}
                  auth={PROJECT_READ}
                />
                <PrivateRoute
                  path="/config/inspection-plan"
                  component={() => <DefaultLayout component={InspectionPlan} />}
                  auth={INSPECTION_PLAN_READ}
                />
                <PrivateRoute
                  path="/config/rota"
                  component={() => <DefaultLayout component={Rota} />}
                  auth={ROTA_READ}
                />
                <PrivateRoute
                  path="/config/ticket-statistics"
                  component={() => (
                    <DefaultLayout component={TicketStatistics} />
                  )}
                  auth={TICKET_STAT_READ}
                />
                <PrivateRoute
                  path="/personal-center"
                  component={() => <DefaultLayout component={PersonalCenter} />}
                  auth={TICKET_READ}
                />
                <Route
                  exact
                  path="/notAuthorized"
                  render={() => <NotMatch code={403} />}
                />
                <Route render={() => <NotMatch code={404} />} />
              </Switch>
            </div>
            <Footer />
          </div>
        </LoginRoute>
      </Switch>
    </Router>
  );
};

export default App;
