import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { GLOBALTYPES } from '../redux/actions/globalTypes'
import { createGroup } from '../redux/actions/groupAction'

const GroupModal = () => {
    const { auth, socket } = useSelector(state => state)
    const dispatch = useDispatch()

    const [name, setName] = useState('')
    const [privacy, setPrivacy] = useState(true) // isPublic
    const [tags, setTags] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        dispatch(createGroup({name, privacy, tags, auth, socket}))
        setName('')
        setPrivacy(true)
        setTags([])
        dispatch({ type: GLOBALTYPES.GROUP, payload: false}) // needed?
    }

    return (
        <div className="group_modal">
            <br />
            <form onSubmit={handleSubmit}>
                <div className="group_header">
                    <h5 className="m-0">Create Group</h5>
                    <span onClick={() => dispatch({
                        type: GLOBALTYPES.GROUP, payload: false
                    })}>
                    </span>
                </div>
                <br />
                

                <div className="form-group">
                    <label htmlFor="name">Group Name</label>
                    <input type="text" name="name" value={name}
                    className="form-control" onChange={e => setName(e.target.value)} />
                </div>

                <label htmlFor="privacy">Privacy</label>
                <div className="input-group-prepend px-0 mb-4">
                    <select name="privacy" id="privacy" value={privacy}
                    className="custom-select text-capitalize"
                    onChange={e => setPrivacy(e.target.value)}>
                        <option value="true">Public</option>
                        <option value="false">Private</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="tags">Group Tags</label>
                    <input type="text" name="tags" value={tags}
                    className="form-control" onChange={e => setTags(e.target.value)} />
                    <p>Please enter group tags as comma-separated-values. For example, "sports,basketball,NBA".</p>
                </div>

                <div className="status_footer">
                    <button className="btn btn-secondary w-100" type="submit">
                        Create Group!
                    </button>
                </div>

            </form>
        </div>
    )
}

export default GroupModal