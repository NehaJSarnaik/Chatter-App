import React, { Component } from 'react';
import Cookies from 'js-cookie';

export default class SignupForm extends Component {
	constructor(props) {
	  super(props);
	
	  this.state = {
	  	username:"",
		usernameerror:"",
		passworderror:"",
		password:""  
	  };
	}

	userLogin = ({error, user,el,errmsg})=>{
		console.log('Signup response = ',{error, user,el,errmsg})
		if(error){

			this.setError(errmsg,el)
		}else{
			this.setError("","")
			this.props.setUser(user)
			user.isck=true;
			Cookies.set('user',user)
		}
	}

	verifyAndLogin = (e)=>{
		e.preventDefault()
		const { socket } = this.props
		const { username,password } = this.state
		socket.emit('USERNAME_CHECK', { username,password }, this.userLogin)
	}

	handleChange = (e)=>{
		this.setState({username:e.target.value})
	}
	handlePassChange=(e)=>{
		this.setState({password:e.target.value})
	}

	setError = (error,el)=>{
		if(el.length>0){
			if(el==='username'){
				this.setState({usernameerror:error,passworderror:''})
			}
			else{
				this.setState({passworderror:error,usernameerror:''})
			}
		}
		else{
			this.setState({usernameerror:error,passworderror:error})
		}
		
	}

	render() {	
		const { username,password, usernameerror,passworderror } = this.state
		return (
			<div className="login">
				<form onSubmit={this.verifyAndLogin} className="login-form" id="login-form" >

					<label className='loginhead' htmlFor="username">
						<h2>SignUp</h2>
					</label>
					<label className='loginhint'>Register and start chatting </label>
					<input
						ref={(input)=>{ this.textInput = input }} 
						type="text"
						id="username"
						value={username}
						onChange={this.handleChange}
						placeholder={'username'}
						/>
					<div className="rederror">{usernameerror ? usernameerror:null}</div>
					<input
						ref={(input)=>{ this.passInput = input }} 
						type="password"
						id="password"
						value={password}
						onChange={this.handlePassChange}
						placeholder={'password'}
						/>
					<div className="rederror">{passworderror ? passworderror:null}</div>
					<button className="login-button"
					onClick={this.verifyAndLogin}
					>Start Chat</button>
                    <span className="loginlink"
                    onClick={()=>{this.props.showLoginForm()}}
                    > Go To Login </span>

				</form>
			</div>
		);
	}
}
