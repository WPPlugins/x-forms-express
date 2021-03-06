// JavaScript Document

//Global object for triggering and binding custom events
core_object = {};
_.extend(core_object, Backbone.Events);

function show_iso_details(iso_Id){
	
	var data = 
		{
		action	 				: 'show_iso_details',
		iso_Id					: iso_Id
		};
jQuery('div.header_info').html('Loading ISO Info...');
	jQuery.post
		(
		ajaxurl, data, function(response)
			{
			jQuery('div.header_info').html(response);
			}
		);
}


jQuery(document).ready(
function ()
	{
	
	jQuery('.view_form_entry').live('click',
		function()
			{
			var data = 
				{
				action	 				: 'populate_form_entry',
				form_entry_Id			: jQuery(this).attr('data-id')
				};
			jQuery('#viewFormEntry .modal-body').html('Loading...<span class="fa fa-spin fa-spinner"></span>');
				jQuery.post
					(
					ajaxurl, data, function(response)
						{
						jQuery('#viewFormEntry .modal-body').html(response);
						}
					);
			}
		);
	
	
	jQuery('.choose_nex_form').change(
		function()
			{
			//jQuery('.form_update_id').text(jQuery(this).val())
			
			if(jQuery(this).val()!='')
				jQuery('.do_export').show()
			else
				jQuery('.do_export').hide()
			
			}
		);	
	
	jQuery('.bulk-action').click(
		function(e)
			{
			if(jQuery(this).parent().find('select').val()=='batch-delete')
				{
				jQuery('th.check-column').each(
					function()
						{
						
						if(jQuery(this).find('input[type="checkbox"]').prop('checked')==true)
							{
								delete_record(jQuery(this).find('input[type="checkbox"]').val(),'wap_nex_forms_entries','bulk-action');	
							}
						}
					);
				setTimeout(function()	{ populate_list() },1000);
				}
				
			e.preventDefault();
			}
		);
	
	
/*******************/
/****** Misc *******/
/*******************/
			var cur_width_L = jQuery('div#col-left').width();	
			var cur_width_R = jQuery('div#col-right').width();	
		jQuery('div.hide-form-wrap').toggle(
			function()
				{
					jQuery('div#col-left').animate(
						{
							width:0
						},300,function(){  }
					);
					jQuery('div#col-right').animate(
						{
							width:cur_width_L + cur_width_R
						},300,function(){ }
					);
					
					jQuery(this).html('Show Form&nbsp;&nbsp;&gt;');
					
				},
			function()
				{
					jQuery('div#col-left').animate(
						{
							width:cur_width_L-10
						},300,function(){ }
					);
					jQuery('div#col-right').animate(
						{
							width:cur_width_R
						},300,function(){ }
					);
					
					jQuery(this).html('&lt;&nbsp;&nbsp;Hide Form');
				}
			);
		jQuery('input[type="radio"][name="set_plugin"]').click(
			function()
				{
				jQuery('input[type="hidden"][name="plugin"]').val(jQuery(this).val());
				}
		);
		




	jQuery('.iz-submit').click(
		function()
			{
			jQuery(this).val('      Saving...      ');	
			
			if(jQuery('div#redirect').text()!='')
				{
				document.location.href = "?page=" + jQuery('div#redirect').text() + "&nde_Id=" + jQuery('div#nde_Id').text();	
				}
					
			if(jQuery('input[name="edit_Id"]').val()!='')
				{
				jQuery('.cancel').val('Done');
				jQuery('input[name="edit_status"]').val('done');
				}
			}
		);
	
	jQuery('div.sidebar-name').click
		(
		function()
			{
			jQuery('div.iz-tool-tip').hide();
			}
		);
	
	/*jQuery('#submit').click
		(
		function()
			{
			
			}
		);*/
/*******************/

	
/**************************/
/****** pagination ********/
/**************************/
	var pagination_data = {	
				
				table	 		: jQuery('div#component_table').text(),
				table_headers	: jQuery('input[name="fields"]').val(),
				page	 		: jQuery('input[name="page"]').val(),
				orderby	 		: jQuery('input[name="orderby"]').val(),
				order	 		: jQuery('input[name="order"]').val(),
				current_page	: jQuery('input[name="current_page"]').val(),
				nex_forms_id	: jQuery('.form_update_id').text()		
			}
	
	jQuery('a.iz-next-page').live('click',
		function()
			{
			if((parseInt(pagination_data.current_page)+2) > parseInt(jQuery('span.total-pages').html()))
				 return false;
				 
			pagination_data.current_page ++;
			jQuery('input[name="current_page"]').val(pagination_data.current_page);
			//function populate_list(args,table,page,plugin_alias,additional_params)
			populate_list(pagination_data.table_headers,pagination_data.table,pagination_data.page,'','',pagination_data.nex_forms_id);
			}
		);
	
	jQuery('a.iz-prev-page').live('click',
		function()
			{
			if(parseInt(pagination_data.current_page)<=0)
				 return false;
			
			pagination_data.current_page--;
			jQuery('input[name="current_page"]').val(pagination_data.current_page);
			populate_list(pagination_data.table_headers,pagination_data.table,pagination_data.page,'','',pagination_data.nex_forms_id);
			}
		);
	jQuery('a.iz-first-page').live('click',
		function()
			{
			pagination_data.current_page = 0;
			jQuery('input[name="current_page"]').val(pagination_data.current_page);
			populate_list(pagination_data.table_headers,pagination_data.table,pagination_data.page,'','',pagination_data.nex_forms_id);
			}
		);
		
	jQuery('a.iz-last-page').live('click',
		function()
			{
			pagination_data.current_page = parseInt(jQuery('span.total-pages').html())-1;
			jQuery('input[name="current_page"]').val(pagination_data.current_page);
			populate_list(pagination_data.table_headers,pagination_data.table,pagination_data.page,'','',pagination_data.nex_forms_id);
			}
		);
/*********************************/
	
	
/*********************************/
/****** hide/show-columns ********/
/*********************************/
	
	jQuery('div.table-options div.hide-cols-wrapper input[type="checkbox"]').change(
		function()
			{
			hideSelectedColumns(jQuery(this));			
			}
		);
	
/*********************************/


/*******************************/
/****** Sorting-columns ********/
/*******************************/
	
	jQuery('th a span.sortable-column').click(
		function()
			{
			jQuery('input[name="orderby"]').val(jQuery(this).attr('data-col-name'));
			
			jQuery('th a').removeClass('asc');
			jQuery('th a').removeClass('desc');
			//populate_list(args,table,page,plugin_alias,additional_params)
			populate_list(pagination_data.table_headers,pagination_data.table,pagination_data.page,'','',pagination_data.nex_forms_id);
			
			if(jQuery(this).attr('data-col-order')=='asc')
				{
				jQuery('th.column-'+ jQuery(this).attr('data-col-name') +' a').	removeClass('asc');
				jQuery('th.column-'+ jQuery(this).attr('data-col-name') +' a').	addClass('desc');
				jQuery('th.column-'+ jQuery(this).attr('data-col-name') +' a span.sortable-column').attr('data-col-order','desc');
				}
			else
				{
					
				jQuery('th.column-'+ jQuery(this).attr('data-col-name') +' a').	removeClass('desc');
				jQuery('th.column-'+ jQuery(this).attr('data-col-name') +' a').	addClass('asc');
				jQuery('th.column-'+ jQuery(this).attr('data-col-name') +' a span.sortable-column').attr('data-col-order','asc');
				}
			
			jQuery('input[name="order"]').val(jQuery(this).attr('data-col-order'));
			}
		);
/*********************************/



/************************************/
/****** Default-file uploads ********/
/************************************/
	

	/* Single file uploads */
	
	jQuery('input[type="file"]').live('focus',
		function()
			{
			
			if(jQuery('input[type="file"]').attr('name')!='file')
				{
				if(!jQuery('div#file-holder-'+ jQuery('input[type="file"]').attr('name') ).length > 0)
					jQuery('input[type="file"]').parent().prepend('<div id="file-holder-'+ jQuery('input[type="file"]').attr('name') +'" class="file-holder-'+ jQuery('input[type="file"]').attr('name') +'"></div>');

				//Get files on Edit
				if(jQuery('input[name="edit_Id"]').val()!='')
					{
					var data = 
						{
						action	 	: 'get_files',
						session_Id	: jQuery('input[name="session_Id"]').val(),
						plugin_table: jQuery('div#component_table').text(),
						scope		: 'single'
						};
							
					jQuery.post
						(
						ajaxurl, data, function(response)
							{
							jQuery('div#file-holder-'+ jQuery('input[type="file"]').attr('name') ).html(response);
							if(response)
								jQuery('input[name="'+ jQuery('input[type="file"]').attr('name') +'"]').hide();
							}
						);
					}
				
				
			//Delete image from uploads directory	
			//jQuery('div.remove-file').die();
			jQuery('div.remove-file').live
				(
				'click',function()
					{
						
					jQuery(this).parent().fadeOut(300);
					
					var get_file = false;
					//console.log(jQuery(this).parent().find('a').attr('href'));
					if(jQuery(this).parent().find('img').length>0)
						get_file = jQuery(this).parent().find('img').attr('src').split('/');
					
					if(jQuery(this).parent().find('a').length>0)
						get_file = jQuery(this).parent().find('a').attr('href').split('/');
					
					
					if(!get_file)
						return;
					
					get_file.reverse();
					
					var data = 
						{
						action	 	: 'remove_file',
						file		: get_file[0]
						};
					jQuery('#ajax-temp').remove();
					//jQuery(this).parent().parent().parent().prepend('<form name="upload_file"></form>');

					jQuery('input[name="'+ jQuery('input[type="file"]').attr('name') +'"]').show()
					jQuery('input[name="'+ jQuery('input[type="file"]').attr('name') +'"]').val('');
					//jQuery('form[name="upload_file"]').prepend(jQuery('input[name="'+ jQuery('input[type="file"]' + '"]').attr('name') +'"]').show());	
							
					jQuery.post(ajaxurl, data, function(response){});
					jQuery(this).remove();
					}
				);
			}
		}
	);
	
	
	
		

/************************************/


/*******************************/
/****** Custom triggers ********/
/*******************************/
	/*core_object.bind
		('get_filter_Id',
		function(args)
			{
			get_filter_Id(jQuery('div#edit_Id').text(),jQuery('div#filter_plugin_alias').text(),args['filter_name']);
			}
		);*/
		
	core_object.bind
		('update_list',
		function(args)
			{
			jQuery('.iz-submit').val( (jQuery('input[name="edit_Id"]').val()) ? '       Save       ' : '       Add Item       '  );
			var data = 	
				{
				action	 			: 'build_admin_table_pagination',
				plugin_alias		: jQuery('input[name="plugin_alias"]').val(),
				table	 			: jQuery('form[name="addItem"] input[name="table"]').val() || jQuery('div#filter_plugin_alias').text(),
				table_headers		: jQuery('input[name="fields"]').val(),
				page	 			: jQuery('input[name="page"]').val(),
				orderby	 			: jQuery('input[name="orderby"]').val(),
				order	 			: jQuery('input[name="order"]').val(),
				current_page		: jQuery('input[name="current_page"]').val(),
				additional_params	: jQuery('input[name="additional_params"]').val(),
				nex_forms_id		: jQuery('.form_update_id').text()
				};
				
			
			//jQuery('tbody#the-list').html('<small>Loading...  </small><span class="fa fa-spin fa-spinner"></span></td></tr>');			
			jQuery.post
				(
				ajaxurl, data, function(response)
					{
					jQuery('div.nex-table-nav').html(response);
					
					jQuery('.badge.entry-count').text(jQuery('.displaying-num .entry-count').first().text())
					
					}
				);
			}
		);
		
	/*core_object.bind
		(
		"update_list", function(args)
			{
			jQuery('select[name="parent_Id"]').html('<option>  loading...</option>');
			var data = 	{
				action	 	: 'populate_dropdown',
				plugin_alias: jQuery('input[name="plugin_alias"]').val(),
				table		: jQuery('#component_table').val(),
				ajax	 	: true
				};
				
			jQuery.post(ajaxurl, data, function(response)
					{
					jQuery('select[name="parent_Id"]').html(response);
					jQuery('select[name="parent_Id"] option[value='+jQuery('input[name="selected_Id"]').val() +']').attr('selected',true);
					jQuery('select[name="parent_Id"] option[value='+jQuery('input[name="edit_Id"]').val() +']').remove();
					}
				);	
			}
		);	*/
	
/**********************/

		
/**********************/
/* Core Text Scroller */
/**********************/
	/*if( jQuery('div.iz-scroll').height() < jQuery('div.iz-panel div.scrollable').height() )
		jQuery('div.iz-scroll div.scroll-arrow-bottom').hide();*/
	
	//Bottom arrow
	jQuery('div.iz-scroll div.scroll-arrow-bottom').hover
		(
		function()
			{
			jQuery(this).addClass('sfhover');
			var get_height 	= parseInt(jQuery(this).parent().height(),10);
			var set_speed 	= 15*get_height;
			jQuery(this).parent().animate({marginTop:get_height*(-1)},set_speed);
			},
		function()
			{
			jQuery(this).next('div.scroll-arrow-top').show();
			jQuery(this).removeClass('sfhover');
			jQuery(this).parent().animate().stop(true);
			}
		);
	//Top arrow	
	jQuery('div.iz-scroll div.scroll-arrow-top').hover
		(
		function()
			{
			jQuery(this).addClass('sfhover');	
			var styleAttr 		= jQuery(this).parent().attr('style').split('margin-top:');
			var get_margin_top 	= styleAttr[1].replace('px;','');	
			var get_height 		= parseInt(get_margin_top,10);
			var set_speed 		= 15*get_height;

			jQuery(this).parent().animate
				(
				{marginTop:0},set_speed*(-1),
				function()
					{
					jQuery(this).find('div.scroll-arrow-top').hide();
					}
				);
			},
		function()
			{
			jQuery(this).removeClass('sfhover');		
			jQuery(this).parent().animate().stop(true);
			}
		);
		
		
/**********************/
	}
);


