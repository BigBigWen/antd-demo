import React from 'react';
import { Tabs } from 'antd';
import moment from 'moment';
const TabPane = Tabs.TabPane;

const TabTableFactory = tabInfo => Component => {
  return class ComponentWrapper extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        activeKey: tabInfo[0].id,
        query: { ...tabInfo[0].query, page: 0, size: 10 },
        data: [],
        loading: false
      };
    }

    componentDidMount() {
      this.onFilterChange();
    }

    onFilterChange = async (queryParams = {}) => {
      this.setState({ loading: true });
      const { activeKey, query } = this.state;
      let values = await tabInfo.find(info => info.id === activeKey).getAction({
        ...query,
        ...queryParams,
        page: queryParams.size
          ? 0
          : queryParams.page || queryParams.page === 0
            ? queryParams.page
            : query.page
      });
      this.setState({
        query: {
          ...query,
          ...queryParams
        },
        data: values.data,
        totalNum: values.total,
        loading: false
      });
    };

    changeTab = activeKey => {
      this.setState(
        {
          activeKey,
          query: {
            ...tabInfo.find(tab => tab.id === activeKey).query,
            page: 0,
            size: 10
          }
        },
        () => this.onFilterChange()
      );
    };

    render() {
      const { activeKey, data, totalNum, loading, query } = this.state;
      let AddLineCom = tabInfo.find(info => info.id === activeKey).handleBtn;
      return (
        <div style={{ display: 'flex', width: '100%' }}>
          <Tabs
            activeKey={activeKey}
            onChange={this.changeTab}
            animated={false}
            tabBarStyle={{
              backgroundColor: '#fff',
              marginBottom: '8px',
              paddingRight: '20px',
              height: '46px'
            }}
            tabBarExtraContent={
              AddLineCom ? (
                <AddLineCom onFilterChange={this.onFilterChange} />
              ) : null
            }
          >
            {tabInfo && tabInfo.length ? (
              tabInfo.map(info => {
                const props = {
                  ...info,
                  data: data,
                  total: totalNum,
                  onFilterChange: this.onFilterChange,
                  page: query.page,
                  query: query,
                  loading: loading,
                  operationWidth: info.operationWidth
                };
                return (
                  <TabPane tab={info.name} key={info.id}>
                    <Component {...props} />
                  </TabPane>
                );
              })
            ) : (
              <div>无数据</div>
            )}
          </Tabs>
        </div>
      );
    }
  };
};

export default TabTableFactory;
