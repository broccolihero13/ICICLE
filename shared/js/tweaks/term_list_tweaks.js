$(document).ready(function(){
  // Add canvas term id below SIS ID
  $('tr.term').each(function(idx,term){
    term = $(term);
    var term_id = term.attr('id').split('_')[1];
    //console.log(term_id);
    term.find('div.show_term>div>span.sis_source_id').after('<br/>ID: '+term_id);
  });
});