function refreshHiddenColumns() {
	jQuery('div.table-options div.hide-cols-wrapper input[type="checkbox"]:not(:checked)').each(
		function() 
			{
			hideSelectedColumns(jQuery(this));
			}
	);
}	

function hideSelectedColumns(checkbox) {
	
	var index	= checkbox.val();
		if(checkbox.attr('checked')!='checked')
			{
			jQuery('table.resiable-columns tr').each(
				function()
					{
					jQuery(this).children('td:eq('+index+')').hide();
					jQuery('div#iz_col_resize_id'+(parseInt(index)+2)).hide();
					jQuery('table.resiable-columns thead tr th:eq('+(parseInt(index)+1)+')').hide();
					jQuery('table.resiable-columns tfoot tr th:eq('+(parseInt(index)+1)+')').hide();
					
					}
				);
			}
		else
			{
			jQuery('table.resiable-columns tr').each(
				function()
					{
					jQuery(this).children('td:eq('+index+')').show();
					jQuery('div#iz_col_resize_id'+(parseInt(index)+2)).show();
					jQuery('table.resiable-columns thead tr th:eq('+(parseInt(index)+1)+')').show();
					jQuery('table.resiable-columns tfoot tr th:eq('+(parseInt(index)+1)+')').show();
					
					}
				);
			}
}


