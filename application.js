jQuery( document ).ready(function( $ ) {
	var template = null;
	$('#recipe-template').load("recipe.html",function(html){ 
		template = Handlebars.compile(html);

		$('#recipe-data').load("data/recipes.js",function(raw){
			var data = JSON.parse(raw);
			for (var i = data.length - 1; i >= 0; i--) {
				console.log(data[i]);
				var recipeHtml = template(data[i]);
				$(recipeHtml).find(".directions p").hide();
				$('#content').append( recipeHtml.replace('data-src','src') );

			};
		});

		$('#content').on('click', '.directions', function(evt){
				$(this).find("p").slideToggle();
		});

		$('#loader').hide();
		return false;
	});
});