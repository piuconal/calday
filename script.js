document.addEventListener("DOMContentLoaded", function () {
  function formatDate(dateString) {
    if (!dateString) return "-";
    const date = new Date(dateString);
    if (isNaN(date)) return "-";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}.${month}.${day}`;
  }

  function calculateDaysLeft(dateString) {
    if (!dateString) return "-";
    const lastChangeDate = new Date(dateString);
    if (isNaN(lastChangeDate)) return "-";

    const targetDate = new Date(lastChangeDate);
    targetDate.setDate(targetDate.getDate() + 90);

    const today = new Date();
    const diffTime = targetDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  function getDangerLevelClass(remainingDays) {
    if (remainingDays < 0) return "danger-0";
    else if (remainingDays <= 5) return "danger-5";
    else if (remainingDays <= 10) return "danger-10";
    else if (remainingDays <= 20) return "danger-20";
    else if (remainingDays <= 30) return "danger-30";
    else return "danger-31";
  }

  fetch("get_data.php")
    .then((response) => response.json())
    .then((data) => {
      console.log("Dữ liệu nhận được:", data);
      const tableBody = document.getElementById("tableBody");
      const totalRow = document.getElementById("totalRow");
      if (!Array.isArray(data)) {
        console.error("Dữ liệu không phải là mảng:", data);
        return;
      }

      tableBody.innerHTML = "";

      const rowsToDisplay = [];

      data.forEach((row) => {
        const remainingDays = calculateDaysLeft(row.last_change_day);
        const dangerClass = getDangerLevelClass(remainingDays);

        rowsToDisplay.push({
          html: `
              <tr data-id="${row.id}">
                <td class="${dangerClass}">${row.ship_name || "-"}</td>
                <td class="${dangerClass}">${row.name || "-"}</td>
                <td class="${dangerClass} num">${formatDate(
            row.last_change_day
          )}</td>
                <td class="${dangerClass} num">${remainingDays}</td>
                <td class="${dangerClass} note-cell">${row.note_in || ""}</td>
              </tr>
            `,
          remainingDays: remainingDays,
        });
      });

      rowsToDisplay.sort((a, b) => a.remainingDays - b.remainingDays);
      rowsToDisplay.forEach((row) =>
        tableBody.insertAdjacentHTML("beforeend", row.html)
      );
      const totalRows = document.querySelectorAll("#tableBody tr").length;
      totalRow.textContent = `SUM: ${totalRows} 🧝🏼‍♀️`;
      // Thêm sự kiện dblclick để chỉnh sửa ghi chú
      document.querySelectorAll(".note-cell").forEach((cell) => {
        cell.addEventListener("dblclick", function () {
          const row = this.closest("tr");
          const id = row.dataset.id;
          const currentNote = this.textContent.trim();

          const newNote = prompt("Nhập ghi chú mới:", currentNote);
          if (newNote !== null) {
            // Cập nhật giao diện ngay lập tức
            this.textContent = newNote;

            // Gửi AJAX để lưu vào database
            fetch("update_note.php", {
              method: "POST",
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
              body: new URLSearchParams({ id, note: newNote }),
            })
              .then((response) => response.text())
              .then((result) => {
                console.log("Kết quả cập nhật:", result);
                if (result.trim() !== "success") {
                  alert("Cập nhật thất bại: " + result);
                }
              })
              .catch((error) => console.error("Lỗi cập nhật ghi chú:", error));
          }
        });
      });
    })
    .catch((error) => console.error("Lỗi tải dữ liệu:", error));
});
