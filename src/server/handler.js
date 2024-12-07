const predictClassification = require("../services/inferenceService");
const crypto = require("crypto");
const storeData = require("../services/storeData");
const getAllData = require("../services/getAllData");
const path = require('path');

const pathKey = path.resolve(__dirname, '../../submissionmlgc-farhan-443616-d76100e733b6.json');

const MAX_IMAGE_SIZE = 1000000; // 1 MB

async function postPredictHandler(request, h) {
  try {
    // 1. Mengecek ukuran gambar, jika lebih dari 1MB
    const { image } = request.payload;
    if (image.length > MAX_IMAGE_SIZE) {
      return h.response({
        status: "fail",
        message: "Payload content length greater than maximum allowed: 1000000"
      }).code(413); // 413 Payload Too Large
    }

    // 2. Menyiapkan model prediksi
    const { model } = request.server.app;

    // 3. Melakukan prediksi pada gambar yang diterima
    const { label, suggestion } = await predictClassification(model, image);

    // 4. Membuat ID unik dan waktu pembuatan
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    // 5. Menyimpan hasil prediksi
    const data = {
      id: id,
      result: label,
      suggestion: suggestion,
      createdAt: createdAt,
    };
    
    await storeData(id, data);

    // 6. Menyusun response
    const response = h.response({
      status: "success",
      message: "Model is predicted successfully",
      data,
    });
    response.code(201);
    return response;
  } catch (error) {
    // 7. Menangani error prediksi
    console.error(error);
    return h.response({
      status: "fail",
      message: "Terjadi kesalahan dalam melakukan prediksi",
    }).code(400); // 400 Bad Request
  }
}


async function predictHistories(request, h) {
  try {

    const allData = await getAllData();

    const result = allData.map(doc => ({
      id: doc.id,
      history: {
        result: doc.data.result,
        createdAt: doc.data.createdAt,
        suggestion: doc.data.suggestion,
        id: doc.data.id,
      }
    }));

    return h.response({
      status: "success",
      data: result,
    });
  } catch (error) {
    console.error('Error fetching prediction histories:', error);
    return h.response({
      status: "fail",
      message: "Failed to fetch prediction histories",
    }).code(500);
  }
}

module.exports = { postPredictHandler, predictHistories };