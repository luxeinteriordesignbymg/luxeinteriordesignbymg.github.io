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

    // --- Blog "Read More" and Email Modal Logic ---
    const modal = document.getElementById('email-modal');
    const blogEmailForm = document.getElementById('blog-email-form');
    const closeModal = document.querySelector('.close-modal');
    const readMoreBtns = document.querySelectorAll('.read-more-btn');
    let activePostId = null;

    if (readMoreBtns.length > 0) {
        readMoreBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                activePostId = this.getAttribute('data-post');
                modal.style.display = 'flex';
                document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
            });
        });

        closeModal.addEventListener('click', () => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });

        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });

        if (blogEmailForm) {
            blogEmailForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const email = document.getElementById('subscriber-email').value;
                const modalStatus = document.getElementById('modal-status');
                
                modalStatus.textContent = "Thank you! Unlocking post...";

                /* 
                   --- GOOGLE FORM INTEGRATION ---
                   To connect this to your Google Form:
                   1. Create a Google Form with an email field.
                   2. Copy the Form Response URL (e.g., https://docs.google.com/forms/d/e/.../formResponse).
                   3. Find the 'entry.xxxx' ID for the email input field.
                */
                
                const googleFormAction = "https://docs.google.com/forms/d/e/1FAIpQLSdEjCrWnnbSr7B56C0bWgBe7amE-pJDEU1lWJlO2yRpqa4wnw/formResponse"; 
                const emailEntryId = "entry.219749187"; 

                // We use a hidden iframe to submit without redirecting
                const tempForm = document.createElement('form');
                tempForm.action = googleFormAction;
                tempForm.method = 'POST';
                tempForm.target = 'hidden_iframe';

                const emailInput = document.createElement('input');
                emailInput.type = 'hidden';
                emailInput.name = emailEntryId;
                emailInput.value = email;
                tempForm.appendChild(emailInput);

                document.body.appendChild(tempForm);
                
                // Submit the form to Google
                tempForm.submit(); 
                
                // Cleanup
                setTimeout(() => {
                    document.body.removeChild(tempForm);
                }, 100);

                // Reveal post after submission
                setTimeout(() => {
                    modal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                    
                    if (activePostId) {
                        const post = document.getElementById(activePostId);
                        const fullContent = post.querySelector('.blog-post-full');
                        const readMoreBtn = post.querySelector('.read-more-btn');
                        
                        fullContent.classList.add('show');
                        readMoreBtn.style.display = 'none';
                        
                        // Scroll slightly to the revealed content
                        fullContent.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }
                    blogEmailForm.reset();
                    modalStatus.textContent = "";
                }, 1500);
            });
        }
    }

});


// --- Contact Form Submission Handling (Formspree) ---
const form = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

if (form) {
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
}