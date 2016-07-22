(function() {
  (function(x, y) {
    return alert(x + y);
  });

}).call(this);

requirejs.config({
	baseUrl:"js/vendor",
	paths:{
		flex:"flexible"	
	}
});
requirejs(["flex"],function(flex){
	alert(flex);
});

