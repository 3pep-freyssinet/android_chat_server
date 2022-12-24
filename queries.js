// from : https://blog.logrocket.com/nodejs-expressjs-postgresql-crud-rest-api-example/
/////////////////////////////////////////////////////////////////////////////////
const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'tomcat14200',
  port: 5432,
})

//////////////////////////////////////////////////////////////////////////////
const getUsers = (request, response) => {
  pool.query('SELECT * FROM eleves ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}
///////////////////////////////////////////////////////////////////////////////
const getUserById = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('SELECT * FROM eleves WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}
/////////////////////////////////////////////////////////////////////////////
const createUser = (request, response) => {
  const { nom, prenom, adresse, ville, codepostal, tel, idclasses } = request.body

  pool.query('INSERT INTO users (nom, prenom, adresse, ville, codepostal, tel, idclasses ) VALUES ($1, $2, $3, $4, $5, $6, $7)', [nom, prenom, adresse, ville, codepostal, tel, idclasses], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(`User added with ID: ${result.insertId}`)
  })
}
///////////////////////////////////////////////////////////////////////////
const updateUser = (request, response) => {
  const id = parseInt(request.params.id)
  const { adresse, ville } = request.body

  pool.query(
    'UPDATE users SET adresse = $1, ville = $2 WHERE id = $3',
    [adresse, ville, id],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`User modified with ID: ${id}`)
    }
  )
}
/////////////////////////////////////////////////////////////////////////////
const deleteUser = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`User deleted with ID: ${id}`)
  })
}
////////////////////////////////////////////////////////////////////////
module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
}
//module.exports = {pool};
///////////////////////////////////////////////////////////////////////////
//						TESTING
////////////////////////////////////////////////////////////////////////////
//add user
//curl --data "name=Elaine&email=elaine@example.com" http://localhost:3000/users

//update user
//curl -X PUT -d "name=Kramer" -d "email=kramer@example.com" http://localhost:3000/users/1

//delete user
//curl -X "DELETE" http://localhost:3000/users/1
//////////////////////////////////////////////////////////////////////////////
//find bugs : https://logrocket.com/signup/
////////////////////////////////////////////////////////////////////////////////



