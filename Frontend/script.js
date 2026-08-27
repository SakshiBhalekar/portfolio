const API_URL = "http://localhost:5000/api";


// ==========================================
// LOAD PROJECTS
// ==========================================

async function loadProjects() {

    const container =
        document.getElementById("projects-container");

    if (!container) return;

    try {

        const response =
            await fetch(`${API_URL}/projects`);

        if (!response.ok) {
            throw new Error("Failed to load projects");
        }

        const projects =
            await response.json();

        container.innerHTML = "";

        if (!projects.length) {

            container.innerHTML = `
                <p class="no-projects">
                    No projects available yet.
                </p>
            `;

            return;
        }


        projects.forEach((project, index) => {

            const card =
                document.createElement("article");

            card.className = "project-card";


            const number =
                String(index + 1).padStart(2, "0");


            const technologies =
                Array.isArray(project.technologies)
                    ? project.technologies
                    : [];


            const tags =
                technologies
                    .map(
                        tech => `
                            <span>${tech}</span>
                        `
                    )
                    .join("");


            card.innerHTML = `

                <div class="project-image">

                    <div class="project-visual">

                        <span>${number}</span>

                        <div class="visual-circle"></div>

                        <div class="visual-line"></div>

                    </div>

                </div>


                <div class="project-content">


                    <div class="project-top">

                        <span class="project-number">
                            ${number}
                        </span>

                        <span class="project-type">
                            PROJECT
                        </span>

                    </div>


                    <div class="project-tags">

                        ${tags}

                    </div>


                    <h3>
                        ${project.title}
                    </h3>


                    <p>
                        ${project.description}
                    </p>


                    <button
                        class="project-view-btn">

                        View Project →

                    </button>


                </div>

            `;


            // Click project

            card.addEventListener(
                "click",
                function() {

                    openProjectModal(project);

                }
            );


            container.appendChild(card);

        });


    }

    catch (error) {

        console.error(
            "Project loading error:",
            error
        );


        container.innerHTML = `

            <div class="no-projects">

                <h3>
                    Projects couldn't be loaded
                </h3>

                <p>
                    Make sure your backend is running.
                </p>

            </div>

        `;

    }

}


// ==========================================
// PROJECT MODAL
// ==========================================

function openProjectModal(project) {


    let oldModal =
        document.getElementById(
            "projectModal"
        );


    if (oldModal) {
        oldModal.remove();
    }


    const technologies =
        Array.isArray(project.technologies)
            ? project.technologies
            : [];


    const tags =
        technologies
            .map(
                tech => `
                    <span>${tech}</span>
                `
            )
            .join("");


    let links = "";


    if (
        project.github &&
        project.github.trim() !== "" &&
        project.github !== "https://github.com/"
    ) {

        links += `

            <a
                href="${project.github}"
                target="_blank"
                rel="noopener noreferrer">

                GitHub ↗

            </a>

        `;

    }


    if (
        project.live &&
        project.live.trim() !== "" &&
        project.live !== "https://example.com/"
    ) {

        links += `

            <a
                href="${project.live}"
                target="_blank"
                rel="noopener noreferrer">

                Live Demo ↗

            </a>

        `;

    }


    if (!links) {

        links = `

            <span class="modal-no-links">

                Links will be added soon.

            </span>

        `;

    }


    const modal =
        document.createElement("div");


    modal.id =
        "projectModal";


    modal.className =
        "project-modal";


    modal.innerHTML = `

        <div class="modal-overlay"></div>


        <div class="modal-box">


            <button
                class="modal-close"
                aria-label="Close">

                ×

            </button>


            <div class="modal-number">

                ${String(
                    project.title
                ).substring(0, 1).toUpperCase()}

            </div>


            <p class="modal-label">
                PROJECT
            </p>


            <h2>
                ${project.title}
            </h2>


            <p class="modal-description">

                ${project.description}

            </p>


            <div class="modal-section">

                <p>
                    TECHNOLOGIES
                </p>


                <div class="modal-tags">

                    ${tags}

                </div>

            </div>


            <div class="modal-actions">

                ${links}

            </div>


        </div>

    `;


    document.body.appendChild(modal);


    requestAnimationFrame(() => {

        modal.classList.add("show");

    });


    const closeModal =
        () => {

            modal.classList.remove(
                "show"
            );

            setTimeout(
                () => modal.remove(),
                250
            );

        };


    modal
        .querySelector(".modal-close")
        .addEventListener(
            "click",
            closeModal
        );


    modal
        .querySelector(".modal-overlay")
        .addEventListener(
            "click",
            closeModal
        );


    document.addEventListener(
        "keydown",
        function escapeHandler(event) {

            if (
                event.key === "Escape"
            ) {

                closeModal();

                document.removeEventListener(
                    "keydown",
                    escapeHandler
                );

            }

        }
    );

}


// ==========================================
// START
// ==========================================

loadProjects();