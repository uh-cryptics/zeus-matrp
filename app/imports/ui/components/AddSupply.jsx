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
  const nameList = supplies.map((item, index) => ({ key: `name${index}`, text: item.name, value: item.name }));

  const [locations, setLocations] = useState(sortList(uniqueLocations, (t) => t.text.toLowerCase()));
  const [units, setUnits] = useState(sortList(uniqueUnits), (t) => t.text.toLowerCase());
  const [name, setName] = useState('');
  const [supNames, setSupNames] = useState(sortList(nameList, (t) => t.text.toLowerCase()));
  const [location, setLocation] = useState('');
  const [quantity, setQuantity] = useState('');
  const [obtained, setObtained] = useState('Donated');
  const [lot, setLot] = useState('');
  const [unit, setUnit] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState({ has: false, message: '' });

  const clear = () => {
    setName('');
    setLocation('');
    setQuantity('');
    setObtained('Donated');
    setLot('');
    setUnit('');
    setNote('');
    setError({ has: false, message: '' });
    setOpen(false);
  };

  const submit = () => {

    if (name && location && quantity && obtained && lot) {
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
            <Form.Dropdown
              required
              name='name'
              label='Name'
              placeholder='Theraband - Green'
              value={name}
              search
              selection
              allowAdditions
              options={supNames}
              onAddItem={(e, { value }) => {
                setSupNames(sortList(supNames.concat([{ key: `name${supNames.length}`, text: value, value: value }]), (t) => t.text.toLowerCase()));
                setName(value);
              }}
              onChange={(e, { value }) => {
                setName(value);
                const autoFillBasic = supplies.filter((item) => item.name === value);
                // Is there an entry? If so, autofill basic info
                if (!_.isEmpty(autoFillBasic)) {
                  setObtained(autoFillBasic[0].obtained);
                  setUnit(autoFillBasic[0].unit);
                  setNote(autoFillBasic[0].note ? autoFillBasic[0].note : '');
                } else {
                  setObtained('Donated');
                  setUnit('');
                  setNote('');
                }
              }}
            />
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
                onAddItem={(e, { value }) => setUnits(sortList(units.concat([{ key: `unit${units.length}`, text: value, value: value }]), (t) => t.text.toLowerCase()))}
                onChange={(e, data) => setUnit(data.value)}
              />
            </Form.Group>
            <Form.Group widths='equal'>
              <Form.Field required name='obtained' label='Obtained' control='select' value={obtained} onChange={(e) => setObtained(e.target.value)}>
                <option value='Donated'>Donated</option>
                <option value='Purchased'>Purchased</option>
              </Form.Field>
              <Form.Input required name='lot' label='LOT' placeholder='1A2B3C4D' value={lot} onChange={(e) => setLot(e.target.value)} />
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
