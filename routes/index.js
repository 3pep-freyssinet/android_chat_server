//const { Router } = require('express'); //{x} = a means x=a.x example A much more useful example would be something like {width, height, color} = options,
                                       // which would replace the lines width = options.width; height = options.height; color = options.color 
//const router = Router();

//idem que above
const express = require('express');
const router  = express.Router();

const controllers = require('../controllers');
router.get('/', (req, res) => {
	res.send('Welcome');  //http://localhost:3000/api/  cf server
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

module.exports = router;