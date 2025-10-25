// access dom elements
const balanceEl = document.getElementById('balance');
const incomeAmountEl = document.getElementById('income-amount');
const expenseAmountEl = document.getElementById('expense-amount');
const transactionListEl = document.getElementById('transaction-list');
const transactionFormEl = document.getElementById('transaction-form');
const descriptionInputEl = document.getElementById('description');
const amountInputEl = document.getElementById('amount');

// initialize transactions array
let transactions =JSON.parse(localStorage.getItem("transactions"))||[];
transactionFormEl.addEventListener('submit', addTransaction);

function addTransaction(e){
    e.preventDefault();

    //get form values
    const description = descriptionInputEl.value.trim();
    const amount = parseFloat(amountInputEl.value.trim());

    transactions.push({
        id:Date.now(),
        description,
        amount
    });
    localStorage.setItem("transactions",JSON.stringify(transactions));

    updateTransactionList();
    updateSummary();
    transactionFormEl.reset();
}

function updateTransactionList(){
    transactionListEl.innerHTML = '';

    const sortedTransactions=[...transactions].reverse();
    sortedTransactions.forEach(transaction => {
       const transactionEl= createTransactionElement(transaction);
       transactionListEl.appendChild(transactionEl);
    });
}

function createTransactionElement(transaction){
    const li = document.createElement('li');
    li.classList.add('transaction');
    li.classList.add(transaction.amount < 0 ? 'expenses' : 'income');    
    li.innerHTML = `
       <span> ${transaction.description}</span>
        <span>${formatCurrency(transaction.amount)}
         <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
        </span>
       
    `;
    return li;
}

function updateSummary(){
  const balance=transactions.reduce((acc,transaction)=>acc+transaction.amount,0)

  const income=transactions.filter(transaction=>transaction.amount>0).reduce((acc,transaction)=>acc+transaction.amount,0);
    const expenses=transactions.filter(transaction=>transaction.amount<0).reduce((acc,transaction)=>acc+transaction.amount,0);

    //UPDATE UI
   balanceEl.textContent=formatCurrency(balance);
   incomeAmountEl.textContent=formatCurrency(income);
    expenseAmountEl.textContent=formatCurrency(expenses);
}
function formatCurrency(number){
    return new Intl.NumberFormat('en-US',{
        style:'currency',
        currency:'USD'
    }).format(number);
}

function removeTransaction(id){
    //filter out the transaction to be removed
    transactions=transactions.filter(transaction=>transaction.id!==id);
    localStorage.setItem("transactions",JSON.stringify(transactions));
    updateTransactionList();
    updateSummary();
}
//initial render
updateTransactionList();
updateSummary();