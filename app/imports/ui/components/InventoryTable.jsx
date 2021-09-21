import React from 'react';
import PropTypes from 'prop-types';
import { Table, Segment } from 'semantic-ui-react';

const InventoryTable = ({ inventory, color }) => {

  const tableHeader = () => {
    const headers = Object.keys(inventory[0]);
    const tableHeaders = headers.map((header, i) => {
      const key = `h${i}`;
      const newHeader = header.toUpperCase();
      const modifiedHeader = newHeader.replace(/_/g, ' ');
      return (header !== '_id' ?
        <Table.HeaderCell key={key}>{modifiedHeader}</Table.HeaderCell>
        : <></>
      );
    });
    return (tableHeaders);
  };

  const tableData = () => {
    const headers = Object.keys(inventory[0]).filter(header => header !== '_id');
    const listedItems = inventory.map((row, i) => {
      // eslint-disable-next-line no-param-reassign
      const rows = row;
      delete rows._id;
      const columns = (Object.values(rows)).map((col, j) => {
        const key = `${i}_${j}`;
        let column = col;
        if (column instanceof Date) {
          column = column.toLocaleDateString();
        }

        if (typeof (column) === 'undefined' || column === null || column === '') {
          return <Table.Cell/>;
        }

        return <Table.Cell key={key} data-label={headers[j]}>{column.toString()}</Table.Cell>;
      });
      return (
        <Table.Row key={i}>
          {columns}
        </Table.Row>
      );
    });
    return (listedItems);
  };

  return (
    <Segment attached>
      <Table celled striped selectable color={color}>
        <Table.Header>
          <Table.Row>
            { tableHeader() }
          </Table.Row>
        </Table.Header>
        <Table.Body>
          { tableData() }
        </Table.Body>
      </Table>
    </Segment>
  );
};

InventoryTable.propTypes = {
  inventory: PropTypes.array.isRequired,
  color: PropTypes.string.isRequired,
};

export default InventoryTable;
