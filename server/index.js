const express = require('express');
const multer = require('multer');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const { parse } = require('json2csv'); // Ensure you have the json2csv package installed

const app = express();
const upload = multer({ dest: 'uploads/' });

const PORT = 5000;

app.get('/', (req, res) => {
  res.send(`
    <h1>Revaluation mini project</h1>
  `);
});

app.post('/upload', upload.single('file'), (req, res) => {
  console.log('hello world', 'request is received');
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  console.log('file is received');

  const filePath = path.join(__dirname, req.file.path);
  const destinationPath = path.join(__dirname, 'uploads', req.file.originalname);

  // Move the file to the desired location with the original name
  fs.rename(filePath, destinationPath, (err) => {
    if (err) {
      return res.status(500).send('Error moving file.');
    }

    // Run the first Python script
    runPythonScript('../reval.py', () => {
      // Run the second Python script
      runPythonScript('../reval_update.py', () => {
        // Run the third Python script to generate Excel file
        runPythonScript('../json_to_excel.py', () => {
          const excelFilePath = path.join(__dirname, 'student_marks.xlsx');

          // Send the Excel file as response
          res.download(excelFilePath, 'student_marks.xlsx', (err) => {
            if (err) {
              console.error(err);
              res.status(500).send('Error sending Excel file');
            }

            // Clean up the Excel file after sending
            fs.unlink(excelFilePath, (err) => {
              if (err) console.error('Error deleting Excel file', err);
            });
          });
        });
      });
    });
  });
});


app.post('/upload/results', upload.single('file'), (req, res) => {
  console.log('hello world', 'request is received');
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  console.log('file is received');

  const filePath = path.join(__dirname, req.file.path);
  const destinationPath = path.join(__dirname, 'uploads', req.file.originalname);

  // Move the file to the desired location with the original name
  fs.rename(filePath, destinationPath, (err) => {
    if (err) {
      return res.status(500).send('Error moving file.');
    }
    console.log('ready to run node')
    // Run the Node.js script first
    runScript('node', '../new_reval.js', () => {
      // Then run the Python script to generate Excel file
      runScript('python', '../json_to_excel.py', () => {
        const excelFilePath = path.join(__dirname, 'student_marks.xlsx');

        // Send the Excel file as response
        res.download(excelFilePath, 'student_marks.xlsx', (err) => {
          if (err) {
            console.error(err);
            res.status(500).send('Error sending Excel file');
          }

          // Clean up the Excel file after sending
          fs.unlink(excelFilePath, (err) => {
            if (err) console.error('Error deleting Excel file', err);
          });
        });
      });
    });
  });
});


const runScript = (command, scriptPath, callback) => {
  const process = spawn(command, [scriptPath]);

  process.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  process.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  process.on('close', (code) => {
    if (code === 0) {
      console.log(`${scriptPath} completed successfully.`);
      callback();
    } else {
      console.error(`${scriptPath} failed with exit code ${code}`);
      // Handle script failure appropriately
    }
  });
};

// app.get('/download', (req, res) => {
//   const resultFilePath = path.join(__dirname, 'result14_reval.json');
//   res.download(resultFilePath, 'result14_reval.json');
// });

app.get('/download', (req, res) => {
  const filePath = path.join(__dirname, '../student_marks.xlsx'); // Adjust path if necessary

  fs.stat(filePath, (err, stats) => {
      if (err) {
          return res.status(404).send('File not found');
      }

      res.sendFile(filePath, (err) => {
          if (err) {
              res.status(500).send('Error sending file');
          }
      });
  });
});
app.get('/download_cgpa', (req, res) => {
  const filePath = path.join(__dirname, '../toppers.xlsx'); // Adjust path if necessary

  fs.stat(filePath, (err, stats) => {
      if (err) {
          return res.status(404).send('File not found');
      }

      res.sendFile(filePath, (err) => {
          if (err) {
              res.status(500).send('Error sending file');
          }
      });
  });
});


app.get('/download_excel', (req, res) => {
  console.log('aaaaaa')
  const filePath = path.join(__dirname, '../student_reval_marks.xlsx'); // Adjust path if necessary

  fs.stat(filePath, (err, stats) => {
      if (err) {
          return res.status(404).send('File not found');
      }

      res.sendFile(filePath, (err) => {
          if (err) {
              res.status(500).send('Error sending file');
          }
      });
  });
});
app.get('/download-csv', (req, res) => {
  const jsonFilePath = path.join(__dirname, 'result14_reval.json');
  const csvFilePath = path.join(__dirname, 'result14_reval.csv');

  // Read the JSON file
  fs.readFile(jsonFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error reading JSON file');
      return;
    }

    // Convert JSON to CSV
    let jsonData;
    try {
      jsonData = JSON.parse(data);
    } catch (e) {
      console.error(e);
      res.status(500).send('Error parsing JSON file');
      return;
    }

    try {
      const csv = parse(jsonData);
      // Write CSV to file
      fs.writeFile(csvFilePath, csv, (err) => {
        if (err) {
          console.error(err);
          res.status(500).send('Error writing CSV file');
          return;
        }

        // Send CSV file as download
        res.download(csvFilePath, 'result14_reval.csv', (err) => {
          if (err) {
            console.error(err);
            res.status(500).send('Error sending CSV file');
          }

          // Clean up the CSV file after sending
          fs.unlink(csvFilePath, (err) => {
            if (err) console.error('Error deleting CSV file', err);
          });
        });
      });
    } catch (e) {
      console.error(e);
      res.status(500).send('Error converting JSON to CSV');
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
