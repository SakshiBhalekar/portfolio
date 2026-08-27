const express = require("express");

const router = express.Router();

const Project = require("../models/project");


// ==========================================
// GET ALL PROJECTS
// ==========================================

router.get("/", async (req, res) => {

    try {

        const projects = await Project
            .find()
            .sort({
                createdAt: -1
            });


        res.status(200).json(projects);

    }

    catch (error) {

        console.error(
            "Fetch Projects Error:",
            error
        );


        res.status(500).json({

            message:
                "Failed to fetch projects",

            error:
                error.message

        });

    }

});


// ==========================================
// GET ONE PROJECT
// ==========================================

router.get("/:id", async (req, res) => {

    try {

        const project =
            await Project.findById(
                req.params.id
            );


        if (!project) {

            return res.status(404).json({

                message:
                    "Project not found"

            });

        }


        res.status(200).json(project);

    }

    catch (error) {

        res.status(500).json({

            message:
                "Failed to fetch project",

            error:
                error.message

        });

    }

});


// ==========================================
// ADD NEW PROJECT
// ==========================================

router.post("/", async (req, res) => {

    try {

        const {

            title,

            description,

            technologies,

            github,

            live,

            image

        } = req.body;


        // Check required fields

        if (
            !title ||
            !description ||
            !technologies
        ) {

            return res.status(400).json({

                message:
                    "Title, description and technologies are required."

            });

        }


        const project =
            new Project({

                title: title,

                description: description,

                technologies: technologies,

                github: github || "",

                live: live || "",

                image: image || ""

            });


        const savedProject =
            await project.save();


        res.status(201).json(
            savedProject
        );

    }

    catch (error) {

        console.error(
            "Create Project Error:",
            error
        );


        res.status(500).json({

            message:
                "Failed to create project",

            error:
                error.message

        });

    }

});


// ==========================================
// DELETE PROJECT
// ==========================================

router.delete("/:id", async (req, res) => {

    try {

        const deletedProject =
            await Project.findByIdAndDelete(
                req.params.id
            );


        if (!deletedProject) {

            return res.status(404).json({

                message:
                    "Project not found"

            });

        }


        res.status(200).json({

            message:
                "Project deleted successfully"

        });

    }

    catch (error) {

        res.status(500).json({

            message:
                "Failed to delete project",

            error:
                error.message

        });

    }

});


module.exports = router;