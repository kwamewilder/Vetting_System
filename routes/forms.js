const express = require('express');
const path = require('path');
const fs = require('fs');

module.exports = function(upload) {
  const router = express.Router();

  // Middleware to check if user is authenticated
  const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
      return next();
    }
    res.redirect('/auth/login');
  };

  // Display initial form
  router.get('/initial', isAuthenticated, (req, res) => {
    res.render('form-initial', { user: req.session.user });
  });

  // Handle form submission
  router.post('/initial', isAuthenticated, upload.single('photo'), (req, res) => {
    try {
      // Extract all form data
      const formData = {
        userId: req.session.user.id,
        armOfService: req.body.armOfService,
        photo: req.file ? req.file.filename : null,
        
        personalDetails: {
          surname: req.body.surname,
          firstName: req.body.firstName,
          previousName: req.body.previousName,
          nameChangeReason: req.body.nameChangeReason,
          birthDetails: req.body.birthDetails,
          hometown: req.body.hometown,
          nationalityPresent: req.body.nationalityPresent,
          nationalityPrevious: req.body.nationalityPrevious,
          passportDetails: {
            type: req.body.passportType,
            number: req.body.passportNumber,
            issueDetails: req.body.passportIssueDetails,
            expiry: req.body.passportExpiry
          },
          countriesVisited: req.body.countriesVisited,
          physicalCharacteristics: {
            height: req.body.height,
            complexion: req.body.complexion,
            eyeColor: req.body.eyeColor,
            hairColor: req.body.hairColor
          },
          occupation: req.body.occupation
        },
        
        // ... include all other form sections as shown in previous example ...
        
        declaration: {
          signature: req.body.signature,
          date: req.body.declarationDate
        }
      };

      // Save submission with user ID
      const submissionPath = path.join(
        __dirname, '../submissions',
        `${req.session.user.id}-${Date.now()}.json`
      );
      
      fs.writeFileSync(submissionPath, JSON.stringify(formData, null, 2));
      
      res.redirect('/dashboard?success=true');
    } catch (error) {
      console.error('Error processing form submission:', error);
      res.status(500).render('error', { 
        error: 'Error processing your submission',
        user: req.session.user 
      });
    }
  });

  // View submitted forms
  router.get('/submissions', isAuthenticated, (req, res) => {
    try {
      const userSubmissions = [];
      const files = fs.readdirSync(path.join(__dirname, '../submissions'));
      
      files.forEach(file => {
        if (file.startsWith(req.session.user.id)) {
          const data = fs.readFileSync(path.join(__dirname, '../submissions', file));
          userSubmissions.push(JSON.parse(data));
        }
      });
      
      res.render('submissions', {
        user: req.session.user,
        submissions: userSubmissions
      });
    } catch (error) {
      console.error('Error reading submissions:', error);
      res.status(500).render('error', {
        error: 'Error retrieving your submissions',
        user: req.session.user
      });
    }
  });

  return router;
};