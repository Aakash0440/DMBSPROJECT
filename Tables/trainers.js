const express = require('express');
const oracledb = require('oracledb');
const router = express.Router();

const dbConfig = {
  user: "sys",
  password: "tiger",
  connectionString: "localhost:1521/orclpdb"
};

// Endpoint to get all trainers
router.get('/', async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `SELECT trainer_id, first_name, last_name, specialization, availability FROM Trainers`,
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

// Endpoint to insert a new Trainer
router.post('/', async (req, res) => {
  let connection;
  const { trainer_id, first_name, last_name, specialization, availability } = req.body;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `INSERT INTO Trainers (trainer_id, first_name, last_name, specialization, availability) VALUES (:trainer_id, :first_name, :last_name, :specialization, :availability)`,
      [trainer_id, first_name, last_name, specialization, availability],
      { autoCommit: true }
    );
    res.status(200).send("Trainer inserted successfully");
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

// Endpoint to update a Trainer
router.put('/:trainer_id', async (req, res) => {
  let connection;
  const { trainer_id } = req.params;
  const { first_name, last_name, specialization, availability } = req.body;
  
  // Ensure required fields are provided
  if (!first_name || !last_name || !specialization || !availability) {
    return res.status(400).send("All fields are required");
  }
  
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `UPDATE Trainers SET first_name = :first_name, last_name = :last_name, specialization = :specialization, availability = :availability WHERE trainer_id = :trainer_id`,
      { trainer_id, first_name, last_name, specialization, availability },
      { autoCommit: true }
    );
    if (result.rowsAffected === 0) {
      res.status(404).send("Trainer not found");
    } else {
      res.status(200).send("Trainer updated successfully");
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

// Endpoint to delete a Trainer
router.delete('/:trainer_id', async (req, res) => {
  let connection;
  const { trainer_id } = req.params;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `DELETE FROM Trainers WHERE trainer_id = :trainer_id`,
      [trainer_id],
      { autoCommit: true }
    );
    if (result.rowsAffected === 0) {
      res.status(404).send("Trainer not found");
    } else {
      res.status(200).send("Trainer deleted successfully");
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

// Endpoint to get a Trainer by trainer_id
router.get('/:trainer_id', async (req, res) => {
  let connection;
  const { trainer_id } = req.params;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `SELECT trainer_id, first_name, last_name, specialization, availability FROM Trainers WHERE trainer_id = :trainer_id`,
      [trainer_id],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    if (result.rows.length === 0) {
      res.status(404).send("Trainer not found");
    } else {
      res.json(result.rows[0]);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching Trainer from database");
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
