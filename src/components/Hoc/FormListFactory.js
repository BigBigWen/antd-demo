import React from 'react';
import { Form, Input, Icon, Button } from 'antd';
const FormItem = Form.Item;

let uuid = 0;
const FormListFactory = ({
  handleCancel = () => {},
  handelDelete = () => {},
  handelAdd = () => {},
  handelSubmit = () => {},
  handelEdit = () => {},
  getFormList = () => {}
}) => Component => {
  class FormListWrapper extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        isEdit: false
      };
      const { getFieldDecorator } = this.props.form;
      getFieldDecorator('keys', { initialValue: [''] });
    }
    handleCancel = k => {
      const { form } = this.props;
      const keys = form.getFieldValue('keys');
      if (keys.length === 1) {
        return;
      }
      form.setFieldsValue({
        keys: keys.filter(key => key !== k)
      });
    };

    add = () => {
      const { form } = this.props;
      // can use data-binding to get
      const keys = form.getFieldValue('keys');
      const nextKeys = keys.concat(uuid);
      uuid++;
      // can use data-binding to set
      // important! notify form to detect changes
      form.setFieldsValue({
        keys: nextKeys
      });
    };

    handleSubmit = e => {
      e.preventDefault();
      this.props.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values);
        }
      });
    };
    render() {
      const { getFieldDecorator, getFieldValue } = this.props.form;
      const formItemLayout = {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 4 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 20 }
        }
      };
      const formItemLayoutWithOutLabel = {
        wrapperCol: {
          xs: { span: 24, offset: 0 },
          sm: { span: 20, offset: 4 }
        }
      };
      const keys = getFieldValue('keys');
      const { isEdit } = this.props;
      const definedProps = {
        keys,
        handleCancel: this.handleCancel
      };
      return (
        <Form
          onSubmit={this.handleSubmit}
          style={{ width: '510px', padding: '40px' }}
        >
          <Component {...definedProps} {...this.props} />
          <FormItem {...formItemLayoutWithOutLabel}>
            <Button type="dashed" onClick={this.add} style={{ width: '60%' }}>
              <Icon type="plus" /> 添加
            </Button>
          </FormItem>
          <FormItem {...formItemLayoutWithOutLabel}>
            <Button type="primary" htmlType="submit">
              保存
            </Button>
          </FormItem>
        </Form>
      );
    }
  }
  return Form.create()(FormListWrapper);
};

export default FormListFactory;
