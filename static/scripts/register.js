var form = document.getElementById("register-form");
var submit = document.getElementById("submit-register-form");

function checkform(form) {
    var inputs = form.getElementsByTagName("input");
    for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].hasAttribute("required")) {
            if (inputs[i].value == "") {
                alert("Please fill all required fields");
                return false;
            }
        }
    }
    return true;
}

submit.addEventListener("click", () => {
    if (checkform(form)) {
        fetch("/", {
            method: "POST",

            body: JSON.stringify({
                email: form.elements["email"].value,
                password: form.elements["password"].value,
                fname: form.elements["fname"].value,
                lname: form.elements["lname"].value,
            }),

            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => {
                return res.json();
            })
            .then((res) => {
                form.reset();
                if (res.status == "Rejected") {
                    document.getElementById("warning").style.display = "block";
                } else {
                    window.location = "/homepage";
                }
            });
    }
});
