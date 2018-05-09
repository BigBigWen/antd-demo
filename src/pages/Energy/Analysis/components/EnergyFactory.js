import React from 'react';
import { measurementBtns } from '../const';
import { getTime } from 'lib/helper';
import moment from 'moment';

const EnergyFactory = ({ tabs, query, ...rest }) => Component =>
  class HOC extends React.Component {
    constructor(props) {
      super(props);
      this.query = {
        aggrLevel: 'measurement',
        ...query,
        ...this.props.queryProps
      };
      this.getAction = null;
      this.state = {
        query: { ...this.query },
        data: {},
        loading: false,
        activeKey: tabs[0].key
      };
    }

    componentDidMount() {
      this.onTabChange(this.state.activeKey);
    }

    onTabChange = key => {
      let activeTab = tabs.find(i => i.key === key);
      this.getAction = activeTab.getAction;
      this.setState(
        {
          activeKey: key,
          data: {}
        },
        () => {
          const { defaultDate, aggrLevel } = activeTab;
          const time = getTime(defaultDate, moment());
          this.onFilterChange({ aggrby: defaultDate, aggrLevel, ...time });
        }
      );
    };

    onFilterChange = async (queryParams = {}) => {
      this.query = { ...this.query, ...queryParams };
      if (this.getAction && this.query.aggrLevelKey) {
        console.log(this.query);
        this.setState({ loading: true });
        const values = await this.getAction(this.query);
        this.setState({
          data: values.data || [],
          loading: false,
          query: { ...this.query }
        });
      }
    };

    render() {
      const { data, query, loading, activeKey } = this.state;
      const definedProps = {
        data,
        query,
        loading,
        onFilterChange: this.onFilterChange,
        onTabChange: this.onTabChange,
        tabs,
        activeKey,
        ...rest
      };
      return <Component {...definedProps} {...this.props} />;
    }
  };

export default EnergyFactory;
