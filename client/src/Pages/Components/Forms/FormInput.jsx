import "../Styles/FormInput.css";
import PropTypes from 'prop-types';

function FormInput({ fieldName, fieldType, setField, isPasswordValid, pattern }) {

    FormInput.propTypes = {
        fieldName: PropTypes.string,
        fieldType: PropTypes.string,
        setField: PropTypes.func,
        isPasswordValid: PropTypes.element,
        pattern: PropTypes.string,
    }

    return (
        <label>
            <input required pattern={pattern} placeholder="" type={fieldType} className="input" onChange={(e) => setField(e.target.value)} />
            <span className="field-label">{fieldName}{fieldType == "password" ? isPasswordValid : <></>} </span>
        </label>
    );
}

export default FormInput;