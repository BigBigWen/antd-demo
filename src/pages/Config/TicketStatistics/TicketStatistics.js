import React from 'react';
import { Button } from 'antd';
import { ticketCountTitle, ticketHourTitle } from './const';
import DetailTable from 'components/DetailTable/DetailTable';
import { TabTableFactory } from 'components/Hoc';
import './TicketStatistics.less';
import {
  getStatCount,
  getStatDuration,
  exportWorkSheet,
  exportWorkHourSheet
} from 'rest/api/Ticket';

const param = [
  {
    id: '1',
    name: '工单数',
    getAction: getStatCount,
    columns: [...ticketCountTitle],
    handleBtn: () => (
      <Button type="primary" onClick={exportWorkSheet}>
        导出报表
      </Button>
    )
  },
  {
    id: '2',
    name: '工单时长',
    getAction: getStatDuration,
    columns: [...ticketHourTitle],
    handleBtn: () => (
      <Button type="primary" onClick={exportWorkHourSheet}>
        导出报表
      </Button>
    )
  }
];

class TicketStatistics extends React.Component {
  render() {
    const { columns, data, onFilterChange, query, total, loading } = this.props;
    return (
      <div className="page-ticket-statistics">
        <DetailTable
          columns={columns}
          data={[...data]}
          total={total}
          onPageChange={onFilterChange}
          pageSize={query.size}
          page={query.page}
          loading={loading}
        />
      </div>
    );
  }
}

export default TabTableFactory([...param], [])(TicketStatistics);
