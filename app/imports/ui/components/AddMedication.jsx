import React from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Modal } from 'semantic-ui-react';
import _ from 'lodash';

const AddMedication = ({ set, open, setOpen }) => {
  const uniqueMedType = _.uniq(_.flatten(set.map(item => item.type))).map((type, index) => ({ key: `medType${index}`, text: type, value: type }));
  const uniqueLocations = _.uniq(set.map(item => item.location)).map((location, i) => ({ key: `loc${i}`, text: location, value: location }));
  return (
    <div>
      <Modal
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
        size='small'
      >
        <Modal.Header>Add Medication</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Input required name='name' label='Name' placeholder='Aspirin 100mg Tablets' />
            <Form.Dropdown
              required
              multiple
              name='type'
              label='Medication Type'
              search
              selection
              options={uniqueMedType}
            />
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
              <Form.Input required name='expiration' type='date' label='Expiration' placeholder='MM/DD/YYYY' />
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

AddMedication.propTypes = {
  set: PropTypes.array.isRequired,
  open: PropTypes.bool,
  setOpen: PropTypes.func,
};

export default AddMedication;
