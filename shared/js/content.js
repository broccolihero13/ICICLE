/*jshint esversion:6*/
$.ajaxSetup({
  dataFilter: function(data, type) {
    var prefixes = ['//', 'while(1);', 'while(true);', 'for(;;);'],
      i,
      l,
      pos;

    if (type != 'json' && type != 'jsonp') {
      return data;
    }

    for (i = 0, l = prefixes.length; i < l; i++) {
      pos = data.indexOf(prefixes[i]);
      if (pos === 0) {
        return data.substring(prefixes[i].length);
      }
    }

    return data;
  }
});
Date.prototype.addDays = function(days) {
  var dat = new Date(this.valueOf());
  dat.setDate(dat.getDate() + days);
  return dat;
};
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(request, sender, sendResponse);
    console.log(sender.tab ?
      "from a content script:" + sender.tab.url :
      "from the extension");
    switch (request.req) {
      //if (request.req == "get_token"){
      case 'redirect':
        window.location = request.href;
        break;
      case 'create__admin':
        createAdminUser(request, sendResponse);
        break;
      case 'showRAT':
        showRAT();
        break;
      case 'getGradeReport':
        startReport((id) => {
          checkReportStatus(id);
        });
        break;
    }
    return true; // This is needed to allow for asynchronous responses via sendResponse
  });

$(document).ready(function() {
  if ($('input[name=authenticity_token]').length > 0) {
    local_authenticity_token = $($('input[name=authenticity_token]')[0]).val();
  }
  local_page_view_id = $('#page_view_id').text();
});


/**
 * Create a user using the api and set that user as an admin in the account
 *
 */
var setUserAsAdmin = function(user, callback) {
  console.log('setting admin user');
  $.ajax({
    url: '/api/v1/accounts/self/admins',
    type: 'post',
    dataType: 'json',
    data: {
      authenticity_token: local_authenticity_token,
      user_id: user.id,
      send_confirmation: false
    }
  }).done(function() {
    console.log('set admin user done ');
    callback(user);
  });
};

var createAdminUser = function(data, callback) {
  // TODO This should check for a user first, and not create if found
  console.log(data);
  $.getJSON('/api/v1/users/sis_login_id:' + data.username + '/profile?dummy=' + new Date().getTime(), function(user_info_fetched) {
      setUserAsAdmin(user_info_fetched, callback);
    })
    .error(function(err_res) {

      $.ajax({
          url: '/api/v1/accounts/self/users',
          type: 'post',
          dataType: 'json',
          data: {
            authenticity_token: local_authenticity_token,
            //page_view_id:document.getElementById('page_view_id').innerText,
            user: {
              name: data.name,
            },
            pseudonym: {
              unique_id: data.username,
              password: data.password,
              send_confirmation: false
            }
          }
        })
        .done(function(user_info) {
          setUserAsAdmin(user_info, callback);
        })
        .error(function(err_res) {
          console.log('there was a problem creating the user', err_res);
        });
    });
};

var showRAT = function() {
  $('.remoteAdminTool').hide();
};

let onElementRendered = function(selector, cb, _attempts) {
  var el = $(selector);
  _attempts = ++_attempts || 1;
  if (el.length) return cb(el);
  if (_attempts == 60) return;
  setTimeout(function() {
    ret_obj.onElementRendered(selector, cb, _attempts);
  }, 250);
};

let startReport = (cb) => {
  $.ajax({
    url: `https://${window.location.hostname}/api/v1/accounts/self/reports/grade_export_csv`,
    type: `POST`,
    data: {
      authenticity_token: local_authenticity_token
    },
    success: function(data) {
      console.log(`Report Started`);
      cb(data.id);
    },
    error: function(err) {
      alert(`Error!: ${err}`);
    }
  });
};
let checkReportStatus = (id) => {
  $.getJSON(`https://${window.location.hostname}/api/v1/accounts/self/reports/grade_export_csv/${id}`).then(function(data) {
    if (data.progress == 100) {
      // $('#main').prepend(`<div><a href="${data.file_url}">Click to Download Grade Report</a></div>`);
      window.open(`${data.file_url}`, '_blank');
    } else {
      console.log(`Report is not ready yet...\n don't leave extension page`);
      setTimeout(function() {
        checkReportStatus(id);
      }, 2000);
    }
  });
};
