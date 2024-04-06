// Initialize Web3
const web3 = new Web3('https://apiuk.omaxray.com');

// Load ABI from a separate text file
async function loadABIFile() {
    try {
        const response = await fetch('./abi_file.json'); // Replace 'path_to_your_abi_file.json' with the actual path to your ABI file
        const abi = await response.json();
        return abi;
    } catch (error) {
        console.error('Error loading ABI:', error);
        throw error;
    }
}

// Example usage:
async function main() {
    try {
        const abi = await loadABIFile();
        console.log('Loaded ABI:');
        // Define the address of your deployed smart contract
        const contractAddress = '0x19Dab9B5289ce3F8E673299A922Fb5397B51dbc4'; // Replace this with your actual contract address
        
        // Create a contract instance
        const domainRegistrar = new web3.eth.Contract(abi, contractAddress);

        // Define getOwner function within main function
        async function getOwner() {
            try {
                const ownerAddress =  await domainRegistrar.methods.owner().call();
                console.log('Owner address is:', ownerAddress);
                // Perform further operations with the owner address if needed
            } catch (error) {
                console.error('Error calling owner():', error);
            }
        }

        async function checkAvailability(_name){
            
            try {
                let _availability =  await domainRegistrar.methods.checkAvailability(_name).call();
                return _availability;
                // Perform further operations with the owner address if needed
            } catch (error) {
                console.error('Error calling checkAvailability():', error);
            }
        }

        async function calculatePayment(_name,_days){
            try{
                let _payment = await domainRegistrar.methods.calculatePayment(_name,_days).call();
                return _payment;
                // Perform further operations with the owner address if needed
            } catch (error) {
                console.error('Error calling calculatePayment():', error);
            }
        }

        

        // Function to be called when Button 1 is clicked
        async function handleClick1() {
            let _inputName = document.getElementById("inputName").value;   
            console.log(await checkAvailability(_inputName));
            
        }

        // Function to be called when Button 2 is clicked
        async function handleClick2() {
            let _inputName = document.getElementById("inputName").value;   
            let _availability = await checkAvailability(_inputName);
            if (_availability == true){
                let _payment = await calculatePayment(_inputName,30);
                console.log(_payment);
            }

            else{
                console.log("Name not Available");
            }
            
           
        }


        async function connectToMetaMask() {
            try {
                if (window.ethereum) {
                    // Request access to user accounts
                    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                    console.log('Connected to MetaMask:', accounts[0]);
                    // Perform actions with connected account
                } else {
                    console.log('MetaMask not detected. Please install MetaMask to use this feature.');
                }
            } catch (error) {
                console.error('Error connecting to MetaMask:', error);
            }
        }
        
        async function RegisterDomain() {
            try {
                // Get the account addresses
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                const from = accounts[0];
        
                // Construct transaction data
                const txData = domainRegistrar.methods.setBasePrice(0).encodeABI();

                // Estimate gas
                const gas = await domainRegistrar.setBasePrice(0).estimateGas({ from });

                // Construct transaction object
                const txObj = {
                    from,
                    to: contractAddress,
                    data: txData,
                    gas,
                };

                // Sign transaction with MetaMask
                const signedTx = await web3.eth.sendTransaction(txObj);
        
                console.log('Transaction receipt:', txReceipt);
            } catch (error) {
                console.error('Error calling method with signed transaction:', error);
            }
        }
        
        
          
          

        // Add event listeners to the buttons
        let inputValue = document.getElementById("inputName").value;     
        document.getElementById('CheckAvailability').addEventListener('click', handleClick1);
        document.getElementById('CalculatePayment').addEventListener('click', handleClick2);
        document.getElementById('RegisterDomain').addEventListener('click', RegisterDomain);
        document.getElementById('connectWalletButton').addEventListener('click', connectToMetaMask);

                
    } catch (error) {
        console.error('Error:', error);
    }
}

// Call the main function
main();
