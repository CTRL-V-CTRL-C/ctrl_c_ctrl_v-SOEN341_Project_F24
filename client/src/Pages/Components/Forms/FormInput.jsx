import "../Styles/FormInput.css";
import PropTypes from 'prop-types';

function FormInput({ fieldName, fieldType, setField, isPasswordValid }) {

    FormInput.propTypes = {
        fieldName: PropTypes.string,
        fieldType: PropTypes.string,
        setField: PropTypes.func,
        isPasswordValid: PropTypes.element
    }

    return (
        <label>
            <input required placeholder="" type={fieldType} className="input" onChange={(e) => setField(e.target.value)} />
            <span className="field-label">{fieldName}{fieldType == "password" ? isPasswordValid : <></>} </span>
        </label>
    );
}

export default FormInput;