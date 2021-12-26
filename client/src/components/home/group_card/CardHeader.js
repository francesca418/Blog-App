import React from 'react'
import { Link } from 'react-router-dom' 
import moment from 'moment'


const CardHeader = ({group}) => {


    return (
        <div className="card_header">
            <div className="d-flex">

                <div className="card_name">
                    <h6 className="m-0">
                        <Link to={`/group/${group._id}`} className="text-dark" >
                            {group.name}
                        </Link>
                    </h6>
                    <small className="text-muted">
                        {moment(group.createdAt).fromNow()}
                    </small>
                </div>
            </div>
        </div>
    )
}

export default CardHeader
