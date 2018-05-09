import React from 'react';
import { isEqual } from 'lodash';
import { Form, Input, Modal, Upload, Icon, message } from 'antd';
import moment from 'moment';
import Header from './DetailListHeader';
import Item from './DetailListItem';
import { inspectStatusSteps } from 'constants/ticketConfig';
import Steps from './TicketSteps';
import StepItem from './TicketStepHorItem';
import ProcedureItem from './TicketStepVerItem';
import CommentForm from './TicketComment';
import CustomTextarea from './CustomTextarea';
import './TicketDetail.less';
import {
  createTicketSteps,
  createTicketHistories,
  displayText,
  spaceCheck
} from '../lib';
import {
  postInspectionSupplement,
  postInspectionAction
} from 'rest/api/Ticket';
import store from 'store/index';
import oss from 'lib/oss';
const FormItem = Form.Item;
const { TextArea } = Input;

class InspectionDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editable: false,
      previewVisible: false,
      previewImage: '',
      fileList: [],
      comment: props.info.comment
    };
  }

  componentDidMount() {
    this.generateImages(this.props.info.images);
  }

  componentWillReceiveProps(nextProps) {
    const isInfoValid = nextProps.info && nextProps.info.id;
    const isInfoChange =
      this.props.info.state !== nextProps.info.state ||
      nextProps.info.id !== this.props.info.id;
    if (isInfoValid && isInfoChange) {
      this.setState({
        comment: nextProps.info.comment,
        editable: false
      });
      this.generateImages(nextProps.info.images);
    }
  }

  generateImages = async images => {
    let funcs = (images || []).map(i => oss.getFileUrl(i));
    let fileList = await Promise.all(funcs);
    this.setState({
      fileList: fileList.map((i, ind) => ({
        key: images[ind],
        uid: images[ind],
        name: images[ind],
        url: i
      }))
    });
  };

  toggleEditable = () => {
    this.setState({ editable: !this.state.editable });
    if (this.state.editable) {
      this.submit();
    }
  };

  submit = () => {
    this.props.form.validateFields((error, value) => {
      if (!error) {
        postInspectionSupplement(this.props.info.id, {
          comment: value.comment,
          images: this.state.fileList.map(i => i.uid)
        }).then(res => {
          this.setState({ comment: res.comment });
          this.generateImages(res.images);
        });
      }
    });
  };

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true
    });
  };

  handleUpload = async ({ file, onProgress, onSuccess, onError }) => {
    // 文档见rc-upload and oss NodeJs sdk
    try {
      let result = await oss.upload({
        key: file.name + moment().format('x'),
        file: file,
        options: {
          progress: async percentage => {
            onProgress({ percent: percentage * 100 });
          }
        }
      });

      let fileList = [
        ...this.state.fileList,
        {
          uid: result.name,
          url: await oss.getFileUrl(result.name)
        }
      ];
      this.setState({ fileList });
      this.props.getImages(fileList);
      onSuccess(result);
    } catch (err) {
      message.error('上传图片失败，请稍后重试');
      onError(err);
    }
  };

  beforeUpload = file => {
    const allowTypes = ['image/jpeg', 'image/png', 'image/bmp', 'image/gif'];
    const allowSize = 13631488;
    const isTypeAllowed = allowTypes.includes(file.type);
    if (!isTypeAllowed) {
      message.error('请上传正确的图片格式(bmp、jpg、png和gif)!');
    }
    const isSizeAllowed = file.size <= allowSize;
    if (!isSizeAllowed) {
      message.error('上传图片的大小不能超过13M!');
    }
    return isTypeAllowed && isSizeAllowed;
  };

  handleRemove = file => {
    const fileList = [...this.state.fileList];
    let index = fileList.findIndex(i => i.uid === file.uid);
    fileList.splice(index, 1);
    this.setState({ fileList });
    this.props.getImages(fileList);
    return false;
  };

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const { getFieldDecorator } = this.props.form;
    const { info } = this.props;
    const detailData = info && info.id ? info : {};
    const project = detailData.project || {};
    const site = detailData.site || {};
    const content = displayText(detailData.content);
    const siteName = displayText(site.name);
    const currentState = detailData.state;
    const siteAddress = displayText(detailData.address);
    const contact = displayText(detailData.contact);
    const contactPhone = displayText(detailData.contactPhone);
    const inspectionTime = detailData.inspectionTime
      ? moment(detailData.inspectionTime).format('YYYY-MM-DD')
      : '--';
    const finishTime = detailData.finishTime
      ? moment(detailData.finishTime).format('YYYY-MM-DD HH:mm:ss')
      : '--';
    const wholeHistories = [
      ...(detailData.histories || []),
      { state: currentState, assignee: detailData.assignee }
    ];
    const steps = createTicketSteps(inspectStatusSteps)(wholeHistories);
    const histories = createTicketHistories(wholeHistories).reverse();
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传图片</div>
      </div>
    );
    const { user } = store.getState();
    const { userId } = user;
    const assigneeId = (detailData.assignee || {}).id;
    const isMyTicket = () => {
      return userId === assigneeId;
    };
    const isLastStep = () => {
      return detailData.state === 'Finished';
    };
    const uploadDisabled =
      (isLastStep() && !this.state.editable) || fileList.length >= 10;
    return (
      <div className="ticket-detail-list">
        <Header text={'工单内容'} />
        <Item label={'巡检内容'} content={content} />
        <Header text={'工单信息'} />
        <Item label={'工单编号'} content={detailData.serialNumber} />
        <Item label={'巡检工单名称'} content={detailData.name} />
        <Item label={'项目'} content={project.name} />
        <Item label={'配电房'} content={siteName} />
        <Item label={'地址'} content={siteAddress} />
        <Item label={'联系人'} content={contact} />
        <Item label={'联系方式'} content={contactPhone} />
        <Item label={'巡检日期'} content={inspectionTime} />
        <Item label={'巡检完成日期'} content={finishTime} />
        <Header text={'工单状态'} />
        <div className="steps-wrapper">
          <Steps
            steps={steps}
            current={currentState}
            direction={'horizontal'}
            StepNode={StepItem}
          />
        </div>
        {histories.length !== 0 && (
          <div className="procedure-wrapper">
            <div className="label">当前流程</div>
            <div className="steps-wrapper">
              <Steps
                steps={histories}
                StepNode={ProcedureItem}
                direction={'vertical'}
              />
            </div>
          </div>
        )}
        <div>
          <Header text={`工单${isLastStep() ? '反馈' : '备注'}`} />
          <CommentForm
            editable={this.state.editable}
            toggleEditable={this.toggleEditable}
            editBtn={isMyTicket() && isLastStep()}
          >
            {isMyTicket() && (this.state.editable || !isLastStep()) ? (
              <FormItem>
                {getFieldDecorator('comment', {
                  initialValue: isLastStep() ? this.state.comment : '',
                  rules: [
                    {
                      required: true,
                      message: '请输入工单反馈!'
                    },
                    { pattern: spaceCheck, message: '请不要全部输入空格' }
                  ] //提示信息及placeholder待定
                })(
                  <CustomTextarea
                    rows={12}
                    maxLength={200}
                    placeholder="请输入工单反馈"
                    onChange={this.props.getComment}
                  />
                )}
              </FormItem>
            ) : (
              <div className="static-text">{this.state.comment}</div>
            )}
            {isMyTicket() || isLastStep() ? (
              <FormItem
                className={
                  isLastStep() && !this.state.editable ? 'disable' : 'editable'
                }
              >
                <Upload
                  action=""
                  beforeUpload={this.beforeUpload}
                  customRequest={this.handleUpload}
                  listType="picture-card"
                  fileList={fileList}
                  onPreview={this.handlePreview}
                  onRemove={this.handleRemove}
                  disabled={uploadDisabled}
                >
                  {uploadDisabled ? null : uploadButton}
                </Upload>
              </FormItem>
            ) : null}
            <Modal
              visible={previewVisible}
              footer={null}
              onCancel={this.handleCancel}
              className="image-modal"
            >
              <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
          </CommentForm>
        </div>
      </div>
    );
  }
}

export default Form.create()(InspectionDetail);
