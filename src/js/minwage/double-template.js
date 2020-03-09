export default function doubleTemplate (location, wageData, wageTranslations) {
  return `
  <h2>${wageTranslations['trans-the-minimum-wage-in']} ${location}, CA ${
    wageTranslations['trans-is']
  }</h2>
  <table class="table">
    <thead>
      <tr>
        ${(function () {
          let output = '';
          if (wageData.length > 1) {
            output = `
              ${wageData
                .map(wageitem => {
                  let label = '';
                  for (var key in wageitem) {
                    label = key;
                  }
                  return `<th class="text-left bold" scope="col">${wageTranslations['trans-employers-with']} ${wageTranslations['trans-' + label]} ${wageTranslations['trans-employees']}</th>`;
                })
                .join(' ')}`;
          }
          return output;
        })()}
      </tr>
    </thead>
    <tbody>
      <tr>
        ${wageData
          .map(wageitem => {
            let wageVal = '';
            for (var key in wageitem) {
              wageVal = wageitem[key];
            }
            return `<td>$${wageVal}/${wageTranslations['trans-hour']}</td>`;
          })
          .join(' ')}
      </tr>
    </tbody>
  </table>`;
}
