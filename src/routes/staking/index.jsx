/**
 * Displays the Wallet page
 */

import React, { Component } from 'react';

import {
  Container,
  Row,
  Col,
} from 'reactstrap';
import Stake from './components/Stake';
import Unstake from './components/Unstake';
import Web3 from 'web3';
import Staking_ABI from './contract/staking';
import {
  getBalanceUsd,
} from '../../services/hydroPrice';



export default class Staking extends Component {


  /*Load Charity Factory Contract*/
  async loadBlockchain(){
    this.setState({loading:true})
    let ethereum= window.ethereum;
    let web3=window.web3;

    if(typeof ethereum !=='undefined'){
     await ethereum.enable();
     web3 = new Web3(ethereum);       
    }

    else if (typeof web3 !== 'undefined'){
    console.log('Web3 Detected!')
    window.web3 = new Web3(web3.currentProvider);
    }
 
    else{console.log('No Web3 Detected')
    window.web3 = new Web3(new Web3.providers.WebsocketProvider('wss://rinkeby.infura.io/ws/v3/72e114745bbf4822b987489c119f858b'));  
    } 
   
    const network = await web3.eth.net.getNetworkType();
    const accounts = await web3.eth.getAccounts();
    const blockNumber = await web3.eth.getBlockNumber();
    if (this._isMounted){
    this.setState({blockNumber:blockNumber});
    }
    if (this._isMounted){
    this.setState({account: accounts[0]}); 
    }
    
    const stakingContract= new web3.eth.Contract(Staking_ABI,'0x267161dCb3ed38FD8105E682FbAD5f25564eA902');
    if (this._isMounted){
        this.setState({stakingContract:stakingContract});
    }

    const duration = await this.state.stakingContract.methods.DURATION().call()
    if (this._isMounted){
       this.setState({duration:duration},()=>console.log())
    }

    const stakingBalance = await this.state.stakingContract.methods.balanceOf(this.state.account).call()
    if (this._isMounted){
      this.setState({stakingBalance:stakingBalance},()=>console.log("dura",this.state.stakingBalance))
   }

   const totalStaking= await this.state.stakingContract.methods.totalSupply().call()
   if (this._isMounted){
     this.setState({totalStaking:totalStaking},()=>console.log("dura",this.state.stakingBalance))
  }

    
    this.setState({loading:false})
    }
    /*END OF LOADING CHARITY FACTORY CONTRACT*/

   
   async getUsdPrice() {
          const req = await getBalanceUsd(1);
          this.setState({price:req},()=>console.log())   
      }
  
   

	constructor(props) {
  super(props)
  this.state = {
        staking_ABI:[],
        stakingContract:[],
        account:[],
        loading:true,
        price:0,

        duration:'',
        stakingBalance:0,
        totalStaking:0,

        address:null,
        blockNumber:'',
  
    }
}

render(){


  return (
    <Container>

      <Row className="wallet__row fadeit">

        <Col sm="12" md="12" lg="4" xl="4" className="mt-2">
        <section class="Card_main_cap"><h2>Hydro Price</h2><strong><p>$ {this.state.price}</p></strong></section>
        </Col>

        <Col sm="12" md="12" lg="4" xl="4" className="mt-2">
        <section class="Card_main_cap"><h2>Total Supply</h2><strong><p>11.1b</p></strong></section>
        </Col>
        
        <Col sm="12" md="12" lg="4" xl="4" className="mt-2">
        <section class="Card_main_cap"><h2>Total Staking</h2><strong><p>{this.state.totalStaking}</p></strong></section>
        </Col>

      </Row>
      
      <Row className="wallet__row fadeit">
        <Col sm="12" md="12" lg="12" xl="12">
        <Stake duration={this.state.duration} account={this.state.account} contract={this.state.stakingContract} />
        </Col>
        <Col>
        
        </Col>
        

      </Row>
      
      <Row className="identity__row fadeit mt-5">
      <Col sm="12" md="12" lg="12" xl="12">
      <Unstake duration={this.state.duration} account={this.state.account} contract={this.state.stakingContract} stakingBalance={this.state.stakingBalance}/>  

        </Col>
      </Row>
      <Row>
        <Col className="nopadding">
          
        </Col>
      </Row>
    </Container>
  );
}
componentDidMount(){
  this._isMounted = true;
  this.loadBlockchain();
  this.getUsdPrice();
}
}



