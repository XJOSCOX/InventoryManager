import React, { useState } from "react";
import LoginPage from "./LoginPage";

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
  };

  return (
    <div>
      {!user ? (
        <LoginPage onLogin={handleLogin} />
      ) : (
        <h2>Welcome, {user.username} ({user.role}) 🎉</h2>
      )}
    </div>
  );
}

export default App;
