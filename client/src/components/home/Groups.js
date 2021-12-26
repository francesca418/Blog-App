import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import GroupCard from '../GroupCard'

const Groups = () => {
    const { homeGroups, auth, theme } = useSelector(state => state)
    const [search, setSearch] = useState('')
    const [sort, setSort] = useState('newest')

    function getSearchGroups(search) {
        let groups = []
        for (const group of homeGroups.groups) {
            // tag search
            if (search === '') {
                groups.push(group)
            } else if (group.tags.filter((tag) => tag.startsWith(search)).length > 0) {
                groups.push(group)
            }
        }
        return groups;
    }

    function sortGroups(sort) {
        let groups = []
        for (const group of homeGroups.groups) {
            // tag search
            if (search === '') {
                groups.push(group)
            } 
        }
        // sort by ...
        if (sort === 'newest') {
            groups.sort(function (g1, g2) {
                if (g1.updatedAt > g2.updatedAt) {
                    return -1;
                } else if (g1.updatedAt < g2.updatedAt) {
                    return 1;
                } else {
                    return 0;
                }
            })
        } else if (sort === 'num-posts') {
            groups.sort(function (g1, g2) {
                if (g1.posts.length > g2.posts.length) {
                    return -1;
                } else if (g1.posts.length < g2.posts.length) {
                    return 1;
                } else {
                    return 0;
                }
            })
        } else if (sort === 'num-users') {
            groups.sort(function (g1, g2) {
                if (g1.users.length > g2.users.length) {
                    return -1;
                } else if (g1.users.length < g2.users.length) {
                    return 1;
                } else {
                    return 0;
                }
            })
        }
        return groups;
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        sortGroups(sort)
    }

    return (
        <div className="groups">
            <div>
                <br />
                <h3>Your Groups</h3>
                {
                homeGroups.groups.filter(group => (group.users.includes(auth.user._id))).map((group, i) => (
                    <GroupCard key={i} group={group} theme={theme} />
                ))
            }
            </div>
            <div>

            <br />
            <h3>Browse Public Groups to Join</h3> <br />

            <form onSubmit={handleSubmit}>

                <div className="form-group">
                    <label htmlFor="name">Filter Public Groups by Tag</label>
                    <input type="text" name="search" value={search}
                    className="form-control" onChange={e => setSearch(e.target.value)} />
                </div>

                <div className="input-group-prepend px-0 mb-4">
                <label htmlFor="sortGroups">Sort Public Groups by...</label>
                    <select name="sortGroups" id="sortGroups" value={sort}
                    className="custom-select text-capitalize"
                    onChange={e => setSort(e.target.value)}>
                        <option value="newest">Newest Post</option>
                        <option value="num-posts">Number of Posts</option>
                        <option value="num-users">Number of Users</option>
                    </select>
                </div>

            </form>
            { search.length > 0 ?
                (getSearchGroups(search).filter(group => (group.privacy && !group.users.includes(auth.user._id))).map((group, i) => (
                    <GroupCard key={i} group={group} theme={theme} />
                ))) : (
                    sortGroups(sort).filter(group => (group.privacy && !group.users.includes(auth.user._id))).map((group, i) => (
                        <GroupCard key={i} group={group} theme={theme} />
                )))
            }
            </div>
        </div>
    )
}

export default Groups
