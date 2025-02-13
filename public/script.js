document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.tablink').click();
    updateDashboard();
});

function openTab(event, tabName) {
    const tablinks = document.querySelectorAll('.tablink');
    const tabcontents = document.querySelectorAll('.tabcontent');

    tabcontents.forEach(tabcontent => {
        tabcontent.classList.remove('active');
    });

    tablinks.forEach(tablink => {
        tablink.classList.remove('active');
    });

    document.getElementById(tabName).classList.add('active');
    event.currentTarget.classList.add('active');

    if (tabName === 'Dashboard') {
        updateDashboard();
    }
}