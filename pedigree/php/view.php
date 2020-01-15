<style>
  button.btn-success {
    margin: 0 10px;
  }

  div.container h2 {
    font-size: 22px;
  }

  @media (max-width: 580px) {
    button.btn-success {
      margin: 5px 0px;
      width: 93vw;
    }
  }
</style>
<br>
<div class="container view">
</div>
<br><br>

<script>
  function viewDialog(ringData2) {
    var a_string = '';
    ringData = findDic(ringData2);
    console.log(ringData);

    viewString = `
  <h1 style="text-align:center;color: #00897B;">${ringData['ring']}</h1>
  <div style="text-align:center" id="img_holder">
    </div>
  <br><div style="font-size:28px">Name: ${ringData['name']}</div>

`;
    $('.view.container').html(viewString);
    for (key in ringData) {
      if (ringData[key] != null && ringData[key] != "") {

        if (key == 'country') {
          $('.container').append(`<h2>Country: ${ringData[key]}</h2>`);
        } else if (key == 'sex') {
          $('.container').append(`<h2>Sex: ${ringData[key]}</h2>`);

        } else if (key == 'description') {
          $('.container').append(`<h2>Description: ${ringData[key]}</h2>`);
        } else if (key == 'performance') {
          $('.container').append(`<h2>Performance: ${ringData[key]}</h2>`);
        } else if (key == 'owner') {
          $('.container').append(`<h2>Owner: ${ringData[key]}</h2>`);
        } else if (key == 'owner_add_1') {
          $('.container').append(`<h2>Owner Address - 1 : ${ringData[key]}</h2>`);

        } else if (key == 'owner_add_2') {
          $('.container').append(`<h2>Owner Address - 2 : ${ringData[key]}</h2>`);

        } else if (key == 'color') {
          $('.container').append(`<h2>Color: ${ringData[key]}</h2>`);
        } else if (key == 'father') {
          $('.container').append(`<h2>Father: ${ringData[key]}</h2>`);
        } else if (key == 'mother') {
          $('.container').append(`<h2>Mother: ${ringData[key]}</h2>`);
        } else if (key == 'file') {
          $('.container').append(`<h2><a style="color: #2f2fd8;" href="../uploads/${ringData['file']}"> PEDIGREE File</a></h2>`);
        } else if (key == 'p_image') {
          $('#img_holder').append(`<img class="mt-3" style="height: 210px; " src="../uploads/${ringData['p_image']}" alt="&nbsp;No Primage Image Available">`);
        } else if (key == 'a_image') {
          parsed_a_image = JSON.parse(ringData[key]);
          a_string = '<br><h2><i>Additional Images</i></h2><br>';
          for (im in parsed_a_image) {
            a_string += `<img class="" style="height: 110px;float:left;margin:0 11px; " src="../uploads/${parsed_a_image[im]}" >`;
          }
        }
      }
    }
    $('.container').append(a_string);
  }
</script>