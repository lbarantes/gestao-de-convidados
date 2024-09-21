$(".recusar").click(function () {
  if ($("#convidado").val() != null) {
    alert("Seu convidado não pode ir sem você.");
  }
});
