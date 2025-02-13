function fetchTrainerData() {
    fetch("/trainers")
      .then((response) => response.json())
      .then((trainerData) => {
        const trainerList = document.getElementById("trainer-list");
        trainerList.innerHTML = ""; // Clear existing list items
  
        trainerData.forEach((trainer) => {
          const listItem = document.createElement("li");
          listItem.className = "trainer-item";
          listItem.innerHTML = `
            <div>
                <strong>Trainer ID:</strong> ${trainer.TRAINER_ID}<br>
                <strong>Name:</strong> ${trainer.FIRST_NAME} ${trainer.LAST_NAME}<br>
                <strong>Specialization:</strong> ${trainer.SPECIALIZATION}<br>
                <strong>Availability:</strong> ${trainer.AVAILABILITY}<br>
            </div>
            <div class="trainer-actions">
                <button class="action-button delete-button" onclick="deleteTrainer(${trainer.TRAINER_ID})"><i class="fas fa-trash"></i> Delete</button>
                <button class="action-button update-button" onclick="updateTrainer(${trainer.TRAINER_ID})"><i class="fas fa-edit"></i> Update</button>
            </div>
          `;
          trainerList.appendChild(listItem);
        });
      })
      .catch((error) => console.error("Error fetching trainer data:", error));
  }
  
  // Fetch data on page load
  fetchTrainerData();
  
  // Set an interval to periodically fetch updated data
  setInterval(fetchTrainerData, 5000); // Adjust the interval as needed (in milliseconds)
  
  function addTrainer() {
    // Handle form submission for adding a trainer
    document.getElementById("trainerForm").addEventListener("submit", function (event) {
      event.preventDefault();
  
      const formData = {
        trainer_id: document.getElementById("trainerID").value,
        first_name: document.getElementById("firstName").value,
        last_name: document.getElementById("lastName").value,
        specialization: document.getElementById("specialization").value,
        availability: document.getElementById("availability").value,
      };
  
      fetch("/trainers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((response) => {
          if (response.ok) {
            alert("Trainer added successfully");
            fetchTrainerData(); // Refresh the table data
          } else {
            alert("Error adding trainer");
          }
        })
        .catch((error) => console.error("Error adding trainer:", error));
    });
  }
  
  function updateTrainer(trainerId) {
    const trainerID = prompt("Enter trainer id you want to update:");
    const newFirstName = prompt("Enter new first name for the trainer:");
    const newLastName = prompt("Enter new last name for the trainer:");
    const newSpecialization = prompt("Enter new specialization for the trainer:");
    const newAvailability = prompt("Enter new availability for the trainer:");
  
    if (newFirstName && newLastName && newSpecialization && newAvailability) {
      const updateData = {
        first_name: newFirstName,
        last_name: newLastName,
        specialization: newSpecialization,
        availability: newAvailability,
      };
  
      fetch(`/trainers/${trainerID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      })
        .then((response) => {
          if (response.ok) {
            alert("Trainer updated successfully");
            fetchTrainerData(); // Refresh the trainer list
          } else {
            alert("Error updating trainer");
          }
        })
        .catch((error) => console.error("Error updating trainer:", error));
    } else {
      alert("All fields are required");
    }
  }
  
  function deleteTrainer(trainerId) {
    fetch(`/trainers/${trainerId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          alert("Trainer deleted successfully");
          fetchTrainerData(); // Refresh the trainer list
        } else {
          alert("Error deleting trainer");
        }
      })
      .catch((error) => console.error("Error deleting trainer:", error));
  }
  
  function searchTrainer() {
    const searchTrainerId = document.getElementById("search-trainer").value;
    fetch(`/trainers/${searchTrainerId}`)
      .then((response) => response.json())
      .then((trainer) => {
        const trainerList = document.getElementById("trainer-list");
        trainerList.innerHTML = ""; // Clear existing list items
  
        const listItem = document.createElement("li");
        listItem.className = "trainer-item";
        listItem.innerHTML = `
            <div>
                <strong>Trainer ID:</strong> ${trainer.TRAINER_ID}<br>
                <strong>Name:</strong> ${trainer.FIRST_NAME} ${trainer.LAST_NAME}<br>
                <strong>Specialization:</strong> ${trainer.SPECIALIZATION}<br>
                <strong>Availability:</strong> ${trainer.AVAILABILITY}<br>
            </div>
            <div class="trainer-actions">
                <button class="action-button delete-button" onclick="deleteTrainer(${trainer.TRAINER_ID})"><i class="fas fa-trash"></i> Delete</button>
                <button class="action-button update-button" onclick="updateTrainer(${trainer.TRAINER_ID})"><i class="fas fa-edit"></i> Update</button>
            </div>
          `;
        trainerList.appendChild(listItem);
      })
      .catch((error) => {
        console.error("Error fetching trainer by ID:", error);
        alert("Trainer not found");
      });
  }
  