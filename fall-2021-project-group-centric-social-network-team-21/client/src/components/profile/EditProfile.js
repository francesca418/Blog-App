import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { checkImage } from '../../utils/imageUpload'
import { GLOBALTYPES } from '../../redux/actions/globalTypes'
import { updateProfileUser } from '../../redux/actions/profileAction'
import { logout } from '../../redux/actions/authAction'
import {hidePost} from '../../redux/actions/postAction'
// import { Link } from 'react-router-dom'

const EditProfile = ({setOnEdit}) => {
    const initState = {
        fullname: '', username: '', mobile: '', address: '', gender: '', password: '', isActive: ''
    }
    const [userData, setUserData] = useState(initState)
    const { fullname, mobile, address, gender, password, isActive } = userData

    const [avatar, setAvatar] = useState('')
    const [typePass, setTypePass] = useState(false)

    const { auth, theme, homePosts } = useSelector(state => state)
    const dispatch = useDispatch()

    useEffect(() => {
        setUserData(auth.user)
    }, [auth.user])

    const changeAvatar = (e) => {
        const file = e.target.files[0]

        const err = checkImage(file)
        if(err) return dispatch({
            type: GLOBALTYPES.ALERT, payload: {error: err}
        })

        setAvatar(file)
    }

    const handleInput = e => {
        const { name, value } = e.target
        setUserData({ ...userData, [name]:value })
    }

    const handleSubmit = e => {
        e.preventDefault()
        dispatch(updateProfileUser({userData, avatar, auth}))
        if (userData.isActive === 'false' || userData.password !== '') {
            if (userData.isActive === 'false') {
                for (const post of homePosts.posts) {
                    if (post.user._id === auth.user._id) {
                        dispatch(hidePost({id: post._id, auth}))
                    }
                }
            }
            dispatch(logout()) 
        }
    }

    return (
        <div className="edit_profile">
            <button className="btn btn-danger btn_close"
            onClick={() => setOnEdit(false)}>
                Close
            </button>
            {console.log(homePosts)}
{ !homePosts.loading && homePosts.posts.length > 0 && 
    (<form onSubmit={handleSubmit}>
    <div className="info_avatar">
        <img src={avatar ? URL.createObjectURL(avatar) : auth.user.avatar} 
        alt="avatar" style={{filter: theme ? 'invert(1)' : 'invert(0)'}} />
        <span>
            <i className="fas fa-camera" />
            <p>Change</p>
            <input type="file" name="file" id="file_up"
            accept="image/*" onChange={changeAvatar} />
        </span>
    </div>

    <div className="form-group">
        <label htmlFor="fullname">Full Name</label>
        <div className="position-relative">
            <input type="text" className="form-control" id="fullname"
            name="fullname" value={fullname} onChange={handleInput} />
            <small className="text-danger position-absolute"
            style={{top: '50%', right: '5px', transform: 'translateY(-50%)'}}>
                {fullname.length}/25
            </small>
        </div>
    </div>

    <div className="form-group">
        <label htmlFor="mobile">Phone number</label>
        <input type="text" name="mobile" value={mobile}
        className="form-control" onChange={handleInput} />
    </div>

    <div className="form-group">
        <label htmlFor="password">Password</label>
        <input type={ typePass ? "text" : "password"} name="password" value={password}
        className="form-control" onChange={handleInput} />

        <small onClick={() => setTypePass(!typePass)}>
            {typePass ? 'Hide' : 'Show'}
        </small>
    </div>

    <div className="form-group">
        <label htmlFor="address">Address</label>
        <input type="text" name="address" value={address}
        className="form-control" onChange={handleInput} />
    </div>

    <label htmlFor="gender">Gender</label>
    <div className="input-group-prepend px-0 mb-4">
        <select name="gender" id="gender" value={gender}
        className="custom-select text-capitalize"
        onChange={handleInput}>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
        </select>
    </div>

    <label htmlFor="isActive">is Active</label>
    <div className="input-group-prepend px-0 mb-4">
        <select name="isActive" id="isActive" value={isActive}
        className="custom-select text-capitalize"
        onChange={handleInput}>
            <option value="true">true</option>
            <option value="false">false</option>
        </select>
    </div>

    {isActive !== 'false' ? (<button className="btn btn-info w-100" type="submit">Save</button>) :
    (<button className="btn btn-danger w-100" type="submit">Deactivate Account</button>)}
    <br/><br/>
</form>   ) 

}
                    
        </div>
    )
}

export default EditProfile
