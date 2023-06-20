// declared state of form
let state = {
    price: getNumber(document.querySelectorAll('[name="price"]')[0].value),
    loan_years: document.querySelectorAll('[name="loan_years"]')[0].value,
    down_payment: document.querySelectorAll('[name="down_payment"]')[0].value,
    interest_rate: document.querySelectorAll('[name="interest_rate"]')[0].value,
    property_tax: document.querySelectorAll('[name="property_tax"]')[0].value,
    home_insurance: document.querySelectorAll('[name="home_insurance"]')[0].value,
    hoa: document.querySelectorAll('[name="hoa"]')[0].value,
  };
  // declared Variables
  let toatlLoan,
    totalMonths,
    monthlyInterest,
    monthlyPrincipalInterest,
    monthlyPropertyTaxes,
    monthlyHomeInsurance,
    monthlyHOA,
    monthlyTotal,
    labels = ["Principal & Interest", "Property Tax", "Home Insurance", "HOA"],
    backgroundColor = [
      "rgba(255, 99, 132, 1)",
      "rgba(54, 162, 235, 1)",
      "rgba(255, 206, 86, 1)",
      "rgba(75, 192, 192, 1)",
      "rgba(153, 102, 255, 1)",
      "rgba(255, 159, 64, 1)",
    ];
  borderColor = [
    "rgba(255, 99, 132, 1)",
    "rgba(54, 162, 235, 1)",
    "rgba(255, 206, 86, 1)",
    "rgba(75, 192, 192, 1)",
    "rgba(153, 102, 255, 1)",
    "rgba(255, 159, 62, 1)",
  ];
  // removes characters returns only numbers
  function getNumber(str) {
    return Number(str.replace(/[^0-9\.-]+/g, ""));
  }
  // intialize vhart.js
  let ctx = document.getElementById("myChart");
  
  let myChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: labels,
      datasets: [
        {
          label: "# of Votes",
          data: [
            monthlyPrincipalInterest,
            monthlyPropertyTaxes,
            monthlyHomeInsurance,
            monthlyHOA,
          ],
          backgroundColor: backgroundColor,
          borderColor: borderColor,
          borderWidth: 1,
        },
      ],
    },
    options: {},
  });
  myChart.options.animation = false;
  // add event lister to inputs
  let i;
  let inputText = document.getElementsByClassName("form-group__textInput");
  for (let i = 0; i < inputText.length; i++) {
    inputText[i].addEventListener("input", updateInputState);
  }
  let inputSlides = document.getElementsByClassName("form-group__range-slide");
  for (let i = 0; i < inputSlides.length; i++) {
    inputSlides[i].addEventListener("input", updateInputState);
  }
  
  function updateInputState(event) {
    let name = event.target.name;
    let value = event.target.value;
    if (name == "price") {
      value = getNumber(value);
    }
    if (event.target.type == "range") {
      let total = (document.getElementsByClassName(
        `total__${name}`
      )[0].innerHTML = `${value}`);
    }
    state = {
      ...state,
      [name]: value,
    };
    calculateData();
  }
  document.getElementsByTagName("form")[0].addEventListener("submit", (event) => {
    event.preventDefault();
    document
      .getElementsByClassName("mg-page__right")[0]
      .classList.add("mg-page__right--animate");
    calculateData();
  });
  function calculateData() {
    toatlLoan = state.price - state.price * (state.down_payment / 100);
    totalMonths = state.loan_years * 12;
    monthlyInterest = state.interest_rate / 100 / 12;
    monthlyPrincipalInterest = (
      toatlLoan *
      ((monthlyInterest * (1 + monthlyInterest) ** totalMonths) /
        ((1 + monthlyInterest) ** totalMonths - 1))
    ).toFixed(2);
    monthlyPropertyTaxes = (
      (state.price * (state.property_tax / 100)) /
      12
    ).toFixed(2);
    monthlyHomeInsurance = state.home_insurance / 12;
    monthlyHOA = state.hoa / 12;
    monthlyTotal =
      parseFloat(monthlyPrincipalInterest) +
      parseFloat(monthlyPropertyTaxes) +
      parseFloat(monthlyHomeInsurance) +
      parseFloat(monthlyHOA);
    document.getElementsByClassName('info__numbers--principal')[0].innerHTML = parseFloat
    (monthlyPrincipalInterest).toFixed(2);
    document.getElementsByClassName('info__numbers--property_taxes')[0].innerHTML = parseFloat
    (monthlyPropertyTaxes).toFixed(2);
    document.getElementsByClassName('info__numbers--home_insurance')[0].innerHTML = parseFloat
    (monthlyHomeInsurance).toFixed(2);
    document.getElementsByClassName('info__numbers--hoa')[0].innerHTML = parseFloat
    (monthlyHOA).toFixed(2);
    document.getElementsByClassName('info__numbers--total')[0].innerHTML = monthlyTotal.toFixed(2);
    updateChart(myChart, labels, backgroundColor);
  }
  function updateChart(Chart, label, color){
      Chart.data.datasets.pop();
      Chart.data.datasets.push({
          label: label,
          backgroundColor: color,
          data: [
              monthlyPrincipalInterest,
              monthlyPropertyTaxes,
              monthlyHomeInsurance,
              monthlyHOA
          ]
      });
      Chart.options.transitions.active.animation.duration = 0;
      Chart.update();
  }
  calculateData();