function pedigree(row) {
    returnStatement = "";
    ringSet = createDic(row['ring']);
    console.log(ringSet);
    $('#dialog_wrapper>div').html('<div id="base_level" style="word-wrap: break-word;width:200px;"></div>')
    $('#dialog_wrapper>div').append('<img src="../resources/image_1.png" style="margin-top: 10%;margin: auto 0;height: 50vh;margin-left: -10px;"><div id="level_1" style="width:200px;"></div>')
    $('#dialog_wrapper>div').append('<img src="../resources/image_2.png" style="float: left;margin: auto 0;height: 68vh;margin-left: -10px;margin-right: -10px;"><div id="level_2" style="width:200px;"></div>')


    for (key in findDic(ringSet['ring'])) {
        //console.log(key, findDic(ringSet['ring'])[key]);
        if ((key != 'id' && key != 'a_image' && key != 'created_date' && key != 'file') && (findDic(ringSet['ring'])[key] != null && findDic(ringSet['ring'])[key] != undefined && findDic(ringSet['ring'])[key] != "")) {
            if (key == 'sex') {
                returnStatement += '<span style="color:red;" >' + findDic(ringSet['ring'])[key] + '</span>';
            } else if (key == 'father') {
                returnStatement += 'father: ' + findDic(ringSet['ring'])[key] + '<br>';
            } else if (key == 'mother') {
                returnStatement += 'mother: ' + findDic(ringSet['ring'])[key] + '<br>';
            } else if (key == 'ring') {
                returnStatement += `<br><h4>${ringSet['ring']}</h4>`;
            } else if (key == 'file') {
                returnStatement += `<a href="../uploads/${findDic(ringSet['ring'])['file']}">Pedigree File</a>`;
            } else if (key == 'a_image') {
                returnStatement += '<span style="font-size:12px">';
                for (a in JSON.parse(findDic(ringSet['ring'])['a_image'])) {
                    returnStatement += `<a href="../uploads/${JSON.parse(findDic(ringSet['ring'])['a_image'])[a]}">Add_Image_${parseInt(a) + 1},</a>`;
                }
                returnStatement += '</span><br>';
            } else if (key == 'name') {
                returnStatement += '<span style="color:#512DA8;font-size: 20px;" >Name: ' + findDic(ringSet['ring'])[key] + '</span>';
            } else if (key == 'breeder') {
                returnStatement += '<span style="color:#28a745;" >' + findDic(ringSet['ring'])[key] + '</span>';
            } else if (key == 'p_image') {
                returnStatement = `<img style="width: 120px;" src="../uploads/${findDic(ringSet['ring'])['p_image']}" >` + returnStatement;
            } else if (1) {
                returnStatement += findDic(ringSet['ring'])[key] + '<br>';
            }
        }
    }
    returnStatement += `<br><button style="margin-top: 15px;width: 92px;" id="getpdf" data-html2canvas-ignore="true" onclick="createPDF()" class="btn btn-info">Get PDF</button>`;
    $('#base_level').append(`${returnStatement}`)
    returnStatement = "";

    if (ringSet['father']) {
        for (key in findDic(ringSet['father']['ring'])) {
            //console.log(key, findDic(ringSet['father']['ring'])[key]);
            if ((key != 'id' && key != 'country' && key != 'description' && key != 'a_image' && key != 'owner_add_1' && key != 'owner_add_2' && key != 'created_date' && key != 'performance' && key != 'file' && key != 'color' && key != 'owner') && (findDic(ringSet['father']['ring'])[key] != null && findDic(ringSet['father']['ring'])[key] != undefined && findDic(ringSet['father']['ring'])[key] != "")) {
                if (key == 'sex') {
                    returnStatement += '<span style="color:red;" >' + findDic(ringSet['father']['ring'])[key] + '</span>';
                } else if (key == 'father') {
                    returnStatement += 'father: ' + findDic(ringSet['father']['ring'])[key] + '<br>';
                } else if (key == 'mother') {
                    returnStatement += 'mother: ' + findDic(ringSet['father']['ring'])[key] + '<br>';
                } else if (key == 'ring') {
                    returnStatement += `<h4>${ringSet['father']['ring']}</h4>`;
                } else if (key == 'file') {
                    returnStatement += `<a href="../uploads/${findDic(ringSet['father']['ring'])['file']}">Pedigree File</a><br>`;
                } else if (key == 'p_image') {
                    returnStatement = `<img style="width: 120px;margin:5px;" src="../uploads/${findDic(ringSet['father']['ring'])['p_image']}" >` + returnStatement;
                } else if (key == 'name') {
                    returnStatement += '<span style="color:#512DA8;font-size: 17px;" >Name: ' + findDic(ringSet['father']['ring'])[key] + '</span>';
                } else if (key == 'breeder') {
                    returnStatement += '<span style="color:#28a745;" >' + findDic(ringSet['father']['ring'])[key] + '</span>';
                } else if (1) {
                    returnStatement += findDic(ringSet['father']['ring'])[key] + '<br>';
                }
            }
        }
        $('#level_1').append(`<div style="height:50%;overflow: hidden;">${returnStatement}</div>`)
        returnStatement = "";
    } else {
        $('#level_1').append(`<div style="height:50%;">`)
    }

    if (ringSet['mother']) {
        for (key in findDic(ringSet['mother']['ring'])) {
            //console.log(key, findDic(ringSet['mother']['ring'])[key]);
            if ((key != 'id' && key != 'country' && key != 'description' && key != 'a_image' && key != 'owner_add_1' && key != 'owner_add_2' && key != 'created_date' && key != 'performance' && key != 'file' && key != 'color' && key != 'owner') && (findDic(ringSet['mother']['ring'])[key] != null && findDic(ringSet['mother']['ring'])[key] != undefined && findDic(ringSet['mother']['ring'])[key] != "")) {
                if (key == 'sex') {
                    returnStatement += '<span style="color:red;" >' + findDic(ringSet['mother']['ring'])[key] + '</span>';
                } else if (key == 'father') {
                    returnStatement += 'father: ' + findDic(ringSet['father']['ring'])[key] + '<br>';
                } else if (key == 'mother') {
                    returnStatement += 'mother: ' + findDic(ringSet['mother']['ring'])[key] + '<br>';
                } else if (key == 'ring') {
                    returnStatement += `<h4>${ringSet['mother']['ring']}</h4>`;
                } else if (key == 'file') {
                    returnStatement += `<a href="../uploads/${findDic(ringSet['mother']['ring'])['file']}">Pedigree File</a><br>`;
                } else if (key == 'p_image') {
                    returnStatement = `<img style="width: 120px;margin:5px;" src="../uploads/${findDic(ringSet['mother']['ring'])['p_image']}" >` + returnStatement;
                } else if (key == 'name') {
                    returnStatement += '<span style="color:#512DA8;font-size: 17px;" >Name: ' + findDic(ringSet['mother']['ring'])[key] + '</span>';
                } else if (key == 'breeder') {
                    returnStatement += '<span style="color:#28a745;" >' + findDic(ringSet['mother']['ring'])[key] + '</span>';
                } else if (1) {
                    returnStatement += findDic(ringSet['mother']['ring'])[key] + '<br>';
                }
            }
        }
        $('#level_1').append(`<div style="height:50%;overflow: hidden;">${returnStatement}</div>`)
        returnStatement = "";
    } else {
        $('#level_1').append(`<div style="height:50%;">`)
    }

    if (ringSet['father']['father']) {
        for (key in findDic(ringSet['father']['father']['ring'])) {
            //console.log(key, findDic(ringSet['father']['father']['ring'])[key]);
            if ((key != 'id' && key != 'p_image' && key != 'father' && key != 'mother' && key != 'country' && key != 'owner_add_1' && key != 'owner_add_2' && key != 'description' && key != 'a_image' && key != 'created_date' && key != 'file') && (findDic(ringSet['father']['father']['ring'])[key] != null && findDic(ringSet['father']['father']['ring'])[key] != undefined && findDic(ringSet['father']['father']['ring'])[key] != "")) {
                if (key == 'sex') {
                    returnStatement += '<span style="color:red;" >' + findDic(ringSet['father']['father']['ring'])[key] + '</span>';
                } else if (key == 'ring') {
                    returnStatement += `<br><h5>${ringSet['father']['father']['ring']}</h5>`;
                } else if (key == 'name') {
                    returnStatement += '<span style="color:#512DA8;font-size: 17px;" >Name: ' + findDic(ringSet['father']['father']['ring'])[key] + '</span>';
                } else if (key == 'breeder') {
                    returnStatement += '<span style="color:#28a745;" >' + findDic(ringSet['father']['father']['ring'])[key] + '</span>';
                } else if (1) {
                    returnStatement += findDic(ringSet['father']['father']['ring'])[key] + '<br>';
                }
            }
        }
        $('#level_2').append(`<div style="height:25%;overflow: hidden;">${returnStatement}</div>`)
        returnStatement = "";
    } else {
        $('#level_2').append(`<div style="height:25%;">`);
    }

    if (ringSet['father']['mother']) {
        for (key in findDic(ringSet['father']['mother']['ring'])) {
            //console.log(key, findDic(ringSet['father']['mother']['ring'])[key]);
            if ((key != 'id' && key != 'p_image' && key != 'father' && key != 'mother' && key != 'country' && key != 'owner_add_1' && key != 'owner_add_2' && key != 'description' && key != 'a_image' && key != 'created_date' && key != 'file') && (findDic(ringSet['father']['mother']['ring'])[key] != null && findDic(ringSet['father']['mother']['ring'])[key] != undefined && findDic(ringSet['father']['mother']['ring'])[key] != "")) {
                if (key == 'sex') {
                    returnStatement += '<span style="color:red;" >' + findDic(ringSet['father']['mother']['ring'])[key] + '</span>';
                } else if (key == 'ring') {
                    returnStatement += `<br><h5>${ringSet['father']['mother']['ring']}</h5>`;
                } else if (key == 'name') {
                    returnStatement += '<span style="color:#512DA8;font-size: 17px;" >Name: ' + findDic(ringSet['father']['mother']['ring'])[key] + '</span>';
                } else if (key == 'breeder') {
                    returnStatement += '<span style="color:#28a745;" >' + findDic(ringSet['father']['mother']['ring'])[key] + '</span>';
                } else if (1) {
                    returnStatement += findDic(ringSet['father']['mother']['ring'])[key] + '<br>';
                }
            }
        }
        $('#level_2').append(`<div style="height:25%;overflow: hidden;">${returnStatement}</div>`)
        returnStatement = "";
    } else {
        $('#level_2').append(`<div style="height:25%;">`);
    }

    if (ringSet['mother']['father']) {
        for (key in findDic(ringSet['mother']['father']['ring'])) {
            //console.log(key, findDic(ringSet['mother']['father']['ring'])[key]);
            if ((key != 'id' && key != 'p_image' && key != 'father' && key != 'mother' && key != 'country' && key != 'owner_add_1' && key != 'owner_add_2' && key != 'description' && key != 'a_image' && key != 'created_date' && key != 'file') && (findDic(ringSet['mother']['father']['ring'])[key] != null && findDic(ringSet['mother']['father']['ring'])[key] != undefined && findDic(ringSet['mother']['father']['ring'])[key] != "")) {
                if (key == 'sex') {
                    returnStatement += '<span style="color:red;" >' + findDic(ringSet['mother']['father']['ring'])[key] + '</span>';
                } else if (key == 'ring') {
                    returnStatement += `<br><h5>${ringSet['mother']['father']['ring']}</h5>`;
                } else if (key == 'name') {
                    returnStatement += '<span style="color:#512DA8;font-size: 17px;" >Name: ' + findDic(ringSet['mother']['father']['ring'])[key] + '</span>';
                } else if (key == 'breeder') {
                    returnStatement += '<span style="color:#28a745;" >' + findDic(ringSet['mother']['father']['ring'])[key] + '</span>';
                } else if (1) {
                    returnStatement += findDic(ringSet['mother']['father']['ring'])[key] + '<br>';
                }
            }
        }
        $('#level_2').append(`<div style="height:25%;overflow: hidden;">${returnStatement}</div>`)
        returnStatement = "";
    } else {
        $('#level_2').append(`<div style="height:25%;">`);
    }

    if (ringSet['mother']['mother']) {
        for (key in findDic(ringSet['mother']['mother']['ring'])) {
            //console.log(key, findDic(ringSet['mother']['mother']['ring'])[key]);
            if ((key != 'id' && key != 'p_image' && key != 'father' && key != 'mother' && key != 'country' && key != 'owner_add_1' && key != 'owner_add_2' && key != 'description' && key != 'a_image' && key != 'created_date' && key != 'file') && (findDic(ringSet['mother']['mother']['ring'])[key] != null && findDic(ringSet['mother']['mother']['ring'])[key] != undefined && findDic(ringSet['mother']['mother']['ring'])[key] != "")) {
                if (key == 'sex') {
                    returnStatement += '<span style="color:red;" >' + findDic(ringSet['mother']['mother']['ring'])[key] + '</span>';
                } else if (key == 'ring') {
                    returnStatement += `<br><h5>${ringSet['mother']['mother']['ring']}</h5>`;
                } else if (key == 'name') {
                    returnStatement += '<span style="color:#512DA8;font-size: 17px;" >Name: ' + findDic(ringSet['mother']['mother']['ring'])[key] + '</span>';
                } else if (key == 'breeder') {
                    returnStatement += '<span style="color:#28a745;" >' + findDic(ringSet['mother']['mother']['ring'])[key] + '</span>';
                } else if (1) {
                    returnStatement += findDic(ringSet['mother']['mother']['ring'])[key] + '<br>';
                }
            }
        }
        $('#level_2').append(`<div style="height:25%;overflow: hidden;">${returnStatement}</div>`);
        returnStatement = "";
    } else {
        $('#level_2').append(`<div style="height:25%;">`);
    }

}
