const { Firestore } = require('@google-cloud/firestore');
const path = require('path');

const pathKey = path.resolve(__dirname, '../../submissionmlgc-farhan-443616-d76100e733b6.json');

async function getAllData() {
  try {

    const db = new Firestore({
      projectId: 'submissionmlgc-farhan-443616',
      keyFilename: pathKey,
      databaseId: 'cancer-prediction',
    });

    const predictCollection = db.collection('predictions');
    
    const snapshot = await predictCollection.get();
    

    const allData = snapshot.docs.map(doc => {
      return {
        id: doc.id,
        data: doc.data(),
      };
    });

    return allData;
  } catch (error) {
    console.error('Error getting data:', error);
  }
}

module.exports = getAllData;
