var form_el_tpl = '<form class="form-horizontal config">'+
  '<h3>{category}</h3>'+
  '{options}'+
  '</form>';

var option_tpl = '<div class="form-group">'+
  '  <label for="{id}" class="col-sm-4 control-label">{label}</label>'+
  '  <div class="col-sm-8">'+
  '    <input type="checkbox" class="form-control" id="{id}" {checked}>'+
  '  </div>'+
  '</div>';

function key_list(){
  var master_list = {}
  $.each(options_defaults,function(idx,category){
    $.each(category.options,function(id,option){
      var new_key = idx+':::'+id;
      master_list[new_key] = option.value;
    });
  });
  return master_list;
}
// Saves options to chrome.storage
function save_options(e) {
    var option_set = { };
    var two_part = e.target.id.split(':::');
    option_set[e.target.id] = options_defaults[two_part[0]].options[two_part[1]].value = $(e.target).is(':checked')
    $('#saving_changes').show();
    chrome.storage.sync.set(option_set, function() {
        // Update status to let user know options were saved.
        $('#saving_changes').hide();
        var status = $('#status');
        status.textContent = 'Options saved...';
        setTimeout(function() {
            status.textContent = '';
        }, 2000);
    });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  var q = $.Deferred();
  // Use default value color = 'red' and likesColor = true.
  var flat_options_list = key_list();

  chrome.storage.sync.get(flat_options_list, function(options) {
    $.each(options,function(idx,option){
        var two_part = idx.split(':::');
        options_defaults[two_part[0]].options[two_part[1]].value = option;
    });
    q.resolve();
  });
  return q;
}

function load_log(){ }



function build_ui(){
  $('#formholder').html('');
  $.each(options_defaults,function(idx,category){
    // TODO Build the tab, folder, or whatever it is for the category
    var tmpl = form_el_tpl.replace(/{category}/g,category.category);
    var option_rows = []; 
    $.each(category.options,function(key,option){
      var tmpl_row = option_tpl
        .replace(/{id}/g,category.category+':::'+option.id)
        .replace(/{label}/g,option.label==''?option.id:option.label)
        .replace(/{checked}/g,option.value?'checked':'');
      // Build the checkbox and label, setting the default value
      option_rows.push(tmpl_row);
    });
    tmpl = tmpl.replace(/{options}/g,option_rows.join('\n'));
    $('#formholder').append(tmpl);
  });
  $('input').change(save_options);
}

$(document).ready(function(){
  restore_options(options_defaults)
    .done(build_ui);
  //build_ui();
  $('#load_log').click(load_log);
});
