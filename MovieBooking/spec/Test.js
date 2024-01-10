import supertest from 'supertest';
import server from '../src/Server.js';

/*
//Get status code of 200 on successful POST request
describe('API Tests', function () {
  it('should get a 200 status code for a POST request', function (done) {
    supertest(server)
      .post('')
      .send({ key: 'value' })
      .expect(200)
      .end(function (err, response) {
        if (err) {
          done.fail(err); should return err no 451 if inserting unknown column values into table
        } else {
          expect(response.status).toBe(200);
          done();
        }
      });
  });
});     
*/
//Invalid formats should give 400: Bad Request response
describe('Invalid formats', function () {
  it('should get Invalid json format error for invalid json', function (done) {
    supertest(server)
      .post('')
      .set('Content-Type', 'application/json') 
      .send('{"age":30;}')
      .expect(400)
      .end(function (err, response) {  
        if (err) {
          done.fail(err);
        } else {
          expect(response.status).toBe(400);
          // Add more assertions as needed
          done();
        }
      });
  });

  it('should get invalid XML format error for invalid XML', function (done) {
    supertest(server)
      .post('')
      .set('Content-Type', 'application/xml') 
      .send('<root><element1>Value1</element1><element2>Value2</element2>')
      .expect(400)
      .end(function (err, response) {
        if (err) {
          done.fail(err);
        } else {
          expect(response.status).toBe(400);
          done();
        }
      });
  });  
}
);


//Using methods apart from PUT, POST, GET, DELETE should give 405 Method not allowed error

describe('Using methods apart from PUT, POST, GET, DELETE should give 405 error', function () {
  it('should get 405 error for PATCH request', function (done) {
    supertest(server)
      .patch('')  
      .expect(405)  
      .end(function (err, response) {
        if (err) {
          done.fail(err);
        } else {
          expect(response.status).toBe(405);
          done();
        }
      });
  });

  it('should get 405 error for OPTIONS request', function (done) {
    supertest(server)
      .options('')  
      .expect(405)  
      .end(function (err, response) {
        if (err) {
          done.fail(err);
        } else {
          expect(response.status).toBe(405);
          done();
        }
      });
  });
});



//Malformed URL's
//For OPERATION: UPDATE URL should be update and METHOD should be PUT
describe('Malformed URLs', function () {
  it('should return 400: Bad Request URL for an UPDATE operation sent using POST', function (done) {

    supertest(server)
      .post('/update?name=Dummy movie&new_name="Jhanavi"')
      .expect(400) 
      .end(function (err, response) {
        if (err) {
          done.fail(err);
        } else {
          expect(response.status).toBe(400); 
          done();
        }
      });});


          it('should return 400: Bad Request URL for an UPDATE operation sent on API other API endpoint', function (done) {
          
            supertest(server)
              .put('/insert"')
              .expect(400) 
              .end(function (err, response) {
                if (err) {
                  done.fail(err);
                } else {
                  expect(response.status).toBe(400); 
                  done();
                }
              })});

      it('should expect 404: Not found for resource not found for an UPDATE operation sent using PUT on a row that does not exist', function (done) {
        
        supertest(server)
          .put('/update?id=100&new_name=Jhanavi')
          .expect(404) 
          .end(function (err, response) {
            if (err) {
              done.fail(err);
            } else {
              expect(response.status).toBe(404); 
              done();
            }
          })});

          it('should expect 451 error code for an UPDATE operation on a column that does not exist', function (done) {
            supertest(server)
              .put('/update?new_Blah=hello')
              .expect(451) 
              .end(function (err, response) {
                if (err) {
                  done.fail(err);
                } else {
                  expect(response.status).toBe(451); 
                  done();
                }
              })});

     it('should return 400: Bad Request URL for an UPDATE operation sent using POST', function (done) {
    supertest(server)
      .post('/update?name=Dummy movie&new_name=Jhanavi')
      .expect(400) 
      .end(function (err, response) {
        if (err) {
          done.fail(err);
        } else {
          expect(response.status).toBe(400); 
          done();
        }
      })});

      it('should return 400: Bad Request URL for an INSERT operation sent using PUT', function (done) {
    
        supertest(server)
          .put('/insert?name="hello"')
          .expect(400) 
          .end(function (err, response) {
            if (err) {
              done.fail(err);
            } else {
              expect(response.status).toBe(400); 
              done();
            }
          })}); 
      
            
            //Make sure id = 2 exists
              it('should return 400: Bad Request URL for a DELETE operation sent using PUT', function (done) {
                supertest(server)
                  .put('/delete?name="Jhanavi"')
                  .expect(400) 
                  .end(function (err, response) {
                    if (err) {
                      done.fail(err);
                    } else {
                      expect(response.status).toBe(400); 
                      done();
                    }
                  })}); 
  });

  
