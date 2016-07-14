requirejs.config({
	baseUrl:"js/vendor",
	paths:{
		flex:"flexible"	
	}
});
requirejs(["flex"],function(flex){
	// alert("hello");
})

