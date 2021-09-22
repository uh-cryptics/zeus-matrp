import React from 'react';
import PropTypes from 'prop-types';
import { Button, Header, Icon, Modal } from 'semantic-ui-react';

const InventoryInformation = ({ item, open, setOpen }) => (item ?
  <Modal
    closeIcon
    open={open}
    onOpen={() => setOpen(true)}
    onClose={() => setOpen(false)}
    size='small'>
    <Header icon={ item.type === 'Medication' ? 'pills' : 'first aid' } content={ item.name }/>
    <Modal.Content>
      { Object.keys(item).map((keys, index) => [<span key={`span_${index}`}>{keys.toUpperCase()}: {item[keys] instanceof Date ?
        item[keys].toLocaleDateString() : item[keys].toString()}</span>, <br key={`br_${index}`}/>]) }
    </Modal.Content>
    <Modal.Actions>
      <Button color='red' onClick={() => setOpen(false)}>
        <Icon name='trash'/> Delete
      </Button>
      <Button color='blue' onClick={() => setOpen(false)}>
        <Icon name='edit'/> Edit
      </Button>
    </Modal.Actions>
  </Modal>
  : <></>
);

InventoryInformation.propTypes = {
  item: PropTypes.object,
  open: PropTypes.bool,
  setOpen: PropTypes.func,
};

export default InventoryInformation;
