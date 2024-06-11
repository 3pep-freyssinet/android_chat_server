
async function check(number) { 
  if (number % 2 == 0) { 
      return("The number is even") 
    } 
    else { 
      return("The number is odd") 
    } 
	
  /*
  // Promise handling 
	//const res = await listeners.check(8);
	//console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ res = " + res) 
	
	//the following is the same as below
	listeners.check(8).then((msg_) => { 
	  console.log("@@@ msg_ = " + msg_) 
	}).catch((msg_) => { 
	  console.log("@@@ msg_ error = " + msg_) 
	});
	*/
  /*	
  return new Promise((Resolve, reject) => { 
    if (number % 2 == 0) { 
      Resolve("The number is even") 
    } 
    else { 
      reject("The number is odd") 
    } 
  });
  */  
} 
  

async function testSocket(pool, msg){
		console.log("************************* test_socket ** : " + msg);
		//return "Hello the world : '" + msg +"'"; 
		
		//get users number
		var query  = "SELECT count(*) FROM users "; 			
		
		//console.log("** test_socket ** query : " + query);
			
		return await executeQuery(pool, query, []);
		
}; //end function
		
async function disconnect(pool, name){
	console.log("** disconnect ***** pool = " + pool + " name = " + name);
	
	//update user status in db
		var query = "UPDATE users SET " 						+ 
		" status = cast(0  AS bit(3))," 						+
		" disconnected = '" + Date.now() + "'"					+
		//" WHERE nickname = '" + name + "'"                    +
		" WHERE nickname = $1"                                  +
		" RETURNING disconnected";
		
		console.log("** disconnect ***** query = " + query);
		
		const  disconnected = await executeQuery(pool, query, [name]); //it will return 'nickname' so we can compare old and updated value
		//console.log("** disconnect ***** disconnected = " + disconnected.rows[0].disconnected);
		return disconnected;
}

async function join(pool,
					userNickname,
					imageProfile,
					status,
					connectionTime, 
					lastConnectionTime, 
					disconnectionTime, 
					notSeenMessages, 
					blacklistAuthor, 
					connectedWith){
		
		console.log('??????????????????????? join : pool = ' + pool + 
						' userNickname       = %s,' +
						' imageProfile       = %s,' +
						' status             = %s,' +
						' connectionTime     = %s,' + 
						' lastConnectionTime = %s,' + 
						' disconnectionTime  = %s,' + 
						' notSeenMessages    = %s,' + 
						' blacklistAuthor    = %s,' + 
						' connectedWith      = %s ',
						userNickname,
						imageProfile.length,
						status,
						connectionTime, 
						lastConnectionTime, 
						disconnectionTime, 
						notSeenMessages, 
						blacklistAuthor, 
						connectedWith
					);
		
		
						
		var query = "INSERT INTO users (nickname, 			" 	+
										" imageprofile, 	" 	+
										" status, 			" 	+
										" connected, 		" 	+
										" lastconnected,	" 	+
										" disconnected, 	" 	+
										" notseenmessages,	" 	+
										" blacklistauthor,	" 	+ 
										" connectedwith)	"	+
 		" VALUES($1, $2, cast(" + status + " AS bit(3)), $3, $4, $5, $6, $7, $8)" 	+
		" ON CONFLICT (nickname) DO " 												+
		" UPDATE SET  status = EXCLUDED.status, "									+
					  "	imageprofile    = EXCLUDED.imageprofile, " 					+ 
					  "	connected       = EXCLUDED.connected, " 					+ 
					  " lastconnected   = EXCLUDED.lastconnected, " 				+
					  " disconnected    = EXCLUDED.disconnected, " 					+
					  " notseenmessages = EXCLUDED.notseenmessages, " 				+
					  " blacklistauthor = EXCLUDED.blacklistauthor,"  				+
					  " connectedwith   = EXCLUDED.connectedwith" 			        + 	//this column is updated again in 'messagedetection'
					  " RETURNING nickname, connected, (SELECT connected FROM users WHERE nickname = '" + userNickname + "') AS old_connected";	//donne une erreur								
					  
		/*
		update orders
			set type = 'delivery'
		where id = 3767
		returning id, type, (
			select type from orders where id = 3767
		) as old_type;
		*/
		
		//console.log('??????????????????????? join : query = ' + query);
		
		return await executeQuery(pool, query, [userNickname, 
												imageProfile, 
												connectionTime, 
												lastConnectionTime, 
												disconnectionTime, 
												notSeenMessages, 
												blacklistAuthor, 
												connectedWith,
											    ]); //it will return 'nickname, connected' so we can compare old and updated values
	
}//end join

