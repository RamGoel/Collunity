import React from 'react'

function UserCard({user, design2}) {
    return (
        <div>
            {
                design2?<div className="d-flex" style={{ justifyContent: 'flex-start' }}>
                <button style={{ borderRadius: '200px', color: 'white', margin: '0px 10px', background: 'black', height: '40px', width: '40px' }}>
                    {user.name[0].toUpperCase()}
                </button>
                <div className="d-flex" style={{ padding: '5px', width:'100%', justifyContent:'space-between' }}>
                    <p style={{ fontSize: 20, margin: '5px 0px', fontWeight: "bold" }}>
                        {user.name}
                        {user.isOnline ? (
                            <span style={{ color: "green" }}> •</span>
                        ) : (
                            <span style={{ color: "red" }}> •</span>
                        )}
                    </p>
                    <p style={{ fontSize: "small" }}>{user.email.substring(0, 23)}...</p>
                </div>
            </div>:<div className="d-flex" style={{ justifyContent: 'flex-start' }}>
                <div style={{ borderRadius: '200px', color: 'white', margin: '0px 10px', background: 'black', height: '50px', width: '50px' }}>
                    <p>{user.name[0].toUpperCase()}</p>
                </div>
                <div className="box" style={{ padding: '5px', borderBottom: '1px solid #D3D3D3' }}>
                    <p style={{ fontSize: 20, margin: '5px 0px', fontWeight: "bold", textAlign: 'left' }}>
                        {user.name}
                        {user.isOnline ? (
                            <span style={{ color: "green" }}> •</span>
                        ) : (
                            <span style={{ color: "red" }}> •</span>
                        )}
                    </p>
                    <p style={{ fontSize: "small", textAlign: 'left' }}>{user.email.substring(0, 23)}...</p>
                </div>
            </div>
            }
        </div>
    )
}

export default UserCard