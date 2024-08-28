import { useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from './hooks/useAuth';
import useApp from './hooks/useApp';
import useTheme from './hooks/useTheme';
import ImageGenerator from './components/ImageGenerator';
import Chat from './components/Chat';
import NavBar from './components/NavBar';
import './App.css';
import './styles/Auth.css';

const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

const App = () => {
    const { selectedComponent, handleComponentChange, toggleProfile, showProfile } = useApp();
    const { theme, setTheme } = useTheme();
    const { user, handleLoginSuccess, handleLoginError, logout } = useAuth();

    useEffect(() => {
    }, [user]);

    return (
        <div className={`app-container`}>
            {user ? (
                <>
                    <NavBar
                        user={user}
                        selectedComponent={selectedComponent}
                        handleComponentChange={handleComponentChange}
                        toggleProfile={toggleProfile}
                        showProfile={showProfile}
                        logout={logout}
                    />
                    <div className="component-container">
                        {selectedComponent === 'chat' && <Chat theme={theme} setTheme={setTheme} />}
                        {selectedComponent === 'imageGenerator' && <ImageGenerator theme={theme} setTheme={setTheme} />}
                    </div>
                </>
            ) : (
                <div className="login-container">
                    <GoogleLogin
                        clientId={CLIENT_ID}
                        buttonText="Login with Google"
                        onSuccess={handleLoginSuccess}
                        onFailure={handleLoginError}
                        access_type="offline"
                        cookiePolicy={"single_host_origin"}
                    />
                </div>
            )}
        </div>
    );
};

export default App;