async function save_image_profile_uri(pool, nickname, uri, time){
			
		// ne marche pas. le result du promise is null
		var query0 = "INSERT INTO imageprofileuri (nickname, uri, date)" 	+
		" VALUES($1, $2, $3)"										    	+    					
		" ON CONFLICT (uri) DO"												+ 
		
		" UPDATE SET  date = EXCLUDED.date, ";								
					  //"	nickname = EXCLUDED.nickname"; 					 
		
		//in 2 steps :
		//if the image profile uri is not found : do insert
		//else do update the date field only
		
		var query1 = "SELECT nickname, uri, date FROM imageprofileuri WHERE nickname = $1 AND uri = $2";
		var query2 = "INSERT INTO imageprofileuri (nickname, uri, date) VALUES ($1, $2, $3)";
		var query3 = "UPDATE imageprofileuri SET date = $3 WHERE nickname = $1 AND uri = $2";
		
		var status = "fail";
		
		console.log("****save_image_profile_uri :  Select ******" + "\n");
		
		let imageProfileSelect  = await executeQuery(pool, query1, [nickname, uri]);
		
		//console.log("promise 'save_image_profile_uri : select : '  results = " + JSON.stringify(imageProfileSelect) + " imageProfileSelect.rowCount = " + imageProfileSelect.rowCount +
		//  "\n" + "-------------------------------------------------------------------------------" + "\n");
			
			if((imageProfileSelect.rowCount != 0) && (imageProfileSelect.rowCount != 1))return callback(Error("unexpected value in 'save_image_profile_uri : select'"));
			
			if(imageProfileSelect.rowCount == 1){
				//do Update
				console.log("**** Update ******" + "\n");
				let imageProfileUpdated  = await executeQuery(connection, query3, [nickname, uri, time]);
				//console.log("promise 'save_image_profile_uri : update : '  results = " + JSON.stringify(imageProfileUpdated) + " imageProfileUpdated.rowCount = " + imageProfileUpdated.rowCount +
				//"\n" + "-------------------------------------------------------------------------------" + "\n");
				
				if(imageProfileUpdated.rowCount != 1)return callback(Error("unexpected value in 'save_image_profile_uri : update'"));
				
				if(imageProfileUpdated.rowCount == 1)status = "success";
			}
			else{
				//do insert
				console.log("**** insert ******" + "\n");
				//console.log("query2 = "+ query2 + "\n");
				//console.log("query2 : values : nickname = " + nickname + "\n");
				//console.log("query2 : values : uri      = " + uri + "\n");
				//console.log("query2 : values : time     = " + time + "\n");
				
				let imageProfileInserted  = await executeQuery(connection, query2, [nickname, uri, time]);
				//console.log("promise 'save_image_profile_uri : insert : '  results = " + JSON.stringify(imageProfileInserted) + " imageProfileInserted.rowCoun = " + imageProfileInserted.rowCount +
				//"\n" + "-------------------------------------------------------------------------------" + "\n");
				
				if(imageProfileInserted.rowCount != 1)return callback(Error("unexpected value in 'save_image_profile_uri : insert'"));
				
				if(imageProfileInserted.rowCount == 1)status = "success";
			}
			
			console.log("save_image_profile_uri : status = " + status);
			
			return status;;
}
	
async function get_all_users(pool){
	var query = "SELECT nickname," 									+
				"encode(imageprofile, 'escape') as imageprofile,"	+
				"status," 											+
				"connected," 										+
				"lastconnected,"									+ 
				"disconnected," 									+
				"blacklistauthor," 									+
				"notseenmessages," 									+
				"connectedwith " 									+
	"FROM users " 													+
	"ORDER BY nickname ASC ";										
	//"ORDER BY nickname ASC LIMIT $1";	//ne marche pas
	//"ORDER BY nickname DESC ";		//ne marche pas
		
	console.log("get_all_users query = " + query);
	return users = await executeQuery(pool, query, []);
}

/////////////////////////////////////////////////////////////////////////////////////////////
//with 'release' function.
async function executeQuery_(connection, query, parameters, release) {
	//console.log('connection = ' + connection);
	//console.log('query = ' + query);
	//console.log('parameters = ' + parameters);
	return new Promise((resolve, reject) => {
		connection.query(query, parameters, (error, response) => {
			if(error){
				console.log('error in "executeQuery_" = ' + error.message);
				return reject(error);
			}
			release();
			//connection.release()	//the next time, there is exception : "the pool had been released"
			//connection.destroy();	//exception = it is not a function
			return resolve(response);
		})
	});
};	
        
	//without 'release' function.
	async function executeQuery(connection, query, parameters) {
		//console.log('connection = ' + connection);
		//console.log('query = ' + query);
		//console.log('parameters = ' + parameters);
		return new Promise((resolve, reject) => {
			connection.query(query, parameters, (error, response) => {
				if(error){
					console.log('error in "executeQuery" = ' + error.message);
					return reject(error);
				}
				//release();
				//connection.release()	//the next time, there is exception : "the pool had been released"
				//connection.destroy();	//exception = it is not a function
				return resolve(response);
			})
		});
	}		
    		

module.exports = { 
	check: check,
	testSocket:testSocket,
	disconnect:disconnect,
    join:join,
	save_image_profile_uri:save_image_profile_uri,
	get_all_users:get_all_users
}; 