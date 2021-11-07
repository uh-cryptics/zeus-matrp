import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Table, Segment } from 'semantic-ui-react';
import HistoryInformation from './HistoryInformation';

const HistoryTable = ({ inventory, setting, filter }) => {
  const [itemInfo, setItemInfo] = useState(null);
  const [open, setOpen] = useState(false);

  const setOpenCallBack = (value) => {
    setOpen(value);
  };

  const openInventoryInfo = (item) => {
    setItemInfo(item);
    setOpenCallBack(true, 'open');
  };

  const tableHeader = () => {
    const headers = Object.keys(inventory[0]).filter((header) => (!(/(_id|type|obtained|provider)/).test(header) ? header : null));
    const tableHeaders = headers.map((header, i) => {
      const key = `h${i}`;
      const newHeader = header.toUpperCase();
      const modifiedHeader = newHeader.replace(/_/g, ' ');
      return (<Table.HeaderCell key={key}>{modifiedHeader}</Table.HeaderCell>);
    });
    return (tableHeaders);
  };

  const tableData = () => {
    const headers = Object.keys(inventory[0]).filter(header => (!(/(_id|type|obtained)/).test(header) ? header : null));
    const listedItems = inventory.filter((value => {
      if (filter === '' || filter === 'All') {
        if (value.patientNumber.includes(setting) ||
            value.amount.toString().includes(setting) ||
            value.clinicLocation.includes(setting) ||
            value.lotNumber.includes(setting)) {
          return value;
        }
      }
    })).map((row, i) => {
      const rows = { ...row };
      delete rows._id;
      delete rows.provider;
      const columns = (Object.values(rows)).map((col, j) => {
        const key = `${i}_${j}`;
        let column = col;
        if (column instanceof Date) {
          column = column.toLocaleDateString();
        }

        if (typeof (column) === 'undefined' || column === null || column === '') {
          return <Table.Cell key={key} />;
        }

        return <Table.Cell key={key} data-label={headers[j]}>{column.toString()}</Table.Cell>;
      });
      const notify = row.quantity < 5 ? 'error' : row.quantity < 11 ? 'warning' : '';
      return (
        <Table.Row key={i} onClick={() => openInventoryInfo(row)} style={{ cursor: 'pointer' }} warning={notify === 'warning'} error={notify === 'error'}>
          {columns}
        </Table.Row>
      );
    });
    return (listedItems);
  };

  return (
    <div>
      <HistoryInformation table={''} item={itemInfo} open={open} setOpen={setOpenCallBack} />
      <Segment attached>
        <Table celled striped selectable>
          <Table.Header>
            <Table.Row>
              {tableHeader()}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {tableData()}
          </Table.Body>
        </Table>
      </Segment>
    </div>
  );
};

HistoryTable.propTypes = {
  inventory: PropTypes.array.isRequired,
  setting: PropTypes.string.isRequired,
  filter: PropTypes.string.isRequired,
};

export default HistoryTable;
