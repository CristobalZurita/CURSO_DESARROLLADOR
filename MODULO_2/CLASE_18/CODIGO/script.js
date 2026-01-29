$(function () {

    /* =========================
       TEMA CLARO / OSCURO
    ========================== */
    $('#toggle-theme').on('click', function () {
        $('body').toggleClass('theme-dark');
    });

    /* =========================
       CAMBIO DE COLOR ACENTO
    ========================== */
    const accents = ['#0d6efd', '#dc3545', '#198754', '#6f42c1'];
    let index = 0;

    $('#btn-color').on('click', function () {
        index = (index + 1) % accents.length;
        document.documentElement.style.setProperty('--accent', accents[index]);
    });

    /* =========================
       ANIMACIÓN AL SCROLL
    ========================== */
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.2 });

    document.querySelectorAll('.section-observe').forEach(section => {
        observer.observe(section);
    });

    /* =========================
       FORMULARIO CON VALIDACIÓN
    ========================== */
    $('#contact-form').on('submit', function (e) {
        e.preventDefault();

        let valid = true;

        $('.error-text').text('');

        if ($('#nombre').val().trim().length < 3) {
            $('#nombre').next().text('Nombre demasiado corto');
            valid = false;
        }

        if (!$('#email').val().includes('@')) {
            $('#email').next().text('Email inválido');
            valid = false;
        }

        if ($('#mensaje').val().trim().length < 10) {
            $('#mensaje').next().text('Mensaje muy corto');
            valid = false;
        }

        if (valid) {
            alert('Mensaje enviado correctamente');
            this.reset();
        }
    });

});
