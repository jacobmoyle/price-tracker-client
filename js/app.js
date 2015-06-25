var ref = new Firebase("https://pricetracker2015.firebaseio.com/");
var baseUrl = 'http://localhost:3000/'
// var baseUrl = 'http://young-ravine-5515.herokuapp.com/'

var fbData;
var userData;
var tempProdId;
var tempProdName;

$(document).ready(function(){
  begin();
  // add Mary's js code
  submitSearch();
  formHandler();
});


var formHandler = function(){
  $('.wish-form').on("submit", function(event){
    event.preventDefault();
    var formData = $('.fuck-up').val();
    var data = {
        wishPrice: formData,
        fbId: fbData,
        prodId: tempProdId,
        prodName: tempProdName,
    }
    var response = $.ajax({
      url: baseUrl + "users/" + userData + "/wants",
      crossDomain: true,
      type: 'post',
      data: data
    });
  });
};

// +++++++++++++++++++++++++ function definitions only +++++++++++++++++++++++++

// ============== Ajax-Begin ==============
var begin = function(){
  $('.button').on('click', function(e){
    e.preventDefault();
    fbAuth().then(function(authData){
      ajaxLogin(authData);
    });
  });
};

var fbAuth = function(){
  var promise = new Promise(function(resolve, reject){
    ref.authWithOAuthPopup("facebook", function(error, authData) {
      if (error) {
        alert("login failed!");
        reject(error);
      } else {
        resolve(authData);
      };
    });
  })
  return promise;
};

var ajaxLogin = function(authData){
  userId = authData.facebook.id;
  userName = authData.facebook.displayName;
  var ajaxData = {
    user: {
      oauth_id: userId,
      oauth_name: userName
    }
  };
  $.ajax({
    url: baseUrl + "users",
    crossDomain: true,
    type:"post",
    data: ajaxData
  }).done(function(response) {
    userData = response.user.id;
    loadHome();
  }).fail(function() {
    alert("Login Failed");
  });
};
// ============== Ajax-End ==============

var loadHome = function(){
  $(".hardLanding").remove();
  $(".search-product-form").show();
  $(".nav-menu").css("display", "block");
  $(".container").css("display", "block");
  homeButton();
  profileButton();

  var request = $.ajax({
    url: baseUrl + "products/newest_products",
    crossDomain: true,
    type:"GET"
   });

  request.done(function(data){

    $("html").css('background-image', '');
    $("html").css('background-color', 'white');

    var products = data["products"]


      for(i = 0; i < products.length; i++){
        $(".softLanding").prepend("<div class='columns'><a class='prod-link' href='" + baseUrl + "products/" + products[i].id + "'>" + "<img class='sa' src='" + products[i].image.sizes.Best.url + "' alt='product Image'>" + "</a></div>")
      };
    showListener();
  });
};

var submitSearch = function(){
  $("#product-search").on('submit', function(event){
    event.preventDefault();

    var request = $.ajax({
      url: baseUrl + "products/results",
      data: $(this).serialize(),
      crossDomain: true,
      type:"GET"
    });

    request.done(function(data){
      $(".softLanding").empty();
      $("html").css('background-image', '');
      $("html").css('background-color', 'white');

      var products = data["products"]

      for(i = 0; i < products.length; i++){
        $(".softLanding").append("<div class='columns'><a class='prod-link' href='"+ baseUrl + "products/" + products[i].id + "'>" + "<img class='sa' src='" + products[i].image.sizes.IPhoneSmall.url + "' alt='product Image'>" + "</a></div>")
      };
      showListener();
    });

    request.fail(function(data){
      console.log("fail");
    });
  });
};

// The following is terribly coded. Forgive me, for I have sinned. <3 Jacob.

var showListener = function(){
  $(".prod-link").on("click", function(){
    event.preventDefault();
    var request = $.ajax({
      url: $(this).attr('href'),
      crossDomain: true,
      type: "GET"
    });

    request.done(function(data){
      $("html").css('background-image', '');
      $("html").css('background-color', 'white');
      display(data);
      backButton();
      tempProdId = data.id;
      tempProdName = data.name;
    });
    request.fail(function(data){
      console.log("fail");
    });
  });
};

var backButton = function(){
  $('.back-button').on("click", function(event){
    event.preventDefault();
    $("html").css('background-image', '');
    $("html").css('background-color', 'white');
    $('.show-page').hide();
    $('.search-product-form').show();
    $('.softLanding').show();
  });
};

//++++++++++++ Nav Bar ++++++++++++++++++++++++//

var homeButton = function(){
  $('.home-button').on("click", function(event){
    event.preventDefault();
    $('.softLanding').show();
    $('.show-page').hide();
  });
};

var profileButton = function(){
  $('.profile-button').on("click", function(event){
    event.preventDefault();
    $('.softLanding').hide();
    $('.show-page').hide();
  });
};

//++++++++++++ end ++++++++++++++++++++++++//

var display = function(shit){
  $('.prod-url').attr('href', shit.clickUrl);
  $('.prod-image').attr('src', shit.image.sizes.IPhone.url);
  $(".prod-name").html(shit.name);
  // $(".prod-brand").html(shit.brand.name);
  $(".prod-stock").html(shit.inStock);
  // $(".prod-desc").html(shit.description);
  $(".prod-cur").html(shit.salePrice);
  $(".prod-reg").html(shit.price);

  $('.search-product-form').hide();
  $('.softLanding').hide();
  $('.show-page').removeAttr("style");
};

