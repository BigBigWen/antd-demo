import React from 'react';
import { isEqual, mapValues } from 'lodash';
import PropTypes from 'prop-types';
import './BtnSelect.less';

export default class BtnSelect extends React.Component {
  static defaultProps = {
    options: [],
    style: {}
  };

  static propTypes = {
    options: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      })
    ),
    style: PropTypes.object
  };

  state = {
    selected: this.props.value || this.props.defaultValue || null
  };

  onClick = val => {
    const selected = isEqual(val, this.state.selected)
      ? mapValues(val, () => '')
      : val;
    this.setState({ selected });
    this.props.onClick(selected);
  };

  render() {
    const { options, style } = this.props;
    const { selected } = this.state;
    return (
      <div style={style} className="c-btn-select">
        {options.map((option, index) => (
          <a
            onMouseDown={() => this.onClick(option.value)}
            key={index}
            className={isEqual(selected, option.value) ? 'selected' : ''}
          >
            {option.label}
          </a>
        ))}
      </div>
    );
  }
}
