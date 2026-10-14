// Validation rules. Each field in the HTML picks one with data-validate="..."
var rules = {
    name: {
        pattern: /^[A-Za-z][A-Za-z ]{1,49}$/,
        allowed: /[^A-Za-z ]/g,            // characters that are removed while typing
        message: "Enter a valid name: 2-50 letters and spaces only."
    },
    email: {
        pattern: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
        allowed: /\s/g,
        message: "Enter a valid email address, e.g. name@example.com."
    },
    phone: {
        pattern: /^[6-9][0-9]{9}$/,
        allowed: /\D/g,
        message: "Enter a valid 10-digit phone number starting with 6, 7, 8 or 9."
    },
    password: {
        pattern: /^(?=.*[A-Za-z])(?=.*[0-9]).{6,}$/,
        message: "Password must be at least 6 characters and contain a letter and a number."
    },
    required: {
        pattern: /\S/,
        message: "This field is required."
    }
};

// Show or clear the red warning for one field. Returns true if the field is valid.
function validateField(input) {
    var rule = rules[input.dataset.validate];
    var error = input.parentNode.querySelector(".error");
    var value = input.value;

    if (input.dataset.validate !== "password" && input.dataset.validate !== "required") {
        value = value.trim();
    }

    if (value === "") {
        error.textContent = "This field is required.";
        input.classList.add("invalid");
        return false;
    }
    if (!rule.pattern.test(value)) {
        error.textContent = rule.message;
        input.classList.add("invalid");
        return false;
    }
    error.textContent = "";
    input.classList.remove("invalid");
    return true;
}

document.querySelectorAll("form").forEach(function (form) {
    var fields = form.querySelectorAll("[data-validate]");

    fields.forEach(function (input) {
        // Block characters that are not allowed while the user types
        input.addEventListener("input", function () {
            var rule = rules[input.dataset.validate];
            if (rule.allowed) {
                input.value = input.value.replace(rule.allowed, "");
            }
            if (input.classList.contains("invalid")) {
                validateField(input);
            }
        });
        // Check the field when the user leaves it
        input.addEventListener("blur", function () {
            validateField(input);
        });
    });

    // Only submit when every field is valid
    form.addEventListener("submit", function (event) {
        var allValid = true;
        fields.forEach(function (input) {
            if (!validateField(input)) {
                allValid = false;
            }
        });
        if (!allValid) {
            event.preventDefault();
        }
    });

    // Clear warnings when the form is reset
    form.addEventListener("reset", function () {
        form.querySelectorAll(".error").forEach(function (e) { e.textContent = ""; });
        fields.forEach(function (input) { input.classList.remove("invalid"); });
    });
});
