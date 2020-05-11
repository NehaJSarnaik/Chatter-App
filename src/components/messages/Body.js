import React, { Component } from 'react';
const SITE_URL = "http://localhost:3001"
export default class MessageBody extends Component {
	constructor(props) {
	  super(props);
		
		this.scrollDown = this.scrollDown.bind(this)
	}

	scrollDown(){
		const { container } = this.refs
		container.scrollTop = container.scrollHeight
	}

	componentDidMount() {
		this.scrollDown()
	}

	componentDidUpdate(prevProps, prevState) {
		this.scrollDown()
	}
	
	render() {
		const { messages, user } = this.props
		
		return (
			// <div className='mwrapper'>
			<div ref='container'
				className="msg-container">
				<div className="msg">
					{
						messages.map((mes)=>{
							// console.log('rendering message = ',mes,mes.sender,user.name)
							return (
								<div
									key={mes.id}
									className={`message-container ${mes.sender === user.name && 'right'}`}
								>
									
									<div className="data">
										{
											mes.type==='message'?<div className="message">{mes.message}</div>:
											mes.type==='image'?<div className="image"><img src={SITE_URL+'/uploads/'+mes.file}/></div>: mes.type==='video'?
											<div className="video"><video width="320" height="240" controls><source src={SITE_URL+'/uploads/'+mes.file} type="video/mp4"/>Your browser does not support the videos.</video></div>:''
										}
										{/* <div className="message">{mes.message}</div> */}
										<div className="info">
											<div className="name">
											{mes.sender}
											</div>
											<div className="time">
												{mes.time}
											</div>
										</div>
										
									</div>
								</div>

								)
						})
					}
				</div>
				


			{/* </div> */}
			{/* <Sidebar /> */}
			</div>
		);
	}
}
