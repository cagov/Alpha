export default function minWageHTML (cityWages, options, label, wageTranslations) {
  // /*html*/ comment below required to enable es6-string-html vscode syntax highlighting
  /* html */
  return `<cwds-accordion>
  <div class="card">
    <button class="card-header accordion-alpha" type="button" aria-expanded="false">
      <div class="accordion-title">${
        wageTranslations['trans-minimum-wage-rates-as-of']
      } ${new Date(label).toLocaleDateString(wageTranslations['trans-key'], options)} </div>
    </button>
    <div class="card-container collapsed">
      <div class="card-body">
        <table class="table">
          <thead>
              <th scope="col">${wageTranslations['trans-place']}</th>
              <th scope="col">${wageTranslations['trans-rate']}</th>
            </tr>
          </thead>
          <tbody>
          ${cityWages
            .map(function (city) {
              return ` <tr>
              <td>${city.name}</td>
              <td>
                ${(function () {
                  const wageData = city.wage;
                  let output = '';
                  if (
                    city.wage[0].everybody &&
                    city.wage[0].everybody.match(/[a-zA-Z]+/g)
                  ) {
                    output = `<p>${city.wage[0].everybody}</p>`;
                  } else {
                    output = `<p>$${city.wage[0].everybody}/${wageTranslations['trans-hour']}</p>`;
                  }
                  if (wageData.length > 1) {
                    output = `
                      ${wageData
                        .map(wageitem => {
                          let label = '';
                          let value = '0';
                          for (var key in wageitem) {
                            value = wageitem[key];
                            label = key;
                          }
                          if (value.match(/[a-zA-Z]+/g)) {
                            return `<p>${value}</p>`;
                          } else {
                            return `<p>$${value}/${wageTranslations['trans-hour']} ${wageTranslations['trans-for-employers-with']} ${wageTranslations['trans-' + label.replace(/ /g,'-')]} ${wageTranslations['trans-employees']}</p>`;
                          }
                        })
                        .join(' ')}`;
                  }
                  return output;
                })()}
              </td>
            </tr>`;
            })
            .join(' ')}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</cwds-accordion>`;
}
