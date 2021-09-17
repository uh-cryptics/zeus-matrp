import { Meteor } from 'meteor/meteor';
import { Inventory } from '../../api/inventory/InventoryCollection';
/* eslint-disable no-console */

// Initialize the database with a default data document.
function addData(data) {
  console.log(`  Adding: ${data.name}`);
  Inventory.define(data);
}

// Initialize the InventoryCollection if empty.
if (Inventory.count() === 0) {
  if (Meteor.settings.defaultData) {
    console.log('Creating default data.');
    Meteor.settings.defaultData.map(data => addData(data));
  }
}
