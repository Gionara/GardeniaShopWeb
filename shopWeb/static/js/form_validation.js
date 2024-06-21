$(document).ready(function() {
    $('#formulario_registro').submit(function(event) {
        event.preventDefault();

        var nombre = $('#nombre').val();
        var apellido = $('#apellido').val();
        var email = $('#email').val();
        var confirmEmail = $('#confirm_email').val();
        var password = $('#password').val();
        var confirmPassword = $('#confirm_password').val();

        var error = false;

        if (!error) {
            $.ajax({
                type: "POST",
                url: $(this).attr('action'),
                data: $(this).serialize(),
                success: function(response) {
                    if (response.error) {
                        $('#email_error').text(response.message);
                    } else {
                        // Asegúrate de que response.redirect_url no esté undefined
                        if (response.redirect_url && response.redirect_url !== 'undefined') {
                            window.location.href = response.redirect_url;
                        } else {
                            console.error('Redirect URL is undefined');
                        }
                    }
                }
            });
        }
    

        if (nombre.length < 3) {
            $('#nombre_error').text('El nombre debe tener al menos 3 caracteres.');
            error = true;
        } else if (!validateName(nombre)) {
            $('#nombre_error').text('El nombre no debe contener caracteres especiales ni números.');
            error = true;
        } else {
            $('#nombre_error').text('');
        }

        if (apellido.length < 3) {
            $('#apellido_error').text('El apellido debe tener al menos 3 caracteres.');
            error = true;
        } else if (!validateName(apellido)) {
            $('#apellido_error').text('El apellido no debe contener caracteres especiales ni números.');
            error = true;
        } else {
            $('#apellido_error').text('');
        }

        if (!validateEmail(email)) {
            $('#email_error').text('Introduce un correo electrónico válido.');
            error = true;
        } else {
            $('#email_error').text('');
        }

        if (email !== confirmEmail) {
            $('#confirm_email_error').text('Los correos electrónicos no coinciden.');
            error = true;
        } else {
            $('#confirm_email_error').text('');
        }

        if (password.length < 6) {
            $('#password_error').text('La contraseña debe tener al menos 6 caracteres.');
            error = true;
        } else if (!validatePassword(password)) {
            $('#password_error').text('La contraseña debe contener al menos una letra mayúscula y un número.');
            error = true;
        } else {
            $('#password_error').text('');
        }

        if (password !== confirmPassword) {
            $('#confirm_password_error').text('Las contraseñas no coinciden.');
            error = true;
        } else {
            $('#confirm_password_error').text('');
        }

        if (!error) {
            this.submit();
        }
    });

    function validateName(name) {
        var regex = /^[a-zA-Z\s]*$/;
        return regex.test(name);
    }

    function validateEmail(email) {
        var re = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
        return re.test(email);
    }

    function validatePassword(password) {
        var uppercaseRegex = /[A-Z]/;
        var numberRegex = /[0-9]/;
        return uppercaseRegex.test(password) && numberRegex.test(password);
    }

    $('#togglePassword').click(function() {
        var passwordField = $('#password');
        var passwordFieldType = passwordField.attr('type');
        if (passwordFieldType === 'password') {
            passwordField.attr('type', 'text');
            $(this).find('i').removeClass('bi-eye').addClass('bi-eye-slash');
        } else {
            passwordField.attr('type', 'password');
            $(this).find('i').removeClass('bi-eye-slash').addClass('bi-eye');
        }
    });

    $('#toggleConfirmPassword').click(function() {
        var confirmPasswordField = $('#confirm_password');
        var confirmPasswordFieldType = confirmPasswordField.attr('type');
        if (confirmPasswordFieldType === 'password') {
            confirmPasswordField.attr('type', 'text');
            $(this).find('i').removeClass('bi-eye').addClass('bi-eye-slash');
        } else {
            confirmPasswordField.attr('type', 'password');
            $(this).find('i').removeClass('bi-eye-slash').addClass('bi-eye');
        }
    });
});
