document.addEventListener('DOMContentLoaded', function() {

  const exchangeRates = {
    INR: 1,
    EUR: 102.10,
    USD: 87.82,
  };

  const amountInput = document.getElementById('amount');
  const fromSelect = document.getElementById('fromCurrency');
  const toSelect = document.getElementById('toCurrency');
  const resultP = document.getElementById('result');

  document.getElementById('convertBtn').addEventListener('click', function() {
    const amount = parseFloat(amountInput.value);
    const fromCurrency = fromSelect.value;
    const toCurrency = toSelect.value;

    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount.');
      return;
    }

    const amountInUSD = amount / exchangeRates[fromCurrency];
    const convertedAmount = (amountInUSD * exchangeRates[toCurrency]).toFixed(2);

    resultP.innerHTML = `${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}`;
  });

  document.getElementById('swapBtn').addEventListener('click', function() {
    const temp = fromSelect.value;
    fromSelect.value = toSelect.value;
    toSelect.value = temp;
    
    document.getElementById('convertBtn').click();
  });

});
