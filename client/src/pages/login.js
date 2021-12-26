import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { login } from '../redux/actions/authAction'
import { useDispatch, useSelector } from 'react-redux'
import { changeProfilePassword } from '../redux/actions/profileAction'

export const validation = (password) => {
    let pattern = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{6,}$/);
    if (!pattern.test(password)) {
        return false;
      }
    return true;
  };

const Login = () => {
    const initialState = { username: '', email: '', password: '' }
    const [userData, setUserData] = useState(initialState)
    const [attempts, setAttempts] = useState(0)
    const { username, email, password } = userData

    const [typePass, setTypePass] = useState(false)
    const [changePass, setChangePass] = useState(false)

    const { auth } = useSelector(state => state)
    const dispatch = useDispatch()
    const history = useHistory()

    useEffect(() => {
        if(auth.token) history.push("/")
    }, [auth.token, history])

    const handleChangeInput = e => {
        const { name, value } = e.target
        setUserData({...userData, [name]:value})
    }

    const handleSubmit = async e => {
        e.preventDefault()
        setAttempts(attempts + 1)
        dispatch(login(userData))
        localStorage.setItem('currentUser', username);
        if (attempts === 2) {
            localStorage.setItem(email, Math.floor(Date.now()/1000));
        };
    }

    const handleChangePassword = e => {
        e.preventDefault();
        dispatch(changeProfilePassword(userData))
        setChangePass(false);
    }

    const displayChangePassword = e => {
        e.preventDefault()
        setChangePass(true)
    }

    return (
        <div className="auth_page">
            {!changePass ? 
            (<form onSubmit={handleSubmit}>
                <h3 className="text-uppercase text-center mb-4">Blog-app</h3>

                <div className="form-group">
                    <label htmlFor="exampleInputEmail1">Email Address</label>
                    <input type="email" className="form-control" id="exampleInputEmail1" name="email"
                    aria-describedby="emailHelp" onChange={handleChangeInput} value={email} />
                </div>

                <div className="form-group">
                    <label htmlFor="exampleUsername1">Username</label>
                    <input type="username" className="form-control" id="exampleUsername1" name="username"
                    aria-describedby="usernameHelp" onChange={handleChangeInput} value={username} />
                </div>

                <div className="form-group">
                    <label htmlFor="exampleInputPassword1">Password</label>

                    <div className="pass">
                        
                        <input type={ typePass ? "text" : "password" } 
                        className="form-control" id="exampleInputPassword1"
                        onChange={handleChangeInput} value={password} name="password" />

                        <small onClick={() => setTypePass(!typePass)}>
                            {typePass ? 'Hide' : 'Show'}
                        </small>
                    </div>
                   
                </div>
                
                <button type="submit" className="btn btn-dark w-100"
                disabled={(email && password && (attempts !== 30) && 
                    ((Date.now()/1000) - ( + localStorage.getItem(email)) > 100)) ? false : true}>
                    Login
                </button>

                <p className="my-2">
                    Warning: Account will be locked temporarily after 3 unsuccessful login attempts!
                </p>
                <button type="button" className="btn btn-dark w-100" onClick={displayChangePassword}>
                    Forgot Password?
                </button>
                <p className="my-2">
                    You don't have an account? <Link to="/register" style={{color: "crimson"}}>Register Now</Link>
                </p>
            </form>) : 
        (<div>
            <div className="mainProfile">
              <form className="formLogin" onSubmit={handleChangePassword}>
              <h3 className="text-uppercase text-center mb-4">Change Password</h3>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                    <input
                    id="email"
                    className="form-control"
                    type="text"
                    align="center"
                    placeholder="email"
                    name="email"
                    value={email}
                    onChange={handleChangeInput}
                    />
                </div>
                <div className="form-group">
                <label htmlFor="userName">Username</label>
                    <input
                    id="userName"
                    className="form-control"
                    type="text"
                    align="center"
                    placeholder="username"
                    name="username"
                    value={username}
                    onChange={handleChangeInput}
                    />
                </div>
                <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                    <input
                    id="newPassword"
                    className="form-control"
                    type={ typePass ? "text" : "password" }
                    align="center"
                    placeholder="new password"
                    name="password"
                    value={password}
                    onChange={handleChangeInput}
                    pattern='^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{6,}$'
                    /> 
                    <small onClick={() => setTypePass(!typePass)}>
                        {typePass ? 'Hide' : 'Show'}
                    </small>
                </div>
                <button id="submit" className="btn btn-dark w-100" align="center">
                  <b>Change Password</b>
                </button>
                <p className="my-2">
                    Refresh the page to return to regular login, or change password here.
                </p>
              </form>
            </div>
          </div>)}
        </div> 
    )
}

export default Login
