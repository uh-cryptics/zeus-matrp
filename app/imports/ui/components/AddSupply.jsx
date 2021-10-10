import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Icon, Message, Modal } from 'semantic-ui-react';
import _ from 'lodash';
import { defineMethod } from '../../api/base/BaseCollection.methods';
import swal from 'sweetalert';
import { Supply } from '../../api/supply/SupplyCollection';

const AddSupply = ({ set, open, setOpen }) => {
  const [locations, setLocations] = useState(_.uniq(set.map(item => item.location)).map((location, i) => ({ key: `loc${i}`, text: location, value: location })));

  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [quantity, setQuantity] = useState('');
  const [obtained, setObtained] = useState('Donated');
  const [lot, setLot] = useState('');
  const [error, setError] = useState({ has: false, message: '' });

  const submit = () => {
    if (name && location && _.isNumber(quantity) && obtained && lot) {
      const definitionData = { name, location, quantity, obtained, lot };
      defineMethod.callPromise({ collectionName: Supply.getCollectionName(), definitionData })
        .catch(e => swal('Error', e.message, 'error'))
        .then(() => {
          swal({title: 'Success', text: `Added ${name}`, icon: 'success', timer: 1500}).then(() => clear());
        });
    } else {
      setError({ has: true, message: 'Please input all required fields' });
    }
  };

  const clear = () => {
    setName('');
    setLocation('');
    setQuantity('');
    setObtained('Donated');
    setLot('');
    setError({ has: false, message: '' });
    setOpen(false);
  };

  return (
    <div>
      <Modal
        onClose={() => clear()}
        onOpen={() => setOpen(true)}
        closeIcon
        open={open}
        size='small'
      >
        <Modal.Header>
          <Icon.Group size='large'>
            <Icon name='first aid' />
            <Icon color='blue' corner='top right' name='add' />
          </Icon.Group>
          &nbsp;
          Add Supply
        </Modal.Header>
        <Modal.Content>
          <Form error={error.has}>
            <Form.Input required name='name' label='Name' placeholder='Theraband - Green' value={name} onChange={(e) => setName(e.target.value)}/>
            <Form.Group widths='equal'>
              <Form.Dropdown
                required
                name='location'
                placeholder='Select Location'
                search
                selection
                label='Location'
                allowAdditions
                options={locations}
                value={location}
                onAddItem={(e, { value }) => setLocations(locations.concat([{ key: `loc${locations.length}`, text: value, value: value }]))}
                onChange={(e, data) => setLocation(data.value)}
              />
              <Form.Input required name='quantity' label='Quantity' placeholder='Quantity' value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value, 10))} />
            </Form.Group>
            <Form.Group widths='equal'>
              <Form.Field required name='obtained' label='Obtained' control='select' value={obtained} onChange={(e) => setObtained(e.target.value)}>
                <option value='Donated'>Donated</option>
                <option value='Purchased'>Purchased</option>
              </Form.Field>
              <Form.Input required name='lot' label='LOT' placeholder='1A2B3C4D' value={lot} onChange={(e) => setLot(e.target.value)}/>
            </Form.Group>
            <Message error header='Error' content={error.message}/>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button color='black' onClick={() => clear()}>
            Cancel
          </Button>
          <Button
            content="Submit"
            labelPosition='right'
            icon='checkmark'
            onClick={() => submit()}
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
