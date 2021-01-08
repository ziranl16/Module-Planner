
$(document).ready(function () {
    add_button();
    display_cap();
    display_su();
});


$(window).bind('hashchange', function() {
    add_button();
    display_cap();
    display_su();
}); // listen for hashchange using jQuery

// window.onhashchange = function() { 
//     //code  
//     add_button();
//     display_cap();
// }
// added a slight delay to make sure data is updated
$("*").click(function() {
    setTimeout(function () {
        refresh_cap();
        refresh_su();
    }, 50)
});


// var su_alert_flag = true;


function cal_cap() {

    let mods_taken_raw = JSON.parse(localStorage.getItem('persist:planner'));
    let all_mods_info_raw = JSON.parse(localStorage.getItem('persist:moduleBank'));
    let modcodes_array = get_modcodes_array(mods_taken_raw);
    console.log(modcodes_array);

    // setTimeout(function () {
    //     update_YSL_data(modcodes_array);
    // }, 50)
    update_YSL_data(modcodes_array);

    if (localStorage.getItem('YSL:data') === null) {
        return "0.00";
    }

    try {
        let mods_taken_grade = JSON.parse(localStorage.getItem('YSL:data'));
        let mods_taken_info_cap = get_mods_taken_info(modcodes_array, all_mods_info_raw, mods_taken_grade);

        console.log(mods_taken_info_cap);

        let cap = calculate_cap(mods_taken_info_cap);
        return cap;
    } catch(err) {
        // this catch block may be reduandant
        console.log(err);
        if (err instanceof TypeError) {
           console.log('possible reason: no grades have been entered yet');
        }
        return "0.00";
    }
}

// this function removes modules info in YSL:data when they were removed on the planner
function update_YSL_data(modcodes_array) {
    let mod_data = localStorage.getItem('YSL:data');
    if (mod_data === null ) {
        console.log("ysl does not exist")
        return null;
    } else if (modcodes_array.length == 0) {
        localStorage.removeItem('YSL:data');
        return null;
    } else if (mod_data == {}) {
        console.log("ysl == {} , empty")
        return null;
    }

    let mods_taken_grade = JSON.parse(localStorage.getItem('YSL:data'));
    let new_mods_taken_grade = {};
    
    for(let i = 0; i<modcodes_array.length; i++) {
        let mod_code = modcodes_array[i];
        // console.log("upadte ysl, mod code:" + mod_code);
        // console.log(mods_taken_grade);
        // console.log("upadte ysl, mod code 3:" + mods_taken_grade);
        // console.log("upadte ysl, mod code 2 :" + mods_taken_grade[mod_code]);
        new_mods_taken_grade[mod_code] = mods_taken_grade[mod_code];
    }
    console.log("update_ysl_data"+ new_mods_taken_grade);
    if (new_mods_taken_grade == {}) {
        console.log("Error in updating YSL data! have modules:" + modcodes_array + "but data not present in YSL data");
    } else {
        localStorage.setItem('YSL:data', JSON.stringify(new_mods_taken_grade));
    }
}



function get_modcodes_array(mods_taken_raw) {
    let res = [];
    let mods_taken = JSON.parse(mods_taken_raw['modules']);
    for (let key in mods_taken) {
        
        let mod_code = mods_taken[key]['moduleCode'];
        res.push(mod_code);
        
    }
    return res;
}


function get_mods_taken_info(modcodes_array, all_mods_info_raw, mods_taken_grade) {
    let res = {};
    let all_mods_info = JSON.parse(all_mods_info_raw['modules']);
    for (let i = 0; i < modcodes_array.length; i++) {
        let mod_code = modcodes_array[i];
        let mc, grade, su;
        if (all_mods_info.hasOwnProperty(mod_code)) {
            mc = parseInt(all_mods_info[mod_code]['moduleCredit']);
        } else {
            console.log('Error: CAP calculator, no MC info for' + mod_code);
            mc = 0;
        }
        if (mods_taken_grade.hasOwnProperty(mod_code)) {
            grade = mods_taken_grade[mod_code]['grade'];
            if (grade === "") {
                grade = 'NA';
            }
            su = mods_taken_grade[mod_code]['su'];
        } else {
            grade = 'NA';
            su = false;
        }
        res[mod_code] = {
            mc, 
            grade,
            su
        }
    }
    return res;
}



