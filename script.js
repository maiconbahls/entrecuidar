document.addEventListener('DOMContentLoaded', () => {
    // ---- INITIAL LOADING & INTRO ----
    const loader = document.getElementById('loader-wrapper');
    const introView = document.getElementById('intro-view');
    const authView = document.getElementById('auth-view');
    const formView = document.getElementById('form-view');
    const btnStartPortal = document.getElementById('btn-start-portal');

    // Simulate Fake Loading (e.g. 1.5s)
    setTimeout(() => {
        if (loader) {
            loader.classList.add('hidden-loader');
            // Remove completely after transition ends
            setTimeout(() => { loader.style.display = 'none'; }, 800);
        }
    }, 3800); /* Tempo aumentado para mostrar mais a logo e segurar o suspense */

    // Intro to Auth Navigation
    if (btnStartPortal) {
        btnStartPortal.addEventListener('click', () => {
            introView.classList.add('hidden');
            authView.classList.remove('hidden');
        });
    }

    // ---- AUTHENTICATION LOGIC ----
    const loginBox = document.getElementById('login-box');
    const registerBox = document.getElementById('register-box');
    const codeBox = document.getElementById('code-box');

    const btnShowRegister = document.getElementById('btn-show-register');
    const btnShowLogin = document.getElementById('btn-show-login');
    const btnLogout = document.getElementById('btn-logout');

    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const codeForm = document.getElementById('code-form');

    // Switch between Login and Register
    btnShowRegister.addEventListener('click', (e) => {
        e.preventDefault();
        loginBox.classList.remove('active');
        registerBox.classList.add('active');
    });

    btnShowLogin.addEventListener('click', (e) => {
        e.preventDefault();
        registerBox.classList.remove('active');
        loginBox.classList.add('active');
    });

    // Handle Login Submit
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        submitBtn.innerHTML = '<i class="ri-loader-4-line ri-spin"></i> Entrando...';
        submitBtn.disabled = true;

        // Simulate API Login
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            loginForm.reset();

            // Hide Login, Show Code Input
            loginBox.classList.remove('active');
            codeBox.classList.add('active');
        }, 1000);
    });

    // Handle Register Submit
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const submitBtn = registerForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        submitBtn.innerHTML = '<i class="ri-loader-4-line ri-spin"></i> Criando conta...';
        submitBtn.disabled = true;

        // Simulate API Registration
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            registerForm.reset();

            // Hide Register, Show Code Input
            registerBox.classList.remove('active');
            codeBox.classList.add('active');
        }, 1000);
    });

    // Handle Logout
    btnLogout.addEventListener('click', () => {
        formView.classList.add('hidden');
        authView.classList.remove('hidden');
        codeBox.classList.remove('active');
        loginBox.classList.add('active');
        // Reset the main form steps
        currentStep = 0;
        updateFormSteps();
        document.getElementById('multi-step-form').reset();
    });

    // Handle Access Code Submit
    codeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const codeInput = document.getElementById('access-code').value.trim();
        const codeError = document.getElementById('code-error');
        const submitBtn = codeForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        codeError.style.display = 'none';

        if (codeInput === '001' || codeInput === '002') {
            submitBtn.innerHTML = '<i class="ri-loader-4-line ri-spin"></i> Validando...';
            submitBtn.disabled = true;

            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;

                // Set the correct product based on code
                let radioValue = codeInput === '001' ? 'essencial' : 'integral';
                let radioToSelect = document.querySelector(`input[name="produto"][value="${radioValue}"]`);
                if (radioToSelect) {
                    radioToSelect.checked = true;
                    // trigger change event to toggle form fields correctly
                    radioToSelect.dispatchEvent(new Event('change'));
                }

                formView.classList.remove('hidden');
                authView.classList.add('hidden');
                // Skip the first selection step directly to Step 2
                currentStep = 1;
                updateFormSteps();
            }, 800);
        } else {
            codeError.style.display = 'block';
        }
    });


    // ---- MULTI-STEP FORM LOGIC ----
    const steps = document.querySelectorAll('.form-step');
    const stepIndicators = document.querySelectorAll('.step');
    const nextBtns = document.querySelectorAll('.btn-next');
    const prevBtns = document.querySelectorAll('.btn-prev');
    const form = document.getElementById('multi-step-form');

    const radioInputs = document.querySelectorAll('input[name="produto"]');
    const camposEssencial = document.getElementById('campos-essencial');
    const camposIntegral = document.getElementById('campos-integral');

    // Handle radio button changes for Step 3 logic
    radioInputs.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'essencial') {
                camposEssencial.style.display = 'block';
                document.getElementById('desafio').setAttribute('required', 'true');
                document.getElementById('area').removeAttribute('required');
                document.getElementById('prazo').removeAttribute('required');
                document.getElementById('detalhes').removeAttribute('required');
                camposIntegral.style.display = 'none';
            } else if (e.target.value === 'integral') {
                camposIntegral.style.display = 'block';
                document.getElementById('area').setAttribute('required', 'true');
                document.getElementById('prazo').setAttribute('required', 'true');
                document.getElementById('detalhes').setAttribute('required', 'true');
                document.getElementById('desafio').removeAttribute('required');
                camposEssencial.style.display = 'none';
            }
        });
    });

    let currentStep = 0;

    nextBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (validateStep(currentStep)) {
                currentStep++;
                updateFormSteps();
            }
        });
    });

    prevBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            currentStep--;
            updateFormSteps();
        });
    });

    // Handle final submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        if (validateStep(currentStep)) {
            const submitBtn = document.getElementById('btn-submit');
            const originalHTML = submitBtn.innerHTML;

            submitBtn.innerHTML = '<i class="ri-loader-4-line ri-spin"></i> Processando...';
            submitBtn.disabled = true;

            setTimeout(() => {
                currentStep++; // Move to success step (Step 4)
                updateFormSteps();
                form.reset();
                submitBtn.innerHTML = originalHTML;
                submitBtn.disabled = false;
            }, 1500);
        }
    });

    function updateFormSteps() {
        steps.forEach((step, index) => {
            if (index === currentStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });

        if (currentStep < 3) {
            stepIndicators.forEach((indicator, index) => {
                if (index === currentStep) {
                    indicator.classList.add('active');
                    indicator.classList.remove('completed');
                } else if (index < currentStep) {
                    indicator.classList.remove('active');
                    indicator.classList.add('completed');
                } else {
                    indicator.classList.remove('active', 'completed');
                }
            });
        }
    }

    function validateStep(stepIndex) {
        let isValid = true;
        const currentStepElement = steps[stepIndex];

        if (stepIndex === 0) {
            const isChecked = document.querySelector('input[name="produto"]:checked');
            if (!isChecked) {
                isValid = false;
                document.querySelector('.product-cards').animate([
                    { transform: 'translateX(0)' },
                    { transform: 'translateX(-10px)' },
                    { transform: 'translateX(10px)' },
                    { transform: 'translateX(0)' }
                ], { duration: 400 });
            }
        }
        else {
            const inputs = currentStepElement.querySelectorAll('input[required], textarea[required], select[required]');

            inputs.forEach(input => {
                const group = input.closest('.input-group');
                if (input.value.trim() === '') {
                    isValid = false;
                    group.classList.add('error');

                    input.addEventListener('input', function handleInput() {
                        group.classList.remove('error');
                        input.removeEventListener('input', handleInput);
                    }, { once: true });
                } else if (input.type === 'email' && !validateEmail(input.value)) {
                    isValid = false;
                    group.classList.add('error');
                    if (group.querySelector('.error-msg')) {
                        group.querySelector('.error-msg').innerText = 'E-mail inválido';
                    }

                    input.addEventListener('input', function handleInput() {
                        group.classList.remove('error');
                        if (group.querySelector('.error-msg')) {
                            group.querySelector('.error-msg').innerText = 'Campo obrigatório';
                        }
                        input.removeEventListener('input', handleInput);
                    }, { once: true });
                }
            });
        }

        return isValid;
    }

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
});
