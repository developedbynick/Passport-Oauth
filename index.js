const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config(); // Reading of environment variables
const app = require("./app"); // Has to be done after the reading of environment variables

const PORT = process.env.PORT || 3000;
mongoose.set("strictQuery", true);

const initialize = async () => {
  // Connecting to the mongodb database
  const { connection } = await mongoose.connect(process.env.MONGO);
  // Logging success message
  console.log(`Successfully connected to ${connection.name} database`);
  // Listening for requests on port {PORT}
  const serverMsg = () => console.log(`Listening for requests on port ${PORT}`);
  app.listen(PORT, serverMsg);
};

initialize();
