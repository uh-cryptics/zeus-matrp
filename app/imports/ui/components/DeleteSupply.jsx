import React from 'react';
import PropTypes from 'prop-types';
import { Button, Header, Icon, Modal } from 'semantic-ui-react';
import swal from 'sweetalert';
import { Supply } from '../../api/supply/SupplyCollection';
import { removeItMethod } from '../../api/base/BaseCollection.methods';

const DeleteSupply = ({ item, open, setOpen }) => {

  if (open) {
    const itemID = item._id;

    const clear = (reason) => {
      setOpen(false, reason);
    };

    const submit = () => {
      removeItMethod.callPromise({ collectionName: Supply.getCollectionName(), instance: itemID })
        .catch(error => swal('Error', error.message, 'error'))
        .then(() => swal('Success', 'Item successfully deleted', 'success').then(() => clear()));
    };

    return <Modal
      closeIcon
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => clear()}
      size='small'>
      <Header>
        <Icon.Group size='large'>
          <Icon color='red' name='trash'/>
        </Icon.Group>
        &nbsp; Delete {item.name}
      </Header>
      <Modal.Content>
        <p>Are you sure you want to delete {item.name}</p>
      </Modal.Content>
      <Modal.Actions>
        <Button color='red' onClick={() => clear('cancel')}>
          <Icon name='cancel'/> Cancel
        </Button>
        <Button color='blue' onClick={() => submit()}>
          <Icon name='trash'/> Delete
        </Button>
      </Modal.Actions>
    </Modal>;
  }
  return <></>;

};

DeleteSupply.propTypes = {
  open: PropTypes.bool,
  setOpen: PropTypes.func,
  item: PropTypes.object,
};

export default DeleteSupply;
