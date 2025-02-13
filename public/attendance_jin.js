function fetchAttendanceData() {
    fetch("/attendance")
      .then((response) => response.json())
      .then((attendanceData) => {
        const attendanceList = document.getElementById("attendance-list");
        attendanceList.innerHTML = ""; // Clear existing list items
  
        attendanceData.forEach((attendance) => {
          const listItem = document.createElement("li");
          listItem.className = "attendance-item";
          listItem.innerHTML = `
            <div>
                <strong>Attendance ID:</strong> ${attendance.ATTENDANCE_ID}<br>
                <strong>Member ID:</strong> ${attendance.MEMBER_ID}<br>
                <strong>Check-In Time:</strong> ${new Date(attendance.CHECK_IN_TIME).toLocaleString()}<br>
                <strong>Check-Out Time:</strong> ${attendance.CHECK_OUT_TIME ? new Date(attendance.CHECK_OUT_TIME).toLocaleString() : 'Not checked out'}<br>
            </div>
            <div class="attendance-actions">
                <button class="action-button delete-button" onclick="deleteAttendance(${attendance.ATTENDANCE_ID})"><i class="fas fa-trash"></i> Delete</button>
                <button class="action-button update-button" onclick="UpdateAttendance(${attendance.ATTENDANCE_ID})"><i class="fas fa-edit"></i> Update</button>
            </div>
          `;
          attendanceList.appendChild(listItem);
        });
      })
      .catch((error) => console.error("Error fetching attendance data:", error));
  }
  
  // Fetch data on page load
  fetchAttendanceData();
  
  // Set an interval to periodically fetch updated data
  setInterval(fetchAttendanceData, 5000); // Adjust the interval as needed (in milliseconds)
  
  function addAttendance() {
    // Handle form submission for adding an equipment
    document.getElementById("equipmentForm").addEventListener("submit", function (event) {
      event.preventDefault();
  
      const formData = {
        attendance_id: document.getElementById("attendanceID").value,
        member_id: document.getElementById("memberID").value,
        check_in_time: document.getElementById("checkIN").value,
        check_out_tim: document.getElementById("checkOUT").value,
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
            alert("Attendance added successfully");
            fetchAttendanceData(); // Refresh the equipment list
          } else {
            alert("Error adding attendance");
          }
        })
        .catch((error) => console.error("Error adding equipment:", error));
    });
  }

  function updateMembership(membershipId) {
    const attendanceID = prompt("Enter attendance id you want to update:");
    const memberID = prompt("Enter new member id for the membership:");
    const checkIN = prompt("Enter new check in time:");
    const checkOUT = prompt("Enter new check out time:");
  
    if (memberId && newStartDate && newEndDate && newMembershipType) {
      const updateData = {
        attendance_id: attendanceID,
        member_id: memberID,
        check_in_time: checkIN,
        check_out_time: checkOUT,
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
            alert("attendance updated successfully");
            fetchAttendanceData(); // Refresh the membership list
          } else {
            alert("Error updating attendance");
          }
        })
        .catch((error) => console.error("Error updating attendance:", error));
    } else {
      alert("All fields are required");
    }
  }
  
  function deleteAttendance(attendance_id) {
    fetch(`/attendance/${attendance_id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          alert("Attendance deleted successfully");
          fetchAttendanceData(); // Refresh the equipment list
        } else {
          alert("Error deleting attendance");
        }
      })
      .catch((error) => console.error("Error deleting attendance:", error));
  }
  
  function searchAttendance() {
    const searchMemberId = document.getElementById("search-member-id").value;
    fetch(`/attendance/${searchMemberId}`)
      .then((response) => response.json())
      .then((attendance) => {
        const attendanceList = document.getElementById("attendance-list");
        attendanceList.innerHTML = ""; // Clear existing list items
  
        const listItem = document.createElement("li");
        listItem.className = "attendance-item";
        listItem.innerHTML = `
            <div>
                <strong>Attendance ID:</strong> ${attendance.ATTENDANCE_ID}<br>
                <strong>Member ID:</strong> ${attendance.MEMBER_ID}<br>
                <strong>Check-In Time:</strong> ${new Date(attendance.CHECK_IN_TIME).toLocaleString()}<br>
                <strong>Check-Out Time:</strong> ${attendance.CHECK_OUT_TIME ? new Date(attendance.CHECK_OUT_TIME).toLocaleString() : 'Not checked out'}<br>
            </div>
            <div class="attendance-actions">
                <button class="action-button update-button" onclick="checkOut(${attendance.ATTENDANCE_ID})"><i class="fas fa-sign-out-alt"></i> Check Out</button>
            </div>
          `;
        attendanceList.appendChild(listItem);
      })
      .catch((error) => {
        console.error("Error fetching attendance by member ID:", error);
        alert("Attendance not found");
      });
  }
