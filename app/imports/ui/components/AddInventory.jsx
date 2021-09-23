import React from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Modal } from 'semantic-ui-react';
import _ from 'lodash';

const AddMedication = ({ set, open, setOpen }) => {
  const uniqueMedType = _.uniq(set.filter(item => item.type === 'Medication')
    .map(item => item.medicationType))
    .map((type, index) => ({ key: `medType${index}`, text: type, value: type }));
  const uniqueLocations = _.uniq(set.map(item => item.location)).map((location, i) => ({ key: `loc${i}`, text: location, value: location }));

  return (
    <div>
      <Modal
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
        size='small'
      >
        <Modal.Header>Add Item</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Input required name='name' label='Name' placeholder='Aspirin 100mg Tablets' />
            <Form.Group>
              <Form.Field required name='type' label='Type' control='select' width='4'>
                <option value='Medication'>Medication</option>
                <option value='Supply'>Supply</option>
              </Form.Field>
              <Form.Select
                required
                name='medType'
                label='Medication Type'
                width='12'
                options={uniqueMedType}
              />
            </Form.Group>
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
              <Form.Input required name='supply' label='Supply' placeholder='Supply' />
              <Form.Input required name='expiration' type='date' label='Expiration' placeholder='MM/DD/YYYY' />
            </Form.Group>
            <Form.Group widths='equal'>
              <Form.Field required name='obtained' label='Obtained' control='select'>
                <option value='Donated'>Donated</option>
                <option value='Purchased'>Purchased</option>
              </Form.Field>
              <Form.Input required name='dosage' label='Recommend Dosage' min={1} type='number' placeholder='Number' />
              <Form.Input required name='lot' label='LOT' placeholder='1A2B3C4D' />
            </Form.Group>
            <Form.Group name='reserve'>
              <label>Reserve</label>
              <Form.Radio
                label='Yes'
                value='true'
              />
              <Form.Radio
                label='No'
                value='false'
              />
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
