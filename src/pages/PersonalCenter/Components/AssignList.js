import React, { Component } from 'react';
import { List, Modal, Radio, Button } from 'antd';
import './AssignList.less';

const Item = List.Item;
// const RadioItem = Radio.RadioItem;

class AssignList extends Component {
  state = {
    checked: null
  };

  onCheck = (e, id) => {
    this.setState({ checked: id });
  };

  onConfirm = () => {
    this.props.onConfirm(this.state.checked);
    this.setState({ checked: null });
  };

  onClose = () => {
    this.setState({ checked: null });
    this.props.onClose();
  };

  render() {
    const { data, visible } = this.props;
    return (
      <Modal
        visible={visible}
        transparent
        className="assign-list-modal"
        onClose={this.onClose}
      >
        <List renderHeader={() => <div>请点击选择人员</div>}>
          {data.length ? (
            data.map(item => (
              <div>
                <div className="name">{item.name}</div>
                <div className="task">{`有${item.ticketCount}项需要执行`}</div>
              </div>
            ))
          ) : (
            <div className="empty-msg">暂时没有人员可供选择</div>
          )}
        </List>
        <Button
          type="primary"
          disabled={!this.state.checked}
          onClick={this.onConfirm}
        >
          确定
        </Button>
      </Modal>
    );
  }
}

export default AssignList;
