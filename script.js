function setCurrentDate() {
    const dateInput = document.getElementById('date');
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    dateInput.value = formattedDate;
}

document.addEventListener('DOMContentLoaded', () => {
    setCurrentDate();

    const dataTable = document.getElementById('dataTable').getElementsByTagName('tbody')[0];
    const form = document.getElementById('dataForm');

    loadRowsFromStorage();

    document.getElementById('addRow').addEventListener('click', () => {
        const formData = new FormData(form);
        const row = {};

        formData.forEach((value, key) => {
            row[key] = value || "N/A";
        });

        if (validateForm(row)) {
            addRowToTable(row);
            saveRowToStorage(row);
            form.reset();
            setCurrentDate();
        } else {
            alert("Please fill out all required fields.");
        }
    });

    document.getElementById('exportExcel').addEventListener('click', () => {
        const tableData = [];
        const headers = Array.from(dataTable.closest('table').rows[0].cells).map(th => th.innerText);

        tableData.push(headers);

        Array.from(dataTable.rows).forEach(row => {
            const rowData = Array.from(row.cells).map(td => td.innerText);
            tableData.push(rowData);
        });

        const worksheet = XLSX.utils.aoa_to_sheet(tableData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        XLSX.writeFile(workbook, 'NorthEdgeSportsAcademy.xlsx');
    });

    document.getElementById('clearTable').addEventListener('click', () => {
        if (confirm("Are you sure you want to clear all data?")) {
            localStorage.removeItem('tableData');
            dataTable.innerHTML = '';
        }
    });

    function addRowToTable(rowData) {
        const row = dataTable.insertRow();
        for (const key in rowData) {
            const cell = row.insertCell();
            cell.innerText = rowData[key];
        }
    }

    function saveRowToStorage(rowData) {
        const rows = JSON.parse(localStorage.getItem('tableData')) || [];
        rows.push(rowData);
        localStorage.setItem('tableData', JSON.stringify(rows));
    }

    function loadRowsFromStorage() {
        const rows = JSON.parse(localStorage.getItem('tableData')) || [];
        rows.forEach(addRowToTable);
    }

    function validateForm(rowData) {
        for (const key in rowData) {
            if (!rowData[key] || rowData[key].trim() === "") {
                return false;
            }
        }
        return true;
    }
});