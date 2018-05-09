import React from 'react';
import PropTypes from 'prop-types';
import { Select, Icon } from 'antd';
import './SearchDropdown.less';
const Option = Select.Option;

export default class SearchDropdown extends React.Component {
  static defaultProps = {
    options: [],
    active: false,
    value: ''
  };

  static propTypes = {
    active: PropTypes.bool,
    value: PropTypes.oneOfType(PropTypes.string, PropTypes.number),
    options: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.oneOfType(PropTypes.string, PropTypes.number)
      })
    )
  };

  state = {
    active: false,
    value: this.props.value
  };
  componentWillReceiveProps(nextProps) {
    if (nextProps.value) {
      this.setState({ value: nextProps.value });
    }
  }

  showSelect = () => {
    this.setState({ active: true });
    this.autoFocus();
  };

  hideSelect = () => {
    this.setState({ active: false });
  };

  autoFocus = () => {
    const selector = document.getElementById('selector');
    selector.click();
  };

  handleSelectChange = value => {
    this.setState({ value });
    this.hideSelect();
    this.props.changeProject(value);
  };

  render() {
    const { options } = this.props;
    const { active, value } = this.state;
    const label = ([...options].find(i => i.value === value) || {}).label;
    return (
      <div className="c-dropdown-select-wrapper">
        {active && (
          <div className="label-wrapper" title={label || ''}>
            <span className="project-name">{label || '请选择项目'}</span>
            <Icon type={'up'} style={{ marginLeft: 12 }} />
          </div>
        )}
        {!active && (
          <div
            className="label-wrapper"
            onClick={this.showSelect}
            title={label || ''}
          >
            <span className="project-name">{label || '请选择项目'}</span>
            <Icon type={'down'} style={{ marginLeft: 12 }} />
          </div>
        )}
        <Select
          id="selector"
          showSearch
          autoFocus
          style={{
            position: 'absolute',
            transform: `translateY(11px)`,
            zIndex: active ? 1 : -1,
            opacity: active ? 1 : 0,
            transition: 'all 0.3s ease-in-out',
            width: '230px'
          }}
          placeholder="请输入项目名称"
          optionFilterProp="children"
          filterOption={(input, option) =>
            option.props.children.toLowerCase().includes(input.toLowerCase())
          }
          onChange={this.handleSelectChange}
          onBlur={this.hideSelect}
          value={value}
        >
          {options.map(option => (
            <Option
              value={option.value}
              key={option.value}
              title={option.label}
            >
              {option.label}
            </Option>
          ))}
        </Select>
      </div>
    );
  }
}
