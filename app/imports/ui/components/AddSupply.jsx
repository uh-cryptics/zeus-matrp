import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Icon, Message, Modal } from 'semantic-ui-react';
import _ from 'lodash';
import swal from 'sweetalert';
import { filterOutUndefined, sortList } from '../utilities/ListFunctions';
import { defineMethod } from '../../api/base/BaseCollection.methods';
import { Supply } from '../../api/supply/SupplyCollection';

const AddSupply = ({ supplies, open, setOpen }) => {
  const uniqueLocations = _.uniq(supplies.map(item => item.location)).map((location, i) => ({ key: `loc${i}`, text: location, value: location }));
  const uniqueUnits = filterOutUndefined(_.uniq(supplies.filter(item => item.unit !== undefined).map((unit, i) => ({ key: `unit${i}`, text: unit, value: unit }))));
  const [locations, setLocations] = useState(sortList(uniqueLocations, (t) => t.text.toLowerCase()));
  const [units, setUnits] = useState(sortList(uniqueUnits), (t) => t.text.toLowerCase());
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [quantity, setQuantity] = useState('');
  const [obtained, setObtained] = useState('Donated');
  const [lot, setLot] = useState([]);
  const [lots, setLots] = useState([]);
  const [unit, setUnit] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState({ has: false, message: '' });

  const submit = () => {

    if (name && location && quantity && obtained && lot && note) {
      console.log(unit);
      const definitionData = { name, location, quantity: _.toNumber(quantity), obtained, lot, unit: unit, note };

      const collectionName = Supply.getCollectionName();
      defineMethod.callPromise({ collectionName, definitionData })
        .catch(e => swal('Error', e.message, 'error'))
        .then(() => {
          swal({ title: 'Success', text: `Added ${name}`, icon: 'success', timer: 1500 }).then(() => clear());
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
    setLot([]);
    setUnit('');
    setNote('');
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
                onAddItem={(e, { value }) => setLocations(sortList(locations.concat([{ key: `loc${locations.length}`, text: value, value: value }]), (t) => t.text.toLowerCase()))}
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
                // Something wack happens it one item
                onAddItem={(e, { value }) => setUnits(sortList(units.concat([{ key: `unit${units.length}`, text: value, value: value }]), (t) => t.text.toLowerCase()))}
                onChange={(e, data) => setUnit(data.value)}
              />
            </Form.Group>
            <Form.Group widths='equal'>
              <Form.Field required name='obtained' label='Obtained' control='select' value={obtained} onChange={(e) => setObtained(e.target.value)}>
                <option value='Donated'>Donated</option>
                <option value='Purchased'>Purchased</option>
              </Form.Field>
              <Form.Dropdown
                required
                name='lot'
                label='LOT'
                placeholder='1A2B3C4D'
                multiple
                search
                selection
                allowAdditions
                options={lots}
                value={lot}
                onAddItem={(e, { value }) => setLots(lots.concat([{ key: `lot${lot.length}`, text: value, value: value }]))}
                onChange={(e, data) => setLot(data.value)}
              />
            </Form.Group>
            <Form.TextArea name='note' label='Note' value={note} onChange={(e) => setNote(e.target.value)}/>
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
