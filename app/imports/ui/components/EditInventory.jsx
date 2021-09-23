import React from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Header, Icon, Input, Loader, Modal, Select } from 'semantic-ui-react';

const EditInventory = ({ item, open, setOpen }) => (item ?
  <Modal
    closeIcon
    open={open}
    onOpen={() => setOpen(true)}
    onClose={() => setOpen(false)}
    size='small'>
    <Header>
      <Icon.Group size='large'>
        <Icon color='blue' name='pencil'/>
        <Icon corner='top right' name='pills'/>
      </Icon.Group>
        &nbsp; Edit {item.name}
    </Header>
    <Modal.Content>
      <Form>
        <Form.Field required>
          <label>Medication Name</label>
          <Form.Group widths="equal">
            <Form.Field>
              <Input placeholder="Medication Name" value={item.name}/>
            </Form.Field>
          </Form.Group>
        </Form.Field>
        <Form.Field>
          <Form.Group widths="equal">
            <Form.Field required>
              <label>Medication Type</label>
              <Input placeholder="Medication Type" value={item.medicationType}/>
            </Form.Field>
            <Form.Field required>
              <label>Amount</label>
              <Input type="number" placeholder="Enter an amount" value={item.dosage}/>
            </Form.Field>
          </Form.Group>
        </Form.Field>
        <Form.Field>
          <Form.Group widths="equal">
            <Form.Field required>
              <label>Expiration Date</label>
              <Input placeholder="Enter expiration date" value={item.expiration.toLocaleString()}/>
            </Form.Field>
            <Form.Field required>
              <label>Location</label>
              <Input placeholder="Enter storage location" value={item.location}/>
            </Form.Field>
          </Form.Group>
        </Form.Field>
        <Form.Field>
          <Form.Group widths="equal">
            <Form.Field required>
              <label>Supply</label>
              <Input type="number" placeholder="Enter supply amount" value={item.supply}/>
            </Form.Field>
          </Form.Group>
        </Form.Field>
      </Form>
    </Modal.Content>
    <Modal.Actions>
      <Button color='red' onClick={() => setOpen(false, 'cancel')}>
        <Icon name='cancel'/> Cancel
      </Button>
      <Button color='blue' onClick={() => setOpen(false)}>
        <Icon name='save'/> Save
      </Button>
    </Modal.Actions>
  </Modal>
  :
  <></>
);

EditInventory.propTypes = {
  open: PropTypes.bool,
  setOpen: PropTypes.func,
  item: PropTypes.object,
};

export default EditInventory;
