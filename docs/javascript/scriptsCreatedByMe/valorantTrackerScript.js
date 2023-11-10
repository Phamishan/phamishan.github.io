async function searchForPlayer() {
  const input = document.getElementById("requestedPlayer").value;

  const playerNameAndTag = input.split("#");
  let playerName = playerNameAndTag[0];
  let playerTag = playerNameAndTag[1];

  const responseForPlayerInfo = await fetch(`https://api.henrikdev.xyz/valorant/v1/account/'${playerName}'/'${playerTag}`);
  const resForPlayerInfo = await responseForPlayerInfo.json();

  const responseForRank = await fetch(`https://api.henrikdev.xyz/valorant/v1/mmr/eu/${playerName}/${playerTag}`);
  const resForRank = await responseForRank.json();

  if (resForPlayerInfo.status === 200) {
    document.getElementById("row").remove();
    const container = document.getElementById("container");
    const row = document.createElement("div");
    row.className = "row";
    row.id = "row";
    container.appendChild(row);
    const col = document.createElement("div");
    col.className = "col d-flex justify-content-center mb-3 w-100";
    row.appendChild(col);

    const card = document.createElement("div");
    card.className = "card";
    col.appendChild(card);

    const img = document.createElement("img");
    img.className = "card-img-top";
    img.alt = "VALORANT BANNER";
    img.src = resForPlayerInfo.data.card.wide;
    card.appendChild(img);

    const cardBody = document.createElement("div");
    cardBody.className = "card-body";
    card.appendChild(cardBody);

    const cardTitle = document.createElement("h5");
    cardTitle.className = "card-title";
    cardTitle.innerHTML = `${resForPlayerInfo.data.name}#${resForPlayerInfo.data.tag}`;
    cardBody.appendChild(cardTitle);

    const rowForCols = document.createElement("div");
    rowForCols.className = "row";
    cardBody.appendChild(rowForCols);

    const colLeft = document.createElement("div");
    colLeft.className = "col-6";
    rowForCols.appendChild(colLeft);

    const colRight = document.createElement("div");
    colRight.className = "col-6";
    rowForCols.appendChild(colRight);

    const cardTextRight = document.createElement("p");
    cardTextRight.className = "card-text";
    cardTextRight.innerHTML = `<b>Account level:</b> ${resForPlayerInfo.data.account_level}`;
    colRight.appendChild(cardTextRight);

    const cardTextLeft = document.createElement("p");
    cardTextLeft.className = "card-text";
    cardTextLeft.innerHTML = "<b>Rank:</b> " + `${resForRank.data.currenttierpatched} - ${resForRank.data.ranking_in_tier} RR`;
    colLeft.appendChild(cardTextLeft);

    const cardTitleRankImage = document.createElement("img");
    cardTitleRankImage.className = "position-absolute top-0 end-0";
    cardTitleRankImage.src = resForRank.data.images.small;
    cardTextRight.appendChild(cardTitleRankImage);

    const modalForMatches = document.createElement("button");
    modalForMatches.className = "btn btn-primary matchesButton";
    modalForMatches.type = "button";
    modalForMatches.innerHTML = "Matches";
    colLeft.appendChild(modalForMatches);

    const el = document.querySelector(".matchesButton");

    if (el) {
      el.dataset.bsTarget = "#example-modal-5";
      el.dataset.bsToggle = "modal";
    }

    document.getElementById("modal-title-2").innerHTML = `${resForPlayerInfo.data.name}#${resForPlayerInfo.data.tag}'s matches`;
    document.getElementById("trackerggBtn").href = `https://tracker.gg/valorant/profile/riot/${resForPlayerInfo.data.name}%23${resForPlayerInfo.data.tag}`;
    document.getElementById("trackerggBtn").target = "_blank";

    const responseForMatches = await fetch(`https://api.henrikdev.xyz/valorant/v3/by-puuid/matches/eu/${resForPlayerInfo.data.puuid}`);
    const resForMatches = await responseForMatches.json();

    const table = document.getElementById("table");
    document.getElementById("tbody").remove();
    const tbody = document.createElement("tbody");
    tbody.id = "tbody";
    table.appendChild(tbody);

    for (let i = 0; i < resForMatches.data.length; i++) {
      const tr = document.createElement("tr");
      tbody.appendChild(tr);

      const td1 = document.createElement("td");
      td1.scope = "row";
      td1.innerHTML = resForMatches.data[i].metadata.game_start_patched;
      tr.appendChild(td1);

      const td2 = document.createElement("td");
      td2.innerHTML = resForMatches.data[i].metadata.mode;
      tr.appendChild(td2);

      const td3 = document.createElement("td");
      td3.innerHTML = resForMatches.data[i].metadata.map;
      tr.appendChild(td3);

      for (let j = 0; j < resForMatches.data[i].players.all_players.length; j++) {
        if (resForMatches.data[i].players.all_players[j].puuid == resForPlayerInfo.data.puuid) {
          const td4 = document.createElement("td");
          td4.innerHTML = resForMatches.data[i].players.all_players[j].character;
          tr.appendChild(td4);

          const td5 = document.createElement("td");
          td5.className = "text-end";

          console.log(resForMatches.data[i].players.all_players[j].team);

          if (resForMatches.data[i].players.all_players[j].team == "Blue" && resForMatches.data[i].teams.blue.has_won == false) {
            td5.innerHTML = `${resForMatches.data[i].teams.blue.rounds_won} - ${resForMatches.data[i].teams.blue.rounds_lost}&#128557`;
            tr.appendChild(td5);
          }

          if (resForMatches.data[i].players.all_players[j].team == "Red" && resForMatches.data[i].teams.red.has_won == false) {
            td5.innerHTML = `${resForMatches.data[i].teams.red.rounds_won} - ${resForMatches.data[i].teams.red.rounds_lost}&#128557`;
            tr.appendChild(td5);
          }

          if (resForMatches.data[i].players.all_players[j].team == "Blue" && resForMatches.data[i].teams.blue.has_won == true) {
            td5.innerHTML = `${resForMatches.data[i].teams.blue.rounds_won} - ${resForMatches.data[i].teams.blue.rounds_lost}&#x2705;`;
            tr.appendChild(td5);
          }

          if (resForMatches.data[i].players.all_players[j].team == "Red" && resForMatches.data[i].teams.red.has_won == true) {
            td5.innerHTML = `${resForMatches.data[i].teams.red.rounds_won} - ${resForMatches.data[i].teams.red.rounds_lost}&#x2705;`;
            tr.appendChild(td5);
          }
        }
      }
    }

    console.log(resForMatches);
  } else {
    document.getElementById("row").remove();
    const container = document.getElementById("container");
    const row = document.createElement("div");
    row.className = "row";
    row.id = "row";
    container.appendChild(row);
    const col = document.createElement("div");
    col.className = "col d-flex justify-content-center mb-3 w-100";
    row.appendChild(col);

    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = resForPlayerInfo.errors[0].message;
    col.appendChild(card);
  }
}

function checkForInput() {
  if (document.getElementById("requestedPlayer").value === "") {
    document.getElementById("searchBtn").disabled = true;
  } else {
    document.getElementById("searchBtn").disabled = false;
  }
}
