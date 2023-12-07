const express = require('express');
const router = express.Router();
const Team = require('../models/team');

//check if user is authenticated or not
function isLoggedIn(req, res, next){
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

// GET handler for rendering the list of teams
router.get('/teams', async (req, res, next) => {
    try {
        // Retrieve the list of teams from the database
        const teams = await Team.find();

        // Render the 'teams/teams.hbs' view with the list of teams
        res.render('teams/teams', {
            title: 'Team List',
            dataset: teams,
            user: req.user
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});


// GET handler for rendering the form to add a team
router.get('/add', isLoggedIn, function(req, res, next){
    res.render('teams/add', { title: 'Add Team', user: req.user });
});

// POST handler for submitting the form to add a team
router.post('/add', isLoggedIn, async (req, res, next) => {
    try {
        // Extract values from the request body
        const { team, captain, manager } = req.body;

        // Check if required fields are provided
        if (!team || !captain || !manager) {
            return res.status(400).send('Missing required fields');
        }

        // Create a new team
        const newTeam = await Team.create({
            team: team,
            captain: captain,
            manager: manager
            // Add other fields as needed
        });

        // Redirect to the teams page after successful addition
        res.redirect("/teams/teams");
    } catch (err) {
        console.error(err);
        if (err.name === 'ValidationError') {
            // Handle validation error
            res.status(400).send('Validation Error');
        } else {
            // Handle other errors
            res.status(500).send('Internal Server Error');
        }
    }
});

//edit a team by ID
router.get('/edit/:_id', isLoggedIn, async (req, res, next) => {
    try {
        const teamId = req.params._id;
        const team = await Team.findById(teamId);
        res.render('teams/edit', { title: 'Edit Team', team: team, user: req.user });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// Handling the form submission for updating a team (POST)
router.post('/edit/:_id', isLoggedIn, async (req, res, next) => {
    try {
        const teamId = req.params._id;
        const { team, captain, manager } = req.body;

        // Validate the provided data if needed

        // Update the team in the database
        await Team.findByIdAndUpdate(teamId, { team, captain, manager });

        // Redirect to the teams page or another appropriate page
        res.redirect('/teams/teams');
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});


// Delete a team by ID
router.get("/delete/:_id", isLoggedIn, async (req, res, next) => {
    try {
        const teamId = req.params._id;

        // Use deleteOne to delete the team
        await Team.deleteOne({ _id: teamId });

        // Redirect to the teams page after successful deletion
        res.redirect("/teams/teams");
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});


module.exports = router;
