const express = require('express');
const cors = require('cors');
// const jwt = require('jsonwebtoken');


require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());



// basic testing api
app.get('/', (req, res) => {
    res.send('grocery stock server is running');
})

app.listen(port, () => {
    console.log('grocery stock server is running on port-', port);
})
