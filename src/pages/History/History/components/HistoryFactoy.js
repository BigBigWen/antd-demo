import React from 'react';
import { getTime, gettotal, getMax, getMin } from 'lib/helper';
import io from 'socket.io-client';
import Cookies from 'js-cookie';
import moment from 'moment';
//该组件切换每个Tab的getAction
const getReduce = arr => getMax(arr) - getMin(arr);
const getFengGuReta = arr =>
  numLabel((getMax(arr) - getMin(arr)) / getMax(arr) * 100);
const HistoryFactory = ({ tabs, query, ...rest }) => Component =>
  class HOC extends React.Component {
    componentDidMount() {
      const token = Cookies.get('token');
      this.socket = io.connect(
        'http://' + window.location.host + '?access_token=' + token
      );
      this.socket.on('daily-real-time-data', msg => {
        let data = { ...this.props.data };
        data.chartData
          .push([msg.ts, msg.value])
          .sort((a, b) => moment(a, 'x').isBefore(moment(b, 'x')));
        let cardData = {};
        this.query.forEach(a => {
          cardData[`min${a}`] = getMin(data.chartData);
          cardData[`max${a}`] = getMax(data.chartData);
        });
        if (this.query.name === 'P') {
          cardData['fengGuReduce'] = getReduce(data.chartData);
          cardData['fengGuReta'] = getFengGuReta(data.chartData);
        }
        this.setState({
          data: {
            cardData: { ...this.state.cardData, ...cardData },
            chartData: data.chartData,
            tableData: this.state.tableData
          }
        });
      });
    }
    componentWillUnmount() {
      this.socket.close();
    }
    constructor(props) {
      super(props);
      this.query = {
        ...query,
        ...this.props.queryProps
      };
      this.getAction = null;
      this.state = {
        query: { ...this.query },
        data: {},
        loading: false
      };
    }
    onFilterChange = async (queryParams = {}) => {
      //todo 取消订阅
      let isSocket = null;
      let currentItem = null;
      this.query = { ...this.query, ...queryParams };
      if (this.query.aggrLevel === 'measurement') {
        currentItem = tabs.measurementBtns.find(
          a => a.name === this.query.name
        );
      } else if (this.query.aggrLevel === 'circuit') {
        currentItem = tabs.circuitBtns.find(a => a.name === this.query.name);
      } else {
        currentItem = null;
      }
      this.getAction = currentItem.getAction;
      if (this.getAction && this.query.aggrLevelKey) {
        this.setState({ loading: true });
        const values = await this.getAction(this.query);
        isSocket =
          currentItem.socket &&
          this.query.tsStart ===
            moment()
              .startOf('day')
              .valueOf();
        if (isSocket) {
          this.socket.emit('daily-real-time-data-subscribe', {
            queries: { ...this.query }
          });
        } else {
          this.socket.emit(
            'daily-real-time-data-subscribe-stop', //todo 等后台给event name取消订阅
            ('queries': {})
          );
        }
        this.setState({
          data: values.data || [],
          loading: false,
          query: { ...this.query }
        });
      }
    };

    render() {
      const { data, query, loading } = this.state;
      const definedProps = {
        data,
        query,
        loading,
        onFilterChange: this.onFilterChange,
        tabs,
        ...rest
      };
      return <Component {...definedProps} {...this.props} />;
    }
  };

export default HistoryFactory;
