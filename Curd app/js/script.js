let menus = JSON.parse(localStorage.getItem("menus")) || [];
let editIndex = null;

// Load on start
window.onload = () => {
  renderTable();
};

// SAVE / UPDATE
function saveMenu() {
  const nameInput = document.getElementById("name");
  const priceInput = document.getElementById("price");
  const msg = document.getElementById("msg");

  const name = nameInput.value.trim();
  const price = priceInput.value.trim();

  msg.innerHTML = "";

  if (!name) {
    msg.innerHTML = `<span class="text-danger">Enter menu name!</span>`;
    return;
  }

  if (!price) {
    msg.innerHTML = `<span class="text-danger">Enter price!</span>`;
    return;
  }

  const isDuplicate = menus.some((m, i) =>
    m.name.toLowerCase() === name.toLowerCase() && i !== editIndex
  );

  if (isDuplicate) {
    msg.innerHTML = `<span class="text-danger">Duplicate menu not allowed!</span>`;
    return;
  }

  const newMenu = { name, price };

  if (editIndex !== null) {
    menus[editIndex] = newMenu;
    editIndex = null;
    msg.innerHTML = `<span class="text-success">Updated successfully!</span>`;
  } else {
    menus.push(newMenu);
  }

  localStorage.setItem("menus", JSON.stringify(menus));

  nameInput.value = "";
  priceInput.value = "";

  renderTable();
}

// RENDER TABLE
function renderTable(filtered = null) {
  const tableDiv = document.getElementById("menuTable");

  let data = filtered || menus;

  if (data.length === 0) {
    tableDiv.innerHTML = `<p class="text-center text-muted">No Data Found</p>`;
    return;
  }

  let html = `
    <table class="table table-bordered table-striped text-center">
      <thead class="table-dark">
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Price (₹)</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
  `;

  data.forEach((menu, index) => {
    html += `
      <tr>
        <td>${index + 1}</td>
        <td>${menu.name}</td>
        <td>₹${menu.price}</td>
        <td>
          <button class="btn btn-info btn-sm" onclick="viewMenu(${index})">View</button>
          <button class="btn btn-warning btn-sm" onclick="editMenu(${index})">Edit</button>
          <button class="btn btn-danger btn-sm" onclick="deleteMenu(${index})">Delete</button>
        </td>
      </tr>
    `;
  });

  html += `</tbody></table>`;
  tableDiv.innerHTML = html;
}

// EDIT
function editMenu(index) {
  document.getElementById("name").value = menus[index].name;
  document.getElementById("price").value = menus[index].price;
  editIndex = index;
}

// DELETE
function deleteMenu(index) {
  if (confirm("Delete this item?")) {
    menus.splice(index, 1);
    localStorage.setItem("menus", JSON.stringify(menus));
    renderTable();
  }
}

// VIEW (MODAL)
function viewMenu(index) {
  const menu = menus[index];

  document.getElementById("detailName").innerText = `Name: ${menu.name}`;
  document.getElementById("detailPrice").innerText = `Price: ₹${menu.price}`;

  const modal = new bootstrap.Modal(document.getElementById("viewModal"));
  modal.show();
}

// SEARCH (LIVE)
document.getElementById("search").addEventListener("input", function () {
  const value = this.value.toLowerCase();

  if (!value) {
    renderTable();
    return;
  }

  const filtered = menus.filter(m =>
    m.name.toLowerCase().includes(value)
  );

  renderTable(filtered);
});
