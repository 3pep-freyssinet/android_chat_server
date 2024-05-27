const { Router } = require('express');
const controllers = require('../controllers');

const router = Router();

router.get('/', (req, res) => res.send('Welcome'));  //http://localhost:3000/api/  cf server

router.get("/read", function(req, res) {
  // this does not exist
  fs.createReadStream("my-self-esteem.txt");
  console.log("ici ******************************************");
});

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