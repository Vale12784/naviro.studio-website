// ============================================================
// NAVIRO STUDIO — script.js
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
  
  // 1. AUTOMATIC FOOTER YEAR
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // 2. MOBILE NAVIGATION TOGGLE
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.getElementById("nav-menu");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.contains("is-open");
      navMenu.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", !isOpen);
    });

    const navLinks = navMenu.querySelectorAll("a");
    navLinks.forEach(link => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // 3. SCROLL REVEAL ANIMATIONS
  const revealElements = document.querySelectorAll(".reveal");

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // 4. SEAMLESS FORM SUBMISSION (NO PAGE RELOAD)
  const form = document.getElementById("contact-form");
  const successMessage = document.getElementById("form-success");

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault(); // Stop the page from reloading
      
      const submitButton = form.querySelector('button[type="submit"]');
      const originalText = submitButton.textContent;
      
      // Change button text to show it's loading
      submitButton.textContent = "Sending..."; 
      submitButton.disabled = true;

      const formData = new FormData(form);

      try {
        const response = await fetch(form.action, {
          method: form.method,
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          // It worked! Show the success message and hide the form
          successMessage.style.display = "block";
          form.style.display = "none"; 
        } else {
          // Something went wrong on Formspree's side
          alert("Oops! There was a problem submitting your form.");
          submitButton.textContent = originalText;
          submitButton.disabled = false;
        }
      } catch (error) {
        // Network error
        alert("Oops! There was a network error.");
        submitButton.textContent = originalText;
        submitButton.disabled = false;
      }
    });
  }

});