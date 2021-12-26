import React from 'react'
import CardHeader from './home/group_card/CardHeader'
import CardFooter from './home/group_card/CardFooter'

const GroupCard = ({group, theme}) => {
    return (
        <div className="card my-3"> 
            <CardHeader group={group} />
            <CardFooter group={group} />
        </div>
    )
}

export default GroupCard