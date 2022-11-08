import {
  Link,
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import { ProSidebar, Menu, MenuItem} from 'react-pro-sidebar';
import 'react-pro-sidebar/dist/css/styles.css';
import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import DmailAbi from './contractsData/dmail.json'
import DmailAddress from './contractsData/dmail-address.json'
import DpayAbi from './contractsData/dpay.json'
import DpayAddress from './contractsData/dpay-address.json'
import { Navbar, Nav, Button } from 'react-bootstrap'
import Home from './Home.js'
import Profile from './Profile.js'
import Payment from './Payment.js'

function App() {
  const [loading, setLoading] = useState(true)
  const [account, setAccount] = useState(null)
  const [dmailContract, setDmailContract] = useState({})
  const [dpayContract, setDpayContract] = useState({})

  window.ethereum.on('chainChanged', () => {
    window.location.reload();
  })
  window.ethereum.on('accountsChanged', async () => {
    setLoading(true)
    web3Handler()
  })

  const web3Handler = async () => {
    try {
      let accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0])
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      loadContract(signer)
    } catch (error) {
      console.log(error);
    }}

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }
      const accounts = await ethereum.request({ method: "eth_accounts" });
      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setAccount(account)
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        // Get signer
        const signer = provider.getSigner()
        loadContract(signer)
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    } }

  const loadContract = async (signer) => {
    try {
      const dmailContract = new ethers.Contract(DmailAddress.address, DmailAbi.abi, signer)
      const dpayContract = new ethers.Contract(DpayAddress.address, DpayAbi.abi, signer)
      setDmailContract(dmailContract)
      setDpayContract(dpayContract)
      setLoading(false)
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    checkIfWalletIsConnected()
  },[account])
  return (
    <BrowserRouter>
      <div className="App" style={{backgroundColor : 'black', height: '100%', color : 'white' }}>
        <Navbar style={{position: 'fixed', backgroundColor: 'rgb(128,128,128)', zIndex: '1',width : '100%' , height : '70px' ,color : 'white'}}>
                
                <h3 style={{paddingLeft: '2%'}}>DMAIL </h3>
                  
                <Nav.Link as={Link} to="/profile" style={{backgroundColor: 'rgb(128,128,128)', color : 'white', marginLeft: '70%'}}>Sign Up</Nav.Link>
                {account ? (
                  <Button variant="dark">{account.slice(0, 5) + '...' + account.slice(38, 42)}</Button>


                ) : (
                  <Button variant="dark" onClick={web3Handler}>Connect Wallet</Button>
                )}
            </Navbar>
          {loading ? (
            <div className='text-center' style={{ top: '200px', position : 'relative', minHeight : '100vh', padding: "20px"}}>
              <h2>Please connect to Metamask</h2>
            </div>
          ) : (
          <div style={{width : '100%'}}>
      
            <div style={{display: 'flex', justifyContent: 'left', textAlign : 'center'}}>
              <ProSidebar style={{ position: 'fixed',  height : '100vh', top : '70px'}}>
                
                <Menu iconShape="square" >
                  <MenuItem >
                      Inbox
                      <Link to="/" />
                  </MenuItem>
                  <MenuItem >
                      Compose
                      <Link to="/compose" />
                  </MenuItem>
                  <MenuItem >
                      Payment
                      <Link to="/payment" />
                  </MenuItem>
                </Menu>
              </ProSidebar>

              <Routes >
                <Route path="/" element={
                  <Home contract={dmailContract} account = {account} inbox = {true} />
                  
                } />
                <Route path="/compose" element={
                  <Home contract={dmailContract} account = {account} inbox = {false} />
                } />
                
                <Route path="/profile" element={
                  <Profile contract={dmailContract} account = {account} />
                } />
                <Route path="/payment" element={
                  <Payment contract={dpayContract} account = {account} />
                } />
              </Routes>
            </div>
            
          </div>
            
          )}
      
      </div>
    </BrowserRouter>

  );
}

export default App;