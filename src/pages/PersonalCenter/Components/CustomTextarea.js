import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Input } from 'antd';
import './CustomTextarea.less';
import { generateTicketComment } from '../../../actions';

const { TextArea } = Input;

class CustomTextarea extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      comment: props.value || ''
    };
  }

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      const value = nextProps.value;
      this.setState({
        comment: value
      });
    }
  }

  handleCommentChange = e => {
    if (!this.props.value) {
      this.setState({
        comment: e.target.value
      });
    }
    this.triggerChange(e.target.value);
  };

  triggerChange = changedValue => {
    const onChange = this.props.onChange;
    if (onChange) {
      onChange(changedValue);
    }
  };

  render() {
    const { maxLength, rows, placeholder } = this.props;
    const { comment } = this.state;
    const length = comment.split('').length;
    return (
      <div className="custom-textarea">
        <TextArea
          rows={rows}
          maxLength={maxLength}
          placeholder={placeholder}
          value={comment}
          onChange={this.handleCommentChange}
        />
        <span className="number-info">{`${length}/${maxLength}`}</span>
      </div>
    );
  }
}
const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => {
  return {
    generateTicketComment: comment => dispatch(generateTicketComment(comment))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CustomTextarea);
