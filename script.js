// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    menuToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        menuToggle.innerHTML = navMenu.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });
    
    // Close menu when clicking a link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });
    
    // Material tabs functionality
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Remove active class from all buttons and panes
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));
            
            // Add active class to clicked button and corresponding pane
            this.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Pricing calculator functionality
    const materialSelect = document.getElementById('material-type');
    const weightSlider = document.getElementById('print-weight');
    const weightValue = document.getElementById('weight-value');
    const timeSlider = document.getElementById('print-time');
    const timeValue = document.getElementById('time-value');
    const complexitySelect = document.getElementById('complexity');
    const finishingSelect = document.getElementById('finishing');
    
    // Material prices per gram/ml
    const materialPrices = {
        'pla': 0.15,
        'abs': 0.25,
        'petg': 0.28,
        'nylon': 0.45,
        'resin': 0.35
    };
    
    // Complexity surcharges
    const complexitySurcharges = {
        '1': 5,
        '2': 15,
        '3': 30,
        '4': 50
    };
    
    // Finishing costs
    const finishingCosts = {
        '0': 0,
        '1': 10,
        '2': 25,
        '3': 40
    };
    
    // Machine cost per hour
    const machineHourlyRate = 2.5;
    
    // Update weight value display
    weightSlider.addEventListener('input', function() {
        weightValue.textContent = this.value;
        updatePricing();
    });
    
    // Update time value display
    timeSlider.addEventListener('input', function() {
        timeValue.textContent = this.value;
        updatePricing();
    });
    
    // Update pricing when any input changes
    materialSelect.addEventListener('change', updatePricing);
    complexitySelect.addEventListener('change', updatePricing);
    finishingSelect.addEventListener('change', updatePricing);
    
    // Calculate and update pricing
    function updatePricing() {
        const material = materialSelect.value;
        const weight = parseInt(weightSlider.value);
        const time = parseInt(timeSlider.value);
        const complexity = complexitySelect.value;
        const finishing = finishingSelect.value;
        
        // Calculate material cost
        const materialPrice = materialPrices[material];
        const materialCost = materialPrice * weight;
        
        // Calculate machine cost
        const machineCost = time * machineHourlyRate;
        
        // Get surcharges
        const complexityCost = complexitySurcharges[complexity];
        const finishingCost = finishingCosts[finishing];
        
        // Calculate total
        const total = materialCost + machineCost + complexityCost + finishingCost;
        
        // Update display
        document.getElementById('material-cost').textContent = `€${materialCost.toFixed(2)}`;
        document.getElementById('machine-cost').textContent = `€${machineCost.toFixed(2)}`;
        document.getElementById('complexity-cost').textContent = `€${complexityCost.toFixed(2)}`;
        document.getElementById('finishing-cost').textContent = `€${finishingCost.toFixed(2)}`;
        document.getElementById('total-cost').textContent = `€${total.toFixed(2)}`;
    }
    
    // Initialize pricing calculator
    updatePricing();
    
    // Form submission
    const projectForm = document.getElementById('project-form');
    projectForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const projectType = document.getElementById('project-type').value;
        const message = document.getElementById('message').value;
        
        // In a real application, you would send this data to a server
        // For this demo, we'll just show an alert
        alert(`Bedankt ${name}! Je projectaanvraag is ontvangen. We nemen binnen 24 uur contact met je op via ${email}.`);
        
        // Reset form
        projectForm.reset();
    });
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.padding = '10px 0';
            navbar.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.padding = '15px 0';
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
        
        // Update active nav link based on scroll position
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-menu a');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
    
    // Initialize scroll effect
    window.dispatchEvent(new Event('scroll'));
    
    // Newsletter subscription
    const newsletterBtn = document.querySelector('.newsletter button');
    const newsletterInput = document.querySelector('.newsletter input');
    
    newsletterBtn.addEventListener('click', function() {
        if (newsletterInput.value && newsletterInput.value.includes('@')) {
            alert(`Bedankt voor je inschrijving! Je ontvangt nu updates op ${newsletterInput.value}.`);
            newsletterInput.value = '';
        } else {
            alert('Voer een geldig e-mailadres in.');
        }
    });
    
    // Add enter key support for newsletter
    newsletterInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            newsletterBtn.click();
        }
    });
    
    // File upload visual feedback
    const fileUpload = document.getElementById('file-upload');
    const fileLabel = document.querySelector('.file-label span');
    
    fileUpload.addEventListener('change', function() {
        if (this.files.length > 0) {
            fileLabel.textContent = this.files[0].name;
        } else {
            fileLabel.textContent = 'Kies bestand of sleep hier';
        }
    });
    
    // Add drag and drop for file upload
    const fileLabelElement = document.querySelector('.file-label');
    
    fileLabelElement.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.style.borderColor = 'var(--primary-color)';
        this.style.backgroundColor = 'rgba(58, 134, 255, 0.1)';
    });
    
    fileLabelElement.addEventListener('dragleave', function() {
        this.style.borderColor = 'var(--gray-medium)';
        this.style.backgroundColor = 'white';
    });
    
    fileLabelElement.addEventListener('drop', function(e) {
        e.preventDefault();
        this.style.borderColor = 'var(--primary-color)';
        this.style.backgroundColor = 'rgba(58, 134, 255, 0.05)';
        
        if (e.dataTransfer.files.length > 0) {
            fileUpload.files = e.dataTransfer.files;
            fileLabel.textContent = e.dataTransfer.files[0].name;
        }
    });
    
    // Animate elements on scroll
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.service-card, .material-card, .info-card');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Set initial state for animation
    document.querySelectorAll('.service-card, .material-card, .info-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    // Run animation on load and scroll
    window.addEventListener('load', animateOnScroll);
    window.addEventListener('scroll', animateOnScroll);
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('href') !== '#') {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
});
