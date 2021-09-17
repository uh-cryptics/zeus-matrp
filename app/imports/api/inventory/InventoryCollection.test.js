import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import faker from 'faker';
import fc from 'fast-check';
import { Inventory, stuffConditions } from './InventoryCollection';
import { removeAllEntities } from '../base/BaseUtilities';

/* eslint prefer-arrow-callback: "off",  no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('InventoryCollection', function testSuite() {
    before(function setup() {
      removeAllEntities();
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('Can define and removeIt', function test1(done) {
      fc.assert(
        fc.property(fc.lorem(2), fc.integer(1, 10), fc.lorem(1), fc.integer(0, stuffConditions.length - 1),
          (name, quantity, owner, choice) => {
            const condition = stuffConditions[choice];
            const docID = Inventory.define({
              name,
              quantity,
              owner,
              condition,
            });
            expect(Inventory.isDefined(docID)).to.be.true;
            Inventory.removeIt(docID);
            expect(Inventory.isDefined(docID)).to.be.false;
          }),
      );
      done();
    });

    it('Can define duplicates', function test2() {
      const name = faker.animal.dog();
      const quantity = faker.datatype.number({ min: 1, max: 5 });
      const owner = faker.internet.email();
      const condition = stuffConditions[Math.floor(Math.random() * stuffConditions.length)];
      const docID1 = Inventory.define({ name, quantity, condition, owner });
      const docID2 = Inventory.define({ name, quantity, condition, owner });
      expect(docID1).to.not.equal(docID2);
    });

    it('Can update', function test3(done) {
      const name = faker.lorem.words();
      const quantity = faker.datatype.number({
        min: 1,
        max: 10,
      });
      const owner = faker.lorem.words();
      const condition = stuffConditions[faker.datatype.number({ min: 1, max: stuffConditions.length - 1 })];
      const docID = Inventory.define({
        name,
        quantity,
        owner,
        condition,
      });
      // console.log(Inventory.findDoc(docID));
      fc.assert(
        fc.property(fc.lorem(2), fc.integer(10), fc.integer(0, stuffConditions.length - 1),
          (newName, newQuantity, index) => {
            Inventory.update(docID, {
              name: newName,
              quantity: newQuantity,
              condition: stuffConditions[index],
            });
            const stuff = Inventory.findDoc(docID);
            expect(stuff.name).to.equal(newName);
            expect(stuff.quantity).to.equal(newQuantity);
            expect(stuff.condition).to.equal(stuffConditions[index]);
          }),
      );
      done();
    });

    it('Can dumpOne, removeIt, and restoreOne', function test4() {
      const origDoc = Inventory.findOne({});
      let docID = origDoc._id;
      const dumpObject = Inventory.dumpOne(docID);
      Inventory.removeIt(docID);
      expect(Inventory.isDefined(docID)).to.be.false;
      docID = Inventory.restoreOne(dumpObject);
      expect(Inventory.isDefined(docID)).to.be.true;
      const doc = Inventory.findDoc(docID);
      expect(doc.name).to.equal(origDoc.name);
      expect(doc.quantity).to.equal(origDoc.quantity);
      expect(doc.condition).to.equal(origDoc.condition);
      expect(doc.owner).to.equal(origDoc.owner);
    });
  });
}
