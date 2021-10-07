import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Table, Segment, Input, Menu } from 'semantic-ui-react';
import InventoryInformation from './InventoryInformation';
import EditMedication from './EditMedication';
import EditSupply from './EditSupply';
import DeleteMedication from './DeleteMedication';
import DeleteSupply from './DeleteSupply';

const InventoryTable = ({ inventory, table }) => {

  const [itemInfo, setItemInfo] = useState(null);
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(false);
  const [deleting, setDelete] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const searchTable = () => (
    <Menu.Item>
      <Input className='icon' icon='search' placeholder='Search...' onChange={(e) => {
        setSearchTerm(e.target.value);
      }}/>
    </Menu.Item>
  );

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

  const setDeleteCallback = (value, reason) => {
    if (reason === 'cancel') {
      openInventoryInfo(itemInfo);
    }
    setDelete(value);
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
    const listedItems = inventory.filter((value => {
      if (searchTerm === '') {
        return value;
      } if (value.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          value.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          value.lot.toLowerCase().includes(searchTerm.toLowerCase())) {
        return value;
      }
    })).map((row, i) => {
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
          return <Table.Cell key={key} />;
        }

        return <Table.Cell key={key} data-label={headers[j]}>{column.toString()}</Table.Cell>;
      });
      return (
        <Table.Row key={i} onClick={() => openInventoryInfo(row)} style={{ cursor: 'pointer' }}>
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
        <EditMedication item={itemInfo} open={edit} setOpen={setEditCallback} />
        :
        <EditSupply item={itemInfo} open={edit} setOpen={setEditCallback} />
      }
      {(table === 'medications') ?
        <DeleteMedication item={itemInfo} open={deleting} setOpen={setDeleteCallback} />
        :
        <DeleteSupply item={itemInfo} open={deleting} setOpen={setDeleteCallback} />
      }
      <Segment attached>
        {searchTable()}
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

InventoryTable.propTypes = {
  inventory: PropTypes.array.isRequired,
  table: PropTypes.string.isRequired,
};

export default InventoryTable;
