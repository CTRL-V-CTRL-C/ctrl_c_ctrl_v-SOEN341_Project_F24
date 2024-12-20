import PropTypes from 'prop-types'

import './Styles/MainContentWrapper.css'

export default function MainContentWrapper({ children }) {
    return <div id="main-content">
        {children}
    </div>
}

MainContentWrapper.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.arrayOf(PropTypes.node)
    ])
}