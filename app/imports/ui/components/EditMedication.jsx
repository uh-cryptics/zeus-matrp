import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Header, Icon, Input, Loader, Message, Modal, Select } from 'semantic-ui-react';
import { Medication, types } from '../../api/medication/MedicationCollection';
import { updateMethod } from '../../api/base/BaseCollection.methods';
import swal from 'sweetalert';
import moment from 'moment';
import _ from 'lodash';

const EditMedication = ({ item, open, setOpen }) => {

  if (open) {
    const [name, setName] = useState(item.name);
    const [type, setType] = useState(item.type);
    const [expDate, setExpDate] = useState(moment(item.expiration).format('YYYY-MM-DD'));
    const [location, setLocation] = useState(item.location);
    const [locations, setLocations] = useState(_.uniq(Medication.find().map(item => item.location)).map((location, i) => ({ key: `loc${i}`, text: location, value: location })));
    const [quantity, setQuantity] = useState(item.quantity);
    const [error, setError] = useState({ has: false, message: '' });
    const uniqueMedType = types.map((type, index) => ({ key: `medType${index}`, text: type, value: type }));

    const submit = () => {
      if (name && type && expDate && location && _.isNumber(quantity) && (type.length > 0)) {
        const updateData = { id: item._id, name, type, expiration: moment(expDate).format('MM/DD/YYYY'), location, quantity };
        updateMethod.callPromise({ collectionName: Medication.getCollectionName(), updateData })
          .catch(error => swal('Error', error.message, 'error'))
          .then(() => swal({title: 'Success', text: 'Item updated successfully', icon: 'success', timer: 1500}).then(() => clear()));
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
                <label>Supply</label>
                <Input type="number" placeholder={item.quantity} min="0" onChange={(e) => setQuantity(_.toNumber(e.target.value))} value={quantity}/>
              </Form.Field>
            </Form.Group>
          </Form.Field>
          <Message error header='Error' content={error.message}/>
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button color='red' onClick={() => clear('cancel')}>
          <Icon name='cancel'/> Cancel
        </Button>
        <Button color='blue' onClick={() => submit()}>
          <Icon name='save'/> Save
        </Button>
      </Modal.Actions>
    </Modal>;
  } else {
    return <></>
  }
};

EditMedication.propTypes = {
  open: PropTypes.bool,
  setOpen: PropTypes.func,
  item: PropTypes.object,
};

export default EditMedication;
