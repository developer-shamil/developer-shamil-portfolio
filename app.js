/* -------------------------------------------------------------
   Interactive Canvas Particle Background
   ------------------------------------------------------------- */
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');

let particlesArray = [];
let connectionDistance = 120;
let particleColor = 'rgba(168, 85, 247, 0.15)'; // Default Violet
let lineColor = 'rgba(6, 182, 212, 0.06)'; // Default Cyan
let particleCount = 60;

// Re-adjust parameters based on viewport width
function adjustSettings() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    if (window.innerWidth < 768) {
        particleCount = 25;
        connectionDistance = 80;
    } else {
        particleCount = 70;
        connectionDistance = 120;
    }
}

// Adjust colors when theme updates
function updateCanvasColors() {
    const isDark = document.body.classList.contains('dark-theme');
    if (isDark) {
        particleColor = 'rgba(168, 85, 247, 0.15)'; // Violet
        lineColor = 'rgba(6, 182, 212, 0.05)'; // Cyan
    } else {
        particleColor = 'rgba(99, 102, 241, 0.12)'; // Indigo
        lineColor = 'rgba(14, 165, 233, 0.06)'; // Sky Blue
    }
}

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 0.6 - 0.3;
        this.speedY = Math.random() * 0.6 - 0.3;
    }
    
    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Bounce off borders
        if (this.x < 0 || this.x > canvas.width) this.speedX = -this.speedX;
        if (this.y < 0 || this.y > canvas.height) this.speedY = -this.speedY;
    }

    draw() {
        ctx.fillStyle = particleColor;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    particlesArray = [];
    for (let i = 0; i < particleCount; i++) {
        particlesArray.push(new Particle());
    }
}

function drawLines() {
    for (let i = 0; i < particlesArray.length; i++) {
        for (let j = i + 1; j < particlesArray.length; j++) {
            const dx = particlesArray[i].x - particlesArray[j].x;
            const dy = particlesArray[i].y - particlesArray[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < connectionDistance) {
                // Fade line based on distance
                const alpha = (1 - (distance / connectionDistance)) * 0.8;
                ctx.strokeStyle = lineColor.replace('0.06', alpha.toFixed(2)).replace('0.05', alpha.toFixed(2));
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                ctx.stroke();
            }
        }
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
    }
    drawLines();
    requestAnimationFrame(animateParticles);
}

// Debounced Resize Observer
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        adjustSettings();
        initParticles();
    }, 150);
});

// Start Canvas
adjustSettings();
updateCanvasColors();
initParticles();
animateParticles();


/* -------------------------------------------------------------
   Theme Switcher Mechanism
   ------------------------------------------------------------- */
const themeToggle = document.getElementById('theme-toggle');

// Check Local Storage preference
const savedTheme = localStorage.getItem('shamil-portfolio-theme') || 'dark';
if (savedTheme === 'light') {
    document.body.classList.remove('dark-theme');
    document.body.classList.add('light-theme');
    updateCanvasColors();
}

themeToggle.addEventListener('click', () => {
    if (document.body.classList.contains('dark-theme')) {
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');
        localStorage.setItem('shamil-portfolio-theme', 'light');
    } else {
        document.body.classList.remove('light-theme');
        document.body.classList.add('dark-theme');
        localStorage.setItem('shamil-portfolio-theme', 'dark');
    }
    updateCanvasColors();
});


/* -------------------------------------------------------------
   Hero Section Typewriter Animation
   ------------------------------------------------------------- */
const typewriterElement = document.getElementById('typewriter-text');
const words = ["Software Developer.", "Node.js Enthusiast.", "Problem Solver.", "Web Designer."];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeSpeed = 100;

function typeAnimation() {
    const currentWord = words[wordIndex];
    
    if (isDeleting) {
        // Delete characters
        typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 50; // Quicker deleting
    } else {
        // Write characters
        typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 100; // Normal typing speed
    }

    // Checking states
    if (!isDeleting && charIndex === currentWord.length) {
        typeSpeed = 1500; // Pause at end of word
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        typeSpeed = 500; // Small delay before next word
    }

    setTimeout(typeAnimation, typeSpeed);
}

// Start Typewriter
if (typewriterElement) {
    typeAnimation();
}


