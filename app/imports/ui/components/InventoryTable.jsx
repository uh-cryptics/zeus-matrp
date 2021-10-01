import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Table, Segment } from 'semantic-ui-react';
import InventoryInformation from './InventoryInformation';
import EditInventory from './EditInventory';

const InventoryTable = ({ inventory, color }) => {

  const [itemInfo, setItemInfo] = useState(null);
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(false);
  const [deleting, setDelete] = useState(false);

  const setOpenCallBack = (value, reason) => {
    if (!value && reason === 'edit') {
      setEdit(true);
    }

    if (!value && reason === 'delete') {
      setDelete(true);
    }
    setOpen(value);
  };

  const openInventoryInfo = (item) => {
    setItemInfo(item);
    setOpenCallBack(true, 'open');
  };

  const setEditCallback = (value, reason) => {
    if (reason === 'cancel') {
      openInventoryInfo(itemInfo);
    }
    setEdit(value);
  };

  const tableHeader = () => {
    const headers = Object.keys(inventory[0]).filter((header) => (!(/(_id|type|obtained)/).test(header) ? header : null));
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
    const listedItems = inventory.map((row, i) => {
      const rows = { ...row };
      delete rows._id;
      delete rows.type;
      delete rows.obtained;
      delete rows.reserve;
      const columns = (Object.values(rows)).map((col, j) => {
        const key = `${i}_${j}`;
        let column = col;
        if (column instanceof Date) {
          column = column.toLocaleDateString();
        }

        if (typeof (column) === 'undefined' || column === null || column === '') {
          return <Table.Cell key={key}/>;
        }

        return <Table.Cell key={key} data-label={headers[j]}>{column.toString()}</Table.Cell>;
      });
      return (
        <Table.Row key={i} onClick={() => openInventoryInfo(row) } style={{ cursor: 'pointer' }}>
          {columns}
        </Table.Row>
      );
    });
    return (listedItems);
  };

  return (
    <div>
      <InventoryInformation item={itemInfo} open={open} setOpen={setOpenCallBack}/>
      <EditInventory item={itemInfo} open={edit} setOpen={setEditCallback}/>
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
    </div>
  );
};

InventoryTable.propTypes = {
  inventory: PropTypes.array.isRequired,
  color: PropTypes.string.isRequired,
};

export default InventoryTable;
