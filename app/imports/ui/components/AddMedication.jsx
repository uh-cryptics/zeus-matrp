import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Icon, Message, Modal } from 'semantic-ui-react';
import _ from 'lodash';
import QRCode from 'qrcode';
import { defineMethod } from '../../api/base/BaseCollection.methods';
import swal from 'sweetalert';
import { Medication, types } from '../../api/medication/MedicationCollection';

let qrCode;
    QRCode.toDataURL(`http://localhost:3000/`)
      .then(url => {
        qrCode = url;
      });

const AddMedication = ({ set, open, setOpen }) => {
  const uniqueMedType = types.map((type, index) => ({ key: `medType${index}`, text: type, value: type }));
  const [locations, setLocations] = useState(_.uniq(set.map(item => item.location)).map((location, i) => ({ key: `loc${i}`, text: location, value: location })));

  const [name, setName] = useState('');
  const [type, setType] = useState([]);
  const [location, setLocation] = useState('');
  const [quantity, setQuantity] = useState('');
  const [expiration, setExpiration] = useState('');
  const [obtained, setObtained] = useState('Donated');
  const [lot, setLot] = useState('');
  const [error, setError] = useState({ has: false, message: '' });

  const submit = () => {
    if (name && (type.length > 0) && location && _.isNumber(quantity) && expiration && obtained && lot) {
      const definitionData = { name, type, location, quantity, expiration, obtained, lot };
      defineMethod.callPromise({ collectionName: Medication.getCollectionName(), definitionData })
        .catch(e => swal('Error', e.message, 'error'))
        .then(() => {
          swal({
            title: 'Success',
            text: 'Order added successfully. Save QRCode for dispensing.',
            icon: qrCode,
          }).then(() => clear());
        });
    } else {
      setError({ has: true, message: 'Please input all required fields' });
    }
  };

  const clear = () => {
    setName('');
    setType([]);
    setLocation('');
    setQuantity('');
    setExpiration('');
    setObtained('Donated');
    setLot('');
    setError({ has: false, message: '' });
    setOpen(false);
  };

  return (
    <div>
      <Modal
        closeIcon
        onClose={() => clear()}
        onOpen={() => setOpen(true)}
        open={open}
        size='small'
      >
        <Modal.Header>
          <Icon.Group size='large'>
            <Icon name='pills' />
            <Icon color='blue' corner='top right' name='add' />
          </Icon.Group>
          &nbsp;
          Add Medication
        </Modal.Header>
        <Modal.Content>
          <Form error={error.has}>
            <Form.Input required name='name' label='Name' placeholder='Aspirin 100mg Tablets' value={name} onChange={(e) => setName(e.target.value)}/>
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
            <Form.Group widths='equal'>
              <Form.Dropdown
                required
                name='location'
                placeholder='Select Location'
                search
                selection
                allowAdditions
                label='Location'
                options={locations}
                value={location}
                onAddItem={(e, { value }) => setLocations(locations.concat([{ key: `loc${locations.length}`, text: value, value: value }]))}
                onChange={(e, data) => setLocation(data.value)}
              />
              <Form.Input required name='quantity' label='Quantity' placeholder='Quantity'
                          value={quantity}
                          onChange={(e) => setQuantity(parseInt(e.target.value, 10))}/>
              <Form.Input required name='expiration' type='date' label='Expiration' placeholder='MM/DD/YYYY'
                          value={expiration}
                          onChange={(e) => setExpiration(e.target.value)} />
            </Form.Group>
            <Form.Group widths='equal'>
              <Form.Field required name='obtained' label='Obtained' control='select'
                          value={obtained}
                          onChange={(e) => setObtained(e.target.value)}>
                <option value='Donated'>Donated</option>
                <option value='Purchased'>Purchased</option>
              </Form.Field>
              <Form.Input required name='lot' label='LOT' placeholder='1A2B3C4D'
                          value={lot}
                          onChange={(e) => setLot(e.target.value)}/>
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

AddMedication.propTypes = {
  set: PropTypes.array.isRequired,
  open: PropTypes.bool,
  setOpen: PropTypes.func,
};

export default AddMedication;
