import { useState} from "react"
import { ethers } from "ethers"
import { Button } from 'react-bootstrap'


function Payment({ contract }) {

  const [transfer_eth, setTransfer_eth] = useState('0');
  const [usdPrice, setUsdPrice] = useState('0');
  const [receiverAddress, setReceiverAddress] = useState("");
  
  async function transfer(event){
    try{
      event.preventDefault();
      const wei = {value: ethers.utils.parseEther(transfer_eth)};
      const transferTxn = await contract.transfer(receiverAddress, wei);
      await transferTxn.wait();
      alert(`${transfer_eth} eth transfered to ${receiverAddress}`)

    }
    catch(error){
      alert("failed")
    }
    

  }
  
  async function getprice(){
    if (parseInt((parseFloat(transfer_eth) * 10**10)) >= 1) {
      const usdBigNum = await contract.getUsdPrice(parseInt((parseFloat(transfer_eth) * 10**10)));
      setUsdPrice(ethers.utils.formatEther( usdBigNum ))
    }
  }
  getprice()

  return (
    <div className="container-fluid mt-5" style={{position : 'relative', width : '70%', minHeight : '100vh', padding: "200px"}}>

      <div className="App-header">
        <h1>Payment</h1>
      </div>

      <div className="App-body" style={{ padding: "20px"}}>

        <div className="App-transfer">
          <div className="row" style={{justifyContent: 'center'}}>
          
            <input className="App-input" style={{ margin: "10px", width: '410px'}}
              type="text"
              placeholder="Receiver Address"
              onChange={(e) => {setReceiverAddress(e.target.value);
                  }}
            />
            <div></div>
          
            <input className="App-input" style={{ margin: "10px", width: '410px'}}
              type="text"
              pattern="[+-]?\d+(?:[.,]\d+)?"
              placeholder="Amount in Ether"
              onChange={(e) => {setTransfer_eth(e.target.value);
                    }
                  }
            />
            
            <div style={{ paddingBottom: "10px",}}> ~ {usdPrice} USD {console.log(transfer_eth)}</div>
         
            <Button className="App-submit" variant="dark" onClick = {transfer} disabled = {!receiverAddress || (transfer_eth === ('0') || !transfer_eth) } style={{ color : 'white', width: '100px'}} > Send </Button>
          </div>
          
        </div>
      </div>
      

    </div>
  );
}

export default Payment
