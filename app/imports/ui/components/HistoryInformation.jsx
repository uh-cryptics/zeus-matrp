import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Roles } from 'meteor/alanning:roles';
import { Button, Header, Icon, Modal } from 'semantic-ui-react';
import { ROLE } from '../../api/role/Role';

const InventoryInformation = ({ item, open, setOpen }) => (item ?
  <Modal
    closeIcon
    open={open}
    onOpen={() => setOpen(true)}
    onClose={() => setOpen(false)}
    size='small'>
    <Header icon='universal access' content={item.name} />
    <Modal.Content>
      {Object.keys(item).map((keys, index) => (keys === 'quantity' && item[keys] < 11 ?
        [<span key={`span_${index}`} style={{ color: 'red' }}>{keys.toUpperCase()}: {`${item[keys].toString()} (WARNING: Low Inventory)`}</span>,
          <br key={`br_${index}`} />] :
        [<span key={`span_${index}`}>{keys.toUpperCase()}: {item[keys] instanceof Date ?
          item[keys].toLocaleDateString() : item[keys].toString()}</span>, <br key={`br_${index}`} />]))}
    </Modal.Content>
    <Modal.Actions>
      <Button color='red' onClick={() => setOpen(false)}>
        <Icon name='close' /> Close
      </Button>
    </Modal.Actions>
  </Modal>
  : <></>
);

InventoryInformation.propTypes = {
  table: PropTypes.string,
  item: PropTypes.object,
  open: PropTypes.bool,
  setOpen: PropTypes.func,
  currentUser: PropTypes.bool.isRequired,
};

export default withTracker(() => {
  // Check what level the current user is
  const currentUser = Roles.userIsInRole(Meteor.userId(), [ROLE.ADMIN]);

  return {
    currentUser,
  };
})(InventoryInformation);
