import React from 'react';
import { Tabs } from 'antd';
import moment from 'moment';
import TicketContent from './Components/TicketContent';
import MultiSelect from './Components/MultiSelect';
import './PersonalCenter.less';

const TabPane = Tabs.TabPane;

class PersonalCenter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeKey: 'repair'
    };
  }

  handletabChange = key => {
    this.setState({ activeKey: key });
  };

  render() {
    return (
      <div className="page-personal-center">
        <div className="content-wrapper">
          <Tabs defaultActiveKey="repair" onChange={this.handletabChange}>
            <TabPane tab="抢修工单" key="repair">
              <TicketContent type="repair" activeKey={this.state.activeKey} />
            </TabPane>
            <TabPane tab="巡检工单" key="inspection">
              <TicketContent
                type="inspection"
                activeKey={this.state.activeKey}
              />
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}

export default PersonalCenter;
