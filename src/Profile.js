import { useState, useEffect } from 'react'
import { Form, Button} from 'react-bootstrap'
import { create as ipfsHttpClient } from 'ipfs-http-client'
const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')


const Profile = ({ contract, account }) => {
    const [profile, setProfile] = useState('')
    const [avatar, setAvatar] = useState(null)
    const [username, setUsername] = useState('')
    const [loading, setLoading] = useState(true)
    const [imageUpload, setImageUpload] = useState(false)

    const loadMyNFTs = async () => {
        contract.user(account).then(async (k) => {
            if (k === true ){
                const uri = await contract.getURI(account)
                const response = await fetch(uri)
                const metadata = await response.json()
                setProfile({id: 0, username: metadata.username, avatar: metadata.avatar})
                setLoading(false)
            }
            else {
                setLoading(false)
            }}) }

    const uploadToIPFS = async (event) => {
        event.preventDefault()
        const file = event.target.files[0]
        if (typeof file !== 'undefined') {
            try {
                const result = await client.add(file)
                setAvatar(`https://ipfs.infura.io/ipfs/${result.path}`)
                setImageUpload(true)  
            } catch (error) {
                console.log("ipfs image upload error: ", error)
            }}}

    const mintProfile = async () => {
        try {
            setLoading(true)
            const result = await client.add(JSON.stringify({ avatar, username }))
            await (await contract.mint(account, `https://ipfs.infura.io/ipfs/${result.path}`)).wait()
            loadMyNFTs()
        } catch (error) {
            setLoading(false)
            console.log("cant create account:", error)
        }
    }
    
    useEffect(() => {
        if(!profile){
            loadMyNFTs()
        } 
    },[])

    if (loading) return (
        <div className='text-center' style={{ top: '100px', position : 'relative', left : '45%', minHeight : '100vh', padding: "20px"}}>
            <h2>Loading...</h2>

        </div>
    )
    return (
        <div className="container-fluid mt-5" style={{position : 'relative', width : '70%', minHeight : '100vh', padding: "200px"}}>
            {profile ? (<div className="mb-3"><h3 className="mb-3">{profile.username}</h3>
                <img className="mb-3" style={{ width: '400px' }} src={profile.avatar} /></div>)
                :
                (<div>
                    <h1 className="mb-4">Sign Up</h1>
                    <h5>Note: Once created, you cann't modify account details</h5>
                
                <div className="row" style={{padding: '50px', justifyContent: 'center'}}>
                
                            <Form.Control 
                                type="file"
                                required
                                name="file"
                                onChange={uploadToIPFS}
                                style={{margin: '10px', width: '300px'}}
                            />
                            <div></div>
                            <Form.Control
                                onChange={(e) => setUsername(e.target.value)} 
                                required type="text" 
                                placeholder="Username"
                                style={{margin: '10px', width: '300px'}}
                            />
                            <div></div>
                            <Button variant="dark" disabled={!imageUpload || !username} onClick={mintProfile} style={{width: '100px'}}>Sign Up</Button>
                        
                </div>
                  
                </div>)}

            
        </div>
    );
}

export default Profile;