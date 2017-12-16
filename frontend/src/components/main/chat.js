import React from 'react'
import MessageRow from '../row/messageRow'
import { Picker } from 'emoji-mart'

export default class Chat extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			inputValue: "",
			popupVisible: false
		}
		this.handleClick = this.handleClick.bind(this);
	    this.handleOutsideClick = this.handleOutsideClick.bind(this);

	  }

	  handleClick() {
	    if (!this.state.popupVisible) {
	      // attach/remove event handler
	      document.addEventListener('click', this.handleOutsideClick, false);
	    } else {
	      document.removeEventListener('click', this.handleOutsideClick, false);
	    }

	    this.setState(prevState => ({
	       popupVisible: !prevState.popupVisible,
	    }));
	  }

	  handleOutsideClick(e) {
	    // ignore clicks on the component itself
	    if (this.node.contains(e.target)) {
	      return;
	    }

	    this.handleClick();
	  }

	send = () => {
		this.props.onSend(this.state.inputValue)
		this.setState({
			inputValue: ""
		})
	}

	update = (evt) => {
		this.setState({
			inputValue:evt.target.value
		})
	}

	handleEnterPress = (target) => {
		if(target.charCode === 13) //13 = la touche entrée
			this.send()
	}

	addEmoji = (emoji, event) => {
    	var inputSmiley = document.getElementById("inputSmiley");
    	inputSmiley.value += emoji.native;
		this.setState({
			inputValue:inputSmiley.value
		})
		inputSmiley.focus();
	}

	render() {

		return (
			<div id="zone_chat" className="col-8">
				<div className="App">
					<div id="text">
						<div id="msg">
							<ul>
								{this.props.messages.map((post, index) => <li key={index}><MessageRow message={post}/></li>)}
							</ul>
						</div>
					</div>
				</div>

				<div className="input-group">
					<input type="text"
							className="form-control"
							placeholder="Écrire ici..."
							value={this.state.inputValue}
							onChange={this.update}
							onKeyPress={this.handleEnterPress}
							id="inputSmiley"
					/>
					<div className="popover-container" ref={node => { this.node = node; }}>
						{this.state.popupVisible && (
						  <div className="popover" >
								<Picker set='twitter'
									exclude='recent'
									style={{zIndex: '10', overflowY: 'auto', height: '300px'}}
									onClick={this.addEmoji}
									onKeyPress={this.handleEnterPress}
								/>
						  </div>
						)}
						<button onClick={this.handleClick} >
							:)
						</button>
					  </div>
					<span className="input-group-addon"
							id="basic-addon2"
							onClick={this.send}>Envoyer
					</span>
				</div>
			</div>
		)
	}
}
