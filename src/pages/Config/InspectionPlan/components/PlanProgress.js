import React from 'react';
import moment from 'moment';
import { Button, Icon } from 'antd';
import { dateLabel } from 'lib/helper';
import './PlanProgress.less';

const isLate = (finishTime, nextTime) =>
  finishTime ? finishTime > nextTime : moment().format('x') > nextTime;

const getClassName = (index, tickets) => {
  if (index + 1 === tickets.length) {
    return 'current';
  } else if (
    isLate(tickets[index].finishTime, tickets[index + 1].inspectionTime)
  ) {
    return 'late';
  } else {
    return 'finished';
  }
};

export default class PlanProgress extends React.Component {
  state = {
    currentIndex: 0 //left
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.tickets !== this.props.tickets) {
      this.setState({ currentIndex: 0 });
    }
  }

  moveLeft = () => {
    if (this.state.currentIndex + 2 < this.props.tickets.length) {
      let currentIndex = this.state.currentIndex + 3;
      this.setState({ currentIndex });
    }
  };

  moveRight = () => {
    if (this.state.currentIndex !== 0) {
      let currentIndex = this.state.currentIndex - 3;
      this.setState({ currentIndex });
    }
  };

  componentDidUpdate(prevProps, prevState) {
    let progressWrapper = document.querySelector('.tickets-wrapper');
    if (this.props.tickets === prevProps.tickets) {
      let next = Math.floor(this.state.currentIndex / 3);
      progressWrapper.style.transform = `translateX(${-next * 100}%)`;
    } else {
      progressWrapper.style.transform = `translateX(0)`;
    }
  }

  render() {
    const { tickets } = this.props;
    const { currentIndex } = this.state;
    const leftDisable = currentIndex + 3 >= tickets.length;
    const rightDisable = currentIndex === 0;
    return (
      <div className="plan-progress">
        {!leftDisable && (
          <div className="btn-wrapper-left">
            <Button type="default" onClick={this.moveLeft}>
              <Icon type="left" />
            </Button>
          </div>
        )}
        <div className="tickets-wrapper">
          {tickets.map((item, index) => {
            const assignee = item.assignee || {};
            return (
              <div key={index} className="plan-ticket">
                <span className="text">第{index + 1}次</span>
                <span className={`icon ${getClassName(index, tickets)}`} />
                <span className="text">
                  {dateLabel(item.inspectionTime, 'YYYY-MM-DD')}
                </span>
                <span className="text">{assignee.name}</span>
              </div>
            );
          })}
        </div>
        {!rightDisable && (
          <div className="btn-wrapper-right">
            <Button type="default" onClick={this.moveRight}>
              <Icon type="right" />
            </Button>
          </div>
        )}
      </div>
    );
  }
}
