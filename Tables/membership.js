const express = require('express');
const oracledb = require('oracledb');
const router = express.Router();

const dbConfig = {
  user: "sys",
  password: "tiger",
  connectionString: "localhost:1521/orclpdb"
};

// Endpoint to get all memberships
router.get('/', async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `SELECT MEMBERSHIP_ID, MEMBER_ID, START_DATE, END_DATE, MEMBERSHIP_TYPE FROM Membership`,
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

// Endpoint to insert a new Membership
router.post('/', async (req, res) => {
  let connection;
  const { member_id, start_date, end_date, membership_type } = req.body;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `INSERT INTO Membership (membership_id, member_id, start_date, end_date, membership_type) VALUES (membership_seq.nextval, :member_id, TO_DATE(:start_date, 'YYYY-MM-DD'), TO_DATE(:end_date, 'YYYY-MM-DD'), :membership_type)`,
      [member_id, start_date, end_date, membership_type],
      { autoCommit: true }
    );
    res.status(200).send("Membership inserted successfully");
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

// Endpoint to update a Membership
router.put('/:membership_id', async (req, res) => {
  let connection;
  const { membership_id } = req.params;
  const { member_id, start_date, end_date, membership_type } = req.body;
  
  // Ensure required fields are provided
  if (!member_id || !start_date || !end_date || !membership_type) {
    return res.status(400).send("All fields are required");
  }
  
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `UPDATE Membership SET member_id = :member_id, start_date = TO_DATE(:start_date, 'YYYY-MM-DD'), end_date = TO_DATE(:end_date, 'YYYY-MM-DD'), membership_type = :membership_type WHERE membership_id = :membership_id`,
      { membership_id, member_id, start_date, end_date, membership_type },
      { autoCommit: true }
    );
    if (result.rowsAffected === 0) {
      res.status(404).send("Membership not found");
    } else {
      res.status(200).send("Membership updated successfully");
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

// Endpoint to delete a Membership
router.delete('/:membership_id', async (req, res) => {
  let connection;
  const { membership_id } = req.params;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `DELETE FROM Membership WHERE membership_id = :membership_id`,
      [membership_id],
      { autoCommit: true }
    );
    if (result.rowsAffected === 0) {
      res.status(404).send("Membership not found");
    } else {
      res.status(200).send("Membership deleted successfully");
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

// Endpoint to get a Membership by membership_id
router.get('/:membership_id', async (req, res) => {
  let connection;
  const { membership_id } = req.params;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `SELECT membership_id, member_id, start_date, end_date, membership_type FROM membership WHERE membership_id = :membership_id`,
      [membership_id],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    if (result.rows.length === 0) {
      res.status(404).send("Membership not found");
    } else {
      res.json(result.rows[0]);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching Membership from database");
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