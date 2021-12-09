import React, { useState, forwardRef, useRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Modal, Input, Message, Segment, Icon } from 'semantic-ui-react';
import _ from 'lodash';
import swal from 'sweetalert';
import { History } from '../../api/history/HistoryCollection';
import { sortList } from '../utilities/ListFunctions';
import { defineMethod, updateMethod } from '../../api/base/BaseCollection.methods';
import { Medication } from '../../api/medication/MedicationCollection';

const DispenseMedicationItem = forwardRef(({ set, setOpen, patientNumber, fullName, setError }, ref) => {
  const uniqueNames = sortList(_.uniq(set.map(item => ({ _id: item._id, name: item.name })))
    .map((type) => ({ key: type._id, text: type.name, value: type._id })), (t) => t.text.toLowerCase());
  const uniqueLot = _.uniq(_.flattenDeep(set.map(item => item.lot))).map((lot, i) => ({ key: `loc${i}`, text: lot, value: lot }));
  const uniqueLocation = _.uniq(_.flattenDeep(set.map(item => item.location))).map((location, i) => ({ key: `location${i}`, text: location, value: location }));
  const [lotList, setLotList] = useState(uniqueLot);
  const [lotNumber, setLotNumber] = useState('');
  const [locationList, setLocationList] = useState(uniqueLocation);
  const [location, setLocation] = useState('');
  const [item, setItem] = useState('');
  const [amount, setAmount] = useState('');
  const resetList = () => {
    setLotList(uniqueLot);
  };

  const clear = () => {
    resetList();
    setLotNumber('');
    setLocation('');
    setItem('');
    setAmount('');
    setOpen(false);
  };

  const findLOT = (product) => {
    setItem(product);
    // Setting lot dropdown back to original list, just in case user switches to different item instead of previously selected
    resetList();
    // Finds the item with the same _id in the collection as the product variable and returns the lot(s)
    // Iterates through each lot number in the find and filters the lotList in the dropdown with matching lot numbers.
    // Lastly, flattens the result by one so it is just an array of objects.
    const lots = _.flatten((set.find((i) => i._id === product).lot).map((j) => uniqueLot.filter((i) => i.value === j)));
    setLotList(lots);
    // Grabbing index of lot num in entire list
    const index = _.findIndex(uniqueLot, lots[0]);
    const locations = _.flatten((set.find((i) => i._id === product).location).map((j) => uniqueLocation.filter((i) => i.value === j)));
    setLocationList(locations);
    // Grabbing index of lot num in entire list
    const locationIndex = _.findIndex(uniqueLocation, locations[0]);
    setLocation(uniqueLocation[locationIndex].text);
    setLotNumber(uniqueLot[index].text);
  };

  const findItem = (lotNum) => {
    setLotNumber(lotNum);
    const collectionID = set.find((i) => i.lot.includes(lotNum))._id;
    setItem(collectionID);
  };

  const findLocation = (locCode) => {
    setLocation(locCode);
  };

  const submit = () => {
    if (patientNumber && location && lotNumber && item && amount && fullName) {
      const itemName = _.find(uniqueNames, (i) => i.key === item).text;
      const oldAmount = _.find(set, (product) => product._id === item).quantity;
      const newAmount = _.toNumber(amount);
      if (oldAmount < newAmount) {
        swal('Error', `There is not enough inventory to dispense ${newAmount} ${itemName}`, 'error');
      } else {
        const definitionData = { patientNumber, lotNumber, clinicLocation: location, item: itemName, amount: newAmount, provider: `${fullName.firstName} ${fullName.lastName}` };
        let collectionName = History.getCollectionName();
        defineMethod.callPromise({ collectionName, definitionData })
          .catch(e => swal('Error', e.message, 'error'))
          .then(() => {
            swal({ title: 'Success', text: `Dispensed ${newAmount} ${itemName}`, icon: 'success', timer: 1500 });
          });
        const updateData = { id: item, quantity: oldAmount - newAmount };
        collectionName = Medication.getCollectionName();
        updateMethod.callPromise({ collectionName, updateData })
          .catch(e => swal('Error', e.message, 'error'))
          .then(() => clear());
      }
    } else {
      setError({ has: true, message: 'Please input all required fields' });
    }
  };

  useImperativeHandle(ref, () => ({
    submitItem: () => {
      submit();
    },
  }));

  return (
    <div>
      <Form.Group widths="equal">
        <Form.Field required width="5">
          <label>Clinic Location</label>
          <Form.Dropdown
            search
            selection
            placeholder="Clinic Location"
            options={locationList}
            value={location}
            onChange={(e, data) => findLocation(data.value)}
          />
        </Form.Field>
        <Form.Field required width="5">
          <label>LOT</label>
          <Form.Dropdown
            search
            selection
            placeholder="Lot Number"
            options={lotList}
            value={lotNumber}
            onChange={(e, data) => findItem(data.value)}
          />
        </Form.Field>
        <Form.Field required>
          <label>Item</label>
          <Form.Dropdown
            search
            selection
            placeholder="Select a medicine or supply to dispense..."
            options={uniqueNames}
            value={item}
            onChange={(e, data) => findLOT(data.value)}
          />
        </Form.Field>
      </Form.Group>
      <Form.Group>
        <Form.Field required width="5">
          <label>Amount</label>
          <Input type="number" name="amount" placeholder="1" value={amount} onChange={(e) => setAmount(e.target.value, 10)} />
        </Form.Field>
      </Form.Group>
    </div>
  );
});

