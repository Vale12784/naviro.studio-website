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

      const showError = (msg) => {
        let box = document.getElementById("form-error");
        if (!box) {
          box = document.createElement("p");
          box.id = "form-error";
          box.setAttribute("role", "alert");
          box.style.cssText = "margin-top:1rem;color:#ff8a8a;font-size:0.95rem;line-height:1.5;";
          form.appendChild(box);
        }
        box.innerHTML = msg + ' You can also email us directly at <a href="https://mail.google.com/mail/?view=cm&fs=1&to=hello.naviro.studio@gmail.com&su=Website%20enquiry" target="_blank" rel="noopener" style="color:inherit;text-decoration:underline;">hello.naviro.studio@gmail.com</a>.';
        submitButton.textContent = originalText;
        submitButton.disabled = false;
      };

      try {
        const response = await fetch(form.action, {
          method: "POST",
          body: formData,
          headers: { "Accept": "application/json" }
        });

        if (response.ok) {
          const old = document.getElementById("form-error");
          if (old) old.remove();
          successMessage.style.display = "block";
          form.style.display = "none";
          if (window.posthog) posthog.capture("enquiry_submitted");
        } else {
          let detail = "";
          try {
            const data = await response.json();
            if (data && data.errors && data.errors.length) {
              detail = " (" + data.errors.map(err => err.message).join("; ") + ")";
            } else if (data && data.error) {
              detail = " (" + data.error + ")";
            }
          } catch (_) { /* response was not JSON */ }
          showError("Sorry, your enquiry could not be sent" + detail + ".");
        }
      } catch (error) {
        showError("Sorry, we could not reach the server. Please check your connection and try again.");
      }
    });
  }

});