function add_button() {

    
    var $calculate = $('<button class="btn btn-svg btn-outline-primary" style="margin-left:8px" type="button"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-calculator" viewBox="0 0 18 16"><path d="M12 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h8zM4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H4z"/><path d="M4 2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5v-2zm0 4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm3-6a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm3-6a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-4z"/></svg>  Calculate</button>');
                //        <button class="btn btn-svg btn-outline-primary" type="button">      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg> Settings</button>
    
    var $space = $('<div class="divider"/>');
    $space.appendTo($(".main-content > div > header > div"));
    $calculate.appendTo($(".main-content > div > header > div"));
    $calculate.click(cal_cap);

}

function display_cap() {
    let capstring = cal_cap();
    var $cap_box = $(`<p class="cap_value" style="margin-right:8px" > CAP:  ${capstring} </p>`);
    $cap_box.prependTo($(".main-content > div > header > div"));
}

function refresh_cap() {
    let capstring = cal_cap();
    console.log("refresh cap, new cap:" + capstring);
    $(".main-content > div > header > div > p.cap_value").replaceWith(`<p class="cap_value" style="margin-right:8px"> CAP:  ${capstring} </p>`);
}

// function refresh_cap() {
//     let capstring = cal_cap();
//     var $cap_box = $(`<p class="VcguI5co"> CAP:  ${capstring} </p>`);
//     $cap_box.prependTo($(".main-content > div > header > div"));
// }

// calculate the cap of the semester
function calculate_cap(courses) {
    var LOOKUP = {'A+':5.0, 'A':5.0, 'A-':4.5, 'B+':4.0, 'B':3.5, 'B-':3.0, 'C+':2.5, 'C': 2.0, 'D+':1.5, 'D':1.0, 'F': 0};
    // var check =  ["A+", "A", 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'D+', 'D', 'F', 'S', 'U', 'CS', 'CU'];
    var total_mc = 0;
    var total_grade_sum = 0;

    for (const course in courses) {
        // console.log(course + " su:  " + courses[course]['su']);
    //   if (!check.includes(courses[course]['grade'])) {
    //       throw new Error("Invalid grade");
    //   }

      if (courses[course]['su'] === true || courses[course]['grade'] === "CS" || courses[course]['grade'] === "NA") {
          continue;
      } else {
        var point = LOOKUP[courses[course]['grade']];
        var mc = courses[course]['mc'];
        total_mc += mc;
        total_grade_sum += point * mc;
        // console.log("totalmc : " + total_mc);
        // console.log("total grade : " + total_grade_sum);
      }
    }

    var cap = 0.0; // cap is 0.0 by default

    if (total_mc === 0 || total_grade_sum === 0) {
        cap = 0.0;
    } else {
        cap = total_grade_sum / total_mc;
    }

    // console.log("cap:" + cap);
    return cap.toFixed(2);
}



// the followings functions involve the SUs


function cal_su() {
    let mods_taken_raw = JSON.parse(localStorage.getItem('persist:planner'));
    let all_mods_info_raw = JSON.parse(localStorage.getItem('persist:moduleBank'));
     

    if (localStorage.getItem('YSL:data') === null) {
        return "32";
    }

    
    try {
        let mods_taken_grade = JSON.parse(localStorage.getItem('YSL:data'));
        let modcodes_array = get_modcodes_array(mods_taken_raw);
        console.log(modcodes_array); 
        let mods_taken_info_cap = get_mods_taken_info(modcodes_array, all_mods_info_raw, mods_taken_grade);
        console.log(mods_taken_info_cap);
        let su = calculate_remaining_su(mods_taken_info_cap);
        return su;

    } catch(err) {
        // if (su_alert_flag === true) {
        //     su_alert_flag = false;
        //     alert(err);
        // }
        console.log(err);
        return "32";
    }
}



function display_su() {
    let sustring = "";
    try {
        
        sustring = cal_su();
        console.log("debug: " + sustring);
    } catch(err) {
        
    }
    var su_box = $(`<div class="su_value H46mXU_C _1coqwKmZ" id="su-float" style="position:fixed;bottom:5px;right:5px;padding:5px 10px;">Remaining SUs: ${sustring}</div>`);
    su_box.appendTo($(".main-container"));
}


function refresh_su() {
    let sustring = cal_su();
    console.log("refresh SU, new SU:" + sustring);
    $("#su-float").text(`Remaining SUs:  ${sustring}`);
}

// calculate the remaining sus
function calculate_remaining_su(courses) {
    var su = 8; // sus are 32 by default

    for (const course in courses) {
        if (courses[course]['su'] === true) {
            su -= courses[course]['mc'];
        }
    }

    if (su <= 0) {
        setSu(true);
        throw new Error("You have overused your SUs");
    } else {
        setSu(false);
    }

    return su;
}


function setSu(cannotSU) {
    localStorage.setItem('YSL:cannotSU', cannotSU);
}

