import React, { useState } from 'react'

const LoginPage = () => {
    return (
        <div className="login-page">
            <div>Log In To You Co_Ride Account</div>
            <form>
                <input type="text" placeholder="Username" />
                <input type="password" placeholder="Password" />
                <button type="submit">Log In</button>
                <button type="button">Sign Up</button>
            </form>
        </div>
    )
}

export default LoginPage;