import React, { Component } from 'react';
import Header from './Header'
import MessageBody from '../messages/Body'
import MessageInput from '../messages/MessageInput'
import OnTypeSection from '../messages/OnType'
import Sidebar from '../sidebar/sidebar'


export default class ChatContainer extends Component {
	constructor(props) {
	  super(props);	
	
	  this.state = {
	  	chats:[
			{	'id':1,
				'name':'CommunityChat',
				'messages':[],
				'typingUsers':[]
			}
		  ],
		showSidebar:false,
		currentChat:1,
		listChat:[{	'id':1,
			'userid':1,
		}],
		sidebarusers:[]

	  };

	  
	}

	componentDidMount() {
		console.log('11')
		const { socket } = this.props
		socket.emit('GROUP_CHAT', this.initChat)

		fetch('http://localhost:3001/users')
		.then(res => res.json())
		.then(
		  (result) => {
			// console.log('11')
			// console.log('why it is not working ',result)
			let communityUser={name:'Comunity Chat',id:1}
			result.users.push(communityUser)
			result.users.reverse()
			// console.log('after ajax users ',result.users)
			this.setState({
				sidebarusers: result.users
			});
		  },
		  (error) => {
			this.setState({
			  error
			});
		  }
		)
	}


	
	initChat = ()=>{
		const { socket } = this.props
		socket.on('ON_TYPE', this.updateTypingInChat)
		socket.on('MESSAGE_RECIEVED', this.addMessageToChat)
		socket.on('FILE_MESSAGE', this.addFileMessageToChat)
		socket.on('INIT_NEW_CHAT', this.addNEWChat)
		socket.on('NEW_USER_CONNECTED', this.addNEWUser)
	}

	showThisChat=(chatid)=>{
		this.setState({currentChat:chatid})
	}
	
	displaySidebar=()=>{
		console.log('@displaySidebar')
		const {showSidebar}=this.state
		this.setState({showSidebar:!showSidebar})
	}

	
	addMessageToChat = (message)=>{
		const { chats } = this.state
		
		console.log('recieved message ',message)
		console.log(chats)
		let newchats = chats.map((chat)=>{
			if(chat.id===message.currentChat){
				chat.messages.push(message)
			}
			else{
				console.log(' id not matched ',message, chat.id,message.currentChat)
			}
			return chat
		})
		console.log('--------------------------------')
		console.log(newchats)

		this.setState({chats:newchats})
	}

	addNEWUser = ({allUsersList})=>{
		// let {sidebarusers}=this.state
		console.log('allUsersList ',allUsersList)
		let communityUser={name:'Comunity Chat',id:1}
		allUsersList.push(communityUser)
		allUsersList.reverse()
		this.setState({sidebarusers:allUsersList})
	}
	addNEWChat=({id,touser,fromUser})=>{
		const { listChat ,chats} = this.state
		let {user}=this.props
		console.log('add chat data ',{id,touser,fromUser,user})
		
		// newlistChat=[]
		if(user.id===touser.id && user.id!==fromUser.id){
			listChat.push({id:id,userid:fromUser.id})
			let nchat={	
				'id':id,
				'name':fromUser.name,
				'messages':[],
				'typingUsers':[]
			}
			let alreadyExist=false
			chats.forEach((el,k)=>{
				if(el.id===id){
					console.log('chat is already exist',el)
					alreadyExist=true
					chats[k].id=id
				}
			})
			if(alreadyExist===false){
				// push this chat
				chats.push(nchat)
			}
			this.setState({listChat:listChat,currentChat:id,chats:chats})
		}
		else if(user.id===fromUser.id){
			// chat initiator so show the chat for him
			listChat.push({id:id,userid:touser.id})
			// and update the current chat id
			let nchat={	
				'id':id,
				'name':touser.name,
				'messages':[],
				'typingUsers':[]
			}
			let alreadyExist=false
			chats.forEach((el,k)=>{
				if(el.id===id){
					console.log('chat is already exist',el)
					alreadyExist=true
					chats[k].id=id
				}
			})
			if(alreadyExist===false){
				// push this chat
				chats.push(nchat)
			}
			this.setState({listChat:listChat,currentChat:id,chats:chats})

		}
		console.log('new list chat', listChat)
		
		
	}

