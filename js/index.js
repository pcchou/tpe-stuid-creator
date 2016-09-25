data = {
  'white_logo': true,
  'name': "我的朋友",
  'student_number': "88888888",
  'school_name': "今天是個美好的一天",
  'school_address': "平安喜樂",
  'school_phone': "(02)8888-8888",
  'school_type': "hs"
};

$("#photo_file").on("change", imageUpload);
$("#logo_file").on("change", imageUpload);
$(":text").on("input", function(){
  data[$(this).attr('id')] = $(this).val();
  drawCard(data);
})
$('#white_logo').on('change', function() {
  data['white_logo'] = !data['white_logo'];
  drawCard(data);
});
$('input[name="school_type"]').on('change', function() {
  data['school_type'] = $('input[name="school_type"]:checked')[0].id;
  drawCard(data);
});
$('#download').on('click', function() {
  var dt = canvas.toDataURL('image/png').replace(/^data:image\/[^;]/, 'data:application/octet-stream');
  this.href = dt;
  this.download = 'card.png'
});

drawCard(data);

function drawCard(property) {
  canvas = $("#card")[0];
  canvas.width = 716; canvas.height = 452;
  var context = canvas.getContext('2d');
  context.rect(0, 0, canvas.width, canvas.height);
  var color_choices = {"hs": 'rgba(142, 217, 181, 1)', "jhs": 'rgba(174, 215, 248, 1)', "es": 'rgba(248, 206, 166, 1)'}
https://s.codepen.io/pcchou/debug/qaAmYN
  // add linear gradient
  var y_end = canvas.height / 2 * 0.33;
  var y_start = canvas.height - y_end;
  var grd = context.createLinearGradient(0, y_start, canvas.width, y_end);
  grd.addColorStop(0.05, color_choices[property['school_type']]);
  grd.addColorStop(0.65, 'rgba(255, 255, 255, 1)');
  context.fillStyle = grd;
  context.fill();

  // initialize
  var lcenter = 0.22;
  var rcenter = 0.711;

  // photo
  var photo_width = 0.285;
  photo = $("#photo")[0];
  photo.onload = function() {
    context.drawImage(photo, 0, 0, photo.width, photo.height, (lcenter - photo_width / 2) * canvas.width, 0.0855 * canvas.height, photo_width * canvas.width, 0.581 * canvas.height);
  };
  photo.onload();

  // name & number
  context.fillStyle = "black";
  context.textAlign = "center";
  drawText(canvas, property['name'], 60, 3, 1, lcenter, 0.78);
  drawText(canvas, property['student_number'], 50, 3, 1, lcenter, 0.87);

  // school logo
  var logo_width = 0.308;
  logo = $("#logo")[0];
  logo.onload = function() {
    context.fillStyle = 'white';
    if (property['white_logo']) context.fillRect((rcenter - logo_width / 2) * canvas.width, 0.102 * canvas.height - 4, logo_width * canvas.width, 0.424 * canvas.height + 4); // we love flattened JPGs on gradient background, yay!
    context.drawImage(logo, (rcenter - logo_width / 2) * canvas.width, 0.102 * canvas.height, logo_width * canvas.width, 0.424 * canvas.height);
  };
  logo.onload();

  // school name & address + phone
  context.fillStyle = "black";
  context.textAlign = "center";
  var school_name_b = property['school_name'].split('');
  var school_name_a = school_name_b.splice(0, property['school_name'].length > 9 ? (property['school_name'].length - 10) / 2 + 4 : property['school_name'].length / 2);
  drawText(canvas, school_name_a.join(''), 52, 3, 1, 0.711, 0.629);
  drawText(canvas, school_name_b.join(''), 52, 3, 1, 0.711, 0.717);
  context.textAlign = "left";
  drawText(canvas, "地址：" + property['school_address'], 26, 3, 1, (0.711 - 0.55 / 2), 0.902);
  drawText(canvas, "電話：" + property['school_phone'], 26, 3, 1, (0.711 - 0.55 / 2), 0.949);

  // barcode
  JsBarcode("#barcode", property['student_number'], {
    format: "code39",
    height: 0.116 * canvas.height - 16,
    width: (0.55 * canvas.width - 20) / 160,
    displayValue: false
  });
  var barcode = $("#barcode")[0];
  barcode.onload = function() {
    context.drawImage(barcode, 4, 4, barcode.width, barcode.height - 11, (0.711 - 0.55 / 2) * canvas.width, 0.75 * canvas.height, 0.55 * canvas.width, 0.113 * canvas.height);
  };
}

function imageUpload() {
  if ($("#photo_file")[0].files[0]) {
    var preader = new FileReader();
    preader.onload = function(event) {
      photo.src = event.target.result;
    }
    preader.readAsDataURL($("#photo_file")[0].files[0]);
  }
  if ($("#logo_file")[0].files[0]) {
    var lreader = new FileReader();
    lreader.onload = function(event) {
      logo.src = event.target.result;
    }
    lreader.readAsDataURL($("#logo_file")[0].files[0]);
  }
  drawCard(data);
}

function drawText(canvas, text, size, weight, spacing, pc_x, pc_y) {
  // much hacks, long live the canvas!
  var context = canvas.getContext('2d');
  context.font = (canvas.width * size) / 1024 + "px 標楷體";
  if (spacing == 2) {
    text = text.split("").join(String.fromCharCode(8201));
  } else if (spacing) {
    text = text.split("").join(String.fromCharCode(8202));
  }
  for (i = 0; i < weight; i++) {
    context.fillText(text, pc_x * canvas.width, pc_y * canvas.height);
  }
}