const io = require('./index.js').io

function createUniqueId(length=5){
	var result           = new Date().valueOf();
	var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var charactersLength = characters.length;
	for ( var i = 0; i < length; i++ ) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result
}

function createUser({name = "",token}){
	return {
		id:createUniqueId(),
		name,
		token
	}
}


function newmessage ({currentChat=1,message = "", sender = ""}){
	return 	{

			id:createUniqueId(),
			currentChat,
			time:`${new Date(Date.now()).getHours()}:${("0"+new Date(Date.now()).getMinutes()).slice(-2)}`,
			message,
			sender,
			type:'message'	
		}

}

function newFilemessage (type="",file="", sender = ""){
	return 	{
			id:createUniqueId(),
			time:`${new Date(Date.now()).getHours()}:${("0"+new Date(Date.now()).getMinutes()).slice(-2)}`,
			file:file,
			sender:sender,
			type:type	
		}

}

function createCommunityChat (){
	return {
		id:createUniqueId(),
		name :"Community",
		messages:[],
		users:[],
		typingUsers:[]
	}
}

function sendUserIsTyping(user){
	return (isTyping,currentChat)=>{
		console.log('sending ontype data =',{currentChat,user, isTyping})
		io.emit('ON_TYPE', {currentChat,user, isTyping})
	}
}


function sendMessage(sender){
	console.log('sending message')
	return (message,currentChat)=>{
		io.emit('MESSAGE_RECIEVED', newmessage({currentChat,message, sender}))
	}
}

function sendFileMessage(sender){
	console.log('sending File message')
	// fileData=fileData.map((el)=>{return m={...el,...{'id':createUniqueId}} })
	
	return (fileData,currentChat)=>{
		finalFileData=[]
		console.log('here filedata ',fileData)
		fileData.data.forEach(element => {
			console.log(element.type,element.file, sender)
			newFilemsg=newFilemessage(element.type,element.file, sender)
			finalFileData.push(newFilemsg)
		});
		console.log('emiting file ',{currentChat:currentChat,finalFileData:finalFileData})

		io.emit('FILE_MESSAGE', {currentChat:currentChat,finalFileData:finalFileData});
	}
}

function sendInitChat(senderid,sendername){
	return (touser)=>{
		finalData={
			id:createUniqueId(),
			touser:touser,
			fromUser:{id:senderid,name:sendername}
		}
		console.log('emiting finaldata ',finalData)
		io.emit('INIT_NEW_CHAT', finalData);
	}
}

function newUser(userList,user,status=0){
	console.log('new user ',user)
	if(status===1){
		user.status=1;
	}
	let newList = Object.assign({}, userList)
	newList[user.name] = user
	return newList
}

function addUser(userList,user){
	user.status=1;
	console.log('@adduser userList',userList,user);

	userList.push(user)
	return userList
}


function deleterUser(userList, username){
	let newList = Object.assign({}, userList)
	delete newList[username]
	return newList
}

function updateStatusUser(userList, username){
	for (let i in userList){
		console.log('update status ',i,userList[i]['name']);
		if(userList[i]['name']==username){
			userList[i].status=0;
		}
	}
	return userList
}

function checkUsernamePass(userList, username,password,type){
	for (let i in userList){
		if(type===1){
			if(userList[i]['name']==username && userList[i]['password']==password){
				return 1
			}
			else if(userList[i]['name']==username){
				return 2
			}
		}
		else{
			if(userList[i]['name']==username && userList[i]['token']==password){
				return 1
			}
			else if(userList[i]['name']==username){
				return 2
			}
		}
	}
	// means we can create new user
  	return 3
}

function checkUsername(userList, username){
	for (let i in userList){
		if(userList[i]['name']==username ){
			return true;
		}
	}
  	return false
}

function getUserDetails(userList,username){
	for (let i in userList){
		if(userList[i]['name']==username ){
			return userList[i];
		}
	}
  	return false
}

let onlineUsers = { }
let communityChat = createCommunityChat()


