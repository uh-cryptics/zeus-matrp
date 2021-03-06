import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Icon, Message, Modal } from 'semantic-ui-react';
import _ from 'lodash';
import QRCode from 'qrcode';
import swal from 'sweetalert';
import moment from 'moment';
import { defineMethod } from '../../api/base/BaseCollection.methods';
import { filterOutUndefined, sortList } from '../utilities/ListFunctions';
import { Medication, types } from '../../api/medication/MedicationCollection';
import { SITE_URL } from '../utilities/PageIDs';

let qrCode;

const AddMedication = ({ medications, open, setOpen }) => {
  const uniqueMedType = sortList(types.map((type, index) => ({ key: `medType${index}`, text: type, value: type })), (t) => t.text.toLowerCase());
  const uniqueLocations = _.uniq(medications.map(item => item.location)).map((location, i) => ({ key: `loc${i}`, text: location, value: location }));
  const uniqueUnits = filterOutUndefined(_.uniq(medications.map(item => item.unit)).map((unit, i) => ({ key: `unit${i}`, text: unit, value: unit })));
  const nameList = _.uniq(medications.map(name => name.name)).map((item, index) => ({ key: `name${index}`, text: item, value: item }));

  const [locations, setLocations] = useState(sortList(uniqueLocations, (t) => t.text.toLowerCase()));
  const [units, setUnits] = useState(sortList(uniqueUnits, (t) => t.text.toLowerCase()));
  const [name, setName] = useState('');
  const [medNames, setMedNames] = useState(sortList(nameList, (t) => t.text.toLowerCase()));
  const [type, setType] = useState([]);
  const [location, setLocation] = useState('');
  const [quantity, setQuantity] = useState('');
  const [expiration, setExpiration] = useState('');
  const [obtained, setObtained] = useState('Donated');
  const [lot, setLot] = useState('');
  const [unit, setUnit] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState({ has: false, message: '' });

  const clear = () => {
    setName('');
    setType([]);
    setLocation('');
    setQuantity('');
    setExpiration('');
    setObtained('Donated');
    setLot('');
    setUnit('');
    setNote('');
    setError({ has: false, message: '' });
    setOpen(false);
  };

  const submit = () => {
    if (name && (type.length > 0) && location && quantity && expiration && obtained && lot) {
      const definitionData = { name, type, location, quantity: _.toNumber(quantity), expiration, obtained, lot, unit, note };
      const collectionName = Medication.getCollectionName();
      defineMethod.callPromise({ collectionName, definitionData })
        .catch(e => ('Error', e.message, 'error'))
        .then(() => {
          // TODO: if anything, change the url to website name instead of localhost

          const newlyAdded = Medication.findOne({ name: name })._id;
          // console.log(`${SITE_URL}/dispenseqr/${newlyAdded}`);

          QRCode.toDataURL(`${SITE_URL}/dispenseqr/${newlyAdded}`)
            .then(url => {
              qrCode = url;
            });

        })
        .then(() => {
          swal({
            title: 'Success',
            text: `Added ${name}`,
            icon: qrCode,
          }).then(() => clear());

        });
    } else {
      setError({ has: true, message: 'Please input all required fields' });
    }
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
            <Form.Dropdown
              required
              name='name'
              label='Name'
              placeholder='Aspirin 100mg Tablets'
              value={name}
              search
              selection
              allowAdditions
              options={medNames}
              onAddItem={(e, { value }) => {
                setMedNames(sortList(medNames.concat([{ key: `name${medNames.length}`, text: value, value: value }]), (t) => t.text.toLowerCase()));
                setName(value);
              }}
              onChange={(e, { value }) => {
                setName(value);
                const autoFillBasic = medications.filter((item) => item.name === value);
                // Is there an entry? If so, autofill basic info
                if (!_.isEmpty(autoFillBasic)) {
                  setExpiration(moment(autoFillBasic[0].expiration).format('YYYY-MM-DD'));
                  setObtained(autoFillBasic[0].obtained);
                  setUnit(autoFillBasic[0].unit);
                  setNote(autoFillBasic[0].note ? autoFillBasic[0].note : '');
                } else {
                  setExpiration('');
                  setObtained('Donated');
                  setUnit('');
                  setNote('');
                }
              }}
            />
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
                onAddItem={(e, { value }) => setLocations(sortList(locations.concat([{ key: `loc${locations.length}`, text: value, value: value }]), (t) => t.text.toLowerCase()))}
                onChange={(e, data) => setLocation(data.value)}
              />
              <Form.Input required name='expiration' type='date' label='Expiration' placeholder='MM/DD/YYYY'
                value={expiration}
                onChange={(e) => setExpiration(e.target.value)} />
            </Form.Group>
            <Form.Group widths='equal'>
              <Form.Input required name='quantity' label='Quantity' placeholder='Quantity'
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}/>
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
              <Form.Field required name='obtained' label='Obtained' control='select'
                value={obtained}
                onChange={(e) => setObtained(e.target.value)}>
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

AddMedication.propTypes = {
  medications: PropTypes.array.isRequired,
  open: PropTypes.bool,
  setOpen: PropTypes.func,
};

export default AddMedication;
