jQuery( document ).ready(function( $ ) {
	var template = null;
	var cardTemplate = null;
	$('#recipe-template').load("recipe.html",function(html){ 
		template = Handlebars.compile(html);
		cardTemplate = Handlebars.compile($('#card-template').html());

		$('#recipe-data').load("data/recipes.js",function(raw){
			var data = JSON.parse(raw);
			for (var i = data.length - 1; i >= 0; i--) {
				data[i].index = i;
				var recipeHtml = cardTemplate(data[i]);
				$('#content').append( recipeHtml.replace('data-src','src') );
			};

			/* Clicking the card will show the recipe */ 
			$('#content').on('click', '.card-click', function(evt){
				var index = $(this).find('.card-title').attr('ref');
				var recipeHtml = template(data[index]);
				$('#recipe-display').html( recipeHtml.replace('data-src','src') );
				$('#recipe-display').show();
				
				evt.stopPropagation();
				console.log('1st');
			});

			/* Only hide the loader if we loaded everything */
			$('#content').fadeIn();
			$('#loader').fadeOut();
		});
		
		return false;
	});

	/* Search functionality for recipes based on title only.*/
	$('#search, .auto-title').each(function(){$(this).val($(this).attr('title'));});

	$('#search').on('keyup',function(evt){
		var val = $(this).val().toUpperCase();
		var titles = $('.card-title');
		for (var i = titles.length - 1; i >= 0; i--) {
			var item = $(titles[i]);
			if(item.text()){ /*template has no value*/
				if( item.text().toUpperCase().search(val) == -1)
					item.closest('.card-container').fadeOut();	
				else
					item.closest('.card-container').fadeIn();	
			}
		};
		if(val.trim().length <= 0)
			titles.parent().parent().fadeIn();
	});
	$('#search, .auto-title').on('focus',function(evt){
		if($(this).val() == $(this).attr('title')){
			$(this).val('');
		}
	});
	$('#search').on('blur',function(evt){
		var val = $(this).val();
		if(val.trim().length <= 0 || val == $(this).attr('title'))
			$('.recipe-title').parent().parent().fadeIn();
		$(this).val($(this).attr('title'));
	});
	$('.auto-title').on('blur',function(evt){
		if(!$(this).val()){
			$(this).val($(this).attr('title'));
		}
	});

	/* Closing of Dialogs if clicked out */
	$('#recipe-display,#format-form').click(function(evt){evt.stopPropagation();});
	$(document).click(function(event) { 
	    if($(event.target).parents().index($('#recipe-display')) == -1) {
	        if($('#recipe-display').is(":visible")) {
	            $('#recipe-display').hide();
	        }
	    }
	    if($(event.target).parents().index($('#format-form')) == -1) {
	        if($('#format-form').is(":visible")) {
	            $('#format-form').hide();
	        }
	    }
	});

	/* Click show generation form */
	$("#show-generation-form").on('click', function(evt){
		$('#format-form').show();
		evt.stopPropagation();
	});

	function makeJSON(){
		/* Construct the JSON and place it in the copying area */
		var templateJSON = { "title" : "", "image" : "", "difficulty" : "", "ingredients" : [], "excerpt" : "", "directions" : [] };
		templateJSON.title = $('#format-form input[name="title"]').val();
		templateJSON.image = $('#format-form input[name="image"').val();
		templateJSON.difficulty = $('#format-form input[name="difficulty"]:checked').val();
		templateJSON.excerpt = $('#format-form input[name="excerpt"]').val();
		templateJSON.ingredients = $('#format-form textarea[name="ingredients"]').val().split("\n");
		templateJSON.directions = $('#format-form textarea[name="instructions"]').val().split("\n");

		var arr = [];
		for (var i = 0; i < templateJSON.ingredients.length; i++) {
			if(templateJSON.ingredients[i].length > 0)
				arr.push({ "name" : templateJSON.ingredients[i]});
		};
		templateJSON.ingredients = arr;

		var arr = [];
		for (var i = 0; i < templateJSON.directions.length; i++) {
			if(templateJSON.directions[i].length > 0)
				arr.push({ "instruction" : templateJSON.directions[i]});
		};
		templateJSON.directions = arr;

		$('#generated-area').val(JSON.stringify(templateJSON));
	}

	$('#format-form form').on('keyup', function(evt){
		makeJSON();
	});
	$('#format-form input[type="radio"]').click(function(evt){
		makeJSON();
	})

	$('#copy-button').click(function(evt){
		copyToClipboard($('#generated-area').val());
		return false;
	});
	function copyToClipboard (text) {
  		window.prompt ("Copy to clipboard: Ctrl+C, Enter", text);
	}

});