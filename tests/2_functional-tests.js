/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
        .post("/api/books")
        .send({"title":"freeCodeCamp book"})
        .end((err , res) => {
         assert.equal(res.status , 200); 
         assert.equal(res.body.title , "freeCodeCamp book" , "title should be freeCodeCamp book"); 
         assert.isArray(res.body.comments , "comment should be an array"); 
         assert.equal(res.body.comments.length , 0 , "comment should be an empty array");
         assert.property(res.body, '_id', 'Books should contain an  _id');
          
        done();
        });
        
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
        .post("/api/books")
        .send({})
        .end((err , res) => {
          assert.equal(res.status , 423);
          assert.equal(res.text , "missing title" , "response text should be 'missing title'");
          done();
        });
      });
      
    });


   suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
        .post("/api/books")
        .send({"title":"freeCodeCamp book"})
        .end((err , res) => {
         assert.equal(res.status , 200); 
         assert.equal(res.body.title , "freeCodeCamp book" , "title should be freeCodeCamp book"); 
         assert.isArray(res.body.comments , "comment should be an array"); 
         assert.equal(res.body.comments.length , 0 , "comment should be an empty array");
         assert.property(res.body, '_id', 'Books should contain an  _id');
        done();
      });      
      
    }); 
   });

//5b8964610d91bc3444fa194c
    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
         chai.request(server)
        .delete("/api/books/5b8964610d91bc3444fa194c")
        .end((err , res) => {
          assert.equal(res.status , 423);
          assert.equal(res.text, "no book exists" , "book should not exist in the DB with this id");
          done();
        }); 
      });
      
 /*     test('Test GET /api/books/[id] with valid id in db',  function(done){
         chai.request(server)
        .delete("/api/books/5b8962f6ce45d626f151d442")
        .end((err , res) => {
          assert.equal(res.status , 423);
          assert.equal(res.text, "'complete delete successful" , "response text should be ''complete delete successful'");
          done();
        }); 
      });*/
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      //5b89636d8dd2862c342526df
      test('Test POST /api/books/[id] with comment', function(done){
        chai.request(server)
        .post("/api/books/5b89636d8dd2862c342526df")
        .send({"comment":"test comment"})
        .end((err , res) => {
          assert.equal(res.status , 200);
          const comments = res.body.comments; 
          assert.equal(comments[comments.length-1] , "test comment" , "comment should be updated properly");
          done();
        });
        
      });
      
    });

  });

});