function populate_list(args,table,page,plugin_alias,additional_params,nex_forms_id){
	/*
	action	 			: 'populate',
		args	 			: args,
		page	 			: page,
		table				: table,
		orderby				: orderby,
		order				: order,
		current_page 		: current_page,
		additional_params	: additional_params
	*/
	
	var data = 	
		{
		plugin_alias		: (jQuery('input[name="plugin_alias"]').val()) ? jQuery('input[name="plugin_alias"]').val() : plugin_alias,
		action	 			: 'populate',
		table	 			: (jQuery('form[name="addItem"] input[name="table"]').val()) ? jQuery('form[name="addItem"] input[name="table"]').val() : table,
		args				: (jQuery('input[name="fields"]').val()) || jQuery('input[name="table_headers"]').val() || args,
		page	 			: (jQuery('input[name="page"]').val()) ? jQuery('input[name="page"]').val() : page,
		order	 			: jQuery('input[name="order"]').val(),
		orderby	 			: jQuery('input[name="orderby"]').val(),
		current_page		: jQuery('input[name="current_page"]').val(),
		additional_params	: (jQuery('input[name="additional_params"]').val()) ? jQuery('input[name="additional_params"]').val() : additional_params,
		nex_forms_id		: jQuery('.form_update_id').text()
		//args				: (jQuery('input[name="table_headers"]').val()) ? jQuery('input[name="table_headers"]').val() : args
		};
	jQuery('tbody#the-list').html('<tr><td></td><td colspan="2">Loading...<span class="fa fa-spin fa-spinner"></span></td></tr>');			
	jQuery.post
		(
		ajaxurl, data, function(response)
			{
			jQuery('tbody#the-list').html(response);
			//core_object.trigger("update_list");
			refreshHiddenColumns();
			//Reset form on insert or update
			
			
			
		
			if(jQuery('input[name="edit_Id"]').val()=='' || jQuery('input[name="edit_status"]').val()=='done')
				{
				reset_form();
				}
			}
		);
	
	var data = 	
				{
				action	 			: 'build_admin_table_pagination',
				plugin_alias		: jQuery('input[name="plugin_alias"]').val(),
				table	 			: jQuery('form[name="addItem"] input[name="table"]').val() || jQuery('div#filter_plugin_alias').text(),
				table_headers		: jQuery('input[name="fields"]').val(),
				page	 			: jQuery('input[name="page"]').val(),
				orderby	 			: jQuery('input[name="orderby"]').val(),
				order	 			: jQuery('input[name="order"]').val(),
				current_page		: jQuery('input[name="current_page"]').val(),
				additional_params	: jQuery('input[name="additional_params"]').val(),
				nex_forms_id		: jQuery('.form_update_id').text()
				};
				
			
			//jQuery('tbody#the-list').html('<small>Loading...  </small><span class="fa fa-spin fa-spinner"></span></td></tr>');			
			jQuery.post
				(
				ajaxurl, data, function(response)
					{
					jQuery('div.nex-table-nav').html(response);
					jQuery('.badge.entry-count').text(jQuery('.displaying-num .entry-count').first().text())
					}
				);
	
}
function reset_form(){
	var frm_elements = document.addItem.elements;
	
	jQuery("html, body").animate(
							{
								scrollTop:0
							},700
						)
		
	//reset default upload		
	jQuery('div.image-holder').html('');
	jQuery('div.header_info').html('');
	jQuery('#ajax-temp').remove();
	jQuery('input[name="'+ jQuery('input[type="file"]').attr('name') +'"]').show()
	jQuery('input[name="'+ jQuery('input[type="file"]').attr('name') +'"]').val('');
	
	//reset action
	jQuery('input[name="action"]').val('do_insert');
	jQuery('input[name="edit_status"]').val('done')
	//reset editing mode
	jQuery('input[name="edit_Id"]').val('');
	jQuery('div#edit_Id').text('');
	
	//reset button text
	jQuery('.iz-submit').val('       Add Item       ');
	
	//reset heading
	jQuery('div.form-wrap h3').text('Add Item');
					
			
				for (i = 0; i < frm_elements.length; i++)
					{
						field_type = frm_elements[i].type.toLowerCase();
						switch (field_type)
						{
						case "text":
						case "password":
						case "textarea":
						
							frm_elements[i].value = "";
							break;
						case "radio":
						case "checkbox":
							if (frm_elements[i].checked)
							{
							frm_elements[i].checked = false;
							}
							break;
						case "select-one":
						case "select-multi":
							frm_elements[i].selectedIndex = 0;
							break;
						default:
							break;
						}
					}
				
				var reset_session_id = Math.floor((Math.random()*99999999999)+1);
				jQuery('input[name="session_Id"]').val(reset_session_id);
}
	
