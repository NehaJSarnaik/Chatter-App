import React, { Component } from 'react';
import {FaEject} from 'react-icons/fa'
import {FaBars} from 'react-icons/fa'
import {FaTimesCircle} from 'react-icons/fa'

export default class Header extends Component{
	render(){
		const { name,user, displaySidebar, logout,showSidebar} = this.props
		return (
			
			<div className="chat-header">
				<div className="chat-info">
					<div className="chatTitle">{name}</div>
				</div>
				<div className="current-user">
					<span>Welcome </span>
					<span>{user.name}</span>
					
				</div>
				<p onClick={()=>{logout()}} title="Logout" className="logout">
						<FaEject/>	
					</p>
		<div className='showSidebar' onClick={()=>{displaySidebar()}}> {(showSidebar) ?<FaTimesCircle/> : <FaBars/>}</div>
			</div>
		);
	}
	
}
