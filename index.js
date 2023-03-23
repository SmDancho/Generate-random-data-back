const express = require("express");
const authRouter = require("./getUsers/usersRouter");
const cors = require("cors");


require("dotenv").config()

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({
  extended: true
}));

app.use("/users", authRouter);

const start = async () => {
  try {
    app.listen(PORT, () => console.log(`server started on port ${PORT}`));
  } catch (e) {
    console.log(e);
    start()
  }
};

start();
