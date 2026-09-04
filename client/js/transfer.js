/**
 * Transfer Page Handler
 */

let recipientData = null;
let transferData = null;

const currencySymbols = {INR:'₹',USD:'$',EUR:'€',GBP:'£',AED:'د.إ'};

async function searchRecipient() {
    const input = document.getElementById('recipient').value.trim();
    if (!input) {
        showError('Please enter recipient identifier');
        return;
    }

    try {
        const response = await api.searchWallet(input);
        if (response.success) {
            recipientData = response.data;
            
            // Update recipient card elements
            const initials = (recipientData.fullName || 'U').split(' ').map(n => n[0]).join('').substring(0, 2);
            document.getElementById('recipientAvatar').textContent = initials;
            document.getElementById('recipientName').textContent = recipientData.fullName;
            document.getElementById('recipientWalletId').textContent = recipientData.walletId;
            document.getElementById('recipientCard').classList.add('active');
            
            showSuccess('Recipient found!');
        }
    } catch (error) {
        showError(error.message || 'Recipient not found');
        const card = document.getElementById('recipientCard');
        if (card) card.classList.remove('active');
    }
}

document.getElementById('sendMoneyForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const recipient = document.getElementById('recipient').value.trim();
    const amount = parseFloat(document.getElementById('amount').value);
    const currency = document.getElementById('currency').value;
    const note = document.getElementById('note').value;

    if (!recipient || amount <= 0) {
        showError('Please fill all required fields');
        return;
    }

    // Send money directly without confirmation modal (simplified for now)
    try {
        const response = await api.sendMoney(recipient, amount, currency, note);
        
        if (response.success) {
            showSuccess('Money sent successfully!');
            document.getElementById('sendMoneyForm').reset();
            const card = document.getElementById('recipientCard');
            if (card) card.classList.remove('active');
            recipientData = null;
            
            setTimeout(() => window.location.href = 'transactions.html', 2000);
        }
    } catch (error) {
        showError(error.message || 'Transfer failed');
    }
});

function toggleSidebar() {
    document.getElementById('sidebar')?.classList.toggle('open');
}

function showError(msg) {
    const el = document.getElementById('errorMessage');
    if (el) {el.textContent = msg; el.style.display = 'block';}
    setTimeout(() => el.style.display = 'none', 5000);
}

function showSuccess(msg) {
    const el = document.getElementById('successMessage');
    if (el) {el.textContent = msg; el.style.display = 'block';}
    setTimeout(() => el.style.display = 'none', 5000);
}
