import React from 'react';
import { Modal, Button } from 'antd';
import moment from 'moment';
import JFPGCom from './JFPG/JFPGCom';
import FormList from './FormList/FormList';
import FormListFactory from '../../components/Hoc/FormListFactory';
import './Test.less';
import { Chart } from 'Chart';
import { getLineChart } from './lib';

class ModalCom extends React.Component {
  state = { visible: false };
  showModal = () => {
    this.setState({
      visible: true
    });
  };

  handleCancel = e => {
    this.setState({
      visible: false
    });
  };
  render() {
    return (
      <div className="jfpg-modal">
        <Button type="primary" onClick={this.showModal}>
          Open
        </Button>
        <div>
          <FormList />
        </div>
        <div style={{ width: '600px', height: '400px' }}>
          <Chart option={getLineChart()} />
        </div>
        <Modal
          title="分时电价"
          visible={this.state.visible}
          width={'auto'}
          confirmLoading
          destroyOnClose
          onCancel={this.handleCancel}
          footer={null}
          wrapClassName="jfpu-modal-container"
        >
          <JFPGCom handleCancel={this.handleCancel} />
        </Modal>
      </div>
    );
  }
}
export default ModalCom;
