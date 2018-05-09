import React from 'react';
import { Icon, Spin } from 'antd';
import './Expand.less';

export default class Expand extends React.Component {
  state = {
    expand: false
  };

  onExpand = () => this.setState({ expand: true });

  onClose = () => this.setState({ expand: false });

  render() {
    const { title, stat, rank, rankTitle, theme, loading } = this.props;
    const { expand } = this.state;
    return (
      <div className={`expand ${theme}`}>
        {loading && <Spin />}
        <div className="stat">
          <div className="title">
            <div className="text">{title}</div>
            {!expand && (
              <Icon type="bars" className="icon" onClick={this.onExpand} />
            )}
          </div>
          {Array.isArray(stat) ? (
            <ul className="stat-list">
              {stat.map(i => (
                <li className="stat-item" key={i.label}>
                  <span className="label">{i.label}</span>
                  <span className="value">
                    {i.value} {i.unit}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="stat-data">
              <div className="value">
                {stat.value} {stat.unit}
              </div>
            </div>
          )}
        </div>
        {expand && (
          <div className="rank">
            <div className="title">
              <div className="text">{rankTitle}</div>
              <Icon type="close" className="icon" onClick={this.onClose} />
            </div>
            <ul className="rank-list">
              {rank.map((i, ind) => (
                <li className="rank-item" key={ind}>
                  <div className="order">
                    <span className="icon">{ind + 1}</span>
                    <span className="label">{i.label}</span>
                  </div>
                  <span className="value">
                    {i.value} {i.unit}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }
}
