import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { Container, Header, Loader, Menu, Icon, Input } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Roles } from 'meteor/alanning:roles';
import { PAGE_IDS } from '../utilities/PageIDs';
import { ROLE } from '../../api/role/Role';
import InventoryTable from '../components/InventoryTable';
import AddMedication from '../components/AddMedication';
import DispenseMedication from '../components/DispenseMedication';
import { Medication } from '../../api/medication/MedicationCollection';
import { Supply } from '../../api/supply/SupplyCollection';
import AddSupply from '../components/AddSupply';
import DispenseSupply from '../components/DispenseSupply';

const ListInventory = ({ currentUser, ready, medications, supplies }) => {
  const [showTable, setShowTable] = useState('medications');
  const [open, setOpen] = useState(false);
  const [dispense, setDispense] = useState(false);

  const handleTable = (value) => {
    setShowTable(value);
  };

  return ((ready) ? (
    <Container id={PAGE_IDS.LIST_STUFF}>
      <Header as="h1" textAlign="center">Inventory</Header>
      <Menu icon='labeled' color='blue' inverted size='huge' widths={2}>
        <Menu.Item name='medications' active={showTable === 'medications'} onClick={() => handleTable('medications')}>
          <Icon name='pills' size='large' />
          Medications
        </Menu.Item>
        <Menu.Item name='supply' active={showTable === 'supply'} onClick={() => handleTable('supply')}>
          <Icon name='first aid' size='large' />
          Supply
        </Menu.Item>
      </Menu>
      <Menu attached='top' size='small' inverted>
        {/* <Menu.Item>
          <Input className='icon' icon='search' placeholder='Search...' />
        </Menu.Item> Commenting out searchbar for now, will transfer functionality from InventoryTable */}
        <Menu.Menu position='right' style={{ cursor: 'pointer' }}>
          {currentUser ?
            <Menu.Item onClick={() => { setOpen(true); }}>
              Add &nbsp;
              {(showTable === 'medications') ?
                <Icon.Group size='large'>
                  <Icon name='pills' />
                  <Icon color='blue' corner='top right' name='add' />
                </Icon.Group>
                :
                <Icon.Group size='large'>
                  <Icon name='first aid' />
                  <Icon color='blue' corner='top right' name='add' />
                </Icon.Group>
              }
            </Menu.Item>
            : ''}
          <Menu.Item position='right' onClick={() => { setDispense(true); }}>
            Dispense &nbsp;
            <Icon size='large' name='user md' />
          </Menu.Item>
        </Menu.Menu>
      </Menu>
      {(showTable === 'medications') ?
        <>
          <AddMedication set={medications} open={open} setOpen={setOpen} />
          <InventoryTable inventory={medications} table={showTable}> </InventoryTable>
        </>
        :
        <>
          <AddSupply set={supplies} open={open} setOpen={setOpen} />
          <InventoryTable inventory={supplies} table={showTable}> </InventoryTable>
        </>
      }
      {(showTable === 'medications') ?
        <DispenseMedication set={medications} open={dispense} setOpen={setDispense} />
        :
        <DispenseSupply set={supplies} open={dispense} setOpen={setDispense} />
      }
    </Container>
  ) :
    <Loader active>Getting data</Loader>
  );
};

// Require an array of Stuff documents in the props.
ListInventory.propTypes = {
  medications: PropTypes.array.isRequired,
  supplies: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
  currentUser: PropTypes.bool.isRequired,
};

// withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
export default withTracker(() => {
  // Check what level the current user is
  const currentUser = Roles.userIsInRole(Meteor.userId(), [ROLE.ADMIN]);
  // Get access to Stuff documents.
  const subscription = Medication.subscribeMedication();
  const subscription2 = Supply.subscribeSupply();
  // Determine if the subscription is ready
  const ready = subscription.ready() && subscription2.ready();
  // Get the Medication and Supply documents and sort them by name.
  const medications = Medication.find({}, { sort: { name: 1 } }).fetch();
  const supplies = Supply.find({}, { sort: { name: 1 } }).fetch();
  return {
    medications,
    supplies,
    ready,
    currentUser,
  };
})(ListInventory);
