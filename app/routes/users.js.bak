//const { Router } = require('express'); //{x} = a means x=a.x example A much more useful example would be something like {width, height, color} = options,
                                       // which would replace the lines width = options.width; height = options.height; color = options.color 
//const router = Router();

//idem as above
const express = require('express');
const router  = express.Router();


const controllers = require('../controllers'); //'index.js' is expected in folder 'app/controllers'

router.get('/route', (req, res) => {
	res.send('hello the world in route');  //http://localhost:3000/route/  cf server
    console.log("get('/' : Welcome ");
});

router.get("/read", function(req, res) {
  // this does not exist
  fs.createReadStream("my-self-esteem.txt");
  console.log("ici ******************************************");
});

console.log("routes : router = " + JSON.stringify(router));

//router.post('/notes', controllers.createPost);

router.get('/all_notes', controllers.getAllNotes);				//http://localhost:3000/api/all_notes

router.get('/note/:postId', controllers.getOneNoteById); 		//http://localhost:3000/api/note/3

router.get('/add_note', controllers.createNote); 				//http://localhost:3000/api/add_note

router.get('/add_notes', controllers.createNotes); 				//http://localhost:3000/api/add_notes

router.get('/update_note/:postId', controllers.updateOneNote); 	//http://localhost:3000/api/update_note/3

router.get('/delete/:postId', controllers.deleteNote); 			//http://localhost:3000/api/delete/3

router.get('/classe/:postId', controllers.getClassOneEleveById);//http://localhost:3000/api/classe/3

router.get('/student/:name', controllers.getAllStudents);		//http://localhost:3000/api/student/martin


const Pool = require('pg').Pool
const fs   = require("fs");

/*
//localhost
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'tomcat@14200',
  port: 5432,
  client_encoding: 'utf8',
  //ssl: true,
  max: 20,
  min: 1,
  idleTimeoutMillis: 1000,
});
*/


/*
//Render + Aiven + env
const pool = new Pool({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: process.env.PORT,
  client_encoding: 'utf8',
  ssl: {
    rejectUnauthorized: true,
    ca: fs.readFileSync("./ca.pem").toString(),
  },
  max: 20,
  min: 1,
  idleTimeoutMillis: 1000,
});


//test
router.get('/', async (req, res) => {
    const response = 'Hello World from express listening on ';
	res.send("response = " + response);
});

//test
router.get('/db', async (req, res) => {
    const response = 'Hello World from express listening on ';
	//res.send("response = " + response);
	
	try {
      const client  = await pool.connect();
      const result  = await client.query('SELECT * FROM eleves WHERE id = 1');
	  
      const results = { 'results': (result) ? result.rows : null};
	  var obj       = JSON.stringify(results);	//--->{"results":[{"id":1,"name":"hello database"}]}
	  //var obj_ = JSON.parse(obj);
																				// Simple quote is same as double quote
	  console.log(" results obj = " + JSON.stringify(results));					//[object Object] --> results obj = {"results":[{"id":1,"nom":"tata\n","prenom":"tartar\n","adresse":"10, rue verte","ville":"bordeaux","codepostal":"33000\n","tel":"0456789012","idclasses":1}]}
	  //console.log("obj['results'] = "+results["results"]);					//[object Object] --> [{"id":1,"name":"hello database"}]
	  //console.log("obj['results'][0] = "+results["results"][0]);				//[object Object] --> {"id":1,"name":"hello database"}
	  //console.log("obj['results'][0]['id'] = "+results["results"][0]["id"]);	// 1
	  
	  //ou
	  
	  //console.log("results.results[0].id = "+results.results[0].id);			// même chose que ci-dessus.
				  
	  //res.send(response + obj);
	  res.send("results : " + JSON.stringify(results));
	  
	  //res.send("results obj = "+obj);	
	  //res.send("obj.['results'] = "+obj['results']);	
	  //res.send("obj.results id = "+obj.results);
	  
	  
      client.release();
    } catch (err) {
      //console.error(err);
      res.send("Error : " + err);
    }
});
*/
module.exports = router;