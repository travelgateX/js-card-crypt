"use strict";

var Card = (function () {
  function Card(number, expiration_month, expiration_year, security_code, currentdate) {
    this.number = number;
    this.expiration_month = expiration_month;
    this.expiration_year = expiration_year;
    this.security_code = security_code;
    this.bin = number.substr(0, 6);
    this.last4 = number.substr(-4)


    this.token_creation_data = currentdate.getUTCFullYear() + "/"
      + getNormalizedData(currentdate.getUTCMonth()) + "/"
      + getNormalizedData(currentdate.getUTCDate()) + " "
      + getNormalizedData(currentdate.getUTCHours()) + ":"
      + getNormalizedData(currentdate.getUTCMinutes()) + ":"
      + getNormalizedData(currentdate.getUTCSeconds());
  }
  return Card;
})();



(function () {
  document.getElementById("card-button").addEventListener("click", function () {
    event.preventDefault();
    var number = document.getElementById("card-number").value;
    var month = document.getElementById("card-month").value;
    var year = document.getElementById("card-year").value;
    var cvv = document.getElementById("card-cvv").value;
    var currentdate = new Date();

    var card = new Card(number, month, year, cvv, currentdate);

    var publicKey = `-----BEGIN PUBLIC KEY-----     YOUR UBLIC KEY HERE          -----END PUBLIC KEY-----`;

    var encrypt = new JSEncrypt();
    encrypt.setPublicKey(publicKey);
    var encrypted = encrypt.encrypt(JSON.stringify(card));
    saveCard(encrypted, card.bin, card.last4);
  });
})();

function getNormalizedData(data) {
  var stringRet = "00"
  if (data < 10) {
    stringRet = "0" + data
  } else {
    stringRet = data
  }
  return stringRet
}

function saveCard(encrypted, bin, last4) {
  var form = document.getElementById("card-form");
  form.reset();
  addHiddenElement(form, "card-token", encrypted)
  addHiddenElement(form, "card-bin", bin)
  addHiddenElement(form, "card-last4", last4)

  //console.log(form)
}

function addHiddenElement(form, fieldID, value) {
  // if the field not exist
  if (!document.getElementById(fieldID)) {
    // add new hidden element
    form.appendChild(createHiddenElement(fieldID, value))

  } else {
    // update the exist element value
    document.getElementById(fieldID).value = value
  }
}

function createHiddenElement(name, value) {
  var hiddenInput = document.createElement("input");
  hiddenInput.setAttribute("type", "hidden");
  hiddenInput.setAttribute("name", name);
  hiddenInput.setAttribute("id", name)
  hiddenInput.setAttribute("value", value);
  return hiddenInput
}
