import React from 'react'
import { Link } from 'react-router-dom'

const GroupCardSuggest = ({ group, border }) => {

    return (
        <div className={`d-flex p-2 align-items-center justify-content-between w-100 ${border}`}>
            <div>
                <Link to={`/group/${group._id}`}
                className="d-flex align-items-center">
                    
                    <div className="ml-1" style={{transform: 'translateY(-2px)'}}>
                        <span className="d-block">{group.name}</span>
                    </div>
                </Link>
            </div>
            
        </div>
    )
}

export default GroupCardSuggest