import React from 'react';
import moment from 'moment';
const TreeTableFactory = ({
  tabs,
  query,
  HandleBtn,
  ...rest
} = {}) => Component => {
  return class ComponentWrapper extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        query: { ...query },
        data: { chartData: [] },
        loading: false,
        tabsActiveKey: tabs.tabArr[0].key || '1',
        getAction: tabs.tabArr[0].getAction
      };
    }
    componentDidMount() {
      this.onFilterChange();
    }
    onFilterChange = async (queryParams = {}) => {
      const { query, getAction } = this.state;
      this.setState({ loading: true });
      let values = await getAction({ ...query, ...queryParams });
      this.setState({
        query: { ...query, ...queryParams },
        loading: false,
        data: values.data || [],
        total: values.total || 1
      });
    };

    changeActiveKey = ({ activeKey, ...rest }) => {
      this.setState(
        {
          tabsActiveKey: activeKey,
          getAction: tabs.tabArr.find(i => i.key === activeKey).getAction,
          query: {
            ...this.state.query,
            ...rest
          }
        },
        () => this.onFilterChange()
      );
    };

    render() {
      const { total, query, loading, data, tabsActiveKey } = this.state;
      const definedProps = {
        total,
        query,
        loading,
        onFilterChange: this.onFilterChange,
        data,
        HandleBtn,
        tabsActiveKey,
        tabsData: tabs.tabArr,
        changeActiveKey: this.changeActiveKey,
        ...rest
      };
      return <Component {...definedProps} />;
    }
  };
};

export default TreeTableFactory;
