const functions = require("firebase-functions");
const cors = require("cors")({ origin: true });

module.exports = functions.https.onRequest((request, response) => {
  cors(request, response, () => {
    if (request.method !== "POST") {
      return response.status(405).send("Method Not Allowed");
    }
    console.log("Received contact form submission:", request.body);

    response.status(200).send("Form submission received");
  });
});
