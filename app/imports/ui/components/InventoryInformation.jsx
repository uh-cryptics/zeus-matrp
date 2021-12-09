import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Roles } from 'meteor/alanning:roles';
import { Button, Dropdown, Grid, Header, Icon, List, Modal } from 'semantic-ui-react';
import moment from 'moment';
import { ROLE } from '../../api/role/Role';
import QRCode from 'qrcode';
import { SITE_URL } from '../utilities/PageIDs';
import swal from 'sweetalert';

const InventoryInformation = ({ table, list, currentUser, item, setItemInfo, open, setOpen }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [location, setLocation] = useState('');
  const [unit, setUnit] = useState('');
  const [defaultLot, setDefaultLot] = useState(0);
  const [expiration, setExpiration] = useState('');
  const [obtained, setObtained] = useState('');
  const [note, setNote] = useState('');
  const [med, setMed] = useState('');

  const clearData = () => {
    setMed('');
    setName('');
    setType('');
    setQuantity('');
    setUnit('');
    setDefaultLot(0);
    setLocation('');
    setExpiration('');
    setObtained('');
    setNote('');
  };

  const setData = (object) => {
    setMed(object);
    setName(object.name);
    setType(object.type);
    setQuantity(object.quantity);
    setUnit(object.unit);
    setLocation(object.location);
    setExpiration(object.expiration);
    setObtained(object.obtained);
    setNote(object.note);
  };

  const findData = (lot) => {
    setDefaultLot(lot);
    const findLOT = list.filter((entry) => entry.lot === lot);
    setData(findLOT[0]);
  };

  let qrCode
  
  if (item !== null) {
  QRCode.toDataURL(`${SITE_URL}/dispenseqr/${item._id}`)
    .then(url => {
      qrCode = url;
    });
  }

  handleClick = () => {
    swal({title: `Dispense QR for ${item.name}`, icon: qrCode});
  }

  return (item ?
    <Modal
      closeIcon
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => { setOpen(false); clearData(); }}
      size='small'>
      <Modal.Header>
        <Grid>
          <Grid.Row>
            <Grid.Column width={8}>
              <Header icon={table === 'medications' ? 'pills' : 'first aid'} content={name || item.name} />
            </Grid.Column>
            <Grid.Column>
              {list.filter((pro) => pro.name === item.name).length > 1 ?
                <Dropdown
                  selection
                  placeholder='Select LOT'
                  options={
                    list.filter((pro) => pro.name === item.name)
                      .map((prop, i) => ({ key: `item${i}`, value: prop.lot, text: prop.lot }))
                  }
                  onChange={(e, { value }) => { findData(value); }}
                  style={{ maxWidth: 'fit-content' }}
                /> : ''}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Modal.Header>
      <Modal.Content>
        {table === 'medications' ?
          <Grid columns={3} divided>
            <Grid.Row>
              <Grid.Column>
                <Header as='h4' style={{ margin: '0 0 0.5rem 0' }}>
                  Name
                  <Header.Subheader>
                    {name || item.name}
                  </Header.Subheader>
                </Header>
              </Grid.Column>
              <Grid.Column>
                <Header as='h4' style={{ margin: '0 0 0.5rem 0' }}>
                  Type
                  <Header.Subheader>
                    <List>
                      {type || item.type?.map((t, index) => <List.Item key={index}>{t}</List.Item>)}
                    </List>
                  </Header.Subheader>
                </Header>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Header as='h4' style={{ margin: '0 0 0.5rem 0' }}>
                  Quantity
                  <Header.Subheader>
                    {quantity || item.quantity}&nbsp;{unit || item.unit}
                  </Header.Subheader>
                </Header>
              </Grid.Column>
              <Grid.Column>
                <Header as='h4' style={{ margin: '0 0 0.5rem 0' }}>
                  Location
                  <Header.Subheader>
                    {location || item.location}
                  </Header.Subheader>
                </Header>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Header as='h4' style={{ margin: '0 0 0.5rem 0' }}>
                  Lot
                  <Header.Subheader>
                    {defaultLot || item.lot}
                  </Header.Subheader>
                </Header>
              </Grid.Column>
              <Grid.Column>
                <Header as='h4' style={{ margin: '0 0 0.5rem 0' }}>
                  Expiration
                  <Header.Subheader>
                    {moment(expiration || item.expiration).format('LL')}
                  </Header.Subheader>
                </Header>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Header as='h4' style={{ margin: '0 0 0.5rem 0' }}>
                  Obtained
                  <Header.Subheader>
                    {obtained || item.obtained}
                  </Header.Subheader>
                </Header>
              </Grid.Column>
              <Grid.Column>
                <Header as='h4' style={{ margin: '0 0 0.5rem 0' }}>
                  <Header.Subheader>
                    <Button content="Dispense QR code" onClick={this.handleClick}/>
                  </Header.Subheader>
                </Header>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Header as='h4' style={{ margin: '0 0 0.5rem 0' }}>
                  Notes
                  <Header.Subheader>
                    {note || item.note}
                  </Header.Subheader>
                </Header>
              </Grid.Column>
            </Grid.Row>
          </Grid>
          :
          <Grid columns={3} divided>
            <Grid.Row>
              <Grid.Column>
                <Header as='h4' style={{ margin: '0 0 0.5rem 0' }}>
                  Name
                  <Header.Subheader>
                    {name || item.name}
                  </Header.Subheader>
                </Header>
              </Grid.Column>
              <Grid.Column>
                <Header as='h4' style={{ margin: '0 0 0.5rem 0' }}>
                  Quantity
                  <Header.Subheader>
                    {quantity || item.quantity}&nbsp;{unit || item.unit}
                  </Header.Subheader>
                </Header>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Header as='h4' style={{ margin: '0 0 0.5rem 0' }}>
                  Location
                  <Header.Subheader>
                    {location || item.location}
                  </Header.Subheader>
                </Header>
              </Grid.Column>
              <Grid.Column>
                <Header as='h4' style={{ margin: '0 0 0.5rem 0' }}>
                  Lot
                  <Header.Subheader>
                    {defaultLot || item.lot}
                  </Header.Subheader>
                </Header>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Header as='h4' style={{ margin: '0 0 0.5rem 0' }}>
                  Expiration
                  <Header.Subheader>
                    {expiration || item.expiration ? moment(expiration || item.expiration).format('LL') : 'N/A'}
                  </Header.Subheader>
                </Header>
              </Grid.Column>
              <Grid.Column>
                <Header as='h4' style={{ margin: '0 0 0.5rem 0' }}>
                  Obtained
                  <Header.Subheader>
                    {obtained || item.obtained}
                  </Header.Subheader>
                </Header>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Header as='h4' style={{ margin: '0 0 0.5rem 0' }}>
                  Notes
                  <Header.Subheader>
                    {note || item.note}
                  </Header.Subheader>
                </Header>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        }
      </Modal.Content>
      {currentUser ?
        <Modal.Actions>
          <Button color='red' onClick={() => setOpen(false, 'delete')}>
            <Icon name='trash' /> Delete
          </Button>
          <Button color='blue' onClick={() => { setOpen(false, 'edit'); setItemInfo(med); }}>
            <Icon name='edit' /> Edit
          </Button>
        </Modal.Actions>
        :
        <Modal.Actions>
          <Button color='red' onClick={() => setOpen(false)}>
            <Icon name='close' /> Close
          </Button>
        </Modal.Actions>
      }
    </Modal>
    : <></>
  );
};

InventoryInformation.propTypes = {
  table: PropTypes.string,
  list: PropTypes.array.isRequired,
  item: PropTypes.object,
  open: PropTypes.bool,
  setOpen: PropTypes.func,
  setItemInfo: PropTypes.func,
  currentUser: PropTypes.bool.isRequired,
};

export default withTracker(() => {
  // Check what level the current user is
  const currentUser = Roles.userIsInRole(Meteor.userId(), [ROLE.ADMIN]);

  return {
    currentUser,
  };
})(InventoryInformation);
