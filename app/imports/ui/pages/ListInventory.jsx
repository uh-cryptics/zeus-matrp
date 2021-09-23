import React, { useState } from 'react';
import { Container, Header, Loader, Menu, Icon, Input } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { PAGE_IDS } from '../utilities/PageIDs';
import InventoryTable from '../components/InventoryTable';
import { Inventory } from '../../api/inventory/InventoryCollection';
import AddInventory from '../components/AddInventory';

const ListInventory = ({ ready, inventory }) => {
  const [showTable, setShowTable] = useState('medications');
  const [open, setOpen] = useState(false);

  const handleTable = (value) => {
    setShowTable(value);
  };

  return ((ready) ? (
    <Container id={PAGE_IDS.LIST_STUFF}>
      <Header as="h1" textAlign="center">Inventory</Header>
      <Menu icon='labeled' color='blue' inverted size='huge' widths={2}>
        <Menu.Item name='medications' active={showTable === 'medications'} onClick={() => handleTable('medications')}>
          <Icon name='pills' size='large'/>
          Medications
        </Menu.Item>
        <Menu.Item name='supply' active={showTable === 'supply'} onClick={() => handleTable('supply')}>
          <Icon name='first aid' size='large'/>
          Supply
        </Menu.Item>
      </Menu>
      <Menu attached='top' size='small' inverted>
        <Menu.Item>
          <Input className='icon' icon='search' placeholder='Search...'/>
        </Menu.Item>
        <Menu.Menu position='right' style={{ cursor: 'pointer' }}>
          <Menu.Item onClick={() => { setOpen(true); }}>
            Add &nbsp;
            { (showTable === 'medications') ?
              <Icon.Group size='large'>
                <Icon name='pills'/>
                <Icon color='blue' corner='top right' name='add'/>
              </Icon.Group>
              :
              <Icon.Group size='large'>
                <Icon name='first aid'/>
                <Icon color='blue' corner='top right' name='add'/>
              </Icon.Group>
            }
          </Menu.Item>
          <Menu.Item position='right'>
              Administer &nbsp;
            <Icon size='large' name='user md'/>
          </Menu.Item>
        </Menu.Menu>
      </Menu>
      <AddInventory set={inventory} open={open} setOpen={setOpen} />
      {(showTable === 'medications' ?
        <InventoryTable inventory={inventory.filter(stuff => stuff.type === 'Medication')} color='green'> </InventoryTable>
        :
        <InventoryTable inventory={inventory.filter(stuff => stuff.type === 'Supply')} color='violet'> </InventoryTable>
      )}

    </Container>
  ) :
    <Loader active>Getting data</Loader>
  );
};

// Require an array of Stuff documents in the props.
ListInventory.propTypes = {
  inventory: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

// withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
export default withTracker(() => {
  // Get access to Stuff documents.
  const subscription = Inventory.subscribeInventory();
  // Determine if the subscription is ready
  const ready = subscription.ready();
  // Get the Stuff documents and sort them by name.
  const inventory = Inventory.find({}, { sort: { name: 1 } }).fetch();
  return {
    inventory,
    ready,
  };
})(ListInventory);
