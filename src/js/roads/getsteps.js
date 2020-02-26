export default function getSteps(json) {
  let steps = json.routes[0].legs[0].steps;
  let stepMap = new Map();
  steps.forEach( (step) => {
    step.bannerInstructions.forEach( (inst) => {
      let key = inst.primary.text;
      if(key.indexOf('fork') === -1 && key.indexOf('/') === -1 && key.indexOf(';') === -1 && step.maneuver.type != 'off ramp') {
        inst.primary.components.forEach( (component) => {
          let roadStr = component.text;
          if((roadStr.indexOf('CA ') == 0) || (roadStr.indexOf('I-') == 0) || (roadStr.indexOf('US ') == 0)) {
            stepMap.set(roadStr, inst)
          }
        })
      } else {
      }
    })
  })
  return stepMap;
}