/* -------------------------------------------------------------
   Navigation: Smooth Highlighting & Mobile Hamburger Menu
   ------------------------------------------------------------- */
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section');

// Mobile Hamburger Toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navMenu.classList.toggle('open');
});

// Close Mobile Navbar on Link click
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navMenu.classList.remove('open');
    });
});

// Active Link Highlighter on Scroll
window.addEventListener('scroll', () => {
    let currentSectionId = "";
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        // Check if current scroll position matches this section
        if (window.scrollY >= (sectionTop - 180)) {
            currentSectionId = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
            link.classList.add('active');
        }
    });
});


/* -------------------------------------------------------------
   Scroll Reveal Animations & Skills fill observer
   ------------------------------------------------------------- */
const reveals = document.querySelectorAll('.scroll-reveal');
const skillFills = document.querySelectorAll('.skill-level-fill');

const observerOptions = {
    root: null, // Viewport
    threshold: 0.12, // Trigger when 12% is visible
    rootMargin: "0px"
};

const scrollObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            
            // If it is the skills section, animate progress bars
            if (entry.target.id === 'skills') {
                animateProgressBars();
            }
            // Stop observing once animated in
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

reveals.forEach(reveal => {
    scrollObserver.observe(reveal);
});

function animateProgressBars() {
    skillFills.forEach(fill => {
        const parent = fill.closest('.skill-card');
        const percentageText = parent.querySelector('.skill-percentage').textContent;
        fill.style.width = percentageText;
    });
}


/* -------------------------------------------------------------
   Simulated Node.js Terminal Script Runner
   ------------------------------------------------------------- */
const scriptButtons = document.querySelectorAll('.script-btn');
const scriptCodes = document.querySelectorAll('.script-code');
const runScriptBtn = document.getElementById('run-script-btn');
const consoleOutput = document.getElementById('console-output');

let currentScript = 'server';
let isRunning = false;

// Script change listeners
scriptButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        if (isRunning) return; // Prevent selection changes during execution

        // Toggle Buttons active classes
        scriptButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Toggle Source Code visibility
        const targetScript = btn.getAttribute('data-script');
        currentScript = targetScript;

        scriptCodes.forEach(code => code.classList.remove('active'));
        document.getElementById(`code-${targetScript}`).classList.add('active');

        // Reset Terminal State
        consoleOutput.innerHTML = `
            <p class="sys-msg">Select a script above and click "Run Node Script" to execute.</p>
            <p class="console-prompt"><span class="prompt-user">shamil-kp@node-playground</span>:<span class="prompt-dir">~</span>$ <span class="typing-dummy"></span></p>
        `;
    });
});

// Run Scripts Simulator Log Templates
const logs = {
    server: [
        { text: 'shamil-kp@node-playground:~$ node server.js', delay: 100, class: 'console-prompt-run' },
        { text: '[shamil-node-engine] Initializing process dependencies...', delay: 600, class: 'sys-msg' },
        { text: 'Loading HTTP library modules...', delay: 1100 },
        { text: 'Binding server process interface...', delay: 1600 },
        { text: 'Server successfully instantiated.', delay: 2100 },
        { text: 'Server listening on: http://localhost:3000', delay: 2500, class: 'terminal-success' },
        { text: 'Press Ctrl+C to stop backend simulation.', delay: 3000, class: 'sys-msg' }
    ],
    fileReader: [
        { text: 'shamil-kp@node-playground:~$ node fileReader.js', delay: 100, class: 'console-prompt-run' },
        { text: '[shamil-node-engine] Opening stream to database.txt...', delay: 700, class: 'sys-msg' },
        { text: 'Buffer allocated: 1024 bytes.', delay: 1200 },
        { text: '--- FILE CONTENT ---', delay: 1800, class: 'sys-msg' },
        { text: '{\n  "project_author": "Shamil KP",\n  "status": "Ready for Deploy",\n  "dependencies_installed": true\n}', delay: 2300 },
        { text: '--------------------', delay: 2800, class: 'sys-msg' },
        { text: 'Memory buffer cleared.', delay: 3300 },
        { text: 'Read completed successfully (Process exited with code 0).', delay: 3800, class: 'terminal-success' }
    ],
    apiSimulator: [
        { text: 'shamil-kp@node-playground:~$ node apiSimulator.js', delay: 100, class: 'console-prompt-run' },
        { text: 'Sending HTTP GET query to /api/v1/developer/profile...', delay: 800 },
        { text: 'Resolving DNS routes...', delay: 1400, class: 'sys-msg' },
        { text: 'Connected to endpoint successfully.', delay: 2000 },
        { text: 'HTTP/1.1 200 OK', delay: 2500, class: 'terminal-success' },
        { text: 'Response Payload:\n{\n  "id": 104,\n  "name": "Shamil KP",\n  "status": "Active",\n  "stack": ["Node.js", "HTML", "CSS", "JavaScript"]\n}', delay: 3100 },
        { text: 'Connection closed (Process exited with code 0).', delay: 3700, class: 'sys-msg' }
    ]
};

