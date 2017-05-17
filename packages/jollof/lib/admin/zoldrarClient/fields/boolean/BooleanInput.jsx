import React, { PropTypes } from 'react';
import Toggle from 'material-ui/Toggle';

const styles = {
	block: {
		margin: '1rem 0',
		maxWidth: 250,
	},
	label: {
		color: 'rgba(0, 0, 0, 0.298039)',
	},
	toggle: {
		marginBottom: 16,
	},
};

const BooleanInput = ({ input, label, source, record }) => (
	<div style={styles.block}>
		<Toggle
			defaultToggled={!!input.value}
			onToggle={input.onChange}
			labelStyle={styles.label}
			style={styles.toggle}
			label={label||source}
		/>
	</div>
);

BooleanInput.propTypes = {
	includesLabel: PropTypes.bool.isRequired,
	input: PropTypes.object,
	label: PropTypes.string,
	source: PropTypes.string,
	record: PropTypes.object,
};

BooleanInput.defaultProps = {
	includesLabel: true,
};

export default BooleanInput;