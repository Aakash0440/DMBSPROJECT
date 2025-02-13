const express = require('express');
const oracledb = require('oracledb');
const router = express.Router();

const dbConfig = {
  user: "sys",
  password: "tiger",
  connectionString: "localhost:1521/orclpdb"
};

// Endpoint to get all equipments
router.get('/', async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `SELECT equipment_id, name, category, brand, purchase_date, maintenance_schedule, condition FROM Equipments`,
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

// Endpoint to insert a new Equipment
router.post('/', async (req, res) => {
  let connection;
  const { name, category, brand, purchase_date, maintenance_schedule, condition } = req.body;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `INSERT INTO Equipments (equipment_id, name, category, brand, purchase_date, maintenance_schedule, condition) 
       VALUES (equipment_seq.nextval, :name, :category, :brand, TO_DATE(:purchase_date, 'YYYY-MM-DD'), :maintenance_schedule, :condition)`,
      [name, category, brand, purchase_date, maintenance_schedule, condition],
      { autoCommit: true }
    );
    res.status(200).send("Equipment inserted successfully");
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

// Endpoint to update an Equipment
router.put('/:equipment_id', async (req, res) => {
  let connection;
  const { equipment_id } = req.params;
  const { name, category, brand, purchase_date, maintenance_schedule, condition } = req.body;
  
  // Ensure required fields are provided
  if (!name || !category || !brand || !purchase_date || !maintenance_schedule || !condition) {
    return res.status(400).send("All fields are required");
  }
  
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `UPDATE Equipments 
       SET name = :name, category = :category, brand = :brand, 
           purchase_date = TO_DATE(:purchase_date, 'YYYY-MM-DD'), 
           maintenance_schedule = :maintenance_schedule, condition = :condition 
       WHERE equipment_id = :equipment_id`,
      { equipment_id, name, category, brand, purchase_date, maintenance_schedule, condition },
      { autoCommit: true }
    );
    if (result.rowsAffected === 0) {
      res.status(404).send("Equipment not found");
    } else {
      res.status(200).send("Equipment updated successfully");
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

// Endpoint to delete an Equipment
router.delete('/:equipment_id', async (req, res) => {
  let connection;
  const { equipment_id } = req.params;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `DELETE FROM Equipments WHERE equipment_id = :equipment_id`,
      [equipment_id],
      { autoCommit: true }
    );
    if (result.rowsAffected === 0) {
      res.status(404).send("Equipment not found");
    } else {
      res.status(200).send("Equipment deleted successfully");
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

// Endpoint to get an Equipment by equipment_id
router.get('/:equipment_id', async (req, res) => {
  let connection;
  const { equipment_id } = req.params;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `SELECT equipment_id, name, category, brand, purchase_date, maintenance_schedule, condition 
       FROM Equipments WHERE equipment_id = :equipment_id`,
      [equipment_id],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    if (result.rows.length === 0) {
      res.status(404).send("Equipment not found");
    } else {
      res.json(result.rows[0]);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching Equipment from database");
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
