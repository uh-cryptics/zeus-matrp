import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Header, Icon, Input, Loader, Message, Modal, Select } from 'semantic-ui-react';
import _ from 'lodash';
import { updateMethod } from '../../api/base/BaseCollection.methods';
import swal from 'sweetalert';
import { Supply } from '../../api/supply/SupplyCollection';

const EditSupply = ({ item, open, setOpen }) => {

  if (open) {
    const [name, setName] = useState(item.name);
    const [location, setLocation] = useState(item.location);
    const [quantity, setQuantity] = useState(item.quantity);
    const [error, setError] = useState({ has: false, message: '' });

    const submit = () => {
      console.log(name && location && _.isNumber(quantity));
      if (name && location && _.isNumber(quantity)) {
        const updateData = { id: item._id, name, location, quantity };
        updateMethod.callPromise({ collectionName: Supply.getCollectionName(), updateData })
          .catch(error => swal('Error', error.message, 'error'))
          .then(() => swal('Success', 'Item updated successfully', 'success').then(() => clear()));
      } else {
        setError({ has: true, message: 'Please input all required fields' });
      }
    };

    const clear = (reason) => {
      setName('');
      setLocation('');
      setQuantity('');
      setOpen(false, reason);
    };

    return <Modal
      closeIcon
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => clear()}
      size='small'>
      <Header>
        <Icon.Group size='large'>
          <Icon color='blue' name='pencil'/>
          <Icon corner='top right' name='first aid'/>
        </Icon.Group>
        &nbsp; Edit {item.name}
      </Header>
      <Modal.Content>
        <Form error={error.has}>
          <Form.Field required>
            <label>Supply Name</label>
            <Form.Group widths="equal">
              <Form.Field>
                <Input placeholder={item.name} onChange={(e) => setName(e.target.value)} value={name}/>
              </Form.Field>
            </Form.Group>
          </Form.Field>
          <Form.Field>
            <Form.Group widths="equal">
              <Form.Field required>
                <label>Location</label>
                <Input placeholder={item.location} onChange={(e) => setLocation(e.target.value)} value={location}/>
              </Form.Field>
            </Form.Group>
          </Form.Field>
          <Form.Field>
            <Form.Group widths="equal">
              <Form.Field required>
                <label>Quantity</label>
                <Input type="number" placeholder={item.quantity} onChange={(e) => setQuantity(parseInt(e.target.value, 10))} value={quantity}/>
              </Form.Field>
            </Form.Group>
          </Form.Field>
          <Message error header='Error' content={error.message}/>
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button color='red' onClick={() => clear()}>
          <Icon name='cancel'/> Cancel
        </Button>
        <Button color='blue' onClick={() => submit()}>
          <Icon name='save'/> Save
        </Button>
      </Modal.Actions>
    </Modal>
  } else {
    return <></>
  }
};

EditSupply.propTypes = {
  open: PropTypes.bool,
  setOpen: PropTypes.func,
  item: PropTypes.object,
};

export default EditSupply;
