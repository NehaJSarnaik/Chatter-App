import React, { Component } from 'react';

export default class MessageBody extends Component {
	// constructor(props) {
	//   super(props);
    // }
    render() {
        const { typingUsers } = this.props
        return (
        typingUsers.map((name)=>{
            return (
                <div key={name} className="typing-user">
                    {`${name} is typing . . .`}
                </div>
            )
        })
        );
    }
}