function delete_record(Id,table,method){
	
	var get_color = jQuery('tr#tag-'+Id).css('background-color');
	jQuery('tr#tag-'+Id).css('background-color','#FFEBE8');
	
	if(method=='bulk-action')
		{
			var data = 	
			{
			action	 	: 'delete_record',
			Id	 		: Id,
			table		: table
			};

		jQuery.post
			(
			ajaxurl, data, function(response)
				{ 
				core_object.trigger("update_list"); 
				
				jQuery('tr#tag-'+Id).remove();
				
				jQuery('#ajax-response').html(response);
				if(jQuery('input[name="edit_Id"]').val()!='')
					reset_form();
					
				
				}
			);
		}
	else
		{
		if(confirm('Are your sure you want to permanently delete this record?'))
			{
			jQuery('tr#tag-'+Id).fadeOut('slow', function()
				{
				jQuery('tr#tag-'+Id).remove();	
				}
			);
			
			var data = 	
				{
				action	 	: 'delete_record',
				Id	 		: Id,
				table		: table
				};
	
			jQuery.post
				(
				ajaxurl, data, function(response)
					{ 
					core_object.trigger("update_list"); 
					
					jQuery('#ajax-response').html(response);
					if(jQuery('input[name="edit_Id"]').val()!='')
						reset_form();
					}
				);
			}
		else
			{
			jQuery('tr#tag-'+Id).css('background-color',get_color);
			}
		}
}



