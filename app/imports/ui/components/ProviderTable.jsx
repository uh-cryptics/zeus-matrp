import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Table, Segment } from 'semantic-ui-react';
import InventoryInformation from './InventoryInformation';
import EditMedication from './EditMedication';
import EditSupply from './EditSupply';
import DeleteMedication from './DeleteMedication';
import DeleteSupply from './DeleteSupply';

const ProviderTable = ({ inventory, table, setting }) => {
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
    if (item) {
      setItemInfo(item);
    }
    setOpenCallBack(true, 'open');
  };

  const setEditCallback = (value, reason) => {
    if (reason === 'cancel') {
      openInventoryInfo();
    }
    setEdit(value);
  };

  const setDeleteCallback = (value, reason) => {
    if (reason === 'cancel') {
      openInventoryInfo();
    }
    setDelete(value);
  };

  const tableHeader = () => {
    const headers = Object.keys(inventory[0]).filter((header) => (!(/(_id|type|obtained|note)/).test(header) ? header : null));
    if (headers[headers.length - 1] !== 'unit') {
      headers.push('unit');
    }

    const tableHeaders = headers.map((header, i) => {
      const key = `h${i}`;
      const newHeader = header.toUpperCase();
      const modifiedHeader = newHeader.replace(/_/g, ' ');
      return (<Table.HeaderCell key={key}>{modifiedHeader}</Table.HeaderCell>);
    });
    return (tableHeaders);
  };

  const tableData = () => {
    const headers = Object.keys(inventory[0]).filter(header => (!(/(_id|type|obtained|note)/).test(header) ? header : null));
    const listedItems = inventory.filter((value => {
      if (value.name.toLowerCase().includes(setting.toLowerCase()) ||
            value.quantity.toString().includes(setting) ||
            value.location.toLowerCase().includes(setting.toLowerCase()) ||
            value.lot.toLowerCase().includes(setting.toLowerCase())) {
        return value;
      }
    })).map((row, i) => {
      const rows = { ...row };
      delete rows._id;
      delete rows.type;
      delete rows.obtained;
      delete rows.note;
      delete rows.reserve;
      if (rows.unit === undefined) {
        rows.unit = 'N/A';
      }
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
      <InventoryInformation table={table} item={itemInfo} open={open} setOpen={setOpenCallBack} />
      {(table === 'medications') ?
        <EditMedication item={itemInfo} open={edit} setOpen={setEditCallback} medications={inventory} />
        :
        <EditSupply item={itemInfo} open={edit} setOpen={setEditCallback} supplies={inventory}/>
      }
      {(table === 'medications') ?
        <DeleteMedication item={itemInfo} open={deleting} setOpen={setDeleteCallback} />
        :
        <DeleteSupply item={itemInfo} open={deleting} setOpen={setDeleteCallback} />
      }
      <Segment attached>
        <Table celled striped selectable color={table === 'medications' ? 'green' : 'violet'}>
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

ProviderTable.propTypes = {
  inventory: PropTypes.array.isRequired,
  table: PropTypes.string.isRequired,
  setting: PropTypes.string.isRequired,
};

export default ProviderTable;
