const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

// Import routes for each table
const membersRoutes = require('./Tables/members');
const membershipRoutes = require('./Tables/membership');
const trainersRoutes = require('./Tables/trainers');
const attendanceRoutes = require('./Tables/attendance');
const equipmentRoutes = require('./Tables/equipments');

const app = express();
const port = 9000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Serve main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Mount routes for each table
app.use('/members', membersRoutes);
app.use('/membership', membershipRoutes);
app.use('/trainers', trainersRoutes);
app.use('/attendance', attendanceRoutes);
app.use('/equipments', equipmentRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});