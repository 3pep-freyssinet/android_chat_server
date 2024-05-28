const models = require('../database/models');
const Op 	 = require("sequelize").Op;

const createNote = async (req, res) => {
  try {
    //const note = await models.Notes.create(req.body);
	const note = await models.Notes.create({ note: '10', ideleves: '5'});
    return res.status(201).json({note});
  } catch (error) {
    return res.status(500).json({error: error.message})
  }
}

//Add notes
const createNotes = async (req, res) => {
  try {
    //const note = await models.Notes.create(req.body);
	
	var data = [
	  { note: '20', ideleves: '1' },
	  { note: '20', ideleves: '1' },
	  { note: '20', ideleves: '1' }
	];
	const notes = await models.Notes.bulkCreate(data);
	
	return res.status(201).json({notes});

	} catch (error) {
		return res.status(500).json({error: error.message})
	}
}

//Get all notes
const getAllNotes = async (req, res) => {
  try {
    const notes = await models.Notes.findAll({
     
	 /*
	  include: [
        {
          model: models.Comment,
          as: 'comments'
        },
        {
          model: models.User,
          as: 'author'
        }
      ]
	  */
    });
    return res.status(200).json({ notes });
  } catch (error) {
    return res.status(500).send("getAllNotes error : "+error.stack); //error.message
  }
}

//Get student info, classroom and mark knowing note id.
const getOneNoteById = async (req, res) => {
  try {
    const { postId } = req.params;
	const note = await models.Notes.findOne({
      where: { id: postId },
     include: 
	 [
		{
		  model: models.Eleves,
		  as: 'author', 
		  include:
		  [
				{
					model: models.Classes,
					as: 'section',
				}
		  ]
		},
	]
	  
	 
	 /*
	  include: [
        {
          model: models.Comment,
          as: 'comments'
        },
        {
          model: models.User,
          as: 'author'
        }
      ]
	  */
    });
    if (note) {
		const eleve = await note.author.nom;
		console.log("eleve = "+eleve); 
		return res.status(200).json({ note });
    }
    return res.status(404).send(`Note with the specified ID = ${postId} does not exists`);
  
  } catch (error) {
    return res.status(500).send(error.message);
  }
  
}

//update one note by its id  , 
const updateOneNote = async (req, res) => {
  try {
    const { postId }  = req.params;
	var data = { note: '20', ideleves: '6' };
	  
    const [ updated ] = await models.Notes.update(data, //update(req.body
	{where: { id: postId } });
    if (updated) {
      const updatedNote = await models.Notes.findOne({ where: { id: postId } }); //get the updated row to display it.
      return res.status(200).json({ note: updatedNote });
    }
    throw new Error('Note to update not found');
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

//Delete one note
const deleteNote = async (req, res) => {
  try {
    const { postId } = req.params;
    const deleted = await models.Notes.destroy({
      where: { id: postId }
    });
    if (deleted) {
		return res.status(204).send("Note deleted");	//original
    }
    throw new Error("Note to delete with id = "+postId+" not found");
  } catch (error) {
		return res.status(500).send(error.message);
  }
};

	//Get student identity, classroom and mark knowing student id.
	const getClassOneEleveById = async (req, res) => {
		try {
			const { postId } = req.params;
			const eleve = await models.Eleves.findOne({
			  where: { id: postId },
			  
			 include: 
			 [
				{
				  model: models.Classes,
				  as: 'section',
				},
				
				{
				   model: models.Notes,
						as: 'notes',
				}
			 ]
			
			 
			 /*
			  include: [
				{
				  model: models.Comment,
				  as: 'comments'
				},
				{
				  model: models.User,
				  as: 'author'
				}
			  ]
			  */
			});
			if (eleve) {
				//const eleve = await eleve.section.classe;
				//console.log("eleve = "+eleve); 
				return res.status(200).json({ eleve });
			}
			return res.status(404).send('Eleve with the specified ID = ${postId} does not exists');
	  
		} catch (error) {
			return res.status(500).send(error.message);
		}
	}
	
	//Get all students info and classes knowing name or part of name
	const getAllStudents = async (req, res) => {
	  try {
		const { name } = req.params;
		const students = await models.Eleves.findAll({
		 where: { nom: {[Op.like]: '%'+name+'%'} },	//where: { nom: {[Op.like]: '%t%'} },
		 attributes: ['nom', 'prenom', ['tel', 'telephone']],  //keep column = 'nom', 'prenom', 'tel' AS 'telephone'
		order: 
		[
            ['id', 'ASC'],	//DESC
            ['nom', 'ASC'],
        ],
		  include: [
			{
				
				  model: models.Classes,
				  as: 'section',
				
				  //attributes:  {
				  //		exclude: ['id']		//not keep the column 'id'
				  //},
				  attributes:['classe'],		//keep only column 'classes'
			}		
		  ]
		  
		});
		return res.status(200).json({ students });
	  } catch (error) {
		return res.status(500).send("getAllStudents error : "+error.stack); //error.message
	  }
	};

module.exports = {
  createNote,
  createNotes,
  getOneNoteById,
  getAllNotes,
  updateOneNote,
  deleteNote,
  getClassOneEleveById,
  getAllStudents
}