(() => {
  // Navbar hamburger menu for mobile
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });

    // Close menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (event) => {
      if (!hamburger.contains(event.target) && !navLinks.contains(event.target)) {
        navLinks.classList.remove('active');
      }
    });
  }

  // Year in footer
  const yearTarget = document.getElementById('year');
  if (yearTarget) {
    yearTarget.textContent = new Date().getFullYear();
  }

  // Render lucide icons if library is available
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }

  // Hero slider (simple cross-fade, 5s interval)
  const heroSlides = document.querySelectorAll('.hero-slide');
  if (heroSlides.length > 1) {
    let currentSlide = 0;

    setInterval(() => {
      heroSlides[currentSlide].classList.remove('active');
      currentSlide = (currentSlide + 1) % heroSlides.length;
      heroSlides[currentSlide].classList.add('active');
    }, 5000);
  }

  // Registration Modal Functionality
  let currentStep = 1;
  const totalSteps = 5;

  // Modal functions (expose after IIFE)

  window.changeStep = function(direction) {
    if (direction === 1 && currentStep < totalSteps) {
      if (validateStep(currentStep)) {
        currentStep++;
        showStep(currentStep);
      }
    } else if (direction === -1 && currentStep > 1) {
      currentStep--;
      showStep(currentStep);
    } else if (direction === 1 && currentStep === totalSteps) {
      if (validateStep(currentStep)) {
        generateMessage();
      }
    }
  };

  window.goToStep = function(targetStep) {
    // Only allow navigation to completed steps or the next step
    if (targetStep < currentStep) {
      // Can always go back to previous steps
      currentStep = targetStep;
      showStep(currentStep);
    } else if (targetStep === currentStep + 1) {
      // Going forward one step - validate current step
      if (validateStep(currentStep)) {
        currentStep = targetStep;
        showStep(currentStep);
      }
    } else if (targetStep > currentStep + 1) {
      // Can't skip ahead - validate and go forward one step at a time
      if (validateStep(currentStep)) {
        currentStep++;
        showStep(currentStep);
      }
    }
    // If targetStep === currentStep, do nothing (already there)
  };

  function showStep(step) {
    // Update step indicators
    document.querySelectorAll('.step').forEach((stepEl, index) => {
      stepEl.classList.remove('active', 'completed');
      if (index + 1 < step) {
        stepEl.classList.add('completed');
      } else if (index + 1 === step) {
        stepEl.classList.add('active');
      }
      
      // Make step clickable
      stepEl.style.cursor = 'pointer';
      stepEl.onclick = function() {
        goToStep(index + 1);
      };
    });

    // Show current step content
    document.querySelectorAll('.wizard-step').forEach((stepEl, index) => {
      stepEl.classList.remove('active');
      if (index + 1 === step) {
        stepEl.classList.add('active');
      }
    });

    // Update buttons
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    prevBtn.style.display = step === 1 ? 'none' : 'block';
    nextBtn.textContent = step === totalSteps ? 'Voltooien' : 'Volgende';

    // Scroll to top of modal body
    const modalBody = document.querySelector('#registrationForm');
    if (modalBody) {
      modalBody.scrollTop = 0;
    }

    // Show summary on last step
    if (step === totalSteps) {
      showSummary();
    }
  }

  function validateStep(step) {
    const currentStepEl = document.querySelector(`.wizard-step[data-step="${step}"]`);
    const requiredFields = currentStepEl.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        field.style.borderColor = 'red';
        isValid = false;
      } else {
        field.style.borderColor = '';
      }
    });

    if (!isValid) {
      alert('Vul alle verplichte velden in voordat u doorgaat.');
    }

    return isValid;
  }

  function showSummary() {
    const formData = new FormData(document.getElementById('registrationForm'));
    const data = Object.fromEntries(formData);
    
    // Get selected values with labels
    const regTypeRadio = document.querySelector('input[name="registrationType"]:checked');
    const regTypeText = regTypeRadio ? regTypeRadio.nextSibling.textContent.trim() : 'Niet geselecteerd';
    
    const gradeRadio = document.querySelector('input[name="gradeLevel"]:checked');
    const gradeText = gradeRadio ? gradeRadio.nextSibling.textContent.trim() : 'Niet geselecteerd';
    
    const profileRadio = document.querySelector('input[name="profile"]:checked');
    const profileText = profileRadio ? profileRadio.nextSibling.textContent.trim() : '';
    
    const paymentRadio = document.querySelector('input[name="paymentMethod"]:checked');
    const paymentText = paymentRadio ? paymentRadio.nextSibling.textContent.trim() : 'Niet geselecteerd';
    
    const summaryHtml = `
      <div class="summary-section">
        <h4>Aanmelding Details:</h4>
        <p><strong>Type:</strong> ${regTypeText}</p>
        <p><strong>Schooljaar:</strong> ${data.schoolYear || 'Niet geselecteerd'}</p>
        <p><strong>Leerjaar:</strong> ${gradeText}</p>
        ${profileText ? `<p><strong>Profiel:</strong> ${profileText}</p>` : ''}
      </div>
      <div class="summary-section">
        <h4>Leerling:</h4>
        <p><strong>Naam:</strong> ${data.childName}</p>
        <p><strong>Geboortedatum:</strong> ${data.birthDate}</p>
        <p><strong>Geboorteplaats:</strong> ${data.birthPlace}</p>
        <p><strong>Adres:</strong> ${data.address}</p>
        ${data.childDoctor ? `<p><strong>Huisarts:</strong> ${data.childDoctor}</p>` : ''}
      </div>
      <div class="summary-section">
        <h4>Ouders:</h4>
        <p><strong>E-mail:</strong> ${data.parentEmail}</p>
        <p><strong>Moeder:</strong> ${data.motherName} (${data.motherOccupation})</p>
        <p><strong>Mobiel moeder:</strong> +597${data.motherPhone}</p>
        <p><strong>Vader:</strong> ${data.fatherName} (${data.fatherOccupation})</p>
        <p><strong>Mobiel vader:</strong> +597${data.fatherPhone}</p>
      </div>
      <div class="summary-section">
        <h4>Betaling:</h4>
        <p><strong>Methode:</strong> ${paymentText}</p>
      </div>
    `;
    
    document.getElementById('summaryContent').innerHTML = summaryHtml;
  }

  function generateMessage() {

  const formData = new FormData(document.getElementById('registrationForm'));
  const data = Object.fromEntries(formData);

  // Get selected profile text
  const profileRadio = document.querySelector('input[name="profile"]:checked');
  const profileText = profileRadio ? profileRadio.nextSibling.textContent.trim() : '';

  // Get registration type text
  const regTypeRadio = document.querySelector('input[name="registrationType"]:checked');
  const regTypeText = regTypeRadio ? regTypeRadio.nextSibling.textContent.trim() : '';

  // Get grade level text
  const gradeRadio = document.querySelector('input[name="gradeLevel"]:checked');
  const gradeText = gradeRadio ? gradeRadio.nextSibling.textContent.trim() : '';

  // Get payment method text
  const paymentRadio = document.querySelector('input[name="paymentMethod"]:checked');
  const paymentText = paymentRadio ? paymentRadio.nextSibling.textContent.trim() : '';

  const message = `
SCHOOLAANMELDING - DE HOEKSTEEN
${regTypeText}

AANMELDING DETAILS:
• Type registratie: ${regTypeText}
• Schooljaar: ${data.schoolYear}
• Leerjaar: ${gradeText}
${profileText ? `• Profiel: ${profileText}` : ''}

LEERLING INFORMATIE:
• Voor- en achternaam: ${data.childName}
• Geboortedatum: ${data.birthDate}
• Geboorteplaats: ${data.birthPlace}
• Adres: ${data.address}
${data.childDoctor ? `• Huisarts: ${data.childDoctor}` : ''}

OUDER/VOOGD INFORMATIE:
• E-mailadres: ${data.parentEmail}

MOEDER:
• Naam: ${data.motherName}
• Beroep: ${data.motherOccupation}
• Mobiel: +597${data.motherPhone}

VADER:
• Naam: ${data.fatherName}
• Beroep: ${data.fatherOccupation}
• Mobiel: +597${data.fatherPhone}

BETALING:
${paymentText ? `• Gewenste betaalmethode: ${paymentText}` : '• Betaalmethode: Nog niet gespecificeerd'}

VERZOEK:
Hierbij melden wij ons kind aan voor De Hoeksteen. Graag zouden wij een afspraak willen maken voor een intakegesprek en eventuele rondleiding. We kijken uit naar jullie reactie!

Vriendelijke groeten,
${data.motherName} & ${data.fatherName}
Ouders van ${data.childName}
`;

  document.getElementById('generatedMessage').value = message;
  document.getElementById('registrationModal').style.display = 'none';
  document.getElementById('messageModal').style.display = 'block';
  document.body.classList.add('modal-open');
  }

  window.copyMessage = function() {
    const messageText = document.getElementById('generatedMessage');
    messageText.select();
    messageText.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(messageText.value);
    alert('Bericht gekopieerd naar klembord!');
  };

  window.sendWhatsApp = function() {
    const message = document.getElementById('generatedMessage').value;
    const whatsappUrl = `https://wa.me/5978825406?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  window.sendEmail = function() {
    const message = document.getElementById('generatedMessage').value;
    const subject = 'Aanmelding Nieuwe Leerling - Basisschool De Hoeksteen';
    const mailtoUrl = `mailto:contact@hoeksteen.sr?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
    window.location.href = mailtoUrl;
  };

  function resetForm() {
    document.getElementById('registrationForm').reset();
    currentStep = 1;
    showStep(currentStep);
  }

  function setupProfileVisibility() {
    // Initial setup - hide profile group
    const profileGroup = document.querySelector('input[name="profile"]').closest('.form-group');
    profileGroup.style.display = 'none';
    
    // Add event listeners to grade level radios
    const gradeRadios = document.querySelectorAll('input[name="gradeLevel"]');
    gradeRadios.forEach(radio => {
      radio.addEventListener('change', function() {
        const gradeValue = this.value;
        const isCollegeGrade = gradeValue.includes('College 4') || 
                              gradeValue.includes('College 5') || 
                              gradeValue.includes('College 6');
        
        if (isCollegeGrade) {
          profileGroup.style.display = 'block';
        } else {
          profileGroup.style.display = 'none';
          // Clear profile selection
          document.querySelectorAll('input[name="profile"]').forEach(p => p.checked = false);
        }
      });
    });
  }

  // Close modals when clicking outside
  window.addEventListener('click', function(event) {
    const registrationModal = document.getElementById('registrationModal');
    const messageModal = document.getElementById('messageModal');
    const protocolModal = document.getElementById('protocolModal');
    
    if (event.target === registrationModal) {
      closeRegistrationModal();
    }
    if (event.target === messageModal) {
      closeMessageModal();
    }
    if (protocolModal && event.target === protocolModal) {
      closeProtocolModal();
    }
  });

  // Scroll-triggered fade-in for sections
  document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('.section');
    const observer = new window.IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, {
      threshold: 0.05,
      rootMargin: '0px 0px -50px 0px'
    });
    sections.forEach(section => {
      observer.observe(section);
    });

    // Smooth Scroll for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        const href = this.getAttribute("href");
        if (href === "#") return;

        const targetElement = document.querySelector(href);
        if (targetElement) {
          e.preventDefault();
          // Account for fixed header height (110px for site-header)
          const headerOffset = 110;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        }
      });
    });
  });

  window._hoeksteenModalFns = {
    openRegistrationModal: function() {
      document.getElementById('registrationModal').style.display = 'block';
      document.body.classList.add('modal-open');
      currentStep = 1;
      showStep(currentStep);
      setupProfileVisibility();
    },
    closeRegistrationModal: function() {
      document.getElementById('registrationModal').style.display = 'none';
      document.body.classList.remove('modal-open');
      resetForm();
    },
    closeMessageModal: function() {
      document.getElementById('messageModal').style.display = 'none';
      document.body.classList.remove('modal-open');
    },
    openProtocolModal: function() {
      document.getElementById('protocolModal').style.display = 'block';
      document.body.classList.add('modal-open');
    },
    closeProtocolModal: function() {
      document.getElementById('protocolModal').style.display = 'none';
      document.body.classList.remove('modal-open');
    }
  };
  // For inline handlers
  window.openRegistrationModal = window._hoeksteenModalFns.openRegistrationModal;
  window.closeRegistrationModal = window._hoeksteenModalFns.closeRegistrationModal;
  window.closeMessageModal = window._hoeksteenModalFns.closeMessageModal;
  window.openProtocolModal = window._hoeksteenModalFns.openProtocolModal;
  window.closeProtocolModal = window._hoeksteenModalFns.closeProtocolModal;

})();
