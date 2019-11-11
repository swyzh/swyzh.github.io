function appendToHistory(card, imgsrc) {
  var selector = "#hero_" + card.type + "_list";
  var content = "<img class=\"padimage\" src='" + imgsrc + "' />";
  $(selector).append(content);
}

function drawOnce(card) {
  var c = $("canvas#cards-canvas")[0];
  var ctx = c.getContext("2d");
  ctx.drawImage(imgBg, 0, 0);

  var img = new Image();
  var type = card.type;
  img.src = "img/head/" + card.id + ".png";

  img.onload = function() {
    ctx.drawImage(img, 450, 220);
  };

  appendToHistory(card, img.src);
}

function drawCombo(card, x, y) {
  var c = $("canvas#cards-canvas")[0];
  var ctx = c.getContext("2d");
  // var imgBg = $('img#background')[0];
  ctx.drawImage(imgBg, 0, 0);

  var img = new Image();
  img.src = "img/head/" + card.id + ".png";

  img.onload = function() {
    ctx.drawImage(img, 80 + x * 142, 140 + y * 172);
  };

  appendToHistory(card, img.src);
}
