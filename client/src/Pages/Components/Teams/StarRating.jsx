import PropTypes from 'prop-types';
import { FaStar } from "react-icons/fa";
import { Container, Radio, Rating } from "../Styles/StarStyles";

function StarRating(props) {

    StarRating.propTypes = {
        evaluations: PropTypes.array,
        rating_criteria: PropTypes.number,
        setEvaluations: PropTypes.func
    }

    let rate = props.evaluations[props.rating_criteria].rating;

    function setRating(givenRating) {
        const updatedEvaluations = [...props.evaluations];
        updatedEvaluations[props.rating_criteria] = {
            ...updatedEvaluations[props.rating_criteria],
            rating: givenRating
        };

        props.setEvaluations(updatedEvaluations);
        console.log(props.evaluations);
    }

    return (
        <Container>
            {[...Array(5)].map((item, i) => {
                const givenRating = i + 1;
                return (
                    <label key={i}>
                        <Radio type="radio" value={givenRating} onClick={() => setRating(givenRating)} />
                        <Rating>
                            <FaStar color={givenRating < rate || givenRating === rate ? "000" : "rgb(192,192,192)"} />
                        </Rating>
                    </label>
                );
            })}
        </Container>
    );
};

export default StarRating;
