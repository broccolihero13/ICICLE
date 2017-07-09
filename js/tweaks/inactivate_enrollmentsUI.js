//---------inactivate or conclude enrollments en mass for user in Canvas----------
//Global Variables
$(document).ready(function() {
  function unenroll_successful(data) {
    $('#placeToAppendEnrollments').append("<p>enrollment: " + data.id + " was successfully changed to: " + data.enrollment_state + "</p>");
    $('input.btn[type="submit"]').remove();
  }

  function unenroll_error(data) {
    $('#placeToAppendEnrollments').append("<p>" + data + "</p>");
    $('input.btn[type="submit"]').remove();
  }
  //onElementRendered function is used to ensure the element is in the DOM
  function onElementRendered(selector, cb, _attempts) {
    var el = $(selector);
    _attempts = ++_attempts || 1;
    if (el.length) return cb(el);
    if (_attempts == 60) return;
    setTimeout(function() {
      onElementRendered(selector, cb, _attempts);
    }, 250);
  }

  if (window.location.pathname.indexOf("users") > -1) {
    var user_canvas_id = $('table[data-user-id]').data('user-id');
    var enrollment_host = "https://" + window.location.hostname + "/api/v1/users/" + user_canvas_id + "/enrollments";
    var enrollments_for_user = [];
    var enrollment_state;

    //submit function for processing all enrollments as inactive
    onElementRendered('#enrollmentsForUser', function(e) {
      $('#enrollmentsForUser').submit(function(e) {
        e.preventDefault();
        var getCourses = $('#enrollmentsForUser input[type="checkbox"]:checked');
        if ($('#enrollmentsForUser select').val() == "1") {
          enrollment_state = 'conclude';
        } else {
          enrollment_state = 'inactivate';
        }
        for (var i = 0; i < getCourses.length; i++) {
          var enrollment_id = getCourses[i].getAttribute("enrollment_id");
          $.ajax({
            url: "https://" + window.location.hostname + "/api/v1/courses/" + getCourses[i].value + "/enrollments/" + enrollment_id,
            method: "DELETE",
            contentType: "application/json",
            data: JSON.stringify({
              "task": enrollment_state,
              "authenticity_token": $('input[name="authenticity_token"]').val()
            }),
            success: unenroll_successful,
            error: unenroll_error
          });
        }
        $('#placeToAppendEnrollments').text(' ');
      });
    });

    /*UI Changes for mass inactivate/conclude utility in Canvas*/



    //Initial API Get Call to populate
    onElementRendered('fieldset#courses', function(e) {
      $('fieldset#courses').prepend('<div class="remoteAdminTool"><button class="btn" id="massEnrollmentChange">Remote Tool - Mass Change Enrollments</button></div><div id="enrollmentOptions" class="remoteAdminTool" style="display:none;"><form id="enrollmentsForUser"><span>Which action would you like to perform: </span><select><option value="0">Deactivate</option><option value="1">Conclude</option></select><br/><p id="placeToAppendEnrollments">Which enrollments would you like to be processed?<br/></p><input class="btn" type="submit" value="Process"></form></div>');
      $('#massEnrollmentChange').on('click', function() {
        $('#enrollmentOptions').toggle();
      });
      if (enrollment_host) {
        $.getJSON(enrollment_host, function(data, response) {
          enrollments_for_user.push(data);
          if (enrollments_for_user[0].length > 0) {
            for (var i = 0; i < enrollments_for_user[0].length; i++) {
              var successCourseID = enrollments_for_user[0][i].course_id;
              var successEnrollmentID = enrollments_for_user[0][i].id;
              var getName = "Course (Canvas ID - name): " + successCourseID + " - " + $('a[href^="/courses/' + successCourseID + '/users/"] span.name').text().trim();

              $('#placeToAppendEnrollments').append('<p> ', $('<input>', {
                type: "checkbox",
                checked: true,
                value: successCourseID,
                enrollment_id: successEnrollmentID
              }), getName + '</p>');
            }
          } else {
            $('#placeToAppendEnrollments').text("Sorry this user has no active enrollments!");
            $('form#enrollmentsForUser input[type="submit"], form#enrollmentsForUser select, form#enrollmentsForUser span').remove();
          }
        });
      }
    });
  }
  //--------------------------------End utility-------------------------------------
});
