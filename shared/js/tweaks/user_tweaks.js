$(document).ready(function() {
  // Add user search to the users page
  $('#right-side-wrapper').append('<div class="remoteAdminTool"><h2 id="user_name_label">Find A User</h2><div class="rs-margin-bottom"><form id="new_user" class="ic-Form-control account_search_form" action="/accounts/1/users" accept-charset="UTF-8" method="get"><input name="utf8" type="hidden" value="✓">      <div class="ic-Input-group"><input name="focus" type="hidden" value="user_name"><input class="ic-Input" type="text" id="user_name" name="user[name]" value="" aria-labelledby="user_name_label"><button class="Button">Go</button></div></form>  </div></div>');

});
