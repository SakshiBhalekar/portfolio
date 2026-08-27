const API_URL = "https://portfolio-ddzw.onrender.com/api";


// ==========================================
// LOAD PROJECTS
// ==========================================

async function loadProjects() {

    const container = document.getElementById("projects-container");

    if (!container) return;

    try {

        container.innerHTML = `
            <div class="loading-projects">
                Loading projects...
            </div>
        `;

        const response = await fetch(`${API_URL}/projects`, {
            method: "GET",
            headers: {
                "Accept": "application/json"
            },
            cache: "no-cache"
        });

        if (!response.ok) {
            throw new Error(`Server returned ${response.status}`);
        }

        const projects = await response.json();

        container.innerHTML = "";

        if (!Array.isArray(projects) || projects.length === 0) {

            container.innerHTML = `
                <div class="no-projects">
                    <p>No projects available yet.</p>
                </div>
            `;

            return;
        }

        projects.forEach((project, index) => {

            const card = document.createElement("article");

            card.className = "project-card";

            const number = String(index + 1).padStart(2, "0");

            const technologies =
                Array.isArray(project.technologies)
                    ? project.technologies
                    : [];

            const tags = technologies
                .map(tech => `<span>${escapeHTML(tech)}</span>`)
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
                        ${escapeHTML(project.title || "Untitled Project")}
                    </h3>

                    <p>
                        ${escapeHTML(
                            project.description ||
                            "No description available."
                        )}
                    </p>

                    <button
                        type="button"
                        class="project-view-btn">

                        View Project →

                    </button>

                </div>
            `;

            card.addEventListener("click", function (event) {

                if (event.target.closest("a")) {
                    return;
                }

                openProjectModal(project);

            });

            container.appendChild(card);

        });

    } catch (error) {

        console.error("Project loading error:", error);

        container.innerHTML = `

            <div class="no-projects">

                <h3>
                    Projects couldn't be loaded
                </h3>

                <p>
                    Please refresh the page and try again.
                </p>

            </div>

        `;
    }
}


// ==========================================
// PROJECT MODAL
// ==========================================

function openProjectModal(project) {

    const oldModal = document.getElementById("projectModal");

    if (oldModal) {
        oldModal.remove();
    }

    const technologies =
        Array.isArray(project.technologies)
            ? project.technologies
            : [];

    const tags = technologies
        .map(tech => `<span>${escapeHTML(tech)}</span>`)
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
                Project links will be added soon.
            </span>

        `;
    }

    const modal = document.createElement("div");

    modal.id = "projectModal";

    modal.className = "project-modal";

    modal.innerHTML = `

        <div class="modal-overlay"></div>

        <div class="modal-box">

            <button
                type="button"
                class="modal-close"
                aria-label="Close">

                ×

            </button>

            <div class="modal-number">

                ${String(project.title || "P")
                    .substring(0, 1)
                    .toUpperCase()}

            </div>

            <p class="modal-label">
                PROJECT
            </p>

            <h2>
                ${escapeHTML(project.title || "Untitled Project")}
            </h2>

            <p class="modal-description">
                ${escapeHTML(
                    project.description ||
                    "No description available."
                )}
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

    const closeModal = () => {

        modal.classList.remove("show");

        setTimeout(() => {

            if (modal) {
                modal.remove();
            }

        }, 250);
    };

    modal
        .querySelector(".modal-close")
        .addEventListener("click", closeModal);

    modal
        .querySelector(".modal-overlay")
        .addEventListener("click", closeModal);

    const escapeHandler = (event) => {

        if (event.key === "Escape") {

            closeModal();

            document.removeEventListener(
                "keydown",
                escapeHandler
            );

        }
    };

    document.addEventListener(
        "keydown",
        escapeHandler
    );
}


// ==========================================
// CONTACT FORM
// ==========================================

function setupContactForm() {

    /*
        This searches for the contact form using
        several common IDs/classes so it works with
        your existing HTML.
    */

    const form =
        document.querySelector("#contact-form") ||
        document.querySelector(".contact-form") ||
        document.querySelector("form[data-contact]");

    if (!form) {

        console.warn(
            "Contact form was not found."
        );

        return;
    }

    form.addEventListener("submit", async function (event) {

        event.preventDefault();

        const nameInput =
            form.querySelector(
                'input[name="name"]'
            );

        const emailInput =
            form.querySelector(
                'input[name="email"]'
            );

        const messageInput =
            form.querySelector(
                'textarea[name="message"]'
            );

        if (
            !nameInput ||
            !emailInput ||
            !messageInput
        ) {

            console.error(
                "Contact form fields are missing."
            );

            return;
        }

        const name =
            nameInput.value.trim();

        const email =
            emailInput.value.trim();

        const message =
            messageInput.value.trim();


        if (!name || !email || !message) {

            showContactMessage(
                form,
                "Please fill in all fields.",
                false
            );

            return;
        }


        const submitButton =
            form.querySelector(
                'button[type="submit"], input[type="submit"]'
            );


        const originalText =
            submitButton
                ? submitButton.textContent
                : "";


        if (submitButton) {

            submitButton.disabled = true;

            submitButton.textContent =
                "Sending...";
        }


        try {

            const response =
                await fetch(
                    `${API_URL}/contact`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",

                            "Accept":
                                "application/json"
                        },

                        body: JSON.stringify({
                            name,
                            email,
                            message
                        })
                    }
                );


            const data =
                await response.json()
                    .catch(() => ({}));


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    `Server error: ${response.status}`
                );
            }


            showContactMessage(
                form,
                "Message sent successfully! I'll get back to you soon.",
                true
            );


            form.reset();


        } catch (error) {

            console.error(
                "Contact form error:",
                error
            );


            showContactMessage(
                form,
                "Unable to send your message right now. Please try again.",
                false
            );


        } finally {

            if (submitButton) {

                submitButton.disabled = false;

                submitButton.textContent =
                    originalText ||
                    "Send Message";
            }
        }

    });
}


// ==========================================
// CONTACT MESSAGE
// ==========================================

function showContactMessage(
    form,
    message,
    success
) {

    let messageBox =
        form.querySelector(
            ".contact-status"
        );


    if (!messageBox) {

        messageBox =
            document.createElement("div");

        messageBox.className =
            "contact-status";

        form.appendChild(
            messageBox
        );
    }


    messageBox.textContent =
        message;


    messageBox.classList.remove(
        "success",
        "error"
    );


    messageBox.classList.add(
        success
            ? "success"
            : "error"
    );
}


// ==========================================
// SECURITY / HTML ESCAPE
// ==========================================

function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


// ==========================================
// START
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadProjects();

        setupContactForm();

    }
);