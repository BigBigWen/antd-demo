import React from 'react';
import { Table } from 'antd';
import TableTooltips from '../UI/TableTooltips';
import './DetailTable.less';
import NotFound from '../UI/NotFound';

const { Column } = Table;

class DetailTable extends React.Component {
  static defaultProps = {
    onRowClick: () => {}
  };

  constructor(props) {
    super(props);
  }

  render() {
    const {
      columns,
      footer,
      data,
      total,
      loading,
      pageSize,
      page,
      onRowClick,
      operationRender,
      onPageChange,
      operationWidth,
      scroll,
      rowSelection,
      rowClassName,
      pagination
    } = this.props;
    const onRow = record => {
      return {
        onClick: () => {
          onRowClick(record);
        }
      };
    };
    return (
      <Table
        rowClassName={rowClassName ? record => rowClassName(record) : () => {}}
        className="c-detail-table"
        loading={loading}
        dataSource={data}
        footer={data.length ? footer : null}
        onRow={onRow}
        rowKey={record => record.id}
        pagination={
          pagination === null
            ? false
            : {
                pageSize: pageSize || 10,
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '30', '40', '50'],
                total: total,
                size: 'small',
                current: page + 1,
                onChange: page => {
                  onPageChange({ page: page - 1 });
                },
                onShowSizeChange: (current, size) => {
                  onPageChange({ size });
                }
              }
        }
        locale={{
          emptyText: '暂无数据'
        }}
        scroll={scroll ? scroll : {}}
        rowSelection={rowSelection ? rowSelection : null}
      >
        {columns.map((item, index) => (
          <Column
            {...item}
            key={item.title}
            title={item.title}
            render={text => <TableTooltips title={text} render={item.render} />}
          />
        ))}
        {operationRender ? (
          <Column
            width={operationWidth || 250}
            title={'操作'}
            key="action"
            render={(text, record) => (
              <div className="operation-cell">{operationRender(record)}</div>
            )}
          />
        ) : null}
      </Table>
    );
  }
}

export default DetailTable;