module.exports = function(socket){
					
	console.log("Socket Id:" + socket.id);

	let sendMessageFromUser;

	let sendTypingFromUser;
	let sendFileMessageFromUser;
	let sendInitChatToUser;

	//Verify Username or signup user
	socket.on('USERNAME_CHECK', (data, callback)=>{
		let {username,password}=data
		if(username.length>0 ){
			if(password.length>0){
				userpasscheck=checkUsernamePass(allUsersData, username,password,1)
				if(userpasscheck===3){
					let utoken=createUniqueId(30)
					let userData={'name':username,'password':password,'token':utoken}
					allUsersData.push(userData)
					let thisUser=createUser({name:username,token:utoken})
					callback({ error:false, user:thisUser,errmsg:false})
					
				}else{
					callback({ error:true, user:null,el:'username',errmsg:'This username is already taken.' })
				}
			}
			else{
				callback({ error:true, user:null,el:'password',errmsg:'Please Enter Password'})
			}
		}
		else{
			callback({ error:true, user:null,el:'username',errmsg:'Please Enter Username'})
		}
	})

	socket.on('USER_LOGIN', (data, callback)=>{
		let {username,password}=data
		if(username.length>0 ){
			if(password.length>0){
				userpasscheck=checkUsernamePass(allUsersData, username,password,1)
				if(userpasscheck===1){
					// login user
					guser=getUserDetails(allUsersList,username);
					if(guser!==false){
						callback({ error:false, user:guser,errmsg:false})
					}
					else{
						callback({ error:true, user:null,el:'password',errmsg:'Please Enter Currect Username or password.' })
					}
					
				}
				else{
					callback({ error:true, user:null,el:'password',errmsg:'Please Enter Currect Username or Password' })
				}
			}
			else{
				callback({ error:true, user:null,el:'password',errmsg:'Please Enter Password'})
			}
		}
		else{
			callback({ error:true, user:null,el:'username',errmsg:'Please Enter Username'})
		}
	})

	socket.on('VERIFY_COOKIES',(user,cb)=>{
		let {ckuser}=user;
		if(ckuser.name.length>0){
			checkUserPass=checkUsernamePass(allUsersList, ckuser.name,ckuser.token,2)
			if(checkUserPass===1){
				cb(true)
			}else{
				cb(false)
			}
		}
		else{
			cb(false)
		}

	})



	//User Connects with username
	socket.on('NEW_USER_CONNECTED', (user)=>{

		sendMessageFromUser = sendMessage(user.name)
		sendTypingFromUser = sendUserIsTyping(user.name)
		sendFileMessageFromUser = sendFileMessage(user.name)
		sendInitChatToUser = sendInitChat(user.id,user.name)
		socket.user = user
		if(!user.isck && !checkUsername(allUsersList, user.name)){
			
			onlineUsers = newUser(onlineUsers, user)
			allUsersList = addUser(allUsersList, user)

			console.log('list of all users ',allUsersList)
			
			io.emit('NEW_USER_CONNECTED', {allUsersList:allUsersList})
		}
		
		console.log('online users',onlineUsers);

	})
	
	//User disconnects
	socket.on('disconnect', ()=>{
		if("user" in socket){
			onlineUsers = deleterUser(onlineUsers, socket.user.name)
			allUsersList= updateStatusUser(allUsersList, socket.user.name)

			io.emit('USER_DISCONNECTED', onlineUsers)
			console.log("Disconnect", onlineUsers);
			console.log("Disconnect all users ", allUsersList);
		}
	})


	//User logsout
	socket.on('USER_LOGOUT', ()=>{
		onlineUsers = deleterUser(onlineUsers, socket.user.name)
		io.emit('USER_DISCONNECTED', onlineUsers)
		console.log("Disconnect", onlineUsers);

	})

	//Get Community Chat
	socket.on('GROUP_CHAT', (callback)=>{
		console.log('kk');
		callback(communityChat)
	})

	socket.on('MESSAGE', ({message,currentChat})=>{
		console.log(message,currentChat)
		sendMessageFromUser(message,currentChat)
	})

	// socket on type event
	socket.on('ON_TYPE', ({isTyping,currentChat})=>{
		sendTypingFromUser(isTyping,currentChat)
	})

	socket.on('FILE_MESSAGE',({fileData,currentChat})=>{
		console.log('file message recieved',fileData)
		sendFileMessageFromUser(fileData,currentChat)
	})

	socket.on('INIT_NEW_CHAT',(touser)=>{
		console.log('on INIT_NEW_CHAT ',touser)
		sendInitChatToUser(touser)
	})

}

