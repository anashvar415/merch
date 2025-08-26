const mongoose = require('mongoose');

// Paste your hardcoded URL here
const dbUrl = "mongodb+srv://76aksh:6u648fOI7vC3v0H4@cluster1.tlkeh1p.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1";

console.log("Attempting to connect...");

mongoose.connect(dbUrl)
  .then(() => {
    console.log("SUCCESS! The connection works from this project.");
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error("ERROR: The connection failed even in isolation.");
    console.error(err);
  });