function duplicate_record(Id,table){
	
		var data = 	
			{
			action	 	: 'duplicate_record',
			Id	 		: Id,
			table		: table,
			page		: jQuery('input[name="page"]').val()
			};

		jQuery.post
			(
			ajaxurl, data, function(response)
				{
				populate_list(); 
				core_object.trigger("update_list"); 
				
				jQuery('#ajax-response').html(response);
				//if(jQuery('input[name="edit_Id"]').val()!='')
					reset_form();
				}
			);

}


function print_msg(type,msg){
	jQuery('.iz-ajax-response').html('test');	
}

function showHide(obj,child,level,max_level,origen){
	
	if(jQuery(obj).hasClass('expanded'))
		{
		jQuery(obj).removeClass('expanded')
		}
	else
		{
		jQuery(obj).addClass('expanded');
		}
		
	if(jQuery('.'+child+'-'+level).hasClass('show'))
		{
		for(i=level;i<max_level;i++)
			{
			jQuery('.'+origen+'-level-'+i).removeClass('show');
			jQuery('.'+origen+'-level-'+i).removeClass('expanded');
			jQuery('.'+origen+'-level-'+i).hide();
			}
		}
	else
		{
		jQuery('.'+child+'-'+level).show();
		jQuery('.'+child+'-'+level).addClass('show');
		}
}