DispenseMedicationItem.displayName = 'DispenseMedicationItem';

DispenseMedicationItem.propTypes = {
  set: PropTypes.array.isRequired,
  setOpen: PropTypes.func,
  setError: PropTypes.func,
  patientNumber: PropTypes.String,
  // clinicLocation: PropTypes.String,
  fullName: PropTypes.object,
};

const DispenseMedication = ({ set, open, setOpen, fullName }) => {
  const [patientNumber, setPatientNumber] = useState('');
  // const [clinicLocation, setClinicLocation] = useState('');
  const [error, setError] = useState({ has: false, message: '' });
  const space = ' ';
  const [items, setItems] = useState([DispenseMedicationItem]);
  const itemRefs = useRef([]);
  const clear = () => {
    setItems([DispenseMedicationItem]);
    setPatientNumber('');
    // setClinicLocation('');
    setError({ has: false, message: '' });
    setOpen(false);
  };

  const submit = () => {
    itemRefs.current.map(item => item.submitItem());
  };

  return (
    <div>
      <Modal
        closeIcon
        onClose={() => {
          setOpen(false);
          clear();
        }}
        onOpen={() => setOpen(true)}
        open={open}
        size='small'
      >
        <Modal.Header>
          <Icon.Group size='large'>
            <Icon color='blue' name='user md' />
            <Icon corner='top right' name='pills' />
          </Icon.Group>
          &nbsp;
          Dispense Medication
        </Modal.Header>
        <Modal.Content>
          <Form error={error.has}>
            <Segment>
              <Form.Group widths="equal">
                <Form.Field required>
                  <label>Patient Medical Number</label>
                  <Form.Field>
                    <Input placeholder="Medical Number" name="medical-number" onChange={(e) => setPatientNumber(e.target.value)} value={patientNumber} />
                  </Form.Field>
                </Form.Field>
              </Form.Group>
              <Form.Group widths="equal">
                <Form.Field required>
                  <label>Provider</label>
                  {fullName ?
                    <Input placeholder="Provider" name="provider" value={fullName.firstName + space + fullName.lastName} disabled/>
                    :
                    <>
                    </>
                  }
                </Form.Field>
              </Form.Group>
              <Form.Field>
                {items.map((Item, i) => <Item ref={(el) => { itemRefs.current[i] = el; }} key={i} set={set} setOpen={setOpen} patientNumber={patientNumber} fullName={fullName} setError={setError}/>)}
                <Button icon="plus" onClick={() => setItems(prev => [...prev, DispenseMedicationItem])}/>
              </Form.Field>
              <Message error header='Error' content={error.message} />
            </Segment>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button secondary onClick={() => clear()}>Cancel</Button>
          <Button
            content="Dispense"
            labelPosition='right'
            icon='checkmark'
            primary
            onClick={() => submit()}
          />
        </Modal.Actions>
      </Modal>
    </div>
  );
};

DispenseMedication.propTypes = {
  set: PropTypes.array.isRequired,
  open: PropTypes.bool,
  setOpen: PropTypes.func,
  fullName: PropTypes.object,
};

export default DispenseMedication;
