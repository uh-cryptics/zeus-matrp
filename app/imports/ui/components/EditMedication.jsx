import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Header, Icon, Input, Loader, Modal, Select } from 'semantic-ui-react';
import moment from 'moment';

const EditMedication = ({ item, open, setOpen }) => {
  const [name, setName] = useState('');
  const [medicationType, setMedicationType] = useState('');
  const [expDate, setExpDate] = useState('');
  const [location, setLocation] = useState('');
  const [supply, setSupply] = useState('');

  return (item ?
    <Modal
      closeIcon
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => {
        setName('');
        setMedicationType('');
        setExpDate('');
        setLocation('');
        setSupply('');
        setOpen(false);
      }}
      size='small'>
      <Header>
        <Icon.Group size='large'>
          <Icon color='blue' name='pencil' />
          <Icon corner='top right' name='pills' />
        </Icon.Group>
        &nbsp; Edit {item.name}
      </Header>
      <Modal.Content>
        <Form>
          <Form.Field required>
            <label>Medication Name</label>
            <Form.Group widths="equal">
              <Form.Field>
                <Input placeholder={item.name} onChange={(e) => setName(e.target.value)} value={name} />
              </Form.Field>
            </Form.Group>
          </Form.Field>
          <Form.Field>
            <Form.Group widths="equal">
              <Form.Field required>
                <label>Medication Type</label>
                <Input placeholder={item.type} onChange={(e) => setMedicationType(e.target.value)} value={medicationType} />
              </Form.Field>
            </Form.Group>
          </Form.Field>
          <Form.Field>
            <Form.Group widths="equal">
              <Form.Field required>
                <label>Expiration Date</label>
                <Input placeholder={moment(item.expiration).format('MM/DD/YYYY')} onChange={(e) => setExpDate(e.target.value)} value={expDate} />
              </Form.Field>
              <Form.Field required>
                <label>Location</label>
                <Input placeholder={item.location} onChange={(e) => setLocation(e.target.value)} value={location} />
              </Form.Field>
            </Form.Group>
          </Form.Field>
          <Form.Field>
            <Form.Group widths="equal">
              <Form.Field required>
                <label>Supply</label>
                <Input type="number" placeholder={item.quantity} onChange={(e) => setSupply(e.target.value)} value={supply} />
              </Form.Field>
            </Form.Group>
          </Form.Field>
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button color='red' onClick={() => {
          setName('');
          setMedicationType('');
          setExpDate('');
          setLocation('');
          setSupply('');
          setOpen(false, 'cancel');
        }}>
          <Icon name='cancel' /> Cancel
        </Button>
        <Button color='blue' onClick={() => setOpen(false)}>
          <Icon name='save' /> Save
        </Button>
      </Modal.Actions>
    </Modal>
    :
    <></>
  );
};

EditMedication.propTypes = {
  open: PropTypes.bool,
  setOpen: PropTypes.func,
  item: PropTypes.object,
};

export default EditMedication;
