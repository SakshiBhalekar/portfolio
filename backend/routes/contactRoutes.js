const express = require("express");

const router = express.Router();

const Contact = require("../models/contact");


// ==========================================
// SEND CONTACT MESSAGE
// ==========================================

router.post("/", async (req, res) => {

    try {

        const {
            name,
            email,
            message
        } = req.body;


        // Check required fields

        if (!name || !email || !message) {

            return res.status(400).json({

                message:
                    "Please fill in all fields."

            });

        }


        // Create contact message

        const newContact =
            new Contact({

                name: name,

                email: email,

                message: message

            });


        // Save to MongoDB

        const savedContact =
            await newContact.save();


        res.status(201).json({

            message:
                "Message sent successfully!",

            contact: savedContact

        });


    }

    catch (error) {

        console.error(
            "Contact Error:",
            error
        );


        res.status(500).json({

            message:
                "Failed to send message."

        });

    }

});


// ==========================================
// GET ALL CONTACT MESSAGES
// ==========================================

router.get("/", async (req, res) => {

    try {

        const contacts =
            await Contact
                .find()
                .sort({
                    createdAt: -1
                });


        res.json(contacts);

    }

    catch (error) {

        console.error(error);


        res.status(500).json({

            message:
                "Failed to fetch messages."

        });

    }

});


module.exports = router;