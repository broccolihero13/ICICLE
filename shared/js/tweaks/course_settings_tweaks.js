$(document).ready(function() {
    /*
     * Add "Last Modified by SIS Import" Information
     *
     */
    var course_sis_source_id = $('#course_sis_source_id').val();
    if (course_sis_source_id !== '') {
        /*
         * Do API request to get course information
         */
        $.get('/api/v1/courses/sis_course_id:' + encodeURI(course_sis_source_id))
            .done(function(data) {
                console.log('sis_import_id:', data.sis_import_id);
                if (data.sis_import_id !== null) {
                    $('#tab-details>h2:first').after("<em>Course Affected by SIS Import <a href='/api/v1/accounts/self/sis_imports/" + data.sis_import_id + "'>" + data.sis_import_id + "</a></em>");

                    console.log(data);
                }
            });
    }
});
