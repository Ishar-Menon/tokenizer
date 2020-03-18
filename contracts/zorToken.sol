pragma solidity ^0.5.0;

contract zorToken {
    // State variable , publicly visible
    uint256 public totalSupply;

    // Name for ERC-20 standard
    string public name = "Zor Token";
    // Symbol for ERC-20 standard
    string public symbol = "ZOR";

    string public standard = "Zor Token v1.0";

    // Gives Balanceof function by default for ERC-20 standard
    mapping(address => uint256) public balanceOf;

    //allowance() function is implicit as mapping is public
    mapping(address => mapping(address => uint256)) public allowance;

    // Transfer event
    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    // Approval event
    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );

    constructor(uint256 _initialSupply) public {
        balanceOf[msg.sender] = _initialSupply;
        totalSupply = _initialSupply;
    }

    // Transfer function - Return a boolean
    // Triggers transfer event
    // Exception if the account doen't have enough
    function transfer(address _to, uint256 _value)
        public
        returns (bool success)
    {
        require(balanceOf[msg.sender] >= _value);

        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;

        emit Transfer(msg.sender, _to, _value);

        return true;
    }

    // Approve - approve for delagated token transfer
    // allow spender to value tokens on behalf of the sender
    function approve(address _spender, uint256 _value)
        public
        returns (bool success)
    {
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    // transfer from - Performs the delagated transfer
    function transferFrom(address _from, address _to, uint256 _value)
        public
        returns (bool success)
    {
        require(balanceOf[_from] >= _value);
        require(allowance[_from][msg.sender] >= _value);

        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;

        allowance[_from][msg.sender] -= _value;

        emit Transfer(_from, _to, _value);

        return true;
    }
}