// Console script execution trigger
runScriptBtn.addEventListener('click', () => {
    if (isRunning) return; // Prevent double execution
    
    isRunning = true;
    runScriptBtn.disabled = true;
    runScriptBtn.style.opacity = '0.5';
    consoleOutput.innerHTML = ''; // Clear prompt

    const scriptLogs = logs[currentScript];
    
    scriptLogs.forEach(log => {
        setTimeout(() => {
            const p = document.createElement('p');
            if (log.class) p.className = log.class;
            
            // Format styling logic for prompt
            if (log.class === 'console-prompt-run') {
                p.innerHTML = `<span class="prompt-user">shamil-kp@node-playground</span>:<span class="prompt-dir">~</span>$ node ${currentScript}.js`;
            } else {
                p.textContent = log.text;
            }
            
            consoleOutput.appendChild(p);
            // Auto scroll console
            consoleOutput.scrollTop = consoleOutput.scrollHeight;
        }, log.delay);
    });

    // Reset button after execution completes
    const totalDuration = scriptLogs[scriptLogs.length - 1].delay + 500;
    setTimeout(() => {
        isRunning = false;
        runScriptBtn.disabled = false;
        runScriptBtn.style.opacity = '1';
        
        // Add final prompt line at the end
        const finalPrompt = document.createElement('p');
        finalPrompt.className = 'console-prompt';
        finalPrompt.innerHTML = `<span class="prompt-user">shamil-kp@node-playground</span>:<span class="prompt-dir">~</span>$ <span class="typing-dummy">|</span>`;
        consoleOutput.appendChild(finalPrompt);
        consoleOutput.scrollTop = consoleOutput.scrollHeight;
    }, totalDuration);
});


/* -------------------------------------------------------------
   Contact Form Validation & Submit Simulation
   ------------------------------------------------------------- */
const contactForm = document.getElementById('contact-form');
const nameInput = document.getElementById('form-name');
const emailInput = document.getElementById('form-email');
const messageInput = document.getElementById('form-message');
const toast = document.getElementById('toast');

// Validate email helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Reset error elements
function clearErrors() {
    const groups = document.querySelectorAll('.form-group');
    groups.forEach(group => group.classList.remove('invalid'));
}

// Form submit handler
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors();

    let hasErrors = false;

    // Validate Name
    if (!nameInput.value.trim()) {
        nameInput.parentElement.classList.add('invalid');
        hasErrors = true;
    }

    // Validate Email
    if (!emailInput.value.trim() || !isValidEmail(emailInput.value.trim())) {
        emailInput.parentElement.classList.add('invalid');
        hasErrors = true;
    }

    // Validate Message
    if (!messageInput.value.trim()) {
        messageInput.parentElement.classList.add('invalid');
        hasErrors = true;
    }

    if (hasErrors) return;

    // Simulate sending message API
    const submitBtn = contactForm.querySelector('.submit-btn');
    const submitBtnText = submitBtn.querySelector('span');
    const originalText = submitBtnText.textContent;
    
    submitBtn.disabled = true;
    submitBtnText.textContent = 'Sending Message...';
    submitBtn.style.opacity = '0.7';

    setTimeout(() => {
        // Success Mock Response
        submitBtn.disabled = false;
        submitBtnText.textContent = originalText;
        submitBtn.style.opacity = '1';

        // Clear Form inputs
        contactForm.reset();

        // Show Toast popup
        toast.classList.remove('hidden');

        // Hide Toast after 4 seconds
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 4000);

    }, 1500);
});
