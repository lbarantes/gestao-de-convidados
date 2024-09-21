$(document).ready(function () {
  $(".phone").mask("(00) 0 0000-0000");
  $(".cpf").mask("000.000.000-00");
});

document.addEventListener("DOMContentLoaded", (event) => {
  const dateInputs = document.querySelectorAll(".date");

  dateInputs.forEach((input) => {
    input.addEventListener("input", handleInput);
    input.addEventListener("keydown", handleBackspace);
    input.addEventListener("blur", handleBlur);
  });

  function handleInput(e) {
    let value = e.target.value.replace(/\D/g, "");
    let day = value.substring(0, 2);
    let month = value.substring(2, 4);
    let year = value.substring(4, 8);

    if (day.length === 2) {
      day = Math.min(31, parseInt(day, 10)).toString().padStart(2, "0");
    }
    if (day.length === 1 && day > 3) {
      day = "0" + day;
    }
    if (month.length === 1 && month > 1) {
      month = "0" + month;
    }
    if (month.length === 2) {
      month = Math.min(12, parseInt(month, 10)).toString().padStart(2, "0");
    }

    e.target.value = `${day}${day.length >= 2 ? "/" : ""}${month}${month.length >= 2 ? "/" : ""}${year}`;
  }

  function handleBackspace(e) {
    if (e.key === "Backspace" && (e.target.value.length === 3 || e.target.value.length === 6)) {
      e.target.value = e.target.value.slice(0, -1);
    }
  }

  function handleBlur(e) {
    let value = e.target.value.replace(/\D/g, "");
    let day = value.substring(0, 2);
    let month = value.substring(2, 4);
    let year = value.substring(4, 8);

    if (day) {
      day = Math.min(31, parseInt(day, 10)).toString().padStart(2, "0");
    }
    if (month) {
      month = Math.min(12, parseInt(month, 10)).toString().padStart(2, "0");
    }
    if (year && year.length < 4) {
      year = year.padEnd(4, "_");
    }

    e.target.value = `${day}${day ? "/" : ""}${month}${month ? "/" : ""}${year}`;
  }
});
