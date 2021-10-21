import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Icon, Message, Modal } from 'semantic-ui-react';
import _ from 'lodash';
import { defineMethod } from '../../api/base/BaseCollection.methods';
import swal from 'sweetalert';
import { Supply } from '../../api/supply/SupplyCollection';

const AddSupply = ({ supplies, open, setOpen }) => {
  const [locations, setLocations] = useState(_.uniq(supplies.map(item => item.location)).map((location, i) => ({ key: `loc${i}`, text: location, value: location })));
  const [units, setUnits] = useState(_.uniq(supplies.map(item => item.unit)).map((unit, i) => ({ key: `unit${i}`, text: unit, value: unit })));

  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [quantity, setQuantity] = useState('');
  const [obtained, setObtained] = useState('Donated');
  const [lot, setLot] = useState('');
  const [unit, setUnit] = useState('');
  const [error, setError] = useState({ has: false, message: '' });

  const submit = () => {
    if (name && location && quantity && obtained && lot) {
      const definitionData = { name, location, quantity: _.toNumber(quantity), obtained, lot, unit };
      const collectionName = Supply.getCollectionName();
      defineMethod.callPromise({ collectionName, definitionData })
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
    setUnit('');
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
            </Form.Group>
            <Form.Group widths='equal'>
              <Form.Input required name='quantity' label='Quantity' placeholder='Quantity' value={quantity} onChange={(e) => setQuantity(e.target.value)} />
              <Form.Dropdown
                name='unit'
                placeholder='Select Unit'
                search
                selection
                allowAdditions
                label='Unit'
                options={units}
                value={unit}
                onAddItem={(e, { value }) => setUnits(units.concat([{ key: `unit${units.length}`, text: value, value: value }]))}
                onChange={(e, data) => setUnit(data.value)}
              />
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
            primary
          />
        </Modal.Actions>
      </Modal>
    </div>
  );
};

AddSupply.propTypes = {
  supplies: PropTypes.array.isRequired,
  open: PropTypes.bool,
  setOpen: PropTypes.func,
};

export default AddSupply;
