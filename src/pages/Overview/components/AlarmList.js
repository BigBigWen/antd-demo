import React from 'react';
import $ from 'jquery';
import AlarmItem from './AlarmItem';
import './AlarmList.less';

class AlarmList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data || []
    };
    this.scrollWrapper = null;
    this.scrollElm = null;
    this.ts = null;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data) {
      this.setState({
        data:
          nextProps.data.length >= 4
            ? [...nextProps.data, ...nextProps.data]
            : [...nextProps.data]
      });
    }
  }

  componentDidMount() {
    this.scrollWrapper = $('.scroll-wrapper');
    this.scrollElm = $('.scroll-elm');

    this.timer = window.setInterval(
      () => this.scrollTop(this.scrollWrapper, this.scrollElm),
      50
    );

    this.scrollWrapper.mouseover(() => {
      clearInterval(this.timer);
    });

    this.scrollWrapper.mouseout(() => {
      this.timer = window.setInterval(
        () => this.scrollTop(this.scrollWrapper, this.scrollElm),
        50
      );
    });

    this.scrollWrapper.bind('mousewheel', e => {
      if (new Date().getTime() - this.ts < 30) return;
      let scrollTop = this.scrollWrapper.scrollTop();
      let height = this.scrollElm.height();
      if (e.originalEvent.wheelDelta < 0) {
        scrollTop = scrollTop >= height / 2 ? 0 : scrollTop + 15;
        this.scrollWrapper.scrollTop(scrollTop);
      } else {
        scrollTop = scrollTop <= 0 ? height / 2 : scrollTop - 15;
        this.scrollWrapper.scrollTop(scrollTop);
      }
      this.ts = new Date().getTime();
    });
  }

  scrollTop(wrapper, elm) {
    let scrollTop = wrapper.scrollTop();
    let clientHeight = wrapper[0].clientHeight;
    let height = elm.height();
    wrapper.scrollTop(scrollTop >= height / 2 ? 0 : scrollTop + 1);
  }

  render() {
    const { data } = this.state;
    const { theme } = this.props;
    console.log(data);
    return (
      <div className={`alarm-list ${theme}`}>
        <div className="list-header">
          <div>报警列表</div>
          <div
            className="decration"
            onClick={() => this.props.showAlarmModal()}
          >
            <div className="inner" />
          </div>
        </div>
        <div className="scroll-wrapper">
          <div className="scroll-elm">
            <ul>
              {[...data].map((x, index) => (
                <AlarmItem
                  key={index}
                  data={x}
                  readAlarm={() => this.props.readAlarm(x)}
                  generateTicket={() => this.props.generateTicket(x)}
                />
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}
export default AlarmList;
