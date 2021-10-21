import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Header, Icon, Input, Message, Modal } from 'semantic-ui-react';
import _ from 'lodash';
import swal from 'sweetalert';
import { updateMethod } from '../../api/base/BaseCollection.methods';
import { Supply } from '../../api/supply/SupplyCollection';

const EditSupply = ({ item, open, setOpen, supplies }) => {

  if (open) {
    const [name, setName] = useState(item.name);
    const [location, setLocation] = useState(item.location);
    const [units, setUnits] = useState(_.uniq(supplies.map(item => item.unit)).map((unit, i) => ({ key: `unit${i}`, text: unit, value: unit })));
    const [locations, setLocations] = useState(_.uniq(supplies.map(item => item.location)).map((location, i) => ({ key: `loc${i}`, text: location, value: location })));
    const [quantity, setQuantity] = useState(item.quantity);
    const [unit, setUnit] = useState(item.unit);
    const [note, setNote] = useState(item.note);
    const [error, setError] = useState({ has: false, message: '' });

    const submit = () => {
      if (name && location && quantity && note) {
        const updateData = { id: item._id, name, location, quantity: _.toNumber(quantity), unit, note };
        const collectionName = Supply.getCollectionName();
        updateMethod.callPromise({ collectionName, updateData })
          .catch(error => swal('Error', error.message, 'error'))
          .then(() => swal({ title: 'Success', text: 'Item updated successfully', icon: 'success', timer: 1500 }).then(() => clear()));
      } else {
        setError({ has: true, message: 'Please input all required fields' });
      }
    };

    const clear = (reason) => {
      setName('');
      setLocation('');
      setQuantity('');
      setUnit('');
      setNote('');
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
              <Form.Dropdown
                required
                name='location'
                placeholder='Select Location'
                search
                selection
                label='Location'
                allowAdditions
                onAddItem={(e, { value }) => setLocations(locations.concat([{ key: `loc${locations.length}`, text: value, value: value }]))}
                options={locations}
                value={location}
                onChange={(e, data) => setLocation(data.value)}
              />
            </Form.Group>
          </Form.Field>
          <Form.Field>
            <Form.Group widths="equal">
              <Form.Field required>
                <label>Quantity</label>
                <Input type="number" placeholder={item.quantity} onChange={(e) => setQuantity(e.target.value)} value={quantity}/>
              </Form.Field>
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
          </Form.Field>
          <Form.Input note='note' label='Note' value={note} onChange={(e) => setNote(e.target.value)}/>
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
    </Modal>;
  }
  return <></>;

};

EditSupply.propTypes = {
  open: PropTypes.bool,
  setOpen: PropTypes.func,
  item: PropTypes.object,
  supplies: PropTypes.array,
};

export default EditSupply;
