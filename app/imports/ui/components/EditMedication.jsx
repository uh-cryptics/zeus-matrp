import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Header, Icon, Input, Message, Modal } from 'semantic-ui-react';
import swal from 'sweetalert';
import moment from 'moment';
import _ from 'lodash';
import { filterOutUndefined, sortList } from '../utilities/ListFunctions';
import { updateMethod } from '../../api/base/BaseCollection.methods';
import { Medication, types } from '../../api/medication/MedicationCollection';

const EditMedication = ({ item, open, setOpen, medications }) => {

  if (open) {
    const uniqueLocations = _.uniq(medications.map(item => item.location)).map((location, i) => ({ key: `loc${i}`, text: location, value: location }));
    const uniqueUnits = filterOutUndefined(_.uniq(medications.map(med => med.unit)).map((unit, i) => ({ key: `unit${i}`, text: unit, value: unit })));

    const [name, setName] = useState(item.name);
    const [type, setType] = useState(item.type);
    const [expDate, setExpDate] = useState(moment(item.expiration).format('YYYY-MM-DD'));
    const [location, setLocation] = useState(item.location);
    const [units, setUnits] = useState(sortList(uniqueUnits, (t) => t.text.toLowerCase()));
    const [locations, setLocations] = useState(sortList(uniqueLocations, (t) => t.text.toLowerCase()));
    const [quantity, setQuantity] = useState(item.quantity);
    const [unit, setUnit] = useState(item.unit);
    const [note, setNote] = useState(item.note);
    const [error, setError] = useState({ has: false, message: '' });
    const uniqueMedType = types.map((type, index) => ({ key: `medType${index}`, text: type, value: type }));

    const submit = () => {
      if (name && type && expDate && location && quantity && (type.length > 0) && note) {
        const updateData = { id: item._id, name, type, expiration: moment(expDate).format('MM/DD/YYYY'), location, quantity: _.toNumber(quantity), unit, note };
        const collectionName = Medication.getCollectionName();
        updateMethod.callPromise({ collectionName, updateData })
          .catch(error => swal('Error', error.message, 'error'))
          .then(() => swal({ title: 'Success', text: 'Item updated successfully', icon: 'success', timer: 1500 }).then(() => clear()));
      } else {
        setError({ has: true, message: 'Please input all required fields' });
      }
    };

    const clear = (reason) => {
      setName('');
      setType([]);
      setExpDate('');
      setLocation('');
      setQuantity('');
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
          <Icon corner='top right' name='pills'/>
        </Icon.Group>
        &nbsp; Edit {item.name}
      </Header>
      <Modal.Content>
        <Form error={error.has}>
          <Form.Field required>
            <label>Medication Name</label>
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
                multiple
                name='type'
                label='Medication Type'
                search
                selection
                options={uniqueMedType}
                value={type}
                onChange={(e, data) => setType(data.value)}
              />
            </Form.Group>
          </Form.Field>
          <Form.Field>
            <Form.Group widths="equal">
              <Form.Field required>
                <label>Expiration Date</label>
                <Input type="date" onChange={(e) => setExpDate(e.target.value ? moment(e.target.value).format('YYYY-MM-DD') : '')} value={expDate}/>
              </Form.Field>
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
                <label>Supply</label>
                <Input type="number" placeholder={item.quantity} min="0" onChange={(e) => setQuantity(e.target.value)} value={quantity}/>
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
            <Form.Input note='note' label='Note' value={note} onChange={(e) => setNote(e.target.value)}/>
          </Form.Field>
          <Message error header='Error' content={error.message}/>
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button color='black' onClick={() => clear('cancel')}>
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

EditMedication.propTypes = {
  open: PropTypes.bool,
  setOpen: PropTypes.func,
  item: PropTypes.object,
  medications: PropTypes.array,
};

export default EditMedication;
