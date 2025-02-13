const express = require('express');
const oracledb = require('oracledb');
const router = express.Router();

const dbConfig = {
  user: "sys",
  password: "tiger",
  connectionString: "localhost:1521/orclpdb"
};

// Endpoint to get all attendance records
router.get('/', async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `SELECT attendance_id, member_id, check_in_time, check_out_time FROM Attendance`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching data from database");
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
});

// Endpoint to insert a new attendance record
router.post('/', async (req, res) => {
  let connection;
  const { member_id, check_in_time, check_out_time } = req.body;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `INSERT INTO Attendance (attendance_id, member_id, check_in_time, check_out_time) VALUES (attendance_seq.nextval, :member_id, TO_TIMESTAMP(:check_in_time, 'YYYY-MM-DD HH24:MI:SS'), TO_TIMESTAMP(:check_out_time, 'YYYY-MM-DD HH24:MI:SS'))`,
      [member_id, check_in_time, check_out_time],
      { autoCommit: true }
    );
    res.status(200).send("Attendance record inserted successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error inserting data into database");
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
});

// Endpoint to update an attendance record
router.put('/:attendance_id', async (req, res) => {
  let connection;
  const { attendance_id } = req.params;
  const { member_id, check_in_time, check_out_time } = req.body;
  
  // Ensure required fields are provided
  if (!member_id || !check_in_time || !check_out_time) {
    return res.status(400).send("Member ID, Check-in time, and Check-out time are required");
  }
  
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `UPDATE Attendance SET member_id = :member_id, check_in_time = TO_TIMESTAMP(:check_in_time, 'YYYY-MM-DD HH24:MI:SS'), check_out_time = TO_TIMESTAMP(:check_out_time, 'YYYY-MM-DD HH24:MI:SS') WHERE attendance_id = :attendance_id`,
      { attendance_id, member_id, check_in_time, check_out_time },
      { autoCommit: true }
    );
    if (result.rowsAffected === 0) {
      res.status(404).send("Attendance record not found");
    } else {
      res.status(200).send("Attendance record updated successfully");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating data in the database");
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
});

// Endpoint to delete an attendance record
router.delete('/:attendance_id', async (req, res) => {
  let connection;
  const { attendance_id } = req.params;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `DELETE FROM Attendance WHERE attendance_id = :attendance_id`,
      [attendance_id],
      { autoCommit: true }
    );
    if (result.rowsAffected === 0) {
      res.status(404).send("Attendance record not found");
    } else {
      res.status(200).send("Attendance record deleted successfully");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting data from the database");
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
});

// Endpoint to get an attendance record by attendance_id
router.get('/:attendance_id', async (req, res) => {
  let connection;
  const { attendance_id } = req.params;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `SELECT attendance_id, member_id, check_in_time, check_out_time FROM Attendance WHERE attendance_id = :attendance_id`,
      [attendance_id],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    if (result.rows.length === 0) {
      res.status(404).send("Attendance record not found");
    } else {
      res.json(result.rows[0]);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching Attendance record from database");
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
});

module.exports = router;
