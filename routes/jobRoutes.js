// routes/jobRoutes.js
const express = require('express');
const router = express.Router();

console.log('[jobRoutes.js] Starting.');

try {
    console.log('[jobRoutes.js] Requiring jobController...');
    const jobController = require('../controllers/jobController');
    console.log('[jobRoutes.js] jobController required. Type:', typeof jobController);

    if (!jobController) {
        throw new Error('jobController was imported but is falsy!');
    }

    // Test the first route handler DIRECTLY
    if (typeof jobController.getAllJobs !== 'function') {
        console.error('[jobRoutes.js] ERROR: jobController.getAllJobs is NOT a function. Type:', typeof jobController.getAllJobs);
        // Add a placeholder route to see if router works at all
        router.get('/', (req, res) => {
            res.status(500).send('Error: getAllJobs handler is not configured correctly.');
        });
    } else {
        console.log('[jobRoutes.js] Registering GET / with jobController.getAllJobs');
        router.get('/', jobController.getAllJobs);
    }

    // Test the second route handler DIRECTLY
    if (typeof jobController.createJob !== 'function') {
        console.error('[jobRoutes.js] ERROR: jobController.createJob is NOT a function. Type:', typeof jobController.createJob);
        // Add a placeholder route
         router.post('/', (req, res) => {
            res.status(500).send('Error: createJob handler is not configured correctly.');
        });
    } else {
        console.log('[jobRoutes.js] Registering POST / with jobController.createJob');
        router.post('/', jobController.createJob);
    }

} catch(err) {
    console.error('[jobRoutes.js] CRITICAL ERROR during setup:', err);
    // Define dummy routes so server MIGHT start, but indicates failure
    router.get('/', (req, res) => res.status(500).send('Failed to load job routes. Check server logs.'));
    router.post('/', (req, res) => res.status(500).send('Failed to load job routes. Check server logs.'));
}

console.log('[jobRoutes.js] Exporting router.');
module.exports = router;