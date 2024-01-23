// Create web server using express
var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var commentsPath = path.join(__dirname, '../data/comments.json');

// GET /comments
router.get('/', function(req, res, next) {
  fs.readFile(commentsPath, 'utf8', function(err, data) {
    if (err) {
      next(err);
    } else {
      var comments = JSON.parse(data);
      res.json(comments);
    }
  });
});

// POST /comments
router.post('/', function(req, res, next) {
  fs.readFile(commentsPath, 'utf8', function(err, data) {
    if (err) {
      next(err);
    } else {
      var comments = JSON.parse(data);
      var comment = req.body;
      comment.id = comments.nextId;
      comments.nextId++;
      comments.push(comment);
      fs.writeFile(commentsPath, JSON.stringify(comments), function(err) {
        if (err) {
          next(err);
        } else {
          res.json(comment);
        }
      });
    }
  });
});

// PUT /comments/:id
router.put('/:id', function(req, res, next) {
  fs.readFile(commentsPath, 'utf8', function(err, data) {
    if (err) {
      next(err);
    } else {
      var comments = JSON.parse(data);
      var comment = comments.filter(function(comment) {
        return comment.id == req.params.id;
      })[0];
      if (comment) {
        comment.body = req.body.body;
        fs.writeFile(commentsPath, JSON.stringify(comments), function(err) {
          if (err) {
            next(err);
          } else {
            res.json(comment);
          }
        });
      } else {
        res.status(404).json({
          error: {
            message: 'Comment with id ' + req.params.id + ' not found'
          }
        });
      }
    }
  });
});

// DELETE /comments/:id
router.delete('/:id', function(req, res, next) {
  fs.readFile(commentsPath, 'utf8', function(err, data) {
    if (err) {
      next(err);
    } else {
      var comments = JSON.parse(data);
      var comment = comments.filter(function(comment) {
        return comment.id == req.params.id;
      })[0];
      if