function show_iz_tooltip(obj,text){
	
  	var obj_pos	= jQuery(obj).offset();
	if(!obj_pos)
		return false;
	
	if(jQuery('div.iz-tool-tip').length<1)
		jQuery('body').prepend('<div class="iz-tool-tip"><p></p><div class="arrow"></div></div>');
	
	jQuery('div.iz-tool-tip').css('position','absolute');
	jQuery('div.iz-tool-tip p').html(text);
	jQuery('div.iz-tool-tip').css('left',(obj_pos.left+jQuery(obj).outerWidth())-jQuery('div.iz-tool-tip').outerWidth());
	jQuery('div.iz-tool-tip').css('top',obj_pos.top-jQuery('div.iz-tool-tip').outerHeight()-jQuery('div.iz-tool-tip div.arrow').outerHeight());
	jQuery('div.iz-tool-tip').fadeIn(300);

	var t = setTimeout ('hide_iz_tooltip()',3000);
	
	jQuery('div.iz-tool-tip').hover
		(
		function()
			{
			clearTimeout(t);
			},
		function()
			{
			t = setTimeout ('hide_iz_tooltip()',500);
			}
		)
}

function hide_iz_tooltip(){
	jQuery('div.iz-tool-tip').fadeOut('fast');
}

/*function get_filter_Id(Id,plugin_table,module_name){

	var data = 	
		{
		action	 		: 'get_filter_Id',
		Id				: Id,
		plugin_table	: plugin_table,
		module_name		: module_name
		};
		
	jQuery('select[name="'+module_name+'_Id"] option[value="0"]').ready
		(
		function () 
			{ 
			jQuery.post
				(ajaxurl, data, function(response)
					{
					if(response){
						jQuery('select[name="'+module_name+'_Id"] option[value='+response+']').attr('selected',true);
						jQuery('select[name="'+module_name+'_Id"]').trigger('change');
						}
					}
				); 
			}
		);
}*/


