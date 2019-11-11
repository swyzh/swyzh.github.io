var useRandomOrgApi = false;
var a_random = new Alea();

// 获取0-1之间的实数
function getRandom(useRandomOrg) {
  var randReal = 0;
  if (useRandomOrg) {
    var randInteger = 0;
    var randMax = 999999999;
    $.ajax({
      type: "GET",
      url: "https://www.random.org/integers/?num=1&min=0&max=999999999&col=1&base=10&format=plain&rnd=new",
      dataType: "text",
      async: false,
      success: function(data, textStatus) {
        randInteger = parseInt(data);
      }
    });
    randReal = randInteger / randMax;
  } else {
    randReal = a_random();//Math.random();
  }
  return randReal;
}

function summonFromPool(upcards, nmcards, type) {
  var card = new Object();
  card.type = type;
  card.id = null;

  rand = getRandom(useRandomOrgApi);

  var counter = 0;
  for (var i = 0; i < upcards.length; i++) {
    var upcard_info = upcards[i];
    counter += upcard_info.rate;
    if (rand < counter) {
      card.id = upcard_info.id;
      break;
    }
  }

  if (card.id == null) {
    card.id = nmcards[Math.floor(getRandom(useRandomOrgApi) * nmcards.length)];
  }

  return card;
}

function currentYPerh() {
  console.log(window.badCounter);
  if (window.badCounter <= 50) {
    return 0.02;
  }
  if (window.badCounter <= 60) {
    return 0.02 + 0.02 * (window.badCounter - 50);
  }
  if (window.badCounter <= 70) {
    return 0.22 + 0.03 * (window.badCounter - 60);
  }
  if (window.badCounter <= 80) {
    return 0.52 + 0.05 * (window.badCounter - 70);
  }
  return 1;
}

function summon(pool) {
  var rand = getRandom(useRandomOrgApi);
  var card = new Object();
  console.log(rand);
  console.log(currentYPerh());
  if (rand <= currentYPerh()) {
    // yu hero 2%
    var upcards = pool.hero_y_up;
    var nmcards = pool.hero_y;
    card = summonFromPool(upcards, nmcards, "y");
    window.badCounter = 0;
    window.noZCounter = 0;
    return card;
  }

  window.badCounter += 1;
  rand = getRandom(useRandomOrgApi);
  if (rand <= 12 / 98) {
    // zhen hero 2%
    var upcards = pool.hero_z_up;
    var nmcards = pool.hero_z;
    card = summonFromPool(upcards, nmcards, "z");
    window.noZCounter = 0;
    return card;
  }

  window.noZCounter += 1;
  if (rand <= (12 + 45) / 98) {
    // shang hero 45%
    var upcards = pool.hero_s_up;
    var nmcards = pool.hero_s;
    card = summonFromPool(upcards, nmcards, "s");
    return card;
  }
  // liang hero 41%
  var upcards = pool.hero_l_up;
  var nmcards = pool.hero_l;
  card = summonFromPool(upcards, nmcards, "l");
  return card;
}

// 抽取保底珍
function summmonGolden(pool) {
  window.badCounter += 1;
  var upcards = pool.hero_z_up;
  var nmcards = pool.hero_z;
  card = summonFromPool(upcards, nmcards, "z");
  window.noZCounter = 0;
  return card;
}

function statRankOfCards(cards, rank) {
  var counter = 0;
  for (var i = 0; i < cards.length; i++) {
    var card = cards[i];
    if (card.rank == rank) {
      counter++;
    }
  }
  return counter;
}

function badLuck(cards) {
  for (var i = 0; i < cards.length; i++) {
    var card = cards[i];
    if (card.type == "z" || card.type == "y") {
      return false;
    }
  }
  return true;
}

function shuffle(cards) {
  cards.sort(function(a, b) {
    code = {
      "y": 1,
      "z": 2,
      "s": 3,
      "l": 4
    };
    al = code[a.type[0]];
    bl = code[b.type[0]];
    return bl - al;
  });
  //return cards;
  var shuffled = new Array();
  for (i=0;i < cards.length;i+=2) {
    shuffled.push(cards[i]);
  }
  var ll = cards.length - 1;
  if(cards.length % 2) ll -= 1;
  for (i=ll;i >= 0;i-=2) {
    shuffled.push(cards[i]);
  }
  return shuffled;

  while (cards.length > 0) {
    var index = parseInt(Math.random() * cards.length);
    shuffled.push(cards[index]);
    cards.splice(index, 1);
  }
  return shuffled;
}

function summon10combo(pool) {
  var cards = new Array();

  for (var i = 0; i < 10; i++) {
    if (window.noZCounter < 9) {
      var card = summon(pool);
      cards.push(card);
    } else {
      var card = summmonGolden(pool);
      cards.push(card);
    }
  }

  // 如果前9张卡全是良尚，第10张从珍卡池中抽
  /*
  if (badLuck(cards)) {
    var card = summmonGolden(pool);
    cards.push(card);
  } else {
    var card = summon(pool);
    cards.push(card);
  }
  //*/
  return shuffle(cards);
}

//获取鼠标坐标
function mousePosition(ev) {
  ev = ev || window.event;
  if (ev.pageX || ev.pageY) {
    return {
      x: ev.pageX,
      y: ev.pageY
    };
  }
  return {
    x: ev.clientX + document.body.scrollLeft - document.body.clientLeft,
    y: ev.clientY + document.body.scrollTop - document.body.clientTop
  };
}
