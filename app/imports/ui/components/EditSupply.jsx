import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Header, Icon, Input, Message, Modal } from 'semantic-ui-react';
import _ from 'lodash';
import swal from 'sweetalert';
import { updateMethod } from '../../api/base/BaseCollection.methods';
import { Supply } from '../../api/supply/SupplyCollection';
import { filterOutUndefined, sortList } from '../utilities/ListFunctions';

const EditSupply = ({ item, open, setOpen, supplies }) => {

  if (open) {
    const uniqueLocations = _.uniq(supplies.map(supply => supply.location)).map((location, i) => ({ key: `loc${i}`, text: location, value: location }));
    const uniqueUnits = filterOutUndefined(_.uniq(supplies.map(supply => supply.unit).map((unit, i) => ({ key: `unit${i}`, text: unit, value: unit }))));

    const [name, setName] = useState(item.name);
    const [location, setLocation] = useState(item.location);
    const [units, setUnits] = useState(sortList(uniqueUnits));
    const [locations, setLocations] = useState(sortList(uniqueLocations, (t) => t.text.toLowerCase()));
    const [quantity, setQuantity] = useState(item.quantity);
    const [unit, setUnit] = useState(item.unit);
    const [error, setError] = useState({ has: false, message: '' });

    const clear = (reason) => {
      setName('');
      setLocation('');
      setQuantity('');
      setUnit('');
      setOpen(false, reason);
    };

    const submit = () => {
      if (name && location && quantity) {
        const updateData = { id: item._id, name, location, quantity: _.toNumber(quantity), unit };
        const collectionName = Supply.getCollectionName();
        updateMethod.callPromise({ collectionName, updateData })
          .catch(error => swal('Error', error.message, 'error'))
          .then(() => swal({ title: 'Success', text: 'Item updated successfully', icon: 'success', timer: 1500 }).then(() => clear()));
      } else {
        setError({ has: true, message: 'Please input all required fields' });
      }
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
                onAddItem={(e, { value }) => setLocations(sortList(locations.concat([{ key: `loc${locations.length}`, text: value, value: value }]), (t) => t.text.toLowerCase()))}
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
                onAddItem={(e, { value }) => setUnits(sortList(units.concat([{ key: `unit${units.length}`, text: value, value: value }]), (t) => t.text.toLowerCase()))}
                onChange={(e, data) => setUnit(data.value)}
              />
            </Form.Group>
          </Form.Field>
          <Message error header='Error' content={error.message}/>
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button color='black' onClick={() => clear()}>
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
