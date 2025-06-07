var express = require('express');
var cors = require('cors');
var multer = require('multer'); // Multer for file uploads
require('dotenv').config()
const fs = require("fs").promises; // Node.js fs module

var app = express();

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/', 
  limits: {
    fileSize: 10 * 1024 * 1024 // added a limit
  }
});

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Middleware to handle reading JSON files 
async function readJSONFile(filename) {
  try {
    const data = await fs.readFile(filename, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filename}: ${error}`);
    return [];
  }
}

//POST the file and analyse
app.post('/api/fileanalyse', upload.single('upfile'), async function (req, res) {
  try {
    const file = req.file; 
    
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const fileInfo = {
      name: file.originalname,
      type: file.mimetype,
      size: file.size
    };
    
    res.json(fileInfo);
  } catch (error) {
    console.error('Error in file analysis:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});