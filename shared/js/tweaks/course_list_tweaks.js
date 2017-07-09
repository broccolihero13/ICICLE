$(document).ready(function() {

  function add_courselist_tweaks() {
    //if([[],undefined,null].indexOf($('#current_context_code')) < 0){
    if ($('#current_context_code').length > 0) {
      console.log('doing it', $('#current_context_code'));
      $.getJSON('/api/v1/accounts/' + $('#current_context_code').text().split('_')[1], function(_data) {
        //console.log(_data);
        if (_data.sis_account_id !== undefined) {
          $('#content>h1:not(.screenreader-only)').first().after('<p class="account-sis-id"><small>SIS ID: ' + _data.sis_account_id + '</small></p>');
        }
      });
    }
    $('div.course>div.info>span.links').each(function(_idx, _item) {
      var course_id = $(_item).find('a:first-child').attr('href').split('/')[2];
      $(_item).append(" | <a href='/courses/" + course_id + "/analytics'>Analytics</a>");
      $(_item).append(" | <a href='/courses/" + course_id + "/users'>People</a>");
      $(_item).append(" | <a href='/courses/" + course_id + "/confirm_action?event=delete'>Delete</a>");
    });
  }
  chrome.storage.sync.get({
    enable_courselist_tweaks: true,
  }, function(items) {
    if (items.enable_courselist_tweaks === true) {
      add_courselist_tweaks();
    }
  });

});
