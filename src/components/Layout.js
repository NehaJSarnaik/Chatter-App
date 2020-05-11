import React, { Component } from 'react';
import io from 'socket.io-client'
import LoginFormBox from './LoginFormBox'
import SignUpFormBox from './SignUpFormBox'
import ChatBox from './chats/ChatBox'
import Cookies from 'js-cookie';
// export default class Layout extends Component {
// 	render(){
// 		return (
// 		<div>Hello</div>
// 		)
// 	}
// }


const SITE_URL = "http://localhost:3001"
//const SITE_URL = "/"
export default class Layout extends Component {
	
	constructor(props) {
	  super(props);
	
	  this.state = {
	  	socket:null,
		user:null,
		showSignUp:false  
	  };
	}

	componentWillMount() {
		this.initSocket()
	}

	
	initSocket = ()=>{
		const socket = io(SITE_URL)

		socket.on('connect', ()=>{
			
			if(Cookies.getJSON('user')){
				socket.emit('VERIFY_COOKIES',{ckuser:Cookies.getJSON('user')},(resp)=>{
					if(resp){
						socket.emit('NEW_USER_CONNECTED', Cookies.getJSON('user'));
						this.setState({socket:socket,user:Cookies.getJSON('user')})
					}
					else{
						//clear cookies
						this.setState({socket})
						Cookies.remove('user');
					}
				});
				
			}
			else{
				this.setState({socket})
			}
		})
		
	}

		
	setUser = (user)=>{
		const { socket } = this.state
		socket.emit('NEW_USER_CONNECTED', user);
		this.setState({user})
	}

	
	logout = ()=>{
		const { socket } = this.state
		socket.emit('USER_LOGOUT')
		this.setState({user:null})
		Cookies.remove('user');

	}
	displaySignup=()=>{
		this.setState({showSignUp:true})
	}

	displayLogin=()=>{
		this.setState({showSignUp:false})
	}

	render() {

		const { socket, user,showSignUp } = this.state
		return (
			<div className="container">
				{	socket ?
					!user ?	
					showSignUp?
					<SignUpFormBox socket={socket} setUser={this.setUser} 
					showLoginForm={
						()=>{
							this.displayLogin()
						}
					}
					/>
					
					:
					<LoginFormBox socket={socket} setUser={this.setUser} 
					showSingUpForm={
						()=>{
							this.displaySignup()
						}
					}
					/>
					:
					<ChatBox socket={socket} user={user} logout={this.logout}/>
					:''
				}
			</div>
		);
	}
}
