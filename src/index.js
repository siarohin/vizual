function rsschool() {
  fetch('./src/db/sessions.json')
    .then(response => response.json())
    .then((data) => {
      const title = [];
      for (let i = 0; i < data.puzzles.length; i += 1) {
        title.push(data.puzzles[i].name);
      }

      let innerTitle = '';
      for (let i = 0; i < title.length; i += 1) {
        innerTitle += `<th class="taskName" scope="row">${title[i]}</th>`;
      }

      document.querySelector('thead').innerHTML = `
    <tr class = "table-baseline table-baseline__rss">
      <th scope="row">UserName</th>
      ${innerTitle}
      <th scope="row">Time</th>
      <th scope="row">Comparison</th>
    </tr>
    `;

      // create users and points
      const user = { };
      for (let j = 0; j < data.puzzles.length; j += 1) {
        for (let i = 0; i < Object.keys(data.rounds[j].solutions).length; i += 1) {
          const keys = Object.keys(data.rounds[j].solutions);
          const id = keys[i];
          let points = Number(data.rounds[j].solutions[keys[i]].time.$numberLong);
          const solution = data.rounds[j].solutions[keys[i]].code || 'none';
          const ifCorrect = data.rounds[j].solutions[keys[i]].correct;
          if (ifCorrect !== 'Correct' || Number(points) > 150) points = 150;
          user[id] = user[id] || [];
          user[id].push({ points, solution: solution.replace(/"/g, '') });
          // user[id].push(solution);
        }
      }

      // numberOfUsers
      const numberOfUser = Object.keys(user).length;

      // summOfPoints
      for (let i = 0; i < numberOfUser; i += 1) {
        const keys = Object.keys(user);
        const id = keys[i];
        while (user[id].length < data.puzzles.length) {
          user[id].push({ points: 150, solution: 'none' });
        }


        const summ = user[id][0].points + user[id][1].points + user[id][2].points
        + user[id][3].points + user[id][4].points + user[id][5].points + user[id][6].points
        + user[id][7].points + user[id][8].points + user[id][9].points;
        user[id].push(summ);
      }

      fetch('./src/db/users.json')
        .then(res => res.json())
        .then((dataUsers) => {
          const keys = Object.keys(user);

          for (let i = 0; i < numberOfUser; i += 1) {
            const id = keys[i];
            user[id].push(dataUsers[id]);
            document.querySelector('tbody').innerHTML += `
        <tr class="table-baseline__rss">
          <th scope="row" data-id="${id}" class="userName">${user[id][11] || id}</th>
          <td title="${user[id][0].solution}">${user[id][0].points}</td>
          <td title="${user[id][1].solution}">${user[id][1].points}</td>
          <td title="${user[id][2].solution}">${user[id][2].points}</td>
          <td title="${user[id][3].solution}">${user[id][3].points}</td>
          <td title="${user[id][4].solution}">${user[id][4].points}</td>
          <td title="${user[id][5].solution}">${user[id][5].points}</td>
          <td title="${user[id][6].solution}">${user[id][6].points}</td>
          <td title="${user[id][7].solution}">${user[id][7].points}</td>
          <td title="${user[id][8].solution}">${user[id][8].points}</td>
          <td title="${user[id][9].solution}">${user[id][9].points}</td>
          <td class="result">${user[id][10]}</td>
          <td><input class="chekbox" type="checkbox" id="${id + 1}"><label class="chekbox-label" id="${id}" for="${id + 1}"><div class="tick"></div></label></td>
        </tr>
      `;
          }
        });
      rsschoolDemo();

      setTimeout(() => {
        chart(user);
      }, 10000);
    });
}


function rsschoolDemo() {
  fetch('./src/db/demo-sessions.json')
    .then(response => response.json())
    .then((data) => {
      const title = [];
      for (let i = 0; i < data.puzzles.length; i += 1) {
        title.push(data.puzzles[i].name);
      }

      let innerTitle = '';
      for (let i = 0; i < title.length; i += 1) {
        innerTitle += `<th class="demo table-baseline__rss-demo hide" scope="row">${title[i]}</th>`;
      }

      document.querySelector('thead').innerHTML += `
    <tr class = "table-baseline table-baseline__rss-demo hide">
      <th scope="row">UserName</th>
      ${innerTitle}
      <th scope="row">Time</th>
    </tr>
    `;

      // create users and points
      const user = { };
      const demoName = data._id.$oid;
      user[demoName] = ['150', '150'];
      user[demoName].push('150');
      const summ = user[demoName].reduce((acc, items) => (+acc + +items));
      user[demoName].push(summ);


      fetch('./src/db/users.json')
        .then(res => res.json())
        .then((dataUsers) => {
          const keys = Object.keys(user);

          for (let i = 0; i < 1; i += 1) {
            const id = keys[i];
            user[id].push(dataUsers[id]);
            document.querySelector('tbody').innerHTML += `
        <tr class="table-baseline__rss-demo hide">
          <th scope="row" data-name="${id}">Demo user</th>
          <td title="">${user[id][0]}</td>
          <td title="">${user[id][1]}</td>
        </tr>
      `;
          }
        });
    });
}

rsschool();


function checkBox() {
  const tplButton = `<div>
  <input type="radio" name="option" id="rsschool" checked />
  <label for="rsschool">rsschool</label>
</div>
<div>
  <input type="radio" name="option" id="rsschool-demo" />
  <label for="rsschool-demo">rsschool-demo</label>
</div>`;

  const place = document.querySelector('.module-radioButton');
  place.innerHTML = tplButton;

  const rssData = document.querySelectorAll('.table-baseline__rss');
  const demoData = document.querySelectorAll('.table-baseline__rss-demo');
  const demoButton = document.getElementById('rsschool-demo');
  const rssButton = document.getElementById('rsschool');


  rssButton.onclick = () => {
    rssButton.setAttribute('checked', 'checked');
    demoButton.removeAttribute('checked', 'checked');

    for (let i = 0; i < rssData.length; i += 1) {
      rssData[i].classList.remove('hide');
    }
    for (let i = 0; i < demoData.length; i += 1) {
      demoData[i].classList.add('hide');
    }
  };

  demoButton.onclick = () => {
    rssButton.removeAttribute('checked', 'checked');
    demoButton.setAttribute('checked', 'checked');

    for (let i = 0; i < demoData.length; i += 1) {
      demoData[i].classList.remove('hide');
    }
    for (let i = 0; i < rssData.length; i += 1) {
      rssData[i].classList.add('hide');
    }
  };
}

setTimeout(() => {
  checkBox();
}, 7000);


// chart
function chart(user) {
  const ctx = document.querySelector('#chart').getContext('2d');
  const chartConfig = {
    type: 'line',
    data: {
      labels: ['Matching Game', 'Matching Game II', 'Classy', 'Articles Everywhere', 'Anchor', 'Signing Up', 'Linear',
        'Envious Heirs', 'Mariana', 'Tech Stack'],
      datasets: [],
    },
    options: {
      title: {
        display: true,
        text: 'RSSchool',
      },
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
          },
        }],
      },
    },
  };

  const chart = new Chart(ctx, chartConfig);
  const colorSet = new Set();
  let color;

  const generateRandomColor = () => {
    color = '#';
    for (let i = 0; i < 3; i += 1) {
      const colorComponent = Math.floor(Math.random() * 255);
      color += colorComponent.toString(16);
    }
    return color;
  };

  const addUserToChart = (config, setName, dataSet) => {
    const name = setName;

    const data = dataSet;

    do {
      color = generateRandomColor();
    } while (colorSet.has(color));
    colorSet.add(color);

    const newUser = {
      label: name,
      data,
      backgroundColor: color,
      borderColor: color,
      borderWidth: 2,
      fill: false,
    };

    config.data.datasets.push(newUser);
    chart.update();
  };

  const removeUserFromChart = ({ data: { datasets } }, name) => {
    if (name) {
      const names = datasets.map(user => user.label);
      const index = names.indexOf(name);

      if (index === -1) {
        return;
      }

      datasets.splice(index, 1);
    } else {
      datasets.pop();
    }

    chart.update();
  };


  const tableBody = document.querySelector('tbody');
  tableBody.onclick = (event) => {
    const elementNavigation = event.target;
    if (elementNavigation.tagName === 'LABEL') {
      const name = user[elementNavigation.id][11];

      const inputId = (elementNavigation.id) + 1;
      const input = document.getElementById(inputId);


      const dataSet = [user[elementNavigation.id][0].points, user[elementNavigation.id][1].points, user[elementNavigation.id][2].points,
        user[elementNavigation.id][3].points, user[elementNavigation.id][4].points, user[elementNavigation.id][5].points,
        user[elementNavigation.id][6].points, user[elementNavigation.id][7].points, user[elementNavigation.id][8].points,
        user[elementNavigation.id][9].points];

      if (input.hasAttribute('data-set', 'active')) {
        input.removeAttribute('data-set', 'active');
        removeUserFromChart(chartConfig, name, dataSet);
      } else {
        input.setAttribute('data-set', 'active');
        addUserToChart(chartConfig, name, dataSet);
      }
    }
  };
}
