
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ReceiptManager {
    struct Receipt {
        uint256 id;
        address owner;
        string vendor;
        string category;
        uint256 amount;
        uint256 date;
    }

    uint256 private _receiptCounter;

    mapping(uint256 => Receipt) public receipts;
    mapping(address => uint256[]) public userReceipts;

    event ReceiptAdded(address indexed owner, uint256 indexed receiptId, string vendor, uint256 amount);

    function addReceipt(
        string memory _vendor,
        string memory _category,
        uint256 _amount,
        uint256 _date
    ) public {
        _receiptCounter++;
        uint256 newReceiptId = _receiptCounter;

        receipts[newReceiptId] = Receipt({
            id: newReceiptId,
            owner: msg.sender,
            vendor: _vendor,
            category: _category,
            amount: _amount,
            date: _date
        });

        userReceipts[msg.sender].push(newReceiptId);

        emit ReceiptAdded(msg.sender, newReceiptId, _vendor, _amount);
    }

    function getReceiptsByOwner(address _owner) public view returns (uint256[] memory) {
        return userReceipts[_owner];
    }
}