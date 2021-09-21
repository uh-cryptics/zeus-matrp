import React, { useState } from 'react';
import { Container, Header, Loader, Menu, Icon, Input } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { PAGE_IDS } from '../utilities/PageIDs';
import InventoryTable from '../components/InventoryTable';
import { Inventory } from '../../api/inventory/InventoryCollection';

/** Renders a table containing all of the Stuff documents. Use <StuffItem> to render each row. */
const ListInventory = ({ ready, stuffs }) => {
  const [showTable, setShowTable] = useState('medications');

  const handleTable = (value) => {
    setShowTable(value);
  };

  return ((ready) ? (
    <Container id={PAGE_IDS.LIST_STUFF}>
      <Header as="h1" textAlign="center">Inventory</Header>
      <Menu icon='labeled' color='blue' inverted size='huge' widths={2}>
        <Menu.Item name='medications' active={showTable === 'medications'} onClick={() => handleTable('medications')}>
          <Icon name='syringe' size='large'/>
          Medications
        </Menu.Item>
        <Menu.Item name='supply' active={showTable === 'supply'} onClick={() => handleTable('supply')}>
          <Icon name='first aid' size='large'/>
          Supply
        </Menu.Item>
      </Menu>
      <Menu attached='top' size='small' inverted>
        <Menu.Item>
          <Input className='icon' icon='search' placeholder='Search...' />
        </Menu.Item>
        <Menu.Menu position='right'>
          <Menu.Item>
            Add &nbsp;
            { (showTable === 'medications') ?
              <Icon.Group size='large'>
                <Icon name='syringe'/>
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
            <Icon name='pills'/>
          </Menu.Item>
        </Menu.Menu>
      </Menu>
      {(showTable === 'medications' ?
        <InventoryTable inventory={stuffs.filter(stuff => stuff.type === 'Medication')} color='green'> </InventoryTable>
        :
        <InventoryTable inventory={stuffs.filter(stuff => stuff.type === 'Supply')} color='violet'> </InventoryTable>
      )}

    </Container>
  ) :
    <Loader active>Getting data</Loader>
  );
};

// Require an array of Stuff documents in the props.
ListInventory.propTypes = {
  stuffs: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

// withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
export default withTracker(() => {
  // Get access to Stuff documents.
  const subscription = Inventory.subscribeInventory();
  // Determine if the subscription is ready
  const ready = subscription.ready();
  // Get the Stuff documents and sort them by name.
  const stuffs = Inventory.find({}, { sort: { name: 1 } }).fetch();
  return {
    stuffs,
    ready,
  };
})(ListInventory);
