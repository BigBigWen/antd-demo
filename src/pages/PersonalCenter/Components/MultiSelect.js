import React from 'react';
import { isEqual } from 'lodash';
import PropTypes from 'prop-types';
import { Select, Icon } from 'antd';
import './MultiSelect.less';

const Option = Select.Option;
const isSelected = source => target =>
  Array.isArray(source) && Array.isArray(target)
    ? source.filter(i => target.includes(i.value))
    : [];
const notSelected = source => target =>
  Array.isArray(source) && Array.isArray(target)
    ? source.filter(i => !target.includes(i.value))
    : [];
const sortOptions = source => target => {
  let selectedOptions = isSelected(source)(target);
  let notSelectedOptions = notSelected(source)(target).sort(
    (a, b) => a.value > b.value
  );
  return [...selectedOptions, ...notSelectedOptions];
};

export default class MultiSelect extends React.Component {
  static defaultProps = {
    options: [],
    selected: []
  };

  static propTypes = {
    options: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      })
    ),
    selected: PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    ),
    placeholder: PropTypes.string,
    onSubmit: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      options: sortOptions(props.options)(props.selected),
      selected: props.selected,
      hidePlaceholder: false
    };
  }

  componentWillReceiveProps(nextProps) {
    if (
      !isEqual(this.props.options, nextProps.options) ||
      !isEqual(this.props.selected, nextProps.selected)
    ) {
      this.setState({
        options: sortOptions(nextProps.options)(nextProps.selected),
        selected: nextProps.selected
      });
    }
  }

  handleChange = selected => {
    let options = [...this.state.options];
    this.setState(
      {
        selected,
        options: sortOptions(options)(selected)
      },
      () => {
        this.props.onSubmit([...this.state.selected]);
      }
    );
  };

  onSubmit = () => {
    this.props.onSubmit([...this.state.selected]);
  };

  render() {
    const { selected, placeholder, disabled = false } = this.props;
    const { options, hidePlaceholder } = this.state;
    return (
      <div className="multi-select-wrapper" id="multi-select-wrapper">
        <Select
          dropdownMatchSelectWidth={false}
          mode="multiple"
          value={[...selected]}
          placeholder={hidePlaceholder ? '' : placeholder}
          maxTagCount={1}
          onChange={this.handleChange}
          disabled={disabled}
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >=
            0
          }
          onSearch={val => this.setState({ hidePlaceholder: val || val === 0 })}
          onBlur={() => this.setState({ hidePlaceholder: false })}
        >
          {options.map(option => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>
        <Icon type="search" />
      </div>
    );
  }
}
