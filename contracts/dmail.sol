//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract Dmail is ERC721URIStorage {

    mapping(address => uint256) public mailCount;
    mapping(address => bool) public user;
    mapping(address => mapping(uint256 => Mail)) public mails;

    struct Mail {
        uint256 id;
        string hash;
        address payable author;
    }

    event MailCreated(
        uint256 id,
        string hash,
        address payable author
    );

    
    constructor() ERC721("Decentralize Mail", "DMAIL") {}

    function mint(address _userAddress,string memory _tokenURI) external {
        _safeMint(msg.sender, uint160(_userAddress));
        _setTokenURI(uint160(_userAddress), _tokenURI);
        user[_userAddress] = true;

    }

    function getURI(address _userAddress) public view returns (string memory){
        return tokenURI(uint160(_userAddress)) ;
    }

    function uploadMail(address _userAddress, string memory _mailHash) external {
    
        require(bytes(_mailHash).length > 0, "Cannot pass an empty hash");
        mailCount[_userAddress]++;
        mails[_userAddress][mailCount[_userAddress]] = Mail(mailCount[_userAddress], _mailHash, payable(msg.sender));
        emit MailCreated(mailCount[_userAddress], _mailHash, payable(msg.sender));
    }


    function getAllMails(address _userAddress) external view returns (Mail[] memory _mails) {
        _mails = new Mail[](mailCount[_userAddress]);
        for (uint256 i = 0; i < _mails.length; i++) {
            _mails[i] = mails[_userAddress][_mails.length - i];
        }
    }

    
}