const users = [];
const emailsSet = new Set();

const myForm = document.querySelector('#my-form');
const nameInput = document.querySelector('#name');
const emailInput = document.querySelector('#email');
const msg = document.querySelector('.msg');
const userList = document.querySelector('#users');

const downloadExcelBtn = document.querySelector('#download-excel');
const downloadCsvBtn = document.querySelector('#download-csv');

myForm.addEventListener('submit', onsubmit);
downloadExcelBtn.addEventListener('click', exportToExcel);
downloadCsvBtn.addEventListener('click', exportToCSV);

function onsubmit(e) {
    e.preventDefault();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim().toLowerCase(); // Normalize email
    const emailPattern = /\S+@\S+\.\S+/;

    if (name === '' || email === '') {
        showError('Please enter all fields');
    } else if (!emailPattern.test(email)) {
        showError('Please enter a valid email');
    } else if (emailsSet.has(email)) {
        showError('This email has already been submitted');
    } else {
        const timestamp = new Date().toLocaleString();

        // Add user to list and Set
        users.push({ Name: name, Email: email, Timestamp: timestamp });
        emailsSet.add(email);

        const li = document.createElement('li');
        li.appendChild(document.createTextNode(`${name} : ${email} @ ${timestamp}`));
        userList.appendChild(li);

        // Clear fields
        nameInput.value = '';
        emailInput.value = '';
    }
}

function showError(message) {
    msg.classList.add('error');
    msg.innerHTML = message;
    setTimeout(() => {
        msg.classList.remove('error');
        msg.innerHTML = '';
    }, 3000);
}

function exportToExcel() {
    if (users.length === 0) return alert('No users to export!');
    const worksheet = XLSX.utils.json_to_sheet(users);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');
    XLSX.writeFile(workbook, 'user_list.xlsx');
}

function exportToCSV() {
    if (users.length === 0) return alert('No users to export!');
    const worksheet = XLSX.utils.json_to_sheet(users);
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'user_list.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
