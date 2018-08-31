/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const expect = require('chai').expect;

const ObjectId = require('mongodb').ObjectId;
const collectionName = "apitest";

module.exports =  (app , db) => {

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      db.collection(collectionName).find()
      .toArray((err , docs) => {
       if(err) throw err;  
      res.status(200).json(docs);
      });
    })
    
    .post((req, res) => {
      const title = req.body.title;
      //response will contain new book object including atleast _id and title
      if(!req.body.title)
      {
        res.status(423).send("missing title");
        return; 
      }
      db.collection(collectionName).insertOne({
      "title":req.body.title,
      "comments":[],
      "commentcount":0   
      })
      .then(doc => {
         doc = doc.ops[0];
         res.status(200).json({"title":doc.title , "comments":doc.comments , "_id":doc._id}); 
      })
      .catch(err => {throw err;});
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
    
      db.collection(collectionName).deleteMany({})
      .then(doc => {
        if(doc.deletedCount > 0)
        {
          res.status(200).send("complete delete successful");
          return;
        }
        res.status(220).send("no doc present");
      
      })
      .catch(err => {throw err});
    });



  app.route('/api/books/:id')
    .get((req, res) => {
      const bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      if(!bookid) {
         res.status(422).send("_id error");
          return; 
         }
      db.collection(collectionName).findOne({"_id":new ObjectId(bookid)})
       .then(doc => {
          if(!doc)
          {
            res.send("no book exists");
            return; 
          }
      
          res.status(200).json({
          "_id":doc._id,
          "title":doc.title,
          "comments":doc.comments
          });  
          })
          .catch(err => {throw err});
    })
    
    .post((req, res) => {
      const bookid = req.params.id;
      const comment = req.body.comment;
       if(!bookid) {
         res.status(422).send("_id error");
          return; 
         }
      //json res format same as .get
      db.collection(collectionName).findOneAndUpdate({"_id":new ObjectId(bookid)}, {
        "$push":{
      "comments":comment
      }, 
      "$inc":{"commentcount":1}} , { returnOriginal: false })
      .then(doc => {     
          doc = doc.value; 
          if(!doc)
          {
            res.status(422).send("no book exists");
            return; 
          }
          res.status(200).json({
          "_id":doc._id,
          "title":doc.title,
          "comments":doc.comments
          });   
      })
      .catch(err => {throw err})
    })
    
    .delete((req, res)=> {
      const bookid = req.params.id;
       if(!bookid) {
         res.status(422).send("_id error");
          return; 
         }
      db.collection(collectionName).deleteOne({"_id":new ObjectId(bookid)})
      .then(doc => {
      if(doc.result.n)
         {
       res.status(200).send("delete successful");
       return;
         }  
       res.status(423).send("no book exists"); 
      })
    .catch(err => {throw err});
      })
};
