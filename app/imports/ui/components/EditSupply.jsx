import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Header, Icon, Input, Loader, Modal, Select } from 'semantic-ui-react';

const EditSupply = ({ item, open, setOpen }) => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [quantity, setQuantity] = useState('');

  return (item ?
    <Modal
      closeIcon
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => {
        setName('');
        setLocation('');
        setQuantity('');
        setOpen(false);
      }}
      size='small'>
      <Header>
        <Icon.Group size='large'>
          <Icon color='blue' name='pencil' />
          <Icon corner='top right' name='first aid' />
        </Icon.Group>
        &nbsp; Edit {item.name}
      </Header>
      <Modal.Content>
        <Form>
          <Form.Field required>
            <label>Supply Name</label>
            <Form.Group widths="equal">
              <Form.Field>
                <Input placeholder={item.name} onChange={(e) => setName(e.target.value)} value={name} />
              </Form.Field>
            </Form.Group>
          </Form.Field>
          <Form.Field>
            <Form.Group widths="equal">
              <Form.Field required>
                <label>Location</label>
                <Input placeholder={item.location} onChange={(e) => setLocation(e.target.value)} value={location} />
              </Form.Field>
            </Form.Group>
          </Form.Field>
          <Form.Field>
            <Form.Group widths="equal">
              <Form.Field required>
                <label>Quantity</label>
                <Input type="number" placeholder={item.quantity} onChange={(e) => setQuantity(e.target.value)} value={quantity} />
              </Form.Field>
            </Form.Group>
          </Form.Field>
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button color='red' onClick={() => {
          setName('');
          setLocation('');
          setQuantity('');
          setOpen(false, 'cancel');
        }}>
          <Icon name='cancel' /> Cancel
        </Button>
        <Button color='blue' onClick={() => setOpen(false)}>
          <Icon name='save' /> Save
        </Button>
      </Modal.Actions>
    </Modal>
    :
    <></>
  );
};

EditSupply.propTypes = {
  open: PropTypes.bool,
  setOpen: PropTypes.func,
  item: PropTypes.object,
};

export default EditSupply;
