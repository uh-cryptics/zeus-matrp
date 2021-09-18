import { Meteor } from 'meteor/meteor';
import { Inventory } from '../../api/inventory/InventoryCollection';
/* eslint-disable no-console */

const medications = JSON.parse(Assets.getText('medications.json'));
const supplies = JSON.parse(Assets.getText('supplies.json'));

// Initialize the database with a default data document.
function addData(data) {
  console.log(`  Adding: ${data.name}`);
  Inventory.define(data);
}

// Initialize the InventoryCollection if empty.
if (Inventory.count() === 0) {
  if (medications && supplies) {
    console.log('Creating default data.');
    medications.map(data => addData(data));
    supplies.map(data => addData(data));
  }
}
