/* QuantFest 2026 - Main JS */

document.addEventListener('DOMContentLoaded', () => {
  initNavScroll();
  initMobileMenu();
  initTypewriter();
  initFadeInElements();
  initNumberCounters();
  initTabs();
  initRegistrationForm();
  initThreeGrid();
  initGSAPReveals();
  initMagneticButtons();
  initMambaEgg();
});

// 6.4 Nav scroll transition
function initNavScroll() {
  const nav = document.querySelector('nav');
  if (!nav) return;
  
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  });
  
  // Trigger once on load
  nav.classList.toggle('scrolled', window.scrollY > 60);
}

// 6.6 Mobile hamburger
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  if (!hamburger) return;
  
  hamburger.addEventListener('click', () => {
    document.body.classList.toggle('nav-open');
  });
}

// 6.3 Hero typewriter
function initTypewriter() {
  const container = document.querySelector('.typewriter-text');
  if (!container) return;
  
  const text = container.getAttribute('data-text');
  if (!text) return;
  
  container.innerHTML = ''; // Clear initial
  let i = 0;
  
  function typeWriter() {
    if (i < text.length) {
      container.innerHTML += text.charAt(i);
      i++;
      setTimeout(typeWriter, 40);
    } else {
      // Finished typing, add the blinking cursor
      const cursor = document.createElement('span');
      cursor.className = 'cursor glow-text';
      cursor.textContent = '|';
      container.appendChild(cursor);
    }
  }
  
  // Start after a short delay
  setTimeout(typeWriter, 300);
}

// 6.1 Scroll-triggered fade-in
function initFadeInElements() {
  const elements = document.querySelectorAll('.fade-in');
  if (elements.length === 0) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  
  elements.forEach(el => observer.observe(el));
}

// 6.2 Number counter animation
function initNumberCounters() {
  const counters = document.querySelectorAll('.counter-val');
  if (counters.length === 0) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateValue(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  
  counters.forEach(counter => observer.observe(counter));
}

function animateValue(obj) {
  const target = parseInt(obj.getAttribute('data-target').replace(/,/g, ''), 10);
  if (isNaN(target)) return;
  
  const duration = 1200;
  const start = 0;
  let startTime = null;
  
  // Save suffix/prefix if any, e.g., '10,000+', '₹8L+'
  const originalText = obj.getAttribute('data-original');
  const prefix = obj.getAttribute('data-prefix') || '';
  const suffix = obj.getAttribute('data-suffix') || '';
  
  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    
    // Ease out cubic
    const easeOut = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(easeOut * target);
    
    // Format number with commas
    const formatted = current.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    
    if (progress < 1) {
      obj.textContent = prefix + formatted + suffix;
      window.requestAnimationFrame(step);
    } else {
      // Ensure we hit the exact target text at the end
      obj.textContent = originalText;
    }
  }
  
  window.requestAnimationFrame(step);
}

// Tabs for Schedule Page
function initTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');
  
  if (tabBtns.length === 0 || tabPanels.length === 0) return;
  
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active from all
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanels.forEach(p => p.classList.remove('active'));
      
      // Add active to clicked
      btn.classList.add('active');
      const targetId = btn.getAttribute('data-target');
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });
}

// Headless Google Form Submission
function initRegistrationForm() {
  const form = document.getElementById('registrationForm');
  const successMessage = document.getElementById('successMessage');
  const submitBtn = document.getElementById('submitBtn');
  
  if (!form) return;
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // REPLACE WITH YOUR ACTUAL GOOGLE FORM ACTION URL
    const actionURL = "YOUR_GOOGLE_FORM_ACTION_URL_HERE"; 
    
    const formData = new FormData(form);
    
    // Loading state
    const originalText = submitBtn.textContent;
    submitBtn.textContent = "Submitting...";
    submitBtn.disabled = true;
    
    fetch(actionURL, {
      method: 'POST',
      mode: 'no-cors',
      body: formData
    })
    .then(() => {
      // no-cors always returns an opaque response, so we assume success.
      form.style.display = 'none';
      successMessage.style.display = 'block';
      window.scrollTo(0, 0);
    })
    .catch((err) => {
      console.error('Submission failed', err);
      alert('There was a problem submitting your registration. Please try again later.');
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    });
  });
}

// Hero Trading Chart Animation

