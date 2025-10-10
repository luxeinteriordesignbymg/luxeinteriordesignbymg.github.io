document.addEventListener('DOMContentLoaded', function() {

    // --- Navbar Scroll Effect ---
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- Hamburger Menu for Mobile ---
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // --- Close menu when a link is clicked ---
    document.querySelectorAll('.nav-menu a').forEach(navLink => {
        navLink.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

});


// --- Form Submission Handling ---
const form = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

form.addEventListener('submit', function(event) {
    // Prevent the default form submission which causes a page redirect
    event.preventDefault(); 
    
    const formData = new FormData(form);
    
    // Send the data to Formspree using the Fetch API
    fetch(form.action, {
        method: form.method,
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    }).then(response => {
        // If the submission was successful
        if (response.ok) {
            formStatus.innerHTML = "Thanks! Your message has been submitted. Get back to you soon.";
            form.reset(); // This clears the form fields
            
            // NEW: Set a timer to clear the message after 10 seconds
            setTimeout(() => {
                formStatus.innerHTML = "";
            }, 10000); // 10000 milliseconds = 10 seconds

        } else {
            // If there was an error
            formStatus.innerHTML = "Oops! There was a problem submitting your form. Try again.";
            // Also clear error messages after 10 seconds
            setTimeout(() => {
                formStatus.innerHTML = "";
            }, 10000);
        }
    }).catch(error => {
        // If there was a network error
        formStatus.innerHTML = "Oops! There was a network error submitting your form. Try again.";
        // Also clear error messages after 10 seconds
        setTimeout(() => {
            formStatus.innerHTML = "";
        }, 10000);
    });
});