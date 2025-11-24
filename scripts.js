
// Solana Token Creation Functions
class TokenCreator {
  constructor() {
    this.tokenData = {
      name: '',
      symbol: '',
      supply: 0,
      decimals: 18,
      image: null
    };
    this.web3Fee = 0.5; // Fee de la plataforma en SOL
    this.networkFee = 0.1; // Fee estimado de la red Solana
    this.SOLANA_RPC = 'https://api.mainnet-beta.solana.com';
  }
// Initialize token creator UI
  init() {
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Token form submission
    document.getElementById('tokenForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.createToken();
    });

    // Image upload handling
    document.getElementById('tokenImage')?.addEventListener('change', (e) => {
      this.handleImageUpload(e.target.files[0]);
    });
  }

  handleImageUpload(file) {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      this.tokenData.image = e.target.result;
      document.getElementById('tokenImagePreview').src = e.target.result;
      document.getElementById('imagePlaceholder').classList.add('hidden');
      document.getElementById('tokenImagePreview').classList.remove('hidden');
    };
    reader.readAsDataURL(file);
  }
  async createToken() {
    // Get form values
    this.tokenData.name = document.getElementById('tokenName').value.trim();
    this.tokenData.symbol = document.getElementById('tokenSymbol').value.trim().toUpperCase();
    this.tokenData.supply = document.getElementById('tokenSupply').value;
    this.tokenData.decimals = document.getElementById('tokenDecimals').value || 18;

    // Basic validation
    if (!this.tokenData.name || !this.tokenData.symbol || !this.tokenData.supply) {
      this.showError('Please fill all required fields');
      return;
    }

    // Show payment modal
    this.showPaymentModal();
  }

  async showPaymentModal() {
    const modal = document.getElementById('paymentModal');
    const totalFee = this.web3Fee + this.networkFee;
    
    document.getElementById('web3Fee').textContent = `${this.web3Fee} SOL`;
    document.getElementById('networkFee').textContent = `${this.networkFee} SOL`;
    document.getElementById('totalFee').textContent = `${totalFee} SOL`;
    
    modal.classList.remove('hidden');
    
    // Setup payment handler
    document.getElementById('confirmPayment').addEventListener('click', async () => {
      try {
        modal.classList.add('hidden');
        this.showLoading('Processing payment and creating token...');
        
        // In a real app, you would connect to a Solana wallet here
        // and make the transaction using @solana/web3.js
        
        // Simulate payment processing and token creation
        setTimeout(async () => {
          this.hideLoading();
          this.showSuccess('Token created successfully on Solana network!');
          this.displayTokenDetails();
          this.displayTransactionDetails();
        }, 3000);
      } catch (error) {
        this.hideLoading();
        this.showError(`Error: ${error.message}`);
      }
    });
  }

  displayTransactionDetails() {
    const txDiv = document.getElementById('transactionDetails');
    txDiv.innerHTML = `
      <h3 class="text-xl font-bold mb-2">Transaction Details</h3>
      <div class="grid grid-cols-2 gap-2">
        <div class="text-gray-600">Network:</div>
        <div>Solana Mainnet</div>
        <div class="text-gray-600">Token Address:</div>
        <div class="break-all">${this.generateFakeAddress()}</div>
        <div class="text-gray-600">Total Fees Paid:</div>
        <div>${this.web3Fee + this.networkFee} SOL</div>
      </div>
    `;
    txDiv.classList.remove('hidden');
  }

  generateFakeAddress() {
    return 'To' + Array.from({length: 42}, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
  }

  showLoading(message) {
    const loadingDiv = document.getElementById('loadingMessage');
    loadingDiv.textContent = message;
    loadingDiv.classList.remove('hidden');
  }

  hideLoading() {
    document.getElementById('loadingMessage').classList.add('hidden');
  }
showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
    setTimeout(() => errorDiv.classList.add('hidden'), 3000);
  }

  showSuccess(message) {
    const successDiv = document.getElementById('successMessage');
    successDiv.textContent = message;
    successDiv.classList.remove('hidden');
    setTimeout(() => successDiv.classList.add('hidden'), 3000);
  }

  displayTokenDetails() {
    const detailsDiv = document.getElementById('tokenDetails');
    detailsDiv.innerHTML = `
      <h3 class="text-xl font-bold mb-2">Token Details</h3>
      <div class="grid grid-cols-2 gap-2">
        <div class="text-gray-600">Name:</div>
        <div>${this.tokenData.name}</div>
        <div class="text-gray-600">Symbol:</div>
        <div>${this.tokenData.symbol}</div>
        <div class="text-gray-600">Total Supply:</div>
        <div>${this.tokenData.supply}</div>
        <div class="text-gray-600">Decimals:</div>
        <div>${this.tokenData.decimals}</div>
      </div>
      ${this.tokenData.image ? `<img src="${this.tokenData.image}" class="mt-4 w-32 h-32 rounded-lg object-cover">` : ''}
    `;
    detailsDiv.classList.remove('hidden');
  }
}
// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const tokenCreator = new TokenCreator();
  tokenCreator.init();

  // Close modal handlers
  document.getElementById('closeModal').addEventListener('click', () => {
    document.getElementById('paymentModal').classList.add('hidden');
  });
  
  document.getElementById('cancelPayment').addEventListener('click', () => {
    document.getElementById('paymentModal').classList.add('hidden');
  });
});
