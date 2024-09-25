import "../Styles/FormInput.css";
import PropTypes from 'prop-types';

function FormInput({ fieldName, fieldType, setField, isPasswordValid }) {

    FormInput.propTypes = {
        fieldName: PropTypes.string,
        fieldType: PropTypes.string,
    }

    function formInputChanged(e) {
        setField(e.target.value)
    }

    return (
        <label>
            <input required placeholder="" type={fieldType} className="input" onChange={formInputChanged} />
            <span className="field-label">{fieldName}{fieldType == "password"? isPasswordValid : <></>} </span>
        </label>
    );
}

export default FormInput;