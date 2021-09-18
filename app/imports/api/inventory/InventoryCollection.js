import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';
import { _ } from 'meteor/underscore';
import BaseCollection from '../base/BaseCollection';

export const inventoryTypes = ['Medication', 'Supply']
export const medicationTypes = [
  'Allergy & Cold Medicines',
  'Analgesics / Antiinflammatory',
  'Antihypertensives',
  'Antimicrobials',
  'Cardiac / Cholesterol',
  'Dermatologic Preparations',
  'Diabetes Meds',
  'Ear and Eye Preparations',
  'Emergency Kit',
  'GI Meds',
  'GYN Meds',
  'Pulmonary',
  'Smoking Cessation',
  'Vitamins and Supplements',
  'Misc.'
];
export const obtainTypes = ['Purchased', 'Donated']
export const inventoryPublications = {
  inventory: 'Inventory',
};

class InventoryCollection extends BaseCollection {
  constructor() {
    super('Inventory', new SimpleSchema({
      name: String,
      location: String,
      supply: Number,
      reserve: Boolean,
      lot: {
        type: String,
        optional: true,
      },
      obtained: {
        type: String,
        allowedValues: obtainTypes,
        defaultValue: 'Purchased',
      },
      type: {
        type: String,
        allowedValues: inventoryTypes,
      },
      medicationType: {
        type: String,
        allowedValues: medicationTypes,
        optional: true,
      },
      dosage: {
        type: Number,
        optional: true,
      },
      expiration: {
        type: Date,
        optional: true
      },
    }));
  }

  /**
   * Defines a new Inventory item.
   * @param name the name of the item.
   * @param inventoryType what type of item.
   * @param medicationType if type is medication, what type of medication
   * @param location the location of the item.
   * @param supply the supply of item
   * @param expiration the date that the item expires if applicable
   * @return {String} the docID of the new document.
   */
  define({ name, type, medicationType, location, supply, expiration, obtained, dosage, lot, reserve }) {
    const docID = this._collection.insert({ 
      name, 
      type, 
      medicationType, 
      location, 
      supply, 
      expiration, 
      obtained, 
      dosage, 
      lot, 
      reserve 
    });

    return docID;
  }

  /**
   * Updates the given document.
   * @param docID the id of the document to update.
   * @param name the new name (optional).
   * @param type the new type (optional).
   * @param medicationType the new medicationType (optional).
   * @param location the new location (optional).
   * @param type the new type (optional).
   * @param medicationType the new medicationType (optional).
   */
  update(docID, { name, type, medicationType, location, supply, expiration, obtained, dosage, lot, reserve }) {
    const updateData = {};
    if (name) {
      updateData.name = name;
    }
    
    if (type) {
      updateData.type = type;
    }

    if (medicationType) {
      updateData.medicationType = medicationType;
    }

    if (location) {
      updateData.location = location;
    }
    
    // if (quantity) { NOTE: 0 is falsy so we need to check if the quantity is a number.
    if (_.isNumber(supply)) {
      updateData.supply = supply;
    }

    if (expiration) {
      updateData.expiration = expiration;
    }

    if (obtained) {
      updateData.obtained = obtained;
    }

    if (_.isNumber(dosage)) {
      updateData.dosage = dosage;
    }

    if (lot) {
      updateData.lot = lot;
    }

    if (reserve) {
      updateData.reserve = reserve;
    }
    
    this._collection.update(docID, { $set: updateData });
  }

  /**
   * A stricter form of remove that throws an error if the document or docID could not be found in this collection.
   * @param { String | Object } name A document or docID in this collection.
   * @returns true
   */
  removeIt(name) {
    const doc = this.findDoc(name);
    check(doc, Object);
    this._collection.remove(doc._id);
    return true;
  }

  /**
   * Default publication method for entities.
   * It publishes the entire collection for admin and just the stuff associated to an owner.
   */
  publish() {
    if (Meteor.isServer) {
      // get the InventoryCollection instance.
      const instance = this;
      /** This subscription publishes only the documents associated with the logged in user */
      Meteor.publish(inventoryPublications.inventory, function publish() {
        if (this.userId) {
          return instance._collection.find({});
        }
        return this.ready();
      });
    }
  }

  /**
   * Subscription method for stuff owned by the current user.
   */
  subscribeInventory() {
    if (Meteor.isClient) {
      return Meteor.subscribe(inventoryPublications.inventory);
    }
    return null;
  }

  /**
   * Returns an object representing the definition of docID in a format appropriate to the restoreOne or define function.
   * @param docID
   * @return {{ name, type, medicationType, location, supply, expiration, obtained, dosage, lot, reserve }}
   */
  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const name = doc.name;
    const type = doc.type;
    const medicationType = doc.medicationType;
    const location = doc.location;
    const supply = doc.supply;
    const expiration = doc.expiration;
    const obtained = doc.obtained;
    const dosage = doc.dosage;
    const lot = doc.lot;
    const reserve = doc.reserve;
    return { name, type, medicationType, location, supply, expiration, obtained, dosage, lot, reserve };
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const Inventory = new InventoryCollection();