//Non-existing resource  

describe('Malformed URLs', function () {

      //If selecting non-existing column from valid row 451

      it('should return err no 451 if using select statement for a column that does not exist', function (done) {
    
        supertest(server)
          .get('/select?blah=hello')
          .expect(451) 
          .end(function (err, response) {  
            if (err) {
              done.fail(err);
            } else {
              expect(response.status).toBe(451); 
              done();
            }
          });});

    
    //If selecting non-existing row from table 404 not found error -Non-existing resource
    //Make sure ID=1000 doesn't exist 
    it('should return err no 404 if using select statement for a row that does not exist', function (done) {
      
      supertest(server)
        .get('/select?id=100')
        .expect(404) 
        .end(function (err, response) {
          if (err) {
            done.fail(err);
          } else {
            expect(response.status).toBe(404); 
            done();
          }
        });});

    //If inserting unknown column values into table 1054
    it('should return err no 451 if inserting unknown column values into table', function (done) {
  
      supertest(server)
        .post('/insert?new_id=100')
        .expect(451) 
        .end(function (err, response) {
          if (err) {
            done.fail(err);
          } else {
            expect(response.status).toBe(451); 
            done();
          }
        });});

  //If updating bad column give error 451
  it('should return err no 451 if updating column that does not exist', function (done) {

    supertest(server)
      .put('/update?blah=3')
      .set('Content-Type', 'application/json')
      .expect(451) 
      .end(function (err, response) {
        if (err) {
          done.fail(err);
        } else {
          expect(response.status).toBe(451); 
          done();
        }
      });});

});

//Resquest to modify non-existing attribute

describe('Resource not found!', function () {
//Should return 404 when updating changes no columns - Resource not found
it('should return err no 404 if updating does not affect any rows', function (done) {

  supertest(server)
    .put('/update?new_name=Dummy movie&id=21')
    .expect(404) 
    .end(function (err, response) {
      if (err) {
        done.fail(err);
      } else {
        expect(response.status).toBe(404); 
        done();
      }
    });});

  //If deleting row which doesn't exist give 404 not found error

    it('should return err no 404 if trying to delete row that does not exist in a table that does exist', function (done) {
    
      supertest(server)
        .delete('/delete?id=21')
        .expect(404) 
        .end(function (err, response) {
          if (err) {
            done.fail(err);
          } else {
            expect(response.status).toBe(404); 
            done();
          }
        });});

  });



//Checking if multiple inserts and deletes work
describe('Multiple rows insertion works!', function () {
const jsonData = [
  {  
    "name": "Movie 1",
    "genre": "Action",
    "director": "Director 1",
    "release_date": "2023-11-01"
  },
  {  
    "name": "Movie 2",
    "genre": "Action",
    "director": "Director 2",
    "release_date": "2023-11-02"
  }
]
let responses="";
//Should return 201 when multiple rows are successfully entered in a table
beforeAll(function (done) {
  supertest(server)
    .post('/insert')
    .send(jsonData)
    .set('Content-Type', 'application/json') 
    .expect(201) 
    .end(function (err, response) {
      responses = response;
      if (err) {
        done.fail(err);
      } else {
        done();
      }
    });
});

it('should return 201 if multiple records entered successfully', function (done) {
  expect(responses.statusCode).toEqual(201);
  done();
});
  
    it('should return 200 if multiple records are deleted successfully', function (done) {
    
      supertest(server)
        .delete('/delete?genre=Action')
        .expect(200) 
        .end(function (err, response) {
          if (err) {
            done.fail(err);
          } else {
            expect(response.status).toBe(200); 
            done();
          }
        });
  })});  

