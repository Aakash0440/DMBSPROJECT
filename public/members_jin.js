function fetchMemberData() {
    fetch("/members")
      .then((response) => response.json())
      .then((memberData) => {
        const memberList = document.getElementById("member-list");
        memberList.innerHTML = ""; // Clear existing list items
  
        memberData.forEach((member) => {
          const listItem = document.createElement("li");
          listItem.className = "member-item";
          listItem.innerHTML = `
            <div>
                <strong>Member ID:</strong> ${member.MEMBER_ID}<br>
                <strong>Name:</strong> ${member.FIRST_NAME} ${member.LAST_NAME}<br>
                <strong>Date of Birth:</strong> ${new Date(member.DATE_OF_BIRTH).toLocaleDateString()}<br>
                <strong>Address:</strong> ${member.ADDRESS}<br>
                <strong>Phone Number:</strong> ${member.PHONE_NUMBER}<br>
                <strong>Email:</strong> ${member.EMAIL}<br>
            </div>
            <div class="member-actions">
                <button class="action-button delete-button" onclick="deleteMember(${member.MEMBER_ID})"><i class="fas fa-trash"></i> Delete</button>
                <button class="action-button update-button" onclick="updateMember(${member.MEMBER_ID})"><i class="fas fa-edit"></i> Update</button>
            </div>
          `;
          memberList.appendChild(listItem);
        });
      })
      .catch((error) => console.error("Error fetching member data:", error));
  }
  
  // Fetch data on page load
  fetchMemberData();
  
  // Set an interval to periodically fetch updated data
  setInterval(fetchMemberData, 5000); // Adjust the interval as needed (in milliseconds)
  
  function addMember() {
    // Handle form submission for adding a member
    document.getElementById("memberForm").addEventListener("submit", function (event) {
      event.preventDefault();
  
      const formData = {
        member_id: document.getElementById("memberID").value,
        first_name: document.getElementById("firstName").value,
        last_name: document.getElementById("lastName").value,
        date_of_birth: document.getElementById("dateOfBirth").value,
        address: document.getElementById("address").value,
        phone_number: document.getElementById("phoneNumber").value,
        email: document.getElementById("email").value,
      };
  
      fetch("/members", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((response) => {
          if (response.ok) {
            alert("Member added successfully");
            fetchMemberData(); // Refresh the table data
          } else {
            alert("Error adding member");
          }
        })
        .catch((error) => console.error("Error adding member:", error));
    });
  }
  
  function updateMember(memberId) {
    const memberID = prompt("Enter member id you want to update:");
    const newFirstName = prompt("Enter new first name for the member:");
    const newLastName = prompt("Enter new last name for the member:");
    const newDateOfBirth = prompt("Enter new date of birth for the member:");
    const newAddress = prompt("Enter new address for the member:");
    const newPhoneNumber = prompt("Enter new phone number for the member:");
    const newEmail = prompt("Enter new email for the member:");
  
    if (newFirstName && newLastName && newDateOfBirth && newAddress && newPhoneNumber && newEmail) {
      const updateData = {
        first_name: newFirstName,
        last_name: newLastName,
        date_of_birth: newDateOfBirth,
        address: newAddress,
        phone_number: newPhoneNumber,
        email: newEmail,
      };
  
      fetch(`/members/${memberID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      })
        .then((response) => {
          if (response.ok) {
            alert("Member updated successfully");
            fetchMemberData(); // Refresh the member list
          } else {
            alert("Error updating member");
          }
        })
        .catch((error) => console.error("Error updating member:", error));
    } else {
      alert("All fields are required");
    }
  }
  
  function deleteMember(memberId) {
    fetch(`/members/${memberId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          alert("Member deleted successfully");
          fetchMemberData(); // Refresh the member list
        } else {
          alert("Error deleting member");
        }
      })
      .catch((error) => console.error("Error deleting member:", error));
  }
  
  function searchMember() {
    const searchMemberId = document.getElementById("search-member").value;
    fetch(`/members/${searchMemberId}`)
      .then((response) => response.json())
      .then((member) => {
        const memberList = document.getElementById("member-list");
        memberList.innerHTML = ""; // Clear existing list items
  
        const listItem = document.createElement("li");
        listItem.className = "member-item";
        listItem.innerHTML = `
            <div>
                <strong>Member ID:</strong> ${member.MEMBER_ID}<br>
                <strong>Name:</strong> ${member.FIRST_NAME} ${member.LAST_NAME}<br>
                <strong>Date of Birth:</strong> ${new Date(member.DATE_OF_BIRTH).toLocaleDateString()}<br>
                <strong>Address:</strong> ${member.ADDRESS}<br>
                <strong>Phone Number:</strong> ${member.PHONE_NUMBER}<br>
                <strong>Email:</strong> ${member.EMAIL}<br>
            </div>
            <div class="member-actions">
                <button class="action-button delete-button" onclick="deleteMember(${member.MEMBER_ID})"><i class="fas fa-trash"></i> Delete</button>
                <button class="action-button update-button" onclick="updateMember(${member.MEMBER_ID})"><i class="fas fa-edit"></i> Update</button>
            </div>
          `;
        memberList.appendChild(listItem);
      })
      .catch((error) => {
        console.error("Error fetching member by ID:", error);
        alert("Member not found");
      });
  }
  