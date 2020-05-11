import React, { Component } from 'react';
export default class SidebarContainer extends Component {
	constructor(props) {
	  super(props);	
	
	  this.state = {
          error:null,
          userChats:[]
	  };
  }

  render() {
    const {listChat,iam,sidebarusr,currentChat}=this.props
    const { users,error } = this.state
    
    
    console.log('listchat at sidebar', listChat)
		return (
			<div className={this.props.newClass}>
				<div className="userlist">
                    <h4 className='userlisthead'>Chats & Users </h4>
                    {
                        (error) ?
                            <div>Error: {error.message}</div>
                        :  
                        sidebarusr.map((cuser)=>{
                              // console.log(cuser)
                              
                              if(cuser.name && iam.id!==cuser.id){
                                let inListUser=false
                                listChat.forEach(el => {
                                  if(el.userid===cuser.id){
                                    inListUser=el.id
                                  }
                                });
                                let activeClass='';
                                if(inListUser===currentChat){
                                  activeClass='chtactive'
                                }

                                if(inListUser===false){
                                  return (
                                      <div className="userlst" key={cuser.name} onClick={()=>{this.props.sendInitNewChat(cuser)}}>
                                          <div className="profilepic">
                                            <label>{cuser.name.charAt(0)}</label>
                                          </div>
                                          <div className='usrdet'>
                                              <span>{cuser.name}</span>
                                          </div>
                                      </div>
                                  )
                                }
                                else{
                                  
                                  return (
                                      <div className={"userlst onceActiveChat "+ `${activeClass}`} key={cuser.name} onClick={()=>{this.props.showChat(inListUser)}}>
                                          <div className="profilepic">
                                            <label>{cuser.name.charAt(0)}</label>
                                          </div>
                                          <div className='usrdet'>
                                              <span>{cuser.name}</span>
                                          </div>
                                      </div>
                                  )
                                }
                                  
                              }
                              else{
                                return null
                              }
                          })
                    }
				</div>
			</div>
		);
	}
}