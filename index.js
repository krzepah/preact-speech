import { Component } from 'preact';
import { forEachObjIndexed } from 'ramda';

class SpeechBase extends Component {
	state = {
		active: false
	}

	onVoice = (text) => {
		try {
			forEachObjIndexed(
				(value, key) => {
					if (text.match(key) != null)
						this.props.resolver[key](text, this.props);
				},
				this.props.resolver
			);
		}
		catch (error) {
			console.log(error, text);
		}
	}

	onSpeechEnd = () => console.log(
		'You were quiet for a while so voice recognition turned itself off.'
	);

	onEnd = () => {
		if (this.state.active) {
			console.log('restarting recognition');
			this.recognition.start();
		}
	}

	onError = (event) => {
		if (event.error == 'no-speech')
			console.log('no speech detected');
	}

	onResult = (event) => {
		let current = event.resultIndex;

		let transcript = event.results[current][0].transcript;

		let mobileRepeatBug = (current == 1 && transcript == event.results[0][0].transcript);

		if (!mobileRepeatBug) {
			console.log(transcript);
			this.onVoice(transcript);
		}
	}

	trigger = () => {
		this.setState({ active: !this.state.active });
		if (this.state.active)
			this.recognition.start();
		else
			this.recognition.stop();
	}

	componentDidMount = () => {
		if (typeof window !== 'undefined') {
			const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
			this.recognition = new SpeechRecognition();
			this.recognition.continuous = true;

			this.recognition.onspeechend = this.onSpeechEnd;
			this.recognition.onend = this.onEnd;
			this.recognition.onerror = this.onError;
			this.recognition.onresult = this.onResult;

			if (this.state.active)
				this.recognition.start();
		}
	}

	render = ({ style }) => (
		<a style={style} onClick={this.trigger}>
			Speech recognition
			{ this.state.active ? ' active' : ' disabled' }
		</a>
	)
}

export default SpeechBase;
