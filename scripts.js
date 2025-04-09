document.addEventListener('DOMContentLoaded', () => {
    const projects = [
        {
            title: "Clinical Nursing Mobile Application Tool Admin Dashboard",
            description: "A full-stack Clinical Nursing Mobile Application Tool Admin Dashboard with real-time user management.",
            status: "current",
            image: "projects/project1.jpg",
            link: "https://github.com/Lwaano/CNMAT-Admin",
            tags: ["Php", "Laravel", "SQLite"]
        },
        {
            title: "Project 2",
            description: "Description of Project 2",
            status: "future",
            image: "projects/project2.jpg",
            link: "https://github.com/Lwaano/Project-2",
            tags: ["React", "Node.js"]
        }
    ];

    const projectsGrid = document.querySelector('.projects-grid');
    const filterButtons = document.querySelectorAll('.filter-buttons button');

    function displayProjects(filter = 'all') {
        projectsGrid.innerHTML = '';
        const filteredProjects = filter === 'all'
            ? projects
            : projects.filter(project => project.status === filter);

        filteredProjects.forEach(project => {
            const projectCard = document.createElement('div');
            projectCard.className = 'glass-card project-card';
            projectCard.innerHTML = `
                <img src="${project.image}" alt="${project.title}" class="project-image">
                <div class="project-content">
                    <h3>${project.title}</h3>
                    <div class="project-tags">
                        ${project.tags ? project.tags.map(tag => `<span class="tag">${tag}</span>`).join('') : ''}
                    </div>
                    <p class="project-description">${project.description}</p>
                    <div class="project-links">
                        <a href="${project.link}" class="btn-neon">Live Demo</a>
                        <a href="${project.link}" class="btn-neon btn-ghost">Code</a>
                    </div>
                </div>
            `;
            projectsGrid.appendChild(projectCard);
        });
    }

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const filter = button.dataset.filter;
            displayProjects(filter);
        });
    });

    // Theme Toggle
    const themeToggle = document.createElement('button');
    themeToggle.textContent = '🌓';
    themeToggle.className = 'theme-toggle';
    document.querySelector('nav ul').appendChild(themeToggle);

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        document.body.setAttribute('data-theme', 
            document.body.classList.contains('dark-theme') ? 'dark' : 'light');
        localStorage.setItem('theme', document.body.getAttribute('data-theme'));
    });

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Loading State
    window.addEventListener('load', () => {
        document.querySelector('.loader').style.display = 'none';
    });

    // Initialize Particles
    particlesJS('particles-js', {
        particles: {
            number: { value: 80 },
            color: { value: "#00ffff" },
            shape: { type: "circle" },
            opacity: { value: 0.5 },
            size: { value: 5 },
            move: {
                enable: true,
                speed: 2,
                direction: "none",
                random: false,
                straight: false,
                out_mode: "out",
                bounce: false
            }
        },
        interactivity: {
            detect_on: "canvas",
            events: {
                onhover: { enable: true, mode: "repulse" },
                onclick: { enable: true, mode: "push" },
                resize: true
            }
        }
    });

    // Animate Skill Bar
    const animateSkills = () => {
        document.querySelectorAll('.skill').forEach(skill => {
            const level = skill.dataset.level;
            const bar = skill.querySelector('.bar');
            bar.style.width = `${level}%`;
        });
    };

    // Animate skill bars on scroll
const skillBars = document.querySelectorAll('.skill-progress');
const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if(entry.isIntersecting) {
            entry.target.style.width = entry.target.dataset.width;
        }
    });
}, { threshold: 0.5 });

skillBars.forEach(bar => {
    bar.dataset.width = bar.style.width;
    bar.style.width = '0';
    skillsObserver.observe(bar.parentElement);
});

    // Intersection Observer for animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('skills-bars')) {
                    animateSkills();
                }
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.skills-bars, .project-card').forEach(el => {
        observer.observe(el);
    });

    // Initialize theme
    const savedTheme = localStorage.getItem('theme') || 
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.body.setAttribute('data-theme', savedTheme);
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }

    // Add intersection observer for scroll-based animations
const heroContent = document.querySelector('.name-title-wrapper');

const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, { threshold: 0.5 });

heroObserver.observe(heroContent);


    // Initial display
    displayProjects();
});