function $m(theVar){
	return document.getElementById(theVar)
}

function addEvent(obj, evType, fn){
	if(obj.addEventListener)
	    obj.addEventListener(evType, fn, true)
	if(obj.attachEvent)
	    obj.attachEvent("on"+evType, fn)
}

function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function IsValidEmail(email){
	var filter = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
	return filter.test(email);
}

function allowedChars(input_value){
	var aChars = '1234567890-+() ';
	for(i=0;i<input_value.length;i++)
		{
		if(aChars.indexOf(input_value.charAt(i)) != -1)
			num = true;
		else
			num = false; break;
		}
	return num;

}

function show_dynamic_form_errors(text,display,error){

	if(error==1)
		{
		jQuery(display).html(text);
		jQuery(display).fadeIn(300).fadeOut(300).fadeIn(300).fadeOut(300).fadeIn(300).fadeOut(300).fadeIn(300);
		}
	else
		{
		jQuery(display).html('');
		jQuery(display).hide('');
		}
}


//Called on successfull saved response
function stamp_succesfull_save(obj){
	
    var theStamp = jQuery('div.saved_stamp');
    
    if(theStamp.length <= 0) {
      jQuery('body').prepend('<div class="saved_stamp"> </div>'); //@TODO: Include the stylesheet with the stamp's properties
    }
    
	var obj_pos			= jQuery(obj).offset();
	var obj_center 		= jQuery(obj).outerWidth()/2;
	var stamp_center 	= theStamp.outerWidth()/2;
	var obj_v_center 	= jQuery(obj).outerHeight()/2;
	var stamp_v_center 	= theStamp.outerHeight()/2;
	
	theStamp.css('left',(obj_pos.left+jQuery(obj).outerWidth())-obj_center-stamp_center);
	theStamp.css('top',obj_pos.top+jQuery(obj).outerHeight()-obj_v_center-stamp_v_center);
	theStamp.fadeIn(300);
	
	var t=setTimeout('fade_saved_stamp()',2000);
}
function fade_saved_stamp(){
	jQuery('div.saved_stamp').fadeOut('slow');	
}

/****************************************************/