import React from 'react';
import { Row, Col, Button, Popconfirm, Upload, message } from 'antd';
import TableFactory from 'components/Hoc/TableFactory';
import Tree from 'components/Tree/Tree';
import DetailTable from 'components/DetailTable/DetailTable';
import { assetTitle } from './const';
import { loadAsset, deleteAsset } from 'rest/api/Alarm';
import Oss from 'lib/oss';
import './Asset.less';
import moment from 'moment';
import { loadTreeData } from 'rest/Assets/Asset';
const ButtonGroup = Button.Group;

class AssetCom extends React.Component {
  state = {
    selectedRowKeys: [],
    loading: false
  };
  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };
  onDelete = () => {
    const { selectedRowKeys } = this.state;
    const { onFilterChange } = this.props;
    deleteAsset(selectedRowKeys[0]).then(data => {
      onFilterChange();
    });
  };
  download = () => {
    window.location.assign(
      `http://kf-prod.oss-cn-beijing.aliyuncs.com/template/%E8%AE%BE%E5%A4%87%E6%A1%A3%E6%A1%88%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.xlsx`
    );
  };
  handleUpload = ({ file, onProgress }) => {
    let fileName = `${file.name}_${moment().format('x')}`;
    file[name] = fileName;
    Oss.upload({
      key: fileName,
      file: file
    }).then(json => {
      this.props.onFilterChange();
    });
  };
  render() {
    const {
      projectOptions,
      treeData,
      selectedProjectId,
      selectedTree,
      data,
      changeProject,
      onFilterChange,
      query,
      loading
    } = this.props;
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange
    };
    const props = {
      action: '',
      customRequest: this.handleUpload,
      showUploadList: false
    };
    return (
      <div className="page-assets-asset">
        <div className="search-tree-container">
          <Tree
            treeType="siteId"
            onFilterChange={onFilterChange}
            enableMulti={false}
            loadData={loadTreeData}
          />
        </div>
        <div className="asset-table-container">
          <Row className="asset-table-title">
            <Col span={6} className="asset-table-title-left">
              资产档案管理
            </Col>
            <Col offset={10} span={8} className="asset-table-title-right">
              <ButtonGroup>
                <Popconfirm title="确认删除" onConfirm={this.onDelete}>
                  <Button
                    disabled={!(selectedRowKeys && selectedRowKeys.length)}
                    type="danger"
                  >
                    删除
                  </Button>
                </Popconfirm>
                <Upload {...props} style={{ display: 'inline-block' }}>
                  <Button style={{ borderRadius: '0', marginTop: '1px' }}>
                    上传档案
                  </Button>
                </Upload>
                <Button type="primary" onClick={this.download}>
                  下载模板
                </Button>
              </ButtonGroup>
            </Col>
          </Row>
          <Row>
            <DetailTable
              rowSelection={rowSelection}
              columns={assetTitle}
              data={data}
              onPageChange={onFilterChange}
              page={query.page}
              pageSize={query.size}
              scroll={{ x: '130%' }}
              loading={loading}
            />
          </Row>
        </div>
      </div>
    );
  }
}

export default TableFactory({ query: {}, getAction: loadAsset })(AssetCom);
