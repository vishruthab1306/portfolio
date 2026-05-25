/**
 * Vishrutha Bangle Portfolio
 * Dynamic Interactive Application Script
 * Forest Emerald & Mint Theme Engine
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. GLOBAL SYSTEM UTILITIES & THEME ENGINE
       ========================================================================== */
    const body = document.body;
    const themeToggleBtn = document.getElementById('theme-toggle');
    const scrollProgress = document.getElementById('scroll-progress');
    const toastContainer = document.getElementById('toast-container');

    // Scroll Progress Bar Tracker
    window.addEventListener('scroll', () => {
        const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
        if (totalScroll > 0) {
            const scrollPercentage = (window.scrollY / totalScroll) * 100;
            scrollProgress.style.width = `${scrollPercentage}%`;
        }
    });

    // Toast Notification System
    function showToast(message, isError = false) {
        const toast = document.createElement('div');
        toast.className = `toast ${isError ? 'error' : ''}`;
        toast.innerHTML = `
            <i class="fas ${isError ? 'fa-exclamation-circle' : 'fa-check-circle'}"></i>
            <span>${message}</span>
        `;
        toastContainer.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'fadeOut 0.3s ease-out forwards';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // Theme Switcher Controller
    const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
    if (savedTheme === 'light') {
        body.classList.remove('dark-theme');
        body.classList.add('light-theme');
    }

    themeToggleBtn.addEventListener('click', () => {
        if (body.classList.contains('dark-theme')) {
            body.classList.remove('dark-theme');
            body.classList.add('light-theme');
            localStorage.setItem('portfolio-theme', 'light');
            showToast('Swapped to Light Theme');
        } else {
            body.classList.remove('light-theme');
            body.classList.add('dark-theme');
            localStorage.setItem('portfolio-theme', 'dark');
            showToast('Swapped to Dark Theme');
        }
    });

    /* ==========================================================================
       2. MOBILE NAVIGATION DRAWER
       ========================================================================== */
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navLinksContainer = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-link');

    mobileMenuToggle.addEventListener('click', () => {
        mobileMenuToggle.classList.toggle('active');
        navLinksContainer.classList.toggle('mobile-active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuToggle.classList.remove('active');
            navLinksContainer.classList.remove('mobile-active');
            
            navLinks.forEach(nl => nl.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // Dynamic Highlight Active Section in Navbar
    const sections = document.querySelectorAll('section');
    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 120; // offset navbar height
        
        sections.forEach(sec => {
            const secTop = sec.offsetTop;
            const secHeight = sec.clientHeight;
            if (scrollPosition >= secTop && scrollPosition < secTop + secHeight) {
                currentSectionId = sec.getAttribute('id');
            }
        });
        
        if (currentSectionId) {
            navLinks.forEach(nl => {
                nl.classList.remove('active');
                if (nl.getAttribute('href') === `#${currentSectionId}`) {
                    nl.classList.add('active');
                }
            });
        }
    });

    /* ==========================================================================
       3. HERO INTERACTIVE CANVAS PARTICLES
       ========================================================================== */
    const canvas = document.getElementById('hero-canvas');
    const ctx = canvas.getContext('2d');
    
    let particles = [];
    let mouse = { x: null, y: null, radius: 120 };

    function resizeCanvas() {
        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    window.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.size = Math.random() * 2.5 + 1;
            // Palette matches forest emerald and mint
            this.color = Math.random() > 0.4 ? '#408a71' : '#b0e4cc';
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 6;
            ctx.shadowColor = this.color;
            ctx.fill();
            ctx.shadowBlur = 0; // reset shadow
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Bounce on boundaries
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

            // Mouse proximity repulsion physics
            if (mouse.x !== null && mouse.y !== null) {
                let dx = this.x - mouse.x;
                let dy = this.y - mouse.y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.radius) {
                    let force = (mouse.radius - dist) / mouse.radius;
                    let angle = Math.atan2(dy, dx);
                    this.x += Math.cos(angle) * force * 1.5;
                    this.y += Math.sin(angle) * force * 1.5;
                }
            }
        }
    }

    function initParticles() {
        particles = [];
        const count = Math.min(65, Math.floor((canvas.width * canvas.height) / 11000));
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(p => {
            p.update();
            p.draw();
        });

        // Draw connections
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                let dx = particles[i].x - particles[j].x;
                let dy = particles[i].y - particles[j].y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < 100) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    // Sleek faint green web lines
                    ctx.strokeStyle = `rgba(176, 228, 204, ${0.15 * (1 - dist/100)})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
        }

        // Draw mouse connect line
        if (mouse.x !== null && mouse.y !== null) {
            particles.forEach(p => {
                let dx = p.x - mouse.x;
                let dy = p.y - mouse.y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.radius - 20) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.strokeStyle = `rgba(64, 138, 113, ${0.25 * (1 - dist/mouse.radius)})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            });
        }

        requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();

    /* ==========================================================================
       4. HERO CMD TERMINAL ENGINE
       ========================================================================== */
    const terminalConsole = document.getElementById('terminal-console');
    const terminalForm = document.getElementById('terminal-form');
    const terminalInput = document.getElementById('terminal-input');
    const terminalResetBtn = document.getElementById('terminal-reset');
    const termTags = document.querySelectorAll('.term-tag');
    const cursorLine = document.getElementById('terminal-cursor-line');

    const cliDatabase = {
        help: 'Available commands:\n  <span class="term-highlight">about</span>      - Short biography and student background\n  <span class="term-highlight">skills</span>     - Technical and product skills directory\n  <span class="term-highlight">projects</span>   - Core products designed\n  <span class="term-highlight">experience</span> - Internship contributions\n  <span class="term-highlight">contact</span>    - Connect credentials and info\n  <span class="term-highlight">clear</span>     - Wipe console history',
        about: '<b>Vishrutha Bangle</b>\n  - Role: 2nd Year Computer Science Engineering Student & Growth Intern\n  - Focus: Software engineering (Java, Python, MERN) & Product strategy\n  - Location: Bengaluru, India\n  - Goal: Securing product-focused and software development internships\n  - Philosophy: Blending core software principles with empathetic growth loops.',
        skills: '<b>Core Competencies</b>\n  - <span class="term-highlight">Interactive Webpages:</span> MERN Stack, Simulated Sandboxes, UI Prototyping\n  - <span class="term-highlight">User-Centred Products:</span> Design Thinking, User Feedback Loops, Personas\n  - <span class="term-highlight">Product Management:</span> MVP Scoping, Figma Wireframing, Product Lifecycle\n  - <span class="term-highlight">Project Operations:</span> Timelines, Logistics, Budget Negotiation, Growth',
        projects: '<b>Core Developed Products</b>\n  - <span class="term-highlight">MediVault:</span> AI-summarizer & AES-256 cloud medical documents storage box.\n  - <span class="term-highlight">CampusMart:</span> Peer-to-peer campus student listings marketplace with direct negotiation chat.\n  <i>*Scroll down to the Projects section to use the live simulators!</i>',
        experience: '<b>Timelines & Roles</b>\n  - <span class="term-highlight">Growth Intern (04/2026 - Present):</span> Altiron One Global (Tourney24 / Campus Scene).\n    Drove sports club acquisition, on-ground events logistics, marketing, and referral networking.',
        contact: '<b>Connect Credentials</b>\n  - Email: vishruthab1306@gmail.com\n  - Location: Bengaluru, India\n  - GitHub: github.com/vishruthab1306\n  - LinkedIn: linkedin.com/in/vishrutha-bangle/'
    };

    function appendTerminalLine(text, isOutput = true) {
        const line = document.createElement('div');
        line.className = `terminal-line ${isOutput ? 'output-line' : ''}`;
        line.innerHTML = text;
        terminalConsole.insertBefore(line, cursorLine);
        terminalConsole.scrollTop = terminalConsole.scrollHeight;
    }

    function processCommand(cmd) {
        const cleanCmd = cmd.trim().toLowerCase();
        
        // Command logging input print
        appendTerminalLine(`<span class="terminal-prompt">guest@vishrutha:~$</span> ${cmd}`, false);

        if (cleanCmd === '') return;

        if (cleanCmd === 'clear') {
            const lines = terminalConsole.querySelectorAll('.terminal-line:not(#terminal-cursor-line)');
            lines.forEach(l => l.remove());
            appendTerminalLine('System logs reset.', true);
            return;
        }

        if (cliDatabase.hasOwnProperty(cleanCmd)) {
            appendTerminalLine(cliDatabase[cleanCmd], true);
        } else {
            appendTerminalLine(`Command not found: <span style="color:#f87171">${cmd}</span>. Type <span class="term-highlight">help</span> for options.`, true);
        }
    }

    terminalForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const value = terminalInput.value;
        processCommand(value);
        terminalInput.value = '';
    });

    terminalResetBtn.addEventListener('click', () => {
        const lines = terminalConsole.querySelectorAll('.terminal-line:not(#terminal-cursor-line)');
        lines.forEach(l => l.remove());
        appendTerminalLine('System reboot completed. Shell is ready.', true);
    });

    termTags.forEach(tag => {
        tag.addEventListener('click', () => {
            const cmd = tag.getAttribute('data-cmd');
            terminalInput.value = '';
            let charIndex = 0;
            tag.disabled = true;
            
            const typeTimer = setInterval(() => {
                if (charIndex < cmd.length) {
                    terminalInput.value += cmd.charAt(charIndex);
                    charIndex++;
                } else {
                    clearInterval(typeTimer);
                    setTimeout(() => {
                        processCommand(cmd);
                        terminalInput.value = '';
                        tag.disabled = false;
                    }, 150);
                }
            }, 50);
        });
    });

    /* ==========================================================================
       5. MEDIVAULT SIMULATOR ENGINE (AI CLINICAL SUMMARY & ECG)
       ========================================================================== */
    const mvTabBtn = document.getElementById('btn-medivault-tab');
    const cmTabBtn = document.getElementById('btn-campusmart-tab');
    const mvPlayground = document.getElementById('medivault-playground');
    const cmPlayground = document.getElementById('campusmart-playground');

    mvTabBtn.addEventListener('click', () => {
        mvTabBtn.classList.add('active');
        cmTabBtn.classList.remove('active');
        mvPlayground.classList.add('active');
        mvPlayground.classList.remove('hidden');
        cmPlayground.classList.remove('active');
        cmPlayground.classList.add('hidden');
    });

    cmTabBtn.addEventListener('click', () => {
        cmTabBtn.classList.add('active');
        mvTabBtn.classList.remove('active');
        cmPlayground.classList.add('active');
        cmPlayground.classList.remove('hidden');
        mvPlayground.classList.remove('active');
        mvPlayground.classList.add('hidden');
    });

    const mvSamples = {
        'report-1': {
            title: 'Blood Test Report.pdf',
            isCardio: false,
            summary: 'The uploaded file is a routine haematology panel. Red blood cell count (RBC) and haemoglobin indices show balanced ranges, indicating normal oxygen-carrying capacity. However, a major anomaly is marked in the biochemistry segment: <b>25-Hydroxy Vitamin D levels are registered at 12.6 ng/mL</b>, indicating severe clinical deficiency. White blood cell distribution is in normal limits, with no signs of active systemic bacterial infection.',
            critical: 'Vitamin D level (12.6 ng/mL) is clinically deficient (Normal range: 30 - 100 ng/mL). Consider discussing therapeutic Vitamin D3 supplementation with your practitioner.',
            params: [
                { name: 'Haemoglobin (Hb)', val: '14.2 g/dL', status: 'Normal', flag: 'normal' },
                { name: 'Vitamin D (25-OH)', val: '12.6 ng/mL', status: 'Deficient', flag: 'abnormal' },
                { name: 'WBC Total Count', val: '6,400 /cumm', status: 'Normal', flag: 'normal' },
                { name: 'Total Cholesterol', val: '185 mg/dL', status: 'Normal', flag: 'normal' }
            ]
        },
        'report-2': {
            title: 'Cardiology Scan.png',
            isCardio: true,
            summary: 'Electrocardiogram telemetry indicates <b>normal sinus rhythm</b> with a resting pulse frequency of 74 beats per minute. P-wave configurations, PR intervals, and QRS electrical dispersion parameters are within baseline limits. A mild ST-segment elevation is detected during initial deep inhalation intervals, but it resides within physiological deviations. Cardiac axis orientation sits at +45 degrees, which is normal.',
            critical: 'ECG is mostly clean and reveals a healthy sinus rhythm. A minor physiological ST-segment spike is noted, likely benign, but should be cross-referenced with your cardiologist.',
            params: [
                { name: 'Heart Rate (ECG)', val: '74 bpm', status: 'Normal', flag: 'normal' },
                { name: 'PR Interval', val: '0.16 sec', status: 'Normal', flag: 'normal' },
                { name: 'QRS Duration', val: '0.09 sec', status: 'Normal', flag: 'normal' },
                { name: 'ST-Segment Elevation', val: '0.04 mV', status: 'Borderline', flag: 'abnormal' }
            ]
        }
    };

    const mvMain = document.querySelector('.mv-main');
    const mvScanline = document.getElementById('mv-scanline');
    const mvStageUpload = document.getElementById('mv-stage-upload');
    const mvStageProcessing = document.getElementById('mv-stage-processing');
    const mvStageSummary = document.getElementById('mv-stage-summary');
    const mvDropzone = document.getElementById('mv-dropzone');
    const mvDocTitle = document.getElementById('mv-doc-title');
    const mvSummaryText = document.getElementById('mv-summary-text');
    const mvCriticalText = document.getElementById('mv-critical-text');
    const mvParamList = document.getElementById('mv-param-list');
    const mvUploadAnotherBtn = document.getElementById('btn-mv-upload-another');
    
    // ECG Oscilloscope Canvas Variables
    const ecgCanvas = document.getElementById('mv-ecg-canvas');
    const ecgCtx = ecgCanvas.getContext('2d');
    let ecgAnimationId = null;
    let ecgX = 0;

    // Drawing Heartbeat telemetry oscilloscope line
    function drawEcgOscilloscope() {
        ecgCtx.fillStyle = '#050a09';
        ecgCtx.fillRect(0, 0, ecgCanvas.width, ecgCanvas.height);

        // draw background grid
        ecgCtx.strokeStyle = 'rgba(64, 138, 113, 0.08)';
        ecgCtx.lineWidth = 0.5;
        for (let x = 0; x < ecgCanvas.width; x += 15) {
            ecgCtx.beginPath();
            ecgCtx.moveTo(x, 0);
            ecgCtx.lineTo(x, ecgCanvas.height);
            ctx.stroke();
        }
        for (let y = 0; y < ecgCanvas.height; y += 15) {
            ecgCtx.beginPath();
            ecgCtx.moveTo(0, y);
            ecgCtx.lineTo(ecgCanvas.width, y);
            ctx.stroke();
        }

        // draw green cardiac telemetry sweep line
        ecgCtx.strokeStyle = '#b0e4cc';
        ecgCtx.lineWidth = 1.8;
        ecgCtx.shadowBlur = 6;
        ecgCtx.shadowColor = '#b0e4cc';
        ecgCtx.beginPath();

        const midY = ecgCanvas.height / 2;
        ecgCtx.moveTo(0, midY);

        for (let i = 0; i < ecgCanvas.width; i++) {
            let relativeX = (i + ecgX) % ecgCanvas.width;
            let drawY = midY;

            // Heartbeat spike sequence algorithm based on X index
            let phase = relativeX % 110;
            if (phase > 20 && phase < 26) {
                // P-wave
                drawY = midY - 3;
            } else if (phase === 30) {
                // Q-spike
                drawY = midY + 4;
            } else if (phase === 32) {
                // R-peak (deep sinus jump)
                drawY = midY - 22;
            } else if (phase === 34) {
                // S-drop
                drawY = midY + 8;
            } else if (phase > 42 && phase < 50) {
                // T-wave
                drawY = midY - 6;
            }

            // Draw fading trail
            let alpha = 1;
            let sweepGap = (i - (ecgCanvas.width - 25)) % ecgCanvas.width;
            if (i > ecgCanvas.width - 25) {
                alpha = (ecgCanvas.width - i) / 25;
            }

            ecgCtx.strokeStyle = `rgba(176, 228, 204, ${alpha})`;
            ecgCtx.lineTo(i, drawY);
        }
        ecgCtx.stroke();
        ecgCtx.shadowBlur = 0; // reset

        ecgX += 2;
        ecgAnimationId = requestAnimationFrame(drawEcgOscilloscope);
    }

    function triggerScan(docKey) {
        const data = mvSamples[docKey];
        if (!data) return;

        // Transition: Upload -> Processing
        mvStageUpload.classList.add('hidden');
        mvStageProcessing.classList.remove('hidden');

        // Turn on laser sweep and ECG trace
        mvMain.classList.add('scanning');
        mvScanline.classList.add('active');
        
        if (data.isCardio) {
            document.getElementById('mv-ecg-container').style.display = 'flex';
            ecgX = 0;
            drawEcgOscilloscope();
        } else {
            document.getElementById('mv-ecg-container').style.display = 'none';
        }

        // Reset step indicators
        const steps = ['mv-step-1', 'mv-step-2', 'mv-step-3', 'mv-step-4'];
        steps.forEach(s => {
            const el = document.getElementById(s);
            el.className = 'step-item';
        });

        // Run sequential scanner ticker simulation
        setTimeout(() => {
            document.getElementById('mv-step-1').classList.add('done');
            document.getElementById('mv-step-2').classList.add('active');
            
            setTimeout(() => {
                document.getElementById('mv-step-2').className = 'step-item done';
                document.getElementById('mv-step-3').classList.add('active');
                
                setTimeout(() => {
                    document.getElementById('mv-step-3').className = 'step-item done';
                    document.getElementById('mv-step-4').classList.add('active');
                    
                    setTimeout(() => {
                        document.getElementById('mv-step-4').className = 'step-item done';
                        
                        // Transition: Processing -> Summary Dashboard
                        setTimeout(() => {
                            mvStageProcessing.classList.add('hidden');
                            mvStageSummary.classList.remove('hidden');
                            
                            // Turn off scanner sweeps and telemetry loops
                            mvMain.classList.remove('scanning');
                            mvScanline.classList.remove('active');
                            if (ecgAnimationId) {
                                cancelAnimationFrame(ecgAnimationId);
                                ecgAnimationId = null;
                            }
                            
                            // Inject dynamic analytical report details
                            mvDocTitle.textContent = data.title;
                            mvSummaryText.innerHTML = data.summary;
                            mvCriticalText.innerHTML = data.critical;
                            
                            // Render Parameter rows
                            mvParamList.innerHTML = '';
                            data.params.forEach(p => {
                                const row = document.createElement('div');
                                row.className = 'param-row';
                                row.innerHTML = `
                                    <span class="param-name">${p.name}</span>
                                    <span class="param-value">${p.val}</span>
                                    <span class="param-status ${p.flag}">${p.status}</span>
                                `;
                                mvParamList.appendChild(row);
                            });
                            
                            showToast(`Scan complete: ${data.title} fully summarized!`);
                        }, 400);

                    }, 800);
                }, 900);
            }, 800);
        }, 700);
    }

    const sampleButtons = document.querySelectorAll('.btn-sample');
    sampleButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const docKey = btn.getAttribute('data-doc');
            triggerScan(docKey);
        });
    });

    mvUploadAnotherBtn.addEventListener('click', () => {
        mvStageSummary.classList.add('hidden');
        mvStageUpload.classList.remove('hidden');
    });

    mvDropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        mvDropzone.style.borderColor = 'var(--accent-secondary)';
    });

    mvDropzone.addEventListener('dragleave', () => {
        mvDropzone.style.borderColor = 'var(--border-color)';
    });

    mvDropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        mvDropzone.style.borderColor = 'var(--border-color)';
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const fileName = files[0].name.toLowerCase();
            if (fileName.includes('heart') || fileName.includes('cardio') || fileName.includes('scan')) {
                triggerScan('report-2');
            } else {
                triggerScan('report-1');
            }
        }
    });

    mvDropzone.addEventListener('click', (e) => {
        if (e.target.closest('.sample-doc-selector')) return;
        triggerScan('report-1');
    });

    /* ==========================================================================
       6. CAMPUSMART MARKETPLACE & NEGOTIATION SIMULATOR
       ========================================================================== */
    const cmProducts = [
        { id: 1, title: 'Scientific Calculator FX-991EX', price: '₹750', origPrice: '₹1,200', category: 'electronics', icon: 'fa-calculator', seller: 'Suresh Kumar', block: 'Block B', details: 'Perfect condition, used for 2 semesters, battery intact.' },
        { id: 2, title: 'Calculus - Early Transcendentals', price: '₹400', origPrice: '₹950', category: 'books', icon: 'fa-book', seller: 'Neha Sharma', block: 'Library Area', details: 'No pen marks, 8th edition, includes formula reference card.' },
        { id: 3, title: 'Engineering Lab Coat (Size M)', price: '₹150', origPrice: '₹350', category: 'lab', icon: 'fa-shirt', seller: 'Rahul Dixit', block: 'Mech Block', details: 'Washed, no chemical spots, standard full-sleeve.' },
        { id: 4, title: 'Mechanical Draftsman Toolkit', price: '₹600', origPrice: '₹1,500', category: 'lab', icon: 'fa-compass', seller: 'Ananya Rao', block: 'Girls Hostel', details: 'Full geometry setup, T-square ruler, drafting clips.' },
        { id: 5, title: 'Arduino Uno Starter Kit', price: '₹900', origPrice: '₹1,800', category: 'electronics', icon: 'fa-microchip', seller: 'Pavan Patel', block: 'Block C Lab', details: 'Includes cables, breadboard, 15 different sensor chips.' },
        { id: 6, title: 'Cracking the Coding Interview', price: '₹550', origPrice: '₹1,100', category: 'books', icon: 'fa-book-open', seller: 'Vishrutha B.', block: 'CSE Block', details: 'Best book for DSA preparations, minor binding marks.' }
    ];

    const cmProductsContainer = document.getElementById('cm-products-container');
    const cmSearchInput = document.getElementById('cm-search-input');
    const cmFilterButtons = document.querySelectorAll('.cm-filter-btn');
    
    const cmChatPanel = document.getElementById('cm-chat-panel');
    const cmChatPlaceholder = document.getElementById('cm-chat-placeholder');
    const cmChatActive = document.getElementById('cm-chat-active');
    const cmChatSellerName = document.getElementById('cm-chat-seller-name');
    const cmChatSellerAvatar = document.getElementById('cm-chat-seller-avatar');
    const cmChatProdTitle = document.getElementById('cm-chat-prod-title');
    const cmChatProdPrice = document.getElementById('cm-chat-prod-price');
    const cmChatProdIcon = document.getElementById('cm-chat-prod-icon');
    const cmChatMessagesBox = document.getElementById('cm-chat-messages-box');
    const cmChatForm = document.getElementById('cm-chat-form');
    const cmChatInput = document.getElementById('cm-chat-input');
    const cmBidPresets = document.getElementById('cm-bid-presets');
    const btnCloseChat = document.getElementById('btn-close-chat');

    let currentSelectedProduct = null;

    // Render Product Cards
    function renderCampusProducts(filterCategory = 'all', searchTerm = '') {
        cmProductsContainer.innerHTML = '';
        
        const filtered = cmProducts.filter(p => {
            const matchesCat = filterCategory === 'all' || p.category === filterCategory;
            const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                  p.seller.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesCat && matchesSearch;
        });

        if (filtered.length === 0) {
            cmProductsContainer.innerHTML = '<p class="text-muted" style="grid-column: 1/-1; text-align:center; padding:40px 0;">No campus products found matching searches.</p>';
            return;
        }

        filtered.forEach(p => {
            const card = document.createElement('div');
            card.className = 'cm-product-card';
            card.innerHTML = `
                <div class="product-img-box ${p.category}">
                    <i class="fas ${p.icon}"></i>
                </div>
                <div class="product-info">
                    <h4>${p.title}</h4>
                    <span class="price">${p.price} <span style="font-size:0.75rem; text-decoration:line-through; color:var(--text-muted); font-weight:normal;">${p.origPrice}</span></span>
                    <div class="meta">
                        <span><i class="fas fa-user"></i> ${p.seller}</span>
                        <span><i class="fas fa-map-marker-alt"></i> ${p.block}</span>
                    </div>
                </div>
                <button class="btn btn-primary btn-contact-seller" data-id="${p.id}"><i class="far fa-comments"></i> Contact Seller</button>
            `;
            cmProductsContainer.appendChild(card);
        });

        const contactButtons = document.querySelectorAll('.btn-contact-seller');
        contactButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const prodId = parseInt(btn.getAttribute('data-id'));
                startNegotiationChat(prodId);
            });
        });
    }

    renderCampusProducts();

    cmFilterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            cmFilterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const category = btn.getAttribute('data-category');
            renderCampusProducts(category, cmSearchInput.value);
        });
    });

    cmSearchInput.addEventListener('input', () => {
        const activeBtn = document.querySelector('.cm-filter-btn.active');
        const category = activeBtn ? activeBtn.getAttribute('data-category') : 'all';
        renderCampusProducts(category, cmSearchInput.value);
    });

    // Chat Simulator Controller
    function startNegotiationChat(productId) {
        const prod = cmProducts.find(p => p.id === productId);
        if (!prod) return;

        currentSelectedProduct = prod;

        cmChatPlaceholder.classList.add('hidden');
        cmChatActive.classList.remove('hidden');

        cmChatSellerName.textContent = prod.seller;
        cmChatSellerAvatar.textContent = prod.seller.charAt(0);
        cmChatProdTitle.textContent = prod.title;
        cmChatProdPrice.textContent = prod.price;
        cmChatProdIcon.innerHTML = `<i class="fas ${prod.icon}"></i>`;

        cmChatMessagesBox.innerHTML = '';
        
        appendChatBubble(prod.seller, `Hi! Yes, I listed the <b>${prod.title}</b>. ${prod.details} It is available at my block (${prod.block}) if you want to inspect it!`, true);
        
        showToast(`Negotiating with ${prod.seller} for ${prod.title}`);
    }

    function appendChatBubble(sender, text, isSeller = false) {
        const bubble = document.createElement('div');
        bubble.className = `chat-bubble ${isSeller ? 'seller' : 'buyer'}`;
        bubble.innerHTML = text;
        cmChatMessagesBox.appendChild(bubble);
        cmChatMessagesBox.scrollTop = cmChatMessagesBox.scrollHeight;
    }

    cmChatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = cmChatInput.value.trim();
        if (text === '') return;

        appendChatBubble('You', text, false);
        cmChatInput.value = '';

        simulateSellerResponse(text);
    });

    function simulateSellerResponse(buyerText) {
        const typingBubble = document.createElement('div');
        typingBubble.className = 'chat-bubble seller typing-indicator';
        typingBubble.innerHTML = '<span style="font-style:italic; color:var(--text-muted)">typing...</span>';
        cmChatMessagesBox.appendChild(typingBubble);
        cmChatMessagesBox.scrollTop = cmChatMessagesBox.scrollHeight;

        const buyerTextLower = buyerText.toLowerCase();
        let sellerResponse = '';

        if (buyerTextLower.includes('₹') || buyerTextLower.includes('price') || buyerTextLower.includes('discount') || buyerTextLower.includes('cheap') || buyerTextLower.includes('less') || buyerTextLower.includes('offer')) {
            const currentPriceVal = parseInt(currentSelectedProduct.price.replace('₹', ''));
            
            // extract bid value if they typed numbers
            const numbersInText = buyerTextLower.match(/\d+/g);
            if (numbersInText) {
                const proposedBid = parseInt(numbersInText[0]);
                if (proposedBid < currentPriceVal * 0.7) {
                    // offer is too low (less than 70% of listing)
                    sellerResponse = `Oh, ₹${proposedBid} is way too low, sorry! I bought this for much more. How about <b>₹${Math.round(currentPriceVal * 0.9)}</b>? That is my absolute best.`;
                } else {
                    // reasonable bid
                    sellerResponse = `₹${proposedBid} is close! I can agree to <b>₹${proposedBid + 50}</b> if you can meet me today. Let me know if that works.`;
                }
            } else {
                const discountPrice = Math.round(currentPriceVal * 0.88); // 12% off
                sellerResponse = `I can lower the price slightly since you are a student! How about we meet in the middle at <b>₹${discountPrice}</b>? Let me know if that sounds reasonable.`;
            }
        } else if (buyerTextLower.includes('meet') || buyerTextLower.includes('where') || buyerTextLower.includes('place') || buyerTextLower.includes('time') || buyerTextLower.includes('when')) {
            sellerResponse = `I am usually free near the <b>${currentSelectedProduct.block}</b> during afternoon lunch breaks (around 1:30 PM). Would tomorrow work for you to meet up?`;
        } else if (buyerTextLower.includes('condition') || buyerTextLower.includes('damage') || buyerTextLower.includes('work') || buyerTextLower.includes('new')) {
            sellerResponse = `It is in great working shape, practically brand new! No defects or visual scratches. You are free to test it thoroughly before you pay.`;
        } else {
            sellerResponse = `That sounds good! I'd love to finalize this. Let's arrange a time to meet up at the <b>${currentSelectedProduct.block}</b> so you can check the product out.`;
        }

        setTimeout(() => {
            typingBubble.remove();
            appendChatBubble(currentSelectedProduct.seller, sellerResponse, true);
        }, 1200);
    }

    // Bidding Quick-Offer Buttons Controller
    cmBidPresets.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn-bid');
        if (!btn || !currentSelectedProduct) return;

        const offerType = btn.getAttribute('data-offer');
        const currentPriceVal = parseInt(currentSelectedProduct.price.replace('₹', ''));
        let messageText = '';

        if (offerType === '50') {
            const proposedValue = currentPriceVal - 50;
            messageText = `Hey! I'm interested. Can I get this for <b>₹${proposedValue}</b>? (₹50 discount)`;
        } else if (offerType === '100') {
            const proposedValue = currentPriceVal - 100;
            messageText = `Hi, would you be willing to accept <b>₹${proposedValue}</b> for this? (₹100 discount)`;
        } else if (offerType === 'meetup') {
            messageText = `Hi! I'd love to buy this. Where and when can we meet up on campus to exchange it?`;
        }

        appendChatBubble('You', messageText, false);
        simulateSellerResponse(messageText);
    });

    btnCloseChat.addEventListener('click', () => {
        cmChatActive.classList.add('hidden');
        cmChatPlaceholder.classList.remove('hidden');
        currentSelectedProduct = null;
    });

    /* ==========================================================================
       7. CONTACT FORM DIAL LOG CONSOLE
       ========================================================================== */
    const contactForm = document.getElementById('contact-form');
    const btnSubmitContact = document.getElementById('btn-submit-contact');
    const contactLogBox = document.getElementById('contact-log-box');
    const btnCopyEmail = document.getElementById('btn-copy-email');

    function appendLog(text, type = 'default') {
        const date = new Date();
        const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const line = document.createElement('div');
        line.className = `log-line ${type}`;
        line.innerHTML = `[${timeStr}] ${text}`;
        contactLogBox.appendChild(line);
        contactLogBox.scrollTop = contactLogBox.scrollHeight;
    }

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('form-name').value;
        const email = document.getElementById('form-email').value;
        const subject = document.getElementById('form-subject').value;
        
        btnSubmitContact.disabled = true;
        btnSubmitContact.innerHTML = '<span>Transmitting...</span> <i class="fas fa-spinner fa-spin"></i>';

        contactLogBox.innerHTML = '';

        appendLog('SYSTEM: Initializing mail submission client...', 'info');

        setTimeout(() => {
            appendLog(`SYSTEM: Resolving destination MX records for "vishruthab1306@gmail.com"`, 'info');
            
            setTimeout(() => {
                appendLog('SYSTEM: Destination resolved. Establishing secure SSL socket on port 465...', 'info');
                
                setTimeout(() => {
                    appendLog('SSLv3: Handshake verified. Cipher Suite: TLS_AES_256_GCM_SHA384 (256-bit keys)', 'success');
                    
                    setTimeout(() => {
                        appendLog(`CLIENT: Formatting payload metadata from sender: ${email} (${name})`, 'default');
                        
                        setTimeout(() => {
                            appendLog(`SMTP: Sending command "MAIL FROM: &lt;${email}&gt;"`, 'default');
                            
                            setTimeout(() => {
                                appendLog(`SMTP: Sending payload packet: Subject="${subject}"`, 'default');
                                
                                setTimeout(() => {
                                    appendLog('SYSTEM: Transmitting data payload streams...', 'info');
                                    
                                    setTimeout(() => {
                                        appendLog('SMTP: 250 2.0.0 OK Message accepted for delivery!', 'success');
                                        appendLog('SYSTEM: Message successfully transmitted to Vishrutha Bangle! WebSocket closed.', 'success');
                                        
                                        contactForm.reset();
                                        btnSubmitContact.disabled = false;
                                        btnSubmitContact.innerHTML = '<span>Send Message</span> <i class="fas fa-paper-plane"></i>';
                                        
                                        showToast('Message sent successfully!');
                                    }, 1000);
                                }, 700);
                            }, 600);
                        }, 500);
                    }, 500);
                }, 600);
            }, 700);
        }, 500);
    });

    btnCopyEmail.addEventListener('click', () => {
        const emailAddress = 'vishruthab1306@gmail.com';
        
        navigator.clipboard.writeText(emailAddress).then(() => {
            showToast('Email address copied to clipboard!');
            appendLog(`SYSTEM: Copied target address "${emailAddress}" to local clipboard successfully.`, 'success');
        }).catch(err => {
            const el = document.createElement('textarea');
            el.value = emailAddress;
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);
            showToast('Email address copied!');
        });
    });

    /* ==========================================================================
       8. SKILL CARDS 3D PERSPECTIVE TILT & ACTIVE FILTERING
       ========================================================================== */
    const skillCards = document.querySelectorAll('.skill-card');
    const skillFilterBtns = document.querySelectorAll('.skill-filter-btn');
    
    // Skill Cards Active Filtering Logic
    skillFilterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active classes
            skillFilterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const targetGroup = btn.getAttribute('data-group');
            
            skillCards.forEach(card => {
                const cardGroup = card.getAttribute('data-group');
                
                if (targetGroup === 'all' || cardGroup === targetGroup) {
                    card.style.display = 'flex';
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(10px) scale(0.95)';
                    
                    // Simple animation reflow
                    setTimeout(() => {
                        card.style.transition = 'all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0) scale(1)';
                    }, 50);
                } else {
                    card.style.transition = 'all 0.3s ease';
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(-10px) scale(0.95)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
            
            showToast(`Filtered competencies: ${btn.textContent}`);
        });
    });

    // 3D Perspective Tilt Hover physics
    skillCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; 
            const y = e.clientY - rect.top;  
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((centerY - y) / centerY) * 10;
            const rotateY = ((x - centerX) / centerX) * 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.transition = 'transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)';
        });
    });

});
