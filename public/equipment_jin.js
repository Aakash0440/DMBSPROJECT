function fetchEquipmentData() {
    fetch("/equipments")
      .then((response) => response.json())
      .then((equipmentData) => {
        const equipmentList = document.getElementById("equipment-list");
        equipmentList.innerHTML = ""; // Clear existing list items
  
        equipmentData.forEach((equipment) => {
          const listItem = document.createElement("li");
          listItem.className = "equipment-item";
          listItem.innerHTML = `
            <div>
                <strong>Equipment ID:</strong> ${equipment.EQUIPMENT_ID}<br>
                <strong>Name:</strong> ${equipment.NAME}<br>
                <strong>Category:</strong> ${equipment.CATEGORY}<br>
                <strong>Brand:</strong> ${equipment.BRAND}<br>
                <strong>Purchase Date:</strong> ${new Date(equipment.PURCHASE_DATE).toLocaleDateString()}<br>
                <strong>Maintenance Schedule:</strong> ${equipment.MAINTENANCE_SCHEDULE}<br>
                <strong>Condition:</strong> ${equipment.CONDITION}<br>
            </div>
            <div class="equipment-actions">
                <button class="action-button delete-button" onclick="deleteEquipment(${equipment.EQUIPMENT_ID})"><i class="fas fa-trash"></i> Delete</button>
                <button class="action-button update-button" onclick="updateEquipment(${equipment.EQUIPMENT_ID})"><i class="fas fa-edit"></i> Update</button>
            </div>
          `;
          equipmentList.appendChild(listItem);
        });
      })
      .catch((error) => console.error("Error fetching equipment data:", error));
  }
  
  // Fetch data on page load
  fetchEquipmentData();
  
  // Set an interval to periodically fetch updated data
  setInterval(fetchEquipmentData, 5000); // Adjust the interval as needed (in milliseconds)
  
  function addEquipment() {
    // Handle form submission for adding an equipment
    document.getElementById("equipmentForm").addEventListener("submit", function (event) {
      event.preventDefault();
  
      const formData = {
        equipment_id: document.getElementById("equipmentID").value,
        name: document.getElementById("equipmentName").value,
        category: document.getElementById("equipmentCategory").value,
        brand: document.getElementById("equipmentBrand").value,
        purchase_date: document.getElementById("equipmentPurchaseDate").value,
        maintenance_schedule: document.getElementById("equipmentMaintenanceSchedule").value,
        condition: document.getElementById("equipmentCondition").value,
      };
  
      fetch("/equipments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((response) => {
          if (response.ok) {
            alert("Equipment added successfully");
            fetchEquipmentData(); // Refresh the equipment list
          } else {
            alert("Error adding equipment");
          }
        })
        .catch((error) => console.error("Error adding equipment:", error));
    });
  }
  
  function updateEquipment(equipmentId) {
    const equipmentID = prompt("Enter equipment id you want to update:");
    const newName = prompt("Enter new name for the equipment:");
    const newCategory = prompt("Enter new category for the equipment:");
    const newBrand = prompt("Enter new brand for the equipment:");
    const newPurchaseDate = prompt("Enter new purchase date for the equipment (YYYY-MM-DD):");
    const newMaintenanceSchedule = prompt("Enter new maintenance schedule for the equipment:");
    const newCondition = prompt("Enter new condition for the equipment:");
  
    if (newName && newCategory && newBrand && newPurchaseDate && newMaintenanceSchedule && newCondition) {
      const updateData = {
        name: newName,
        category: newCategory,
        brand: newBrand,
        purchase_date: newPurchaseDate,
        maintenance_schedule: newMaintenanceSchedule,
        condition: newCondition,
      };
  
      fetch(`/equipments/${equipmentID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      })
        .then((response) => {
          if (response.ok) {
            alert("Equipment updated successfully");
            fetchEquipmentData(); // Refresh the equipment list
          } else {
            alert("Error updating equipment");
          }
        })
        .catch((error) => console.error("Error updating equipment:", error));
    } else {
      alert("All fields are required");
    }
  }
  
  function deleteEquipment(equipmentId) {
    fetch(`/equipments/${equipmentId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          alert("Equipment deleted successfully");
          fetchEquipmentData(); // Refresh the equipment list
        } else {
          alert("Error deleting equipment");
        }
      })
      .catch((error) => console.error("Error deleting equipment:", error));
  }
  
  function searchEquipment() {
    const searchEquipmentId = document.getElementById("search-equipment").value;
    fetch(`/equipments/${searchEquipmentId}`)
      .then((response) => response.json())
      .then((equipment) => {
        const equipmentList = document.getElementById("equipment-list");
        equipmentList.innerHTML = ""; // Clear existing list items
  
        const listItem = document.createElement("li");
        listItem.className = "equipment-item";
        listItem.innerHTML = `
            <div>
                <strong>Equipment ID:</strong> ${equipment.EQUIPMENT_ID}<br>
                <strong>Name:</strong> ${equipment.NAME}<br>
                <strong>Category:</strong> ${equipment.CATEGORY}<br>
                <strong>Brand:</strong> ${equipment.BRAND}<br>
                <strong>Purchase Date:</strong> ${new Date(equipment.PURCHASE_DATE).toLocaleDateString()}<br>
                <strong>Maintenance Schedule:</strong> ${equipment.MAINTENANCE_SCHEDULE}<br>
                <strong>Condition:</strong> ${equipment.CONDITION}<br>
            </div>
            <div class="equipment-actions">
                <button class="action-button delete-button" onclick="deleteEquipment(${equipment.EQUIPMENT_ID})"><i class="fas fa-trash"></i> Delete</button>
                <button class="action-button update-button" onclick="updateEquipment(${equipment.EQUIPMENT_ID})"><i class="fas fa-edit"></i> Update</button>
            </div>
          `;
        equipmentList.appendChild(listItem);
      })
      .catch((error) => {
        console.error("Error fetching equipment by ID:", error);
        alert("Equipment not found");
      });
  }