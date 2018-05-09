import React, { Component } from 'react';
import { Button } from 'antd';
import './TicketComment.less';

class TicketComment extends Component {
  render() {
    const { editable, toggleEditable, editBtn, children } = this.props;
    return (
      <div className={`ticket-comment-wrapper ${editable ? 'editable' : ''}`}>
        {editBtn && (
          <div className="edit-btn">
            <Button type="primary" onClick={toggleEditable}>
              {editable ? '保存' : '编辑反馈'}
            </Button>
          </div>
        )}
        {children}
      </div>
    );
  }
}

export default TicketComment;
