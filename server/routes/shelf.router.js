const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const { rejectUnauthenticated } = require('../modules/authentication-middleware');

/**
 * Get all of the items on the shelf
 */
router.get('/', (req, res) => {
  console.log('req.user', req.user);
  const queryText = `SELECT * FROM item ORDER BY "user_id" ASC`
  pool.query(queryText)
  .then((results) => {
    res.send(results.rows);
  }).catch((error) => {
    console.log('Error in shelt.router.js GET route', error);
    res.sendStatus(500);
  })
});

/**
 * Get all of the items from one user on the shelf
 */
router.get('/:id', (req, res) => {
  const queryText = `SELECT * FROM item WHERE user_id = $1 ORDER BY "user_id" ASC`
  pool.query(queryText, [req.params.id])
  .then((results) => {
    res.send(results.rows);
  }).catch((error) => {
    console.log('Error in shelt.router.js GET route', error);
    res.sendStatus(500);
  })
});

/**
 * Add an item for the logged in user to the shelf
 */
router.post('/', rejectUnauthenticated, (req, res) => {
  // code here
  console.log('body', req.body);
  console.log('user', req.user);
  let queryText = `INSERT INTO "item" ("description", "comment", "image_url", "user_id")
                   VALUES ( $1, $2, $3, $4)`;
  pool.query(queryText, [req.body.description, req.body.comment, req.body.image_url, req.user.id])
  .then(() => res.sendStatus(201))
  .catch((error) => { 
    console.log('Bad news bears error in server POST route ---->', error)
    res.sendStatus(501)
  });
});

/**
 * Delete an item if it's something the logged in user added
 */
router.delete('/', rejectUnauthenticated, (req, res) => {
    // DELETE route code here
  let userId = Number(req.query.userId);
  console.log('userId', userId);
  console.log('req.user', req.user.id);
  if (userId === req.user.id) { 
    const queryText = 'DELETE FROM item WHERE id=$1';
    pool.query(queryText, [req.query.itemId])
      .then(() => { res.sendStatus(200); })
      .catch((err) => {
        console.log('Error completing DELETE query', err);
        res.sendStatus(500);
      });
  } else { 
    console.log('user is unauthorized to delete', req.user.id, userId )
  }
 
});

/**
 * Update an item if it's something the logged in user added
 */
router.put('/:id', rejectUnauthenticated, (req, res) => {
  console.log('body', req.body);
  console.log('user', req.user);
  let queryText = `UPDATE "item" SET "description" = $2, "comment" = $3, "image_url" = $4 WHERE id = $1;`
  pool.query(queryText, [req.params.id, req.body.description, req.body.comment, req.body.image_url])
  .then(() => res.sendStatus(201))
  .catch((error) => { 
    console.log('Bad news bears error in server PUT route ---->', error)
    res.sendStatus(501)
  });
});

/**
 * Return all users along with the total number of items
 * they have added to the shelf
 */
router.get('/count', (req, res) => {
  // GET /count route code here
});

/**
 * Return a specific item by id
 */
router.get('/:id', (req, res) => {
  // GET item route code here
});

module.exports = router;
