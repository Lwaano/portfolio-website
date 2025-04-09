document.addEventListener('DOMContentLoaded'), () => {
    const projects = [
        {
            title: "Clinical Nursing Mobile Application Tool Admin Dashboard",
            description: "This is a description of Clinical Nursing Mobile Application Tool Admin Dashboard",
            status: "In Progress",
            image: "projects/projects.jpg",
            link: "https://github.com/Lwaano/CNMAT-Admin"
        },
        {
            title: "Project 2",
            description: "This is a description of Project 2",
            status: "In Progress",
            image: "projects/projects2.jpg",
            link: "https://github.com/Lwaano/Project-2"
        },
    ];

    const projectsGrid = document.querySelector('.projects-grid');
    const filterButtons = document.querySelectorAll('filter-buttons button');

    function displayProjects(filter = 'all') {
        projectsGrid.innerHTML = '';
        const filterProjects = filter == 'all'
            ? projects
            : projects.filter(project => project.status == filter);

        filterProjects.forEach(project => {
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';
            projectCard.innerHTML = `
                <img src="${project.image}" alt="${project.title}">
                <div class="project-info">
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                    <span class="status ${project.status}">${project.status}</span>
                    <a href="${project.link}" target="_blank" class="view-project">View Project</a>

                </div>
            `;
            projectsGrid.appendChild(projectCard);
        });
    }

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach('click', () => {
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
        document.body.classList.toggle('dark-mode');
        document.body.setAttribute('data-theme'),
            document.body.classList.contains('dark-theme') ? 'dark' : 'light');
    });

    // Smooth Scroll
    document.querySelectorAll('a [href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
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
        "particles": {
            number: { value: 80 },
            color: { value: '#00ffff' },
            shape: { type: 'circle', 
            opacity: { value: 0.5 },
            size: { value: 5 },
            move: {
                enable: true,
                speed: 2,
                direction: 'none',
                random: false,
                straight: false,
                out_mode: 'out',
                bounce: false,
            }
        },
        "interactivity": {
            detect_on: 'canvas',
            events: {
                onhover: { enable: true, mode: 'repulse' },
                onclick: { enable: true, mode: 'push' },
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

    // Intersection Observer for animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('skill-bars')) {
                    animateSkills();
                }
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.skill-bars, .project-card').forEach(el => {
        observer.observe(el);
    });

    //Theme to local storage
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.body.classList.add('dark-mode');
    }

    // Initialize theme
document.body.setAttribute('data-theme', 
    document.body.classList.contains('dark-theme') ? 'dark' : 'light');

    //Initial display
    displayProjects();
};