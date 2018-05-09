import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { Select, Icon } from 'antd';
import './DropdownSelect.less';
const Option = Select.Option;

export default class DropdownSelect extends React.Component {
  static defaultProps = {
    options: [{ value: 1, label: '' }],
    style: {},
    changeProject: () => {}
  };

  static propTypes = {
    options: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.number,
        label: PropTypes.string
      })
    ).isRequired,
    style: PropTypes.object,
    changeProject: PropTypes.func
  };

  state = {
    active: false,
    value: this.props.defaultValue || this.props.options[0].value || ''
  };
  componentWillReceiveProps(nextProps) {
    if (this.props.defaultValue !== nextProps.defaultValue) {
      this.setState({
        value: nextProps.defaultValue
      });
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
    ReactDOM.findDOMNode(this.selector).click();
  };

  handleSelectChange = value => {
    this.setState({ value });
    this.props.changeProject && this.props.changeProject(value);
    this.hideSelect();
  };

  render() {
    const { options, style, ...rest } = this.props;
    const { active, value } = this.state;
    const label = ([...options].find(i => i.value == value) || {}).label;
    return (
      <div className="c-dropdown-select" style={style}>
        {active && (
          <div className="label-wrapper" title={label || ''}>
            <span>{label || '请选择项目'}</span>
            <Icon type={'up'} style={{ marginLeft: 12 }} />
          </div>
        )}
        {!active && (
          <div
            className="label-wrapper"
            title={label || ''}
            onClick={this.showSelect}
          >
            <span>{label || '请选择项目'}</span>
            <Icon type={'down'} style={{ marginLeft: 12 }} />
          </div>
        )}

        <Select
          ref={ele => {
            this.selector = ele;
          }}
          showSearch
          style={{
            position: 'absolute',
            transform: `translateY(25px)`,
            zIndex: active ? 10 : -1,
            opacity: active ? 1 : 0,
            transition: 'all 0.3s ease-in-out',
            width: '100%',
            backgroundColor: '#fff'
          }}
          placeholder="请选择项目"
          optionFilterProp="children"
          filterOption={(input, option) =>
            option.props.children.toLowerCase().includes(input.toLowerCase())
          }
          onChange={this.handleSelectChange}
          onBlur={this.hideSelect}
          value={`${value}`}
          {...rest}
        >
          {options.map(option => (
            <Option
              value={`${option.value}`}
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
