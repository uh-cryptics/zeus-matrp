import React from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Modal } from 'semantic-ui-react';
import _ from 'lodash';

const AddSupply = ({ set, open, setOpen }) => {
  const uniqueLocations = _.uniq(set.map(item => item.location)).map((location, i) => ({ key: `loc${i}`, text: location, value: location }));
  return (
    <div>
      <Modal
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
        size='small'
      >
        <Modal.Header>Add Supply</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Input required name='name' label='Name' placeholder='Theraband - Green' />
            <Form.Group widths='equal'>
              <Form.Dropdown
                required
                name='location'
                placeholder='Select Location'
                search
                selection
                label='Location'
                options={uniqueLocations}
              />
              <Form.Input required name='quantity' label='Quantity' placeholder='Quantity' />
            </Form.Group>
            <Form.Group widths='equal'>
              <Form.Field required name='obtained' label='Obtained' control='select'>
                <option value='Donated'>Donated</option>
                <option value='Purchased'>Purchased</option>
              </Form.Field>
              <Form.Input required name='lot' label='LOT' placeholder='1A2B3C4D' />
            </Form.Group>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button color='black' onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            content="Submit"
            labelPosition='right'
            icon='checkmark'
            onClick={() => setOpen(false)}
            positive
          />
        </Modal.Actions>
      </Modal>
    </div>
  );
};

AddSupply.propTypes = {
  set: PropTypes.array.isRequired,
  open: PropTypes.bool,
  setOpen: PropTypes.func,
};

export default AddSupply;
