import { useState, useEffect } from 'react'
import { Form, Button, Card } from 'react-bootstrap'
import { create as ipfsHttpClient } from 'ipfs-http-client'
const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

const Home = ({ contract, account, inbox }) => {
    const [mails, setMails] = useState('')
    const [sender, setSender] = useState('')
    const [hasProfile, setHasProfile] = useState(false)
    const [mail, setMail] = useState('')
    const [loading, setLoading] = useState(true)

    const checkProfile = async () =>{
        let address = await contract.signer.getAddress()
        const balance = await contract.balanceOf(address)
        setHasProfile(() => balance > 0)
    }

    const loadMails = async () => {
        let results = await contract.getAllMails(account)
        if (results !== [])
        {
            let mails = await Promise.all(results.map(async i => {
                let response = await fetch(`https://ipfs.infura.io/ipfs/${i.hash}`)
                const metadataMail = await response.json()
                const uri = await contract.getURI(i.author)
                response = await fetch(uri)
                const metadataProfile = await response.json()
                const author = {
                    address: i.author,
                    username: metadataProfile.username,
                    avatar: metadataProfile.avatar
                }
                let mail = {
                    id: i.id,
                    content: metadataMail.mail,
                    author
                }
                return mail
            }))
            setMails(mails)
        }
        setLoading(false)
    }

    const uploadMail = async () => {
        if (!mail) return
        setLoading(true)

        let hash
        // Upload mail to IPFS
        try {
            const result = await client.add(JSON.stringify({ mail }))
            hash = result.path
            await (await contract.uploadMail(sender,hash)).wait()
            setLoading(false)
        } catch (error) {
            window.alert("Error", error)
            setLoading(false)
        }
        
    }

    useEffect(() => {
        console.log("effect")
        if (!mails && inbox) {
            setLoading(true)
            loadMails()
        }
        else {
            checkProfile()
            setLoading(false)
        }
    },[inbox])
    
    if (loading) return (
        <div className='text-center' style={{ top: '100px', position : 'relative', left : '45%', minHeight : '100vh', padding: "20px"}}>
            <main>
                <h2>Loading...</h2>
            </main>
        </div>
    )
    return (
        <div className="container-fluid mt-5" style={{ position : 'relative', width : '70%', minHeight : '100vh', padding : '200px'}}>
            {
                !inbox ? 
                (<div>
                    {hasProfile ?
                        (<div className="row"style={{padding: '50px', justifyContent: 'left'}}>
                           
                            
                            <Form.Control onChange={(e) => setSender(e.target.value)} required type="text" placeholder="Receiver Address" style={{margin: '10px', width: '410px'}} />
                            <div></div>
                            <Form.Control onChange={(e) => setMail(e.target.value)} required as="textarea" placeholder="Body" style={{margin: '10px', height : '200px',width: '410px'}}/>
                            <div></div>
                            <Button onClick={uploadMail} disabled={!sender || !mail} variant="dark" style={{margin: '10px', width: '100px'}}>Send</Button>
                            
                                    
                        </div>
                        
                        ):
                        (<div className="text-center">
                            <main >
                                <h1>Please Sign Up</h1>
                            </main>
                        </div>)
                    }

                </div>
                ):
                <div>
                    {mails.length > 0 ?
                        mails.map((mail, key) => {
                            return (
                                <div key={key} className="col-lg-12 my-3 mx-auto" style={{width: '100%'}}>
                                    <Card style={{backgroundColor:'white'}}>
                                        <Card.Header style={{backgroundColor:'black'}}>
                                           
                                            <img
                                                className='mt-1 float-start'
                                                width='50'
                                                height='50'
                                                src={mail.author.avatar}
                                            
                                            />
                                            <Card.Title className="ms-2 float-start">
                                                {mail.author.username}
                                            </Card.Title>
                                            <small className="mt-1 float-end d-inline">
                                                {mail.author.address}
                                            </small>
                                        </Card.Header>
                                        <Card.Body style={{backgroundColor:'black'}}>
                                            <Card.Title className='mt-1 float-start'>
                                                {mail.content}
                                            </Card.Title>
                                        </Card.Body>                
                                        
                                    </Card>
                                </div>)
                        })
                        : (
                            <div className="text-center">
                                <main>
                                    <h1>No Mails</h1>
                                </main>
                            </div>
                        )}

                </div>
}
            
            

            

        </div >
    );
}

export default Home