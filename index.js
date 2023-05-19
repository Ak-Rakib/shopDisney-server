const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config()
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


// Check it out the server site actually running or not
app.get("/", async(req, res) => {
    res.send('shopDisney site is running');
});


// sending port
app.listen(port, () => {
    console.log(`On port ${port}`);
});