	addFileMessageToChat=(fileData)=>{
		
		const { chats } = this.state
		
		console.log('recieved file data ',fileData)
		console.log(chats)
		let newchats = chats.map((chat)=>{
			if(chat.id===fileData.currentChat){
				// chat.messages.push(message)
				fileData.finalFileData.forEach(element => {
					chat.messages.push(element)
				});
			}
			else{
				console.log(' id not matched ',chat.id,fileData.currentChat)
			}
			return chat
		})
		console.log('--------------------------------')
		console.log(newchats)

		this.setState({chats:newchats})
	}

	
	updateTypingInChat = ({currentChat,user,isTyping}) =>{
		console.log('on type',{currentChat,user,isTyping})
			if(user !== this.props.user.name){

				const { chats } = this.state
				let newchats=chats.map((chat)=>{
					if(chat.id===currentChat){
						// console.log('kkkkkkkkk')
						if(isTyping && !chat.typingUsers.includes(user)){
							// console.log('ooooooooooo')
							chat.typingUsers.push(user)
						}else if(!isTyping && chat.typingUsers.includes(user)){
							chat.typingUsers = chat.typingUsers.filter(u => u !== user)
						}
						else{
							// console.log('yyyyyyyyyyyyyyyyy ',isTyping,chat.typingUsers.includes(user))
						}
					}
					else{
						console.log('chat id not matched with on type data',chat.id,currentChat )
					}
					return chat
				})
				console.log(newchats)
				this.setState({chats:newchats})
				

			}
	}

	
	sendMessage = (message)=>{
		const { socket } = this.props
		let {currentChat}=this.state
		console.log('send message data ',{message,currentChat})
		socket.emit("MESSAGE", {message,currentChat} )
	}


	sendUploadmsg= (fileData)=>{
		const {socket} =this.props
		console.log('sendUploadmsg')
		let {currentChat}=this.state
		socket.emit('FILE_MESSAGE',{fileData,currentChat})
	}
	

	
	sendTyping = (isTyping)=>{
		const { socket } = this.props
		console.log('istypeing data =',{isTyping})
		let {currentChat}=this.state
		socket.emit("ON_TYPE", {isTyping,currentChat})
	}

	sendInitNewChat = (cuser)=>{
		const { socket } = this.props
		console.log('sendInitNewChat data =',{cuser})
		socket.emit("INIT_NEW_CHAT", cuser)
	}

	showThisChat=(chid)=>{
		let {currentChat} = this.state
		if(currentChat!==chid){
			currentChat=chid
		}
		this.setState({currentChat:currentChat})
	}

	
	render() {
		const { user, logout } = this.props
		const { chats,showSidebar,currentChat,listChat,sidebarusers } = this.state
		// console.log(chat.messages)
		return (
			<div className="container">
				<div className="CommunityChat">
					{
						chats.map((chat)=>{
							return (
								(chat.id===currentChat)?
								<div className="Comunitycht" id={currentChat} key={currentChat}>
									<Header name={chat.name} displaySidebar={this.displaySidebar} showSidebar={showSidebar} logout={logout} user={user} />

									<div className='ctbx'>
										<div className='chtbox'>
											<MessageBody 
												messages={chat.messages}
												user={user}
												/>
											<OnTypeSection typingUsers={chat.typingUsers} />
											<MessageInput 
												sendMessage={
													(message)=>{
														this.sendMessage(message)
													}
												}
												sendUploadmsg={
													(fileData)=>{
														// console.log('lll')
														this.sendUploadmsg(fileData)
													}
												}
												sendTyping={
													(isTyping)=>{
														this.sendTyping(isTyping)
													}
												}
												/>
										</div>

										<div className='userListCont'>
											<Sidebar 
												newclass='userListContainer1'
												sendInitNewChat={
													(cuser)=>{
														this.sendInitNewChat(cuser)
													}
												}
												showChat={
													(chid)=>{
														this.showThisChat(chid)
													}
												}
												listChat={listChat}
												iam={user}
												sidebarusr={sidebarusers}
												currentChat={currentChat}
											/> 
										</div>
										{
										(showSidebar)?
											<div className='userListCont2'>
											<Sidebar 
												newclass='userListContainer2'
												sendInitNewChat={
													(cuser)=>{
														this.sendInitNewChat(cuser)
													}
												}
												showChat={
													(chid)=>{
														this.showThisChat(chid)
													}
												}
												currentChat={currentChat}
												listChat={listChat}
												iam={user}
												sidebarusr={sidebarusers}
											/> 
											</div>
										:''}
									</div>
								</div>
								:''
								)
						})
						
					}
				</div>

			</div>
		);
	}
}
