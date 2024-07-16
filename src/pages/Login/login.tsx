import React, {ChangeEvent, createContext, useState, useContext} from 'react';
import './login.css';
import typing from '../../assets/images/typing.gif';
import {login} from '../../redux/action';
import {useDispatch} from "react-redux";
import {useNavigate} from 'react-router-dom';
import {register} from "../../api/api";
import {ws} from "../../api/web-socket";

function Login() {
    const [isLogin, setIsLogin] = useState(true);
    const handleFormSwitch = (isLogin: boolean) => {
        setIsLogin(isLogin);
    };

    return (
        <div className="container">
            <div className="box-1">
                <div className="content-holder">
                    <h5>Welcome to chat-app</h5>
                    <img id="typing-img" src={typing} alt="typing"/>
                    {isLogin ? (
                        <button className="button-1" onClick={() => handleFormSwitch(false)}>Sign up</button>
                    ) : (
                        <button className="button-2" onClick={() => handleFormSwitch(true)}>Login</button>
                    )}
                </div>
            </div>
            <div className="box-2">
                {isLogin ? (
                    <LoginForm/>
                ) : (
                    <SignupForm/>
                )}
            </div>
        </div>
    );
}

function LoginForm() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    if (ws) {
        ws.onmessage = (event) => {
            const response = JSON.parse(event.data as string);
            switch (response.event) {
                case "LOGIN": {
                    if (response.status === "success") {
                        const loginInfo = {
                            username: username,
                            password: password,
                            reLoginCode: response.data.RE_LOGIN_CODE
                        };
                        const jsonLoginInfoString = JSON.stringify(loginInfo);
                        const base64LoginInfoString = btoa(jsonLoginInfoString);

                        localStorage.setItem("user", base64LoginInfoString);

                        navigate('/chat');
                    } else if (response.status === "error") {
                        setErrorMsg(response.mes);
                    }
                    break;
                }
            }
        };
    }

    const handleLogin = () => {
        if (username.trim() !== "" && password.trim() !== "") {
            dispatch(
                login({
                    user: username,
                    pass: password
                })
            )
        } else {
            setErrorMsg("Please type your username and password");
        }
    }

    const handleChangeUsername = (e: ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    }

    const handleEnterPass = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    }

    return (
        <div className="login-form-container">
            <h1>Login Form</h1>
            <input
                type="text"
                value={username}
                required={true}
                onChange={handleChangeUsername}
                placeholder="Username"
                className="input-field"
                name="username"
            />
            <br/><br/>
            <input type="password"
                   required={true}
                   onKeyPress={handleEnterPass}
                   onChange={(e) => setPassword(e.target.value)}
                   placeholder="Password"
                   className="input-field"
                   name="password"
            />
            <br/><br/>
            {errorMsg !== '' ? <p className="Text-danger">{errorMsg}</p> : <br/>}
            <button
                className="login-button"
                onClick={handleLogin}
                type="button"
            >Login
            </button>
        </div>
    );
}

function SignupForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rePassword, setRePassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const handleSignUp = () => {
        if (rePassword !== password) {
            setErrorMsg("RePassword and Password are not matched");
        } else {
            register({
                user: username,
                pass: password,
            })
        }
    }

    const handleEnterPass = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSignUp();
        }
    }

    if (ws) {
        ws.onmessage = (event) => {
            const response = JSON.parse(event.data as string);
            console.log('Nhận dữ liệu từ máy chủ:', response);
            switch (response.event) {
                case "REGISTER": {
                    if (response.status === "success") {
                        setErrorMsg("register successfully, please log in to continue");
                    } else if (response.status === "error") {
                        setErrorMsg(response.mes);
                    }
                    break;
                }
            }
        };
    }

    return (
        <div className="signup-form-container">
            <h1>Sign Up Form</h1>
            <input
                type="text"
                placeholder="Username"
                required={true}
                onChange={(e) => setUsername(e.target.value)}
                className="input-field"
                name="username"
            />
            <br/><br/>

            <input
                type="password"
                placeholder="Password"
                required={true}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                name="password"
            />
            <br/><br/>
            <input
                type="password"
                required={true}
                placeholder="RePassword"
                onKeyPress={handleEnterPass}
                onChange={(e) => setRePassword(e.target.value)}
                className="input-field"
                name="rePassword"
            />
            <br/>
            {errorMsg !== '' ? <p className="Text-danger">{errorMsg}</p> : <br/>}
            <button
                className="signup-button"
                onClick={handleSignUp}
                type="submit">Sign Up
            </button>
        </div>
    );
}

export default Login;
