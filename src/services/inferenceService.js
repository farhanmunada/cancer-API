const tf = require('@tensorflow/tfjs-node');
const InputError = require('../exceptions/InputError');

async function predictClassification(model, image) {
  try {
    // 1. Mengubah gambar menjadi tensor dan melakukan resizing
    const tensor = tf.node
      .decodeJpeg(image)
      .resizeNearestNeighbor([224, 224]) // Ukuran standar untuk model
      .expandDims()
      .toFloat()
      .div(tf.scalar(255));

    // 2. Melakukan prediksi
    const prediction = model.predict(tensor);
    const score = await prediction.data();
    console.log("Score Array:", score);

    const confidenceIndex = score.indexOf(Math.max(...score));

    const labels = ['Cancer', 'Non-cancer'];
    let label = labels[confidenceIndex];
    console.log("Predicted Label:", label);

    const confidenceScore = Math.max(...score);
    console.log("Confidence Score:", confidenceScore);

    // 3. Menetapkan label berdasarkan score
    if (confidenceScore < 0.58) {
      label = 'Non-cancer';
    }

    let suggestion;
    if (label === 'Cancer') {
      suggestion = "Segera periksa ke dokter!";
    } else {
      suggestion = "Penyakit kanker tidak terdeteksi.";
    }

    return { label, suggestion };
  } catch (error) {
    throw new InputError('Terjadi kesalahan dalam melakukan prediksi');
  }
}

module.exports = predictClassification;
