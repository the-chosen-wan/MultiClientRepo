var form = document.getElementById("text-form");
var submit = document.getElementById("submit-text-form");
var textarea = document.getElementById("text");
textarea.setSelectionRange(0, 0);

submit.addEventListener("click", () => {
    console.log("hey");
    form.submit();
    textarea.reset();
    form.reset();
});
