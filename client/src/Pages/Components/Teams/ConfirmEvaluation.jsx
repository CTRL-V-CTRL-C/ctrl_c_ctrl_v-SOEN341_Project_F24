import PropTypes from 'prop-types';
import "../Styles/MyTeam.css";

function ConfirmEvaluation({ evaluations, onConfirm, onCancel }) {

    ConfirmEvaluation.propTypes = {
        evaluations: PropTypes.array.isRequired,
        onConfirm: PropTypes.func.isRequired,
        onCancel: PropTypes.func.isRequired
    };

    return (
        <div className="confirmation-page">
            <h3>Are you sure you want to submit the following evaluation ?</h3>
            <hr />
            <div className="confirmation-details">
                {evaluations.map((evaluation, i) => (
                    <div key={i} className="confirmation-criteria">
                        <p><strong>Criteria:</strong> {evaluation.criteria}</p>
                        <p><strong>Rating:</strong> {evaluation.rating}</p>
                        <p><strong>Comment:</strong> {evaluation.comment}</p>
                        <hr />
                    </div>
                ))}
            </div>
            <div className="confirmation-actions">
                <button onClick={onConfirm} className="button confirm-button">Confirm</button>
                <button onClick={onCancel} className="button cancel-button">Cancel</button>
            </div>
        </div>
    );
}

export default ConfirmEvaluation;
