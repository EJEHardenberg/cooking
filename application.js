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
	$('#search').val($('#search').attr('title'));
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
	$('#search').on('focus',function(evt){
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

	/* Closing of Dialogs if clicked out */
	$('#recipe-display').click(function(evt){evt.stopPropagation();});
	$(document).click(function(event) { 
	    if($(event.target).parents().index($('#recipe-display')) == -1) {
	        if($('#recipe-display').is(":visible")) {
	            $('#recipe-display').hide()
	            
	        }
	    }        
	});

});