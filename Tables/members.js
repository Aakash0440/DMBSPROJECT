const express = require('express');
const oracledb = require('oracledb');
const router = express.Router();

const dbConfig = {
  user: "sys",
  password: "tiger",
  connectionString: "localhost:1521/orclpdb"
};

// Endpoint to get all members
router.get('/', async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `SELECT member_id, first_name, last_name, date_of_birth, address, phone_number, email FROM Members`,
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

// Endpoint to insert a new Member
router.post('/', async (req, res) => {
  let connection;
  const { member_id, first_name, last_name, date_of_birth, address, phone_number, email } = req.body;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `INSERT INTO Members (member_id, first_name, last_name, date_of_birth, address, phone_number, email) VALUES (:member_id, :first_name, :last_name, TO_DATE(:date_of_birth, 'YYYY-MM-DD'), :address, :phone_number, :email)`,
      [member_id, first_name, last_name, date_of_birth, address, phone_number, email],
      { autoCommit: true }
    );
    res.status(200).send("Member inserted successfully");
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

// Endpoint to update a Member
router.put('/:member_id', async (req, res) => {
  let connection;
  const { member_id } = req.params;
  const { first_name, last_name, date_of_birth, address, phone_number, email } = req.body;
  
  // Ensure required fields are provided
  if (!first_name || !last_name || !date_of_birth || !address || !phone_number || !email) {
    return res.status(400).send("All fields are required");
  }
  
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `UPDATE Members SET first_name = :first_name, last_name = :last_name, date_of_birth = TO_DATE(:date_of_birth, 'YYYY-MM-DD'), address = :address, phone_number = :phone_number, email = :email WHERE member_id = :member_id`,
      { member_id, first_name, last_name, date_of_birth, address, phone_number, email },
      { autoCommit: true }
    );
    if (result.rowsAffected === 0) {
      res.status(404).send("Member not found");
    } else {
      res.status(200).send("Member updated successfully");
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

// Endpoint to delete a Member
router.delete('/:member_id', async (req, res) => {
  let connection;
  const { member_id } = req.params;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `DELETE FROM Members WHERE member_id = :member_id`,
      [member_id],
      { autoCommit: true }
    );
    if (result.rowsAffected === 0) {
      res.status(404).send("Member not found");
    } else {
      res.status(200).send("Member deleted successfully");
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

// Endpoint to get a Member by member_id
router.get('/:member_id', async (req, res) => {
  let connection;
  const { member_id } = req.params;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `SELECT member_id, first_name, last_name, date_of_birth, address, phone_number, email FROM Members WHERE member_id = :member_id`,
      [member_id],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    if (result.rows.length === 0) {
      res.status(404).send("Member not found");
    } else {
      res.json(result.rows[0]);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching Member from database");
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