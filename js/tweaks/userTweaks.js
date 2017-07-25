$(document).ready(function(){
  if (window.location.pathname.indexOf('users') > -1) {
    let str;
    let sis_import_id;
    let userOnPage = window.location.pathname.split('/users/')[1];
    let url = `https://${window.location.hostname}/api/v1/users/${userOnPage}`;
    $.getJSON(url, (data, response) => {
      sis_import_id = data.sis_import_id;
      console.log(sis_import_id);
      if(sis_import_id!=null){
        str = '<tr class="remoteAdminTool"><th>Debug Info</th><td>Last Modified by SIS Import <a href="/api/v1/accounts/self/sis_imports/'+sis_import_id+'"target="_new">'+ sis_import_id+'</a></td></tr>';
      }else{
        str = '<tr class="remoteAdminTool"><th>Debug Info</th><td>Not Modified by SIS Import</td></tr>';
      }
      $('#name_and_email>table>tbody>tr:last').before(str);
    });

  }
});
