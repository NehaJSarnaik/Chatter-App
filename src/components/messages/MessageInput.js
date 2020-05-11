import React, { Component } from 'react';
import {MdSend} from 'react-icons/md';
import {MdAttachFile} from 'react-icons/md';
const axios = require("axios");
// import ImageUploader from 'react-images-upload';
const SITE_URL = "http://localhost:3001"
export default class MessageInput extends Component {
	
	constructor(props) {
		super(props);

		this.state = {
			message:"",
			buttonDisabled:true,
			isTyping:false,
			file: null
		};

	}
	
	handleSubmit = (e)=>{
		e.preventDefault()
		
		if(this.state.message===""){
			this.uploadFile();
		}
		else{
			this.sendMessage()
		}
		this.setState({
			message:"",
			buttonDisabled:true,
			isTyping:false,
			file: null
		})
	}

	uploadFile=()=>{
		const formData = new FormData();
		formData.append('myFile',this.state.file);
		const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
		};
		
		axios.post(SITE_URL+"/upload",formData,config)
            .then((response) => {
				console.log(response)
				if(response.data && response.data.length>0){
					console.log('lll')
					this.props.sendUploadmsg(response);
				}
				
            }).catch((error) => {
				alert('Error : '+error)
        });
	}

	sendMessage = ()=>{
		this.props.sendMessage(this.state.message)
		this.stopCheckingTyping()
	}

	componentWillUnmount() {
	  this.stopCheckingTyping()
	}

	sendTyping = ()=>{
		this.lastUpdateTime = Date.now()
		if(!this.state.isTyping){
			this.setState({isTyping:true})
			this.props.sendTyping(true)
			this.startCheckingTyping()
		}
	}

	
	startCheckingTyping = ()=>{
		console.log("Typing");
		this.typingInterval = setInterval(()=>{
			if((Date.now() - this.lastUpdateTime) > 600){
				this.setState({isTyping:false})
				this.stopCheckingTyping()
			}
		}, 600)
	}
	
	
	stopCheckingTyping = ()=>{
		console.log("Stop Typing");
		if(this.typingInterval){
			clearInterval(this.typingInterval)
			this.props.sendTyping(false)
		}
	}

	onfileChange=(e) =>{
		this.setState({file:e.target.files[0],message:"",buttonDisabled:false});
		
    }


	render() {
		const { message,buttonDisabled,file } = this.state
		return (
			<div className="message-input">
				<form 
					onSubmit={ this.handleSubmit }
					className="message-form">
					{/* <ImageUploader
						withIcon={true}
						buttonText='Choose images'
						onChange={this.onDrop}
						maxFileSize={5242880}
					/> */}
					<div className="uploadimgvid">
						<span><MdAttachFile/></span>
						<input  id="uploadimgvid"  type="file"
							onChange= {this.onfileChange}
						/>
					</div>
					<input 
						disabled={file!=null}
						id = "message"
						ref = {"messageinput"}
						type = "text"
						className = "form-control"
						value = { message }
						autoComplete = {'off'}
						placeholder = "Type something interesting"
						onKeyUp = { e => { e.keyCode !== 13 && this.sendTyping() } }
						onClick={event => event.target.value = null}
						onChange = {
							({target})=>{
								this.setState({message:target.value,buttonDisabled:false,file:null})
							}
						}
						/>
					<button
						disabled = {buttonDisabled}
						type = "submit"
						className = "send"

					> <MdSend/> </button>
				</form>

			</div>
		);
	}
}
