document.addEventListener('DOMContentLoaded', function() {

  document.getElementById('convertBtn').addEventListener('click', function() {
    var temp = parseFloat(document.getElementById('temperature').value);
    var unit = document.getElementById('unit').value;
    if (isNaN(temp)) {
      alert("Please enter a valid temperature.");
      return;
    }
    {
      var result;
        if (unit === "C") {
            result = ((temp - 32) * 5 / 9).toFixed(2) + " °C";
        } else if (unit === "F") {
            result = (temp * 9 / 5 + 32).toFixed(2) + " °F";
      }
    }
    document.getElementById('result').innerHTML = "Converted Temperature: " + result;
  });
});
