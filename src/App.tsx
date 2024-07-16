import React, {useEffect} from 'react';
import './App.css';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import {publicRoutes} from './routes/routes';
import {closeWebSocket, connectWebSocket} from "./api/web-socket";

function App() {
    useEffect(() => {
        connectWebSocket();

        return () => {
            closeWebSocket();
        };
    }, []);

    return (
        <Router>
            <div className="App">
                <Routes>
                    {
                        publicRoutes.map((route, index) => {
                            const Page = route.component;
                            return <Route key={index} path={route.path} element={<Page/>}/>
                        })
                    }
                </Routes>
            </div>
        </Router>
    );
}

export default App;
