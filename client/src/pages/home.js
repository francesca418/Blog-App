import React, { useEffect} from 'react'

import Groups from '../components/home/Groups'
import RightSideBar from '../components/home/RightSideBar'

import { useSelector } from 'react-redux'
import LoadIcon from '../images/loading.gif'
import GroupModal from '../components/GroupModal'

let scroll = 0;

const Home = () => {
    const { homeGroups } = useSelector(state => state)

    window.addEventListener('scroll', () => {
        if(window.location.pathname === '/'){
            scroll = window.pageYOffset
            return scroll;
        }
    })

    useEffect(() => {
        setTimeout(() => {
            window.scrollTo({top: scroll, behavior: 'smooth'})
        }, 100)
    },[])

    return (
        <div className="home row mx-0">
            <div className="col-md-8">
                <GroupModal />

                <div className="groupCards">

                    {
                        homeGroups.loading 
                        ? <img src={LoadIcon} alt="loading" className="d-block mx-auto" />
                        : 
                        (homeGroups.result === 0 && homeGroups.groups.length === 0)
                         ? <h2 className="text-center">No Groups</h2>
                         : <Groups />
                    }
                    
                </div>                
            </div>
            
            <div className="col-md-4">
                <RightSideBar />
            </div>
        </div>
    )
}


export default Home
