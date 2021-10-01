import { Meteor } from 'meteor/meteor';
import { Medication } from '../../api/medication/MediationCollection';
import { Supply } from '../../api/supply/SupplyCollection';
/* eslint-disable no-console */

const medications = JSON.parse(Assets.getText('medications.json'));
const supplies = JSON.parse(Assets.getText('supplies.json'));

// Initialize the database with a default data document.
function addMedication(data) {
  console.log(`  Adding: ${data.name}`);
  Medication.define(data);
}

// Initialize the InventoryCollection if empty.
if (Medication.count() === 0) {
  if (medications) {
    console.log('Creating default data.');
    medications.map(data => addMedication(data));
  }
}

// Initialize the database with a default data document.
function addSupply(data) {
  console.log(`  Adding: ${data.name}`);
  Supply.define(data);
}

// Initialize the InventoryCollection if empty.
if (Supply.count() === 0) {
  if (supplies) {
    console.log('Creating default data.');
    supplies.map(data => addSupply(data));
  }
}