// =========================================
// THREE.JS BREATHING GRID
// =========================================
function initThreeGrid() {
  const container = document.getElementById('three-container');
  if (!container || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);

  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 30;
  camera.position.y = -10;
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  // Low-poly plane geometry
  const geometry = new THREE.PlaneGeometry(100, 100, 30, 30);
  
  // Rotate to be flat-ish like a floor/ceiling
  geometry.rotateX(-Math.PI / 2);

  // Material: faint cool gray wireframe
  const material = new THREE.LineBasicMaterial({
    color: 0x111111,
    transparent: true,
    opacity: 0.08
  });

  const wireframe = new THREE.WireframeGeometry(geometry);
  const line = new THREE.LineSegments(wireframe, material);
  scene.add(line);

  // Store original Y positions for sine wave math
  const positions = line.geometry.attributes.position.array;
  const originalY = [];
  for (let i = 1; i < positions.length; i += 3) {
    originalY.push(positions[i]);
  }

  // Handle Resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // Animation Loop
  function animate() {
    requestAnimationFrame(animate);
    
    const time = Date.now() * 0.001;
    
    // Breathing Sine Wave
    const positions = line.geometry.attributes.position.array;
    let yIndex = 0;
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const z = positions[i+2];
      
      // Undulate based on x, z and time
      positions[i+1] = originalY[yIndex] + Math.sin(x * 0.1 + time * 0.5) * Math.cos(z * 0.1 + time * 0.5) * 2.0;
      yIndex++;
    }
    line.geometry.attributes.position.needsUpdate = true;
    
    // Subtle rotation
    scene.rotation.y = Math.sin(time * 0.1) * 0.05;

    renderer.render(scene, camera);
  }
  
  animate();
}

// =========================================
// GSAP ANIMATIONS
// =========================================
function initGSAPReveals() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  const revealElements = gsap.utils.toArray('.gsap-reveal, section, .stage-card, .timeline-item, .stat-box');
  
  revealElements.forEach((el) => {
    gsap.from(el, {
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        toggleActions: "play none none none"
      },
      y: 15,
      opacity: 0,
      duration: 1,
      ease: "power2.out"
    });
  });
}

function initMagneticButtons() {
  if (typeof gsap === 'undefined') return;
  
  const buttons = document.querySelectorAll('.btn-primary, .btn-outline');
  
  buttons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      // Calculate mouse position relative to center of button
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      // Move button slightly towards mouse
      gsap.to(btn, {
        x: x * 0.2,
        y: y * 0.2,
        duration: 0.3,
        ease: "power2.out"
      });
    });
    
    btn.addEventListener('mouseleave', () => {
      // Snap back to origin
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: "elastic.out(1, 0.3)"
      });
    });
  });
}

// =========================================
// EASTER EGG: Mamba Media
// =========================================
function initMambaEgg() {
  const eggs = document.querySelectorAll('.mamba-egg');
  const tooltip = document.getElementById('mambaTooltip');
  if (eggs.length === 0 || !tooltip) return;

  eggs.forEach(egg => {
    // Build the rolling characters dynamically
    const rollingContainer = egg.querySelector('.mamba-rolling');
    if (rollingContainer) {
      const mamba = "MAMBA".split("");
      const media = "MEDIA".split("");
      const stripChars = ["0", "1", "X", "%", "$", "#"];
      
      let html = "";
      const buildCol = (char, delay, colorClass) => {
        let stripHtml = stripChars.map(c => `<span class="mamba-char">${c}</span>`).join('');
        stripHtml += `<span class="mamba-char">${char}</span>`;
        
        return `
          <span class="mamba-char-col ${colorClass}">
            <span class="mamba-char-strip" data-delay="${delay}" data-length="${stripChars.length}">
              ${stripHtml}
            </span>
          </span>
        `;
      };
      
      mamba.forEach((c, i) => html += buildCol(c, i * 60, "text-primary"));
      html += `<span style="width: 6px;"></span>`;
      media.forEach((c, i) => html += buildCol(c, (mamba.length + i) * 60, "text-red"));
      
      rollingContainer.innerHTML = html;
    }

    // Hover Events
    egg.addEventListener('mouseenter', (e) => {
      tooltip.style.display = 'block';
      tooltip.style.left = (e.clientX + 16) + 'px';
      tooltip.style.top = (e.clientY + 16) + 'px';
      
      // Trigger roll
      const strips = egg.querySelectorAll('.mamba-char-strip');
      strips.forEach(strip => {
        const delay = strip.getAttribute('data-delay');
        const len = strip.getAttribute('data-length');
        strip.style.transitionDelay = delay + 'ms';
        strip.style.transform = `translateY(-${len}em)`;
      });
    });

    egg.addEventListener('mousemove', (e) => {
      tooltip.style.left = (e.clientX + 16) + 'px';
      tooltip.style.top = (e.clientY + 16) + 'px';
    });

    egg.addEventListener('mouseleave', () => {
      tooltip.style.display = 'none';
      
      // Reset roll
      const strips = egg.querySelectorAll('.mamba-char-strip');
      strips.forEach(strip => {
        strip.style.transitionDelay = '0ms';
        strip.style.transform = `translateY(0em)`;
      });
    });
  });
}

