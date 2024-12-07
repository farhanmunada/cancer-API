const { Firestore } = require('@google-cloud/firestore');
const path = require('path');

const pathKey = path.resolve(__dirname, '../../submissionmlgc-farhan-443616-d76100e733b6.json');

async function storeData(id, data) {
  try {
    const db = new Firestore({
      projectId: 'submissionmlgc-farhan-443616',
      keyFilename: pathKey,
    });

    console.log("Firestore connected successfully!");

    const predictCollection = db.collection('predictions');
    await predictCollection.doc(id).set(data);

    console.log(`Data with id ${id} successfully stored in Firestore`);
  } catch (error) {
    console.error("Error storing data:", error);
  }
}

module.exports = storeData;
