function fetchMembershipData() {
    fetch("/membership")
      .then((response) => response.json())
      .then((membershipData) => {
        const membershipList = document.getElementById("membership-list");
        membershipList.innerHTML = ""; // Clear existing list items
  
        membershipData.forEach((membership) => {
          const listItem = document.createElement("li");
          listItem.className = "membership-item";
          listItem.innerHTML = `
            <div>
                <strong>Membership ID:</strong> ${membership.MEMBERSHIP_ID}<br>
                <strong>Member ID:</strong> ${membership.MEMBER_ID}<br>
                <strong>Start Date:</strong> ${membership.START_DATE}}<br>
                <strong>End Date:</strong> ${membership.END_DATE}<br>
                <strong>Membership Type:</strong> ${membership.MEMBERSHIP_TYPE}<br>
            </div>
            <div class="membership-actions">
                <button class="action-button delete-button" onclick="deleteMembership(${membership.MEMBERSHIP_ID})"><i class="fas fa-trash"></i> Delete</button>
                <button class="action-button update-button" onclick="updateMembership(${membership.MEMBERSHIP_ID})"><i class="fas fa-edit"></i> Update</button>
            </div>
          `;
          membershipList.appendChild(listItem);
        });
      })
      .catch((error) => console.error("Error fetching membership data:", error));
  }
  
  // Fetch data on page load
  fetchMembershipData();
  
  // Set an interval to periodically fetch updated data
  setInterval(fetchMembershipData, 5000); // Adjust the interval as needed (in milliseconds)
  
  function addMembership() {
    // Handle form submission for adding a membership
    document.getElementById("membershipForm").addEventListener("submit", function (event) {
      event.preventDefault();
  
      const formData = {
        member_id: document.getElementById("memberID").value,
        start_date: document.getElementById("startDate").value,
        end_date: document.getElementById("endDate").value,
        membership_type: document.getElementById("membershipType").value,
      };
  
      fetch("/memberships", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((response) => {
          if (response.ok) {
            alert("Membership added successfully");
            fetchMembershipData(); // Refresh the membership list
          } else {
            alert("Error adding membership");
          }
        })
        .catch((error) => console.error("Error adding membership:", error));
    });
  }
  
  function updateMembership(membershipId) {
    const memberId = prompt("Enter member id you want to update:");
    const newStartDate = prompt("Enter new start date for the membership:");
    const newEndDate = prompt("Enter new end date for the membership:");
    const newMembershipType = prompt("Enter new membership type:");
  
    if (memberId && newStartDate && newEndDate && newMembershipType) {
      const updateData = {
        member_id: memberId,
        start_date: newStartDate,
        end_date: newEndDate,
        membership_type: newMembershipType,
      };
  
      fetch(`/memberships/${membershipId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      })
        .then((response) => {
          if (response.ok) {
            alert("Membership updated successfully");
            fetchMembershipData(); // Refresh the membership list
          } else {
            alert("Error updating membership");
          }
        })
        .catch((error) => console.error("Error updating membership:", error));
    } else {
      alert("All fields are required");
    }
  }
  
  function deleteMembership(membershipId) {
    fetch(`/memberships/${membershipId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          alert("Membership deleted successfully");
          fetchMembershipData(); // Refresh the membership list
        } else {
          alert("Error deleting membership");
        }
      })
      .catch((error) => console.error("Error deleting membership:", error));
  }
  
  function searchMembership() {
    const searchMembershipId = document.getElementById("search-membership").value;
    fetch(`/memberships/${searchMembershipId}`)
      .then((response) => response.json())
      .then((membership) => {
        const membershipList = document.getElementById("membership-list");
        membershipList.innerHTML = ""; // Clear existing list items
  
        const listItem = document.createElement("li");
        listItem.className = "membership-item";
        listItem.innerHTML = `
            <div>
                <strong>Membership ID:</strong> ${membership.MEMBERSHIP_ID}<br>
                <strong>Member ID:</strong> ${membership.MEMBER_ID}<br>
                <strong>Start Date:</strong> ${new Date(membership.START_DATE).toLocaleDateString()}<br>
                <strong>End Date:</strong> ${new Date(membership.END_DATE).toLocaleDateString()}<br>
                <strong>Membership Type:</strong> ${membership.MEMBERSHIP_TYPE}<br>
            </div>
          `;
        membershipList.appendChild(listItem);
      })
      .catch((error) => {
        console.error("Error fetching membership by ID:", error);
        alert("Membership not found");
      });
  }
  