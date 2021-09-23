import React from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Modal, Input } from 'semantic-ui-react';
import _ from 'lodash';

const Administer = ({ set, open, setOpen }) => {
  const uniqueNames = _.uniq(set.map(item => item.name))
    .map((type, index) => ({ key: `name${index}`, text: type, value: type }));

  return (
    <div>
      <Modal
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
        size='small'
      >
        <Modal.Header>Admnister Medication</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Field required>
              <label>Patient Name</label>
              <Form.Group widths="equal">
                <Form.Field>
                  <Input placeholder="First Name" name="first-name" />
                </Form.Field>
                <Form.Field>
                  <Input placeholder="Last Name" name="last-name" />
                </Form.Field>
              </Form.Group>
            </Form.Field>
            <Form.Field>
              <Form.Group widths="equal">
                <Form.Field required>
                  <label>Medicine</label>
                  <Form.Dropdown
                    search
                    selection
                    placeholder="Select a medicine to administer..."
                    options={uniqueNames}
                  />
                </Form.Field>
                <Form.Field required>
                  <label>Amount</label>
                  <Input type="number" name="amount" placeholder="Amount" />
                </Form.Field>
              </Form.Group>
            </Form.Field>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button secondary onClick={() => setOpen(false)}>Cancel</Button>
          <Button primary onClick={() => setOpen(false)}>Administer</Button>
        </Modal.Actions>
      </Modal>
    </div>
  );
};

Administer.propTypes = {
  set: PropTypes.array.isRequired,
  open: PropTypes.bool,
  setOpen: PropTypes.func,
};

export default Administer;
