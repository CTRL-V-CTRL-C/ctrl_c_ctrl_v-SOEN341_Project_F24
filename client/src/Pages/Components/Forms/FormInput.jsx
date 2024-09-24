import PropTypes from 'prop-types';

function FormInput({ fieldName, fieldType }) {

    FormInput.propTypes = {
        fieldName: PropTypes.string,
        fieldType: PropTypes.string,
    }

    return (
        <label>
            <input required="" placeholder="" type={fieldType} className="input" />
            <span>{fieldName}</span>
        </label>
    );
}

export default